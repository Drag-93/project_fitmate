//package org.spring.backend.exercise;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
///**
// * 이미 캐싱된 target(부위)들만 대상으로 주기적으로 재동기화한다.
// * - 새 부위를 알아서 추가하지는 않는다 (그건 사용자가 처음 요청할 때 syncByTarget으로 처리됨)
// * - RapidAPI 무료 티어 rate limit(대략 분당 10회 수준) 보호를 위해
// *   요청 사이에 최소 간격을 둔다.
// */
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class ExerciseSyncScheduler {
//
//    private final ExerciseRepository exerciseRepository;
//    private final ExerciseSyncService syncService;
//
//    private static final long DELAY_BETWEEN_CALLS_MS = 6_000; // 분당 10회 페이스 유지
//
//    /** 매일 새벽 3시(서버 타임존 기준) 캐싱된 target 전부 재동기화 */
//    @Scheduled(cron = "0 7 * * * *")
//    public void refreshCachedTargets() {
//        List<String> targets = exerciseRepository.findDistinctTargets();
//        if (targets.isEmpty()) {
//            log.info("ExerciseSyncScheduler: 재동기화할 캐시된 target이 없습니다.");
//            return;
//        }
//
//        log.info("ExerciseSyncScheduler: {}개 target 재동기화 시작", targets.size());
//        for (String target : targets) {
//            try {
//                syncService.syncByTarget(target);
//                Thread.sleep(DELAY_BETWEEN_CALLS_MS);
//            } catch (InterruptedException e) {
//                Thread.currentThread().interrupt();
//                log.warn("ExerciseSyncScheduler: 재동기화 중 인터럽트 발생, 중단합니다.");
//                return;
//            } catch (Exception e) {
//                // 한 target 실패해도 나머지는 계속 진행
//                log.warn("ExerciseSyncScheduler: target={} 재동기화 실패: {}", target, e.getMessage());
//            }
//        }
//        log.info("ExerciseSyncScheduler: 재동기화 완료");
//    }
//}
