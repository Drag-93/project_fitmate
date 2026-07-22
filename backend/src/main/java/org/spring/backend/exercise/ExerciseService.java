package org.spring.backend.exercise;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExercisePlanRepository planRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseSyncService syncService;
    private final ValidValuesService validValuesService;
    private final ExerciseTranslationService translationService; // ★ 추가

    private static final int MAX_EXERCISES_PER_ROUTINE = 5;

    //부위에 해당하는 장비만 추출
    public Map<String, String> getEquipmentsMapByTarget(String target) {
        List<Exercise> exercises = exerciseRepository.findByTargetIgnoreCase(target);
        Map<String, String> equipMap = new LinkedHashMap<>();

        for (Exercise ex : exercises) {
            String eqEn = ex.getEquipment();
            if (eqEn != null && !eqEn.isBlank()) {
                String eqKo = (ex.getEquipKo() != null && !ex.getEquipKo().isBlank()) ? ex.getEquipKo() : eqEn;
                equipMap.put(eqEn.toLowerCase(), eqKo);
            }
        }
        return equipMap;
    }

    /** 부위별 기본 처방(세트/렙/휴식) - 규칙 기반, AI 미사용 */
    private static final Map<String, Prescription> PRESCRIPTION_BY_BODY_PART = Map.ofEntries(
            Map.entry("cardio", new Prescription(1, "15-20분", 0)),
            Map.entry("back", new Prescription(4, "6-10", 90)),
            Map.entry("chest", new Prescription(4, "6-10", 90)),
            Map.entry("upper legs", new Prescription(4, "8-12", 90)),
            Map.entry("shoulders", new Prescription(3, "10-12", 60)),
            Map.entry("upper arms", new Prescription(3, "10-15", 60)),
            Map.entry("waist", new Prescription(3, "15-20", 45))
    );
    private static final Prescription DEFAULT_PRESCRIPTION = new Prescription(3, "8-12", 60);

    public RoutineResult generateRoutine(String userEmail, String muscle, String equipment) {
        // 0. 입력값 검증 - ExerciseDB가 지원하지 않는 값이면 API/DB 조회 전에 바로 차단
        if (muscle == null || muscle.isBlank() || !validValuesService.isValidTarget(muscle)) {
            throw new InvalidExerciseRequestException(
                    "'" + muscle + "'는 지원하지 않는 muscle(target) 값입니다.");
        }
        boolean equipmentSpecified = equipment != null && !equipment.isBlank();
        if (equipmentSpecified && !validValuesService.isValidEquipment(equipment)) {
            throw new InvalidExerciseRequestException(
                    "'" + equipment + "'는 지원하지 않는 equipment 값입니다.");
        }

        // 1. 로컬 캐시에 없으면 그때만 동기화 (RapidAPI 무료 티어 rate limit 보호)
        // ★ 동기화 직후 번역까지 함께 실행 (관리자 sync 엔드포인트와 동일하게 맞춤)
        if (!syncService.isCached(muscle)) {
            syncService.syncByTarget(muscle);
            translationService.translateMissingNames();
        }

        // 2. equipment가 지정된 경우만 부위+장비로 조회, 없으면 부위 전체 조회
        List<Exercise> candidates = equipmentSpecified
                ? exerciseRepository.findByTargetIgnoreCaseAndEquipmentIgnoreCase(muscle, equipment)
                : List.of();
        if (candidates.isEmpty()) {
            candidates = exerciseRepository.findByTargetIgnoreCase(muscle);
        }
        if (candidates.isEmpty()) {
            throw new ExerciseNotFoundException(
                    "'" + muscle + "' 부위에 해당하는 운동을 찾지 못했습니다.");
        }

        // 3. 이름 중복 제거 + 셔플로 매번 다른 조합이 나오도록 다양성 확보
        List<Exercise> deduped = new ArrayList<>(
                candidates.stream()
                        .collect(LinkedHashMap<String, Exercise>::new,
                                (map, ex) -> map.putIfAbsent(ex.getName(), ex),
                                LinkedHashMap::putAll)
                        .values()
        );
        Collections.shuffle(deduped);
        List<Exercise> selected = deduped.subList(0, Math.min(MAX_EXERCISES_PER_ROUTINE, deduped.size()));

        // 4. 부위별 규칙으로 세트/렙/휴식 부여
        List<ExerciseDetail> details = new ArrayList<>();
        for (Exercise ex : selected) {
            Prescription p = PRESCRIPTION_BY_BODY_PART.getOrDefault(
                    ex.getBodyPart().toLowerCase(), DEFAULT_PRESCRIPTION);
            details.add(ExerciseDetail.builder()
                    .id(ex.getId())
                    .name(displayName(ex))
                    .target(displayTarget(ex))       // ★ 영문 대신 한글 번역 반영
                    .equipment(displayEquipment(ex)) // ★ 영문 대신 한글 번역 반영
                    .sets(p.sets())
                    .reps(p.reps())
                    .restSeconds(p.restSeconds())
                    .build());
        }

        String routineText = buildComplexRoutine(details);

        ExercisePlan plan = planRepository.save(
                new ExercisePlan(userEmail, muscle, "", routineText));

        return new RoutineResult(plan, details);
    }

    public List<ExercisePlan> getHistory(String userEmail, int page, int size) {
        return planRepository
                .findByUserEmailOrderByIdDesc(userEmail, PageRequest.of(page, size))
                .getContent();
    }

    /**
     * 한글 번역(nameKo)이 있으면 그걸, 없으면(아직 번역 안 된 신규 운동 등)
     * 영문 name으로 폴백. 화면에 표시되는 모든 이름이 여기를 거치게 함.
     */
    private String displayName(Exercise ex) {
        String nameKo = ex.getNameKo();
        return (nameKo != null && !nameKo.isBlank()) ? nameKo : ex.getName();
    }

    private String buildComplexRoutine(List<ExerciseDetail> exercises) {
        StringBuilder sb = new StringBuilder();
        sb.append("🔥 오늘의 맞춤 루틴 추천\n\n");

        for (int i = 0; i < exercises.size(); i++) {
            ExerciseDetail ex = exercises.get(i);
            sb.append(String.format("%d. %s\n", i + 1, ex.getName().toUpperCase()));
            sb.append("   - 목표: ").append(ex.getTarget()).append("\n");
            sb.append("   - 세트: ").append(ex.getSets())
                    .append(" x ").append(ex.getReps())
                    .append(" (휴식 ").append(ex.getRestSeconds()).append("초)\n\n");
        }
        sb.append("오늘도 득근하세요! 💪");
        return sb.toString();
    }

    private record Prescription(int sets, String reps, int restSeconds) {}

    /** 컨트롤러에서 plan + 상세 목록을 함께 응답으로 변환할 수 있도록 감싸는 결과 객체 */
    public record RoutineResult(ExercisePlan plan, List<ExerciseDetail> details) {}

    private String displayTarget(Exercise ex) {
        String targetKo = ex.getTargetKo(); // 만약 엔티티 필드명이 다르다면 확인해주세요 (예: targetKo)
        return (targetKo != null && !targetKo.isBlank()) ? targetKo : ex.getTarget();
    }

    private String displayEquipment(Exercise ex) {
        String equipKo = ex.getEquipKo(); // 엔티티의 한글 장비 필드명
        return (equipKo != null && !equipKo.isBlank()) ? equipKo : ex.getEquipment();
    }
}