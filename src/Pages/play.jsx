import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function play({ setUserName }) {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // Step 1: Store all active quizzes
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  
  const navigate = useNavigate();

  // Step 2: Load active quizzes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizzes")) || [];
    const active = stored.filter(q => q.status === "Active");
    setActiveQuizzes(active);

    if (active.length === 0) return; // no active quizzes

    // By default, load the first quiz's questions
    const firstQuestions = active[0].questions || [];
    setQuestions(firstQuestions);

    const defaults = firstQuestions.map(q => {
      if (q.type === "mcq-multi") return [];
      if (q.type === "mcq-single") return null;
      return "";
    });
    setUserAnswers(defaults);
    setSelectedAnswer(defaults[0]);
  }, []);

  // Step 3: Handle quiz selection (if multiple active quizzes)
  const handleQuizSelect = (index) => {
    setSelectedQuizIndex(index);
    const quizQuestions = activeQuizzes[index].questions || [];
    setQuestions(quizQuestions);

    const defaults = quizQuestions.map(q => {
      if (q.type === "mcq-multi") return [];
      if (q.type === "mcq-single") return null;
      return "";
    });
    setUserAnswers(defaults);
    setSelectedAnswer(defaults[0]);
  };

  // Before quiz starts, show name input and quiz selection
  if (!started) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Enter Your Full Name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="border p-2 rounded w-64"
        />
        <br />

        {/* Step 3: Dropdown if multiple active quizzes */}
        {activeQuizzes.length > 1 && (
          <div className="my-4">
            <label className="mr-2 font-medium">Select Quiz:</label>
            <select
              value={selectedQuizIndex}
              onChange={(e) => handleQuizSelect(parseInt(e.target.value))}
              className="border p-2 rounded w-64"
            >
              {activeQuizzes.map((quiz, i) => (
                <option key={i} value={i}>{quiz.quizTitle}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => {
            if (!name.trim()) return;
            setUserName(name);
            setStarted(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2 mt-4 rounded"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="p-10 text-center">No Active Questions Available</div>;
  }

  const q = questions[current];

  // Handle single/multi choice selection
  const handleSelect = (index) => {
    if (q.type === "mcq-multi") {
      const arr = selectedAnswer ? [...selectedAnswer] : [];
      if (arr.includes(index)) arr.splice(arr.indexOf(index), 1);
      else arr.push(index);
      setSelectedAnswer(arr);
    } else {
      setSelectedAnswer(index);
    }
  };

  // Handle text input
  const handleTextChange = (e) => setSelectedAnswer(e.target.value);

  const handleNext = () => {
    const updatedAnswers = [...userAnswers];

    if (q.type === "mcq-multi") updatedAnswers[current] = selectedAnswer || [];
    else if (q.type === "mcq-single") updatedAnswers[current] = selectedAnswer;
    else updatedAnswers[current] = selectedAnswer?.trim() || "";

    setUserAnswers(updatedAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      const nextQ = questions[current + 1];
      setSelectedAnswer(
        updatedAnswers[current + 1] ??
        (nextQ.type === "mcq-multi" ? [] : nextQ.type === "mcq-single" ? null : "")
      );
    } else {
      // Calculate correct answers
      const correctCount = questions.reduce((acc, q, i) => {
        const userAns = updatedAnswers[i];

        if (q.type === "mcq-single") return q.correctAnswer === userAns ? acc + 1 : acc;

        if (q.type === "mcq-multi") {
          const correct = [...q.correctAnswer].sort();
          const user = [...(userAns || [])].sort();
          return JSON.stringify(correct) === JSON.stringify(user) ? acc + 1 : acc;
        }

        if (q.type === "short" || q.type === "description") {
          return q.answerText.trim().toLowerCase() ===
            (userAns ?? "").trim().toLowerCase() ? acc + 1 : acc;
        }

        return acc;
      }, 0);

      const resultData = {
        questions,
        userAnswers: updatedAnswers,
        correct: correctCount,
        wrong: questions.length - correctCount,
        total: questions.length,
        date: new Date().toLocaleString()
      };

      localStorage.setItem("quizResult", JSON.stringify(resultData));
      navigate("/Result");
    }
  };

  const isDisabled = () => {
    if (q.type === "mcq-single") return selectedAnswer === null;
    if (q.type === "mcq-multi") return !selectedAnswer || selectedAnswer.length === 0;
    if (q.type === "short" || q.type === "description") return !selectedAnswer || !selectedAnswer.trim();
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl relative">
        <p className="text-lg font-medium mb-6">{q.question}</p>

        {q.type === "mcq-single" || q.type === "mcq-multi" ? (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`block border rounded-lg p-3 cursor-pointer transition ${
                  q.type === "mcq-multi"
                    ? selectedAnswer?.includes(i)
                      ? "bg-indigo-100 border-indigo-500"
                      : "hover:bg-gray-50"
                    : selectedAnswer === i
                    ? "bg-indigo-100 border-indigo-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type={q.type === "mcq-multi" ? "checkbox" : "radio"}
                  checked={q.type === "mcq-multi" ? selectedAnswer?.includes(i) : selectedAnswer === i}
                  onChange={() => handleSelect(i)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <div>
            {q.type === "short" && (
              <input
                type="text"
                value={selectedAnswer || ""}
                onChange={handleTextChange}
                placeholder="Your answer (2 words)"
                className="border p-2 rounded w-full"
              />
            )}
            {q.type === "description" && (
              <textarea
                rows={4}
                value={selectedAnswer || ""}
                onChange={handleTextChange}
                placeholder="Your answer (2–4 sentences)"
                className="border p-2 rounded w-full"
              />
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <span className="text-gray-500 font-medium">{current + 1} / {questions.length}</span>
          <button
            onClick={handleNext}
            disabled={isDisabled()}
            className={`mt-6 px-6 py-2 rounded-lg text-white w-full ${
              isDisabled()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {current === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default play;