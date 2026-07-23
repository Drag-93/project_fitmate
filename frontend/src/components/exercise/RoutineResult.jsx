import { useState } from "react";
import { API_SERVER_URL } from "../../apis/commonApi";

export default function RoutineResult({ result }) {
  // 각 운동 카드의 사진 보기 토글 상태를 관리 (운동 인덱스 `i`를 키로 사용)
  const [showImageIndices, setShowImageIndices] = useState(new Set());

  if (!result) {
    return (
      <div className="panel result-panel empty-state">
        <p className="eyebrow">02 — 결과</p>
        <h2 className="panel-title">아직 비어있음</h2>
        <p className="muted">
          왼쪽에서 부위를 고르고 루틴을 생성하면 여기 뜹니다.
        </p>
      </div>
    );
  }

  // 특정 운동의 사진 보기 토글 핸들러
  const toggleImage = (index) => {
    setShowImageIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="panel result-panel">
      <p className="eyebrow">02 — 결과</p>
      <h2 className="panel-title">{result.nameKo} 루틴</h2>

      <ol className="exercise-list">
        {result.exerciseDetails?.map((ex, i) => {
          const isImageVisible = showImageIndices.has(i);

          return (
            <li key={i} className="exercise-card">
              <div className="exercise-info" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="exercise-index">
                    SET {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* 사진 보기 / 닫기 토글 버튼 */}
                  {ex.id && (
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => toggleImage(i)}
                      style={{
                        cursor: "pointer",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      {isImageVisible ? "사진 닫기 🔼" : "사진 보기 🔽"}
                    </button>
                  )}
                </div>

                <h3>{ex.name}</h3>
                <p className="muted">
                  {ex.target} · {ex.equipment}
                </p>
                <div className="badge-row">
                  <span className="badge">{ex.reps}회, </span>
                  <span className="badge">{ex.sets}세트, </span>
                  <span className="badge">{ex.restSeconds}초 휴식</span>
                </div>

                {/* '사진 보기'를 눌렀을 때만 나타나는 GIF 이미지 영역 */}
                {isImageVisible && ex.id && (
                  <div style={{ marginTop: "12px", textAlign: "center" }}>
                    <img
                      className="exercise-gif"
                      src={`${API_SERVER_URL}/api/exercise/image/${ex.id}`}
                      alt={ex.name}
                      loading="lazy"
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
