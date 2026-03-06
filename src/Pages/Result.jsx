import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizResult"));
    setResult(stored);
  }, []);

  if (!result) {
    return (
      <div className="p-10 text-center">
        No result found
        <br />
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">

        <h2 className="text-2xl font-bold mb-6">Quiz Result</h2>

        <div className="flex justify-around mb-6">
          <div className="bg-green-100 p-4 rounded-lg w-32">
            <p className="text-xl font-bold text-green-700">{result.correct}</p>
            <p>Correct</p>
          </div>

          <div className="bg-red-100 p-4 rounded-lg w-32">
            <p className="text-xl font-bold text-red-700">{result.wrong}</p>
            <p>Wrong</p>
          </div>
        </div>

        <p>Total Questions: {result.total}</p>
        <p className="text-sm text-gray-500 mt-2">{result.date}</p>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-2 mt-6 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default Result;