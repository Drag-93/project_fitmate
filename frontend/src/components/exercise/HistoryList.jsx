import { useEffect, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

/**
 * 최근 5개까지만 저장되도록 백엔드에서 제한하므로 페이지네이션은 없앴다.
 * - refreshKey: 부모(RoutinePage)가 새 루틴 생성 시 값을 올려서 즉시 재조회를 트리거.
 * - selectedId: 부모가 현재 RoutineResult에 표시 중인 항목의 id를 내려줘서
 *   하이라이트 상태를 별도 내부 state 없이 그대로 반영.
 */
export default function HistoryList({ onSelect, refreshKey, selectedId }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jwtAxios
      .get(`${API_SERVER_URL}/api/exercise/history`, {
        params: { page: 0, size: 5 },
      })
      .then((res) => setItems(res.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  }

  return (
    <div className="panel history-panel">
      <p className="eyebrow">03 — 히스토리 (최근 5개)</p>
      <h2 className="panel-title">지난 루틴</h2>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">불러오는 중…</p>}
      {!loading && items.length === 0 && (
        <p className="muted">아직 생성한 루틴이 없습니다.</p>
      )}

      <ul className="history-list">
        {items.map((item) => {
          const exerciseNames =
            item.exerciseDetails?.map((d) => d.name).join(", ") ||
            "운동 정보 없음";
          const isSelected = item.id === selectedId;

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`history-item history-item-btn${isSelected ? " selected" : ""}`}
                onClick={() => onSelect?.(item)}
              >
                <div className="history-item-head">
                  <strong>{item.nameKo || item.name}</strong>
                  <time className="muted">{formatDate(item.createTime)}</time>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
