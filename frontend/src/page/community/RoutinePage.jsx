import { useState } from "react";
import RoutineForm from "../../components/exercise/RoutineForm";
import RoutineResult from "../../components/exercise/RoutineResult";

export default function RoutinePage() {
  const [result, setResult] = useState(null);

  return (
    <div className="routine-page">
      <RoutineForm onGenerated={setResult} />
      <RoutineResult result={result} />
    </div>
  );
}