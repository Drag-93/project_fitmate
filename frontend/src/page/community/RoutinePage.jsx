import { useState } from "react";
import RoutineForm from "../../components/exercise/RoutineForm";
import HistoryList from "../../components/exercise/HistoryList";
import RoutineResult from "../../components/exercise/RoutineResult";
import "../../css/Community/RoutinePage.css";

export default function RoutinePage() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(0);

  function handleGenerated(newResult) {
    setResult(newResult);
    setHistory((h) => h + 1);
  }

  return (
    <div className="routine-page">
      <RoutineForm onGenerated={handleGenerated} />
      <RoutineResult result={result} />
      <HistoryList
        onSelect={setResult}
        refreshKey={history}
        selectedId={result?.id}
      />
    </div>
  );
}
