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
      setError(e.message);
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
