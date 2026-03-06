import { useState  , useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Create_New_quiz() {
  const navigate = useNavigate();
  const location = useLocation();

const editQuiz = location.state?.quizData;
const editIndex = location.state?.quizIndex;

  const emptyQuestion = (type) => ({
    type,
    question: "",
    optionInput: "",
    options: [],
    correctAnswer: type === "mcq-multi" ? [] : "",
    answerText: "",
  });

  const [showTypeModal, setShowTypeModal] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const isSaveDisabled =(selectedType === "mcq-single" || selectedType === "mcq-multi") &&
  !quizTitle.trim();
  useEffect(() => {
  if (editQuiz) {
    setSelectedType(editQuiz.type);
    setQuizTitle(editQuiz.quizTitle);
    setQuestions(editQuiz.questions);
    setShowTypeModal(false);
  }
}, [editQuiz]);
  

  const handleContinue = () => {
    setQuestions([emptyQuestion(selectedType)]);
    setShowTypeModal(false);
  };

  const handleChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };
  

  const addOption = (qIndex) => {
    const updated = [...questions];
    if (!updated[qIndex].optionInput.trim()) return;
    updated[qIndex].options.push(updated[qIndex].optionInput);
    updated[qIndex].optionInput = "";
    setQuestions(updated);
  };

  const deleteOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const toggleMultiCorrect = (qIndex, value) => {
    const updated = [...questions];
    const arr = updated[qIndex].correctAnswer || [];

    if (arr.includes(value)) {
      updated[qIndex].correctAnswer = arr.filter((v) => v !== value);
    } else {
      updated[qIndex].correctAnswer = [...arr, value];
    }

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion(selectedType)]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

 // Save all question types properly
const saveQuestions = () => {
  const existing = JSON.parse(localStorage.getItem("quizzes")) || [];

  const quizObject = {
    id: editQuiz?.id || Date.now(),
    quizTitle:
      selectedType === "mcq-single" || selectedType === "mcq-multi"
        ? quizTitle.trim()
        : selectedType === "short"
        ? "Short Questions Answers"
        : "Description Type Questions",
    createdAt: editQuiz?.createdAt || new Date().toLocaleDateString(),
    status: editQuiz?.status || "Active",
    type: selectedType,
    questions: questions.map(q => {
      if (q.type === "mcq-single") return { ...q, correctAnswer: q.correctAnswer ?? null };
      if (q.type === "mcq-multi") return { ...q, correctAnswer: q.correctAnswer ?? [] };
      return { ...q, answerText: q.answerText?.trim() ?? "" };
    }),
  };

  let updatedQuizzes = editIndex !== undefined && editIndex !== null
    ? [...existing.slice(0, editIndex), quizObject, ...existing.slice(editIndex + 1)]
    : [...existing, quizObject];

  localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
  setShowSuccessModal(true);
};
  const getHeading = () => {
  if (selectedType === "mcq-single" || selectedType === "mcq-multi") {
    return "Title of the Quiz";
  }
  if (selectedType === "short") {
    return "Short Questions Answers";
  }
  if (selectedType === "description") {
    return "Description Type Questions";
  }
  return "";
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* TYPE MODAL */}
      {showTypeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl w-[400px] shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Select Question Type
            </h2>

            {[
              { label: "MCQ (Single Correct)", value: "mcq-single" },
              { label: "MCQ (Multiple Correct)", value: "mcq-multi" },
              { label: "Short Answer (2 words)", value: "short" },
              { label: "Description (2–4 sentences)", value: "description" },
            ].map((type) => (
              <label key={type.value} className="flex gap-3 mb-3">
                <input
                  type="radio"
                  value={type.value}
                  name="type"
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                {type.label}
              </label>
            ))}

            <button
              disabled={!selectedType}
              onClick={handleContinue}
              className={`w-full mt-4 py-2 rounded-lg text-white ${
                selectedType
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* FORM SECTION */}
      {!showTypeModal && (
        <div className="max-w-3xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-center">
  {getHeading()}
</h1>

         
          {/* QUIZ TITLE ONLY FOR MCQ */}
{(selectedType === "mcq-single" || selectedType === "mcq-multi") && (
  <div>
    <input
      type="text"
      placeholder="Enter Quiz Title"
      value={quizTitle}
      onChange={(e) => setQuizTitle(e.target.value)}
      className="w-full border p-3 rounded-xl text-lg"
    />
  </div>
)}

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Question {qIndex + 1}
              </h2>

              <input
                type="text"
                placeholder="Enter Question"
                value={q.question}
                onChange={(e) =>
                  handleChange(qIndex, "question", e.target.value)
                }
                className="w-full border p-2 rounded-lg mb-4"
              />

              {/* MCQ */}
              {(q.type === "mcq-single" ||
                q.type === "mcq-multi") && (
                <>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Enter Option"
                      value={q.optionInput}
                      onChange={(e) =>
                        handleChange(qIndex, "optionInput", e.target.value)
                      }
                      className="flex-1 border p-2 rounded-lg"
                    />
                    <button
                      onClick={() => addOption(qIndex)}
                      className="bg-indigo-600 text-white px-4 rounded-lg"
                    >
                      Add
                    </button>
                  </div>

                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 mb-2"
                    >
                      <input
                        type="text"
                        value={opt}
                        disabled
                        className="flex-1 border p-2 rounded-lg bg-gray-100"
                      />
                      <button
                        onClick={() => deleteOption(qIndex, i)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  {q.type === "mcq-single" && (
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleChange(
                          qIndex,
                          "correctAnswer",
                          Number(e.target.value)
                        )
                      }
                      className="w-full border p-2 rounded-lg mt-3"
                    >
                      <option value="">Select Correct Option</option>
                      {q.options.map((_, i) => (
                        <option key={i} value={i}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  )}

                  {q.type === "mcq-multi" && (
                    <div className="mt-3">
                      <p className="mb-2 font-medium">
                        Select Correct Answers
                      </p>
                      {q.options.map((_, i) => (
                        <label key={i} className="flex gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={q.correctAnswer.includes(i)}
                            onChange={() =>
                              toggleMultiCorrect(qIndex, i)
                            }
                          />
                          Option {i + 1}
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}

              {q.type === "short" && (
                <input
                  type="text"
                  placeholder="Correct answer (2 words)"
                  value={q.answerText}
                  onChange={(e) =>
                    handleChange(qIndex, "answerText", e.target.value)
                  }
                  className="w-full border p-2 rounded-lg"
                />
              )}

              {q.type === "description" && (
                <textarea
                  rows="4"
                  placeholder="Correct answer (2–4 sentences)"
                  value={q.answerText}
                  onChange={(e) =>
                    handleChange(qIndex, "answerText", e.target.value)
                  }
                  className="w-full border p-2 rounded-lg"
                />
              )}

              <button
                onClick={() => deleteQuestion(qIndex)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg mt-4"
              >
                Delete Question
              </button>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Add Question
          </button>

          

          <button
  disabled={isSaveDisabled}
  onClick={saveQuestions}
  className={`px-6 py-2 rounded-lg ml-4 text-white ${
    isSaveDisabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  Save
</button>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl w-[350px] text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4">
  {editIndex !== undefined
    ? "Quiz updated successfully"
    : "Quiz created successfully"}
</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
  setShowSuccessModal(false);
  navigate("/My_quiz");
}}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                View All Quizzes
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create_New_quiz;