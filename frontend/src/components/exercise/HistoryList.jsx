import { useEffect, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

export default function HistoryList({ newRoutine }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 열려있는 히스토리 아이템의 ID들을 관리하는 상태
  const [expandedIds, setExpandedIds] = useState(new Set());

  // 폼에서 새로운 루틴이 생성되어 전달되면 목록의 맨 위에 곧바로 추가
  useEffect(() => {
    if (newRoutine) {
      setItems((prevItems) => [newRoutine, ...prevItems]);
      // 새로 추가된 루틴은 편의상 자동으로 상세 보기(토글)를 열어줄 수도 있습니다 (선택사항)
      if (newRoutine.id) {
        setExpandedIds((prev) => new Set(prev).add(newRoutine.id));
      }
    }
  }, [newRoutine]);

  const fetchHistory = async (page, size) => {
    const res = await jwtAxios.get(`${API_SERVER_URL}/api/exercise/history`, {
      params: { page, size },
    });
    return res.data;
  };

  // 페이지가 바뀔 때 히스토리 목록 불러오기
  useEffect(() => {
    setLoading(true);
    fetchHistory(page, 10)
      .then((data) => {
        setItems(data);
        setExpandedIds(new Set());
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  // 토글 핸들러 함수
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="panel history-panel">
      <p className="eyebrow">03 — 히스토리 및 결과</p>
      <h2 className="panel-title">지난 루틴 목록</h2>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">불러오는 중…</p>}

      {!loading && items.length === 0 && (
        <p className="muted">아직 생성한 루틴이 없습니다.</p>
      )}

      <ul className="history-list">
        {items.map((item) => {
          const isExpanded = expandedIds.has(item.id);

          return (
            <li key={item.id} className="history-item">
              <div className="history-item-head">
                <div>
                  <strong>{item.name}</strong>
                  {item.createTime && (
                    <time className="muted" style={{ marginLeft: "10px" }}>
                      {new Date(item.createTime).toLocaleDateString()}
                    </time>
                  )}
                </div>
                {/* 사진 보기 / 접기 토글 버튼 */}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => toggleExpand(item.id)}
                >
                  {isExpanded ? "상세 닫기 🔼" : "사진 보기 🔽"}
                </button>
              </div>

              {/* 기존 텍스트 형태의 루틴 내용 요약 */}
              <pre className="routine-text">{item.routine}</pre>

              {/* '사진 보기'를 눌렀을 때만 나타나는 상세 운동 카드 및 GIF 영역 */}
              {isExpanded && (
                <div className="expanded-details" style={{ marginTop: "15px" }}>
                  <ol className="exercise-list">
                    {item.exerciseDetails?.map((ex, i) => (
                      <li key={i} className="exercise-card">
                        {ex.id && (
                          <img
                            className="exercise-gif"
                            src={`${API_SERVER_URL}/api/exercise/image/${ex.id}`}
                            alt={ex.name}
                            loading="lazy"
                          />
                        )}
                        <div className="exercise-info">
                          <span className="exercise-index">
                            SET {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3>{ex.name}</h3>
                          <p className="muted">
                            {ex.target} · {ex.equipment}
                          </p>
                          <div className="badge-row">
                            <span className="badge">{ex.sets} SETS</span>
                            <span className="badge">{ex.reps} REPS</span>
                            <span className="badge">
                              {ex.restSeconds}s REST
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          이전
        </button>
        <span className="muted">PAGE {page + 1}</span>
        <button
          disabled={items.length < 10}
          onClick={() => setPage((p) => p + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
