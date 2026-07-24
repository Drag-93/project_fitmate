import { useEffect, useState } from "react";
import jwtAxios from "../../apis/util/jwtUtil";
import { API_SERVER_URL } from "../../apis/commonApi";

export default function RoutineForm({ onGenerated }) {
  const [targetMap, setTargetMap] = useState({});
  const [equipMap, setEquipMap] = useState({});
  const [target, setTarget] = useState("");
  const [equip, setEquip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    jwtAxios
      .get(`${API_SERVER_URL}/api/exercise/options`)
      .then((res) => {
        const targets = res.data.targets || {};
        setTargetMap(targets);

        const targetKeys = Object.keys(targets);
        if (targetKeys.length) {
          setTarget(targetKeys[0]);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!target) {
      setEquipMap({});
      setEquip("");
      return;
    }

    jwtAxios
      .get(`${API_SERVER_URL}/api/exercise/options/equipments`, {
        params: { target },
      })
      .then((res) => {
        setEquipMap(res.data || {});
        setEquip("");
      })
      .catch((e) => {
        console.error("장비 목록 로드 실패:", e);
        setEquipMap({});
      });
  }, [target]);

  const generateRoutine = async ({ target, equip }) => {
    const res = await jwtAxios.post(
      `${API_SERVER_URL}/api/exercise/recommend`,
      { target, equip },
    );
    return res.data;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateRoutine({ target, equip });
      onGenerated(result);
    } catch (e) {
      console.error("에러 객체 확인:", e);

      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      const status = e.response?.status;
      const data = e.response?.data;

      // 백엔드에서 보낸 에러 코드나 상태(400, 429 등)에 따라 원하는 메시지로 변경합니다.
      if (
        status === 429 ||
        data === "RATE_LIMIT_EXCEEDED" ||
        (typeof data === "string" && data.includes("너무 잦습니다"))
      ) {
        errorMessage =
          "루틴 생성 요청이 너무 잦습니다. 1분 후 다시 시도해주세요.";
      } else if (status === 400) {
        errorMessage = "잘못된 요청입니다. 입력값을 확인해주세요.";
      } else if (status === 500) {
        errorMessage = "서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (typeof data === "string") {
        errorMessage = data;
      } else if (data?.message) {
        errorMessage = data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <p className="eyebrow">01 — 조건 선택</p>
      <h2 className="panel-title">오늘 뭐 할까</h2>

      {/* 운동 부위 선택 */}
      <label className="field">
        <span>타겟 부위</span>
        <select value={target} onChange={(e) => setTarget(e.target.value)}>
          {Object.keys(targetMap).map((engKey) => (
            <option key={engKey} value={engKey}>
              {targetMap[engKey]}
            </option>
          ))}
        </select>
      </label>

      {/* 부위에 해당하는 장비만 */}
      <label className="field">
        <span>장비 (선택)</span>
        <select value={equip} onChange={(e) => setEquip(e.target.value)}>
          <option value="">전체 (모든 장비 포함)</option>
          {Object.keys(equipMap).map((engKey) => (
            <option key={engKey} value={engKey}>
              {equipMap[engKey]}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error-text">{error}</p>}

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || !target}
      >
        {loading ? "조합하는 중…" : "루틴 생성"}
      </button>
    </form>
  );
}
