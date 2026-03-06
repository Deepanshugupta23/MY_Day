import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function My_quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("quizzes")) || [];
    setQuizzes(data);
  };

  loadData();

  window.addEventListener("focus", loadData);

  return () => window.removeEventListener("focus", loadData);
}, []);

  // UPDATE STORAGE
  const updateStorage = (updated) => {
    setQuizzes(updated);
    localStorage.setItem("quizzes", JSON.stringify(updated));
  };

  // DELETE
  const confirmDelete = () => {
    const updated = quizzes.filter((_, i) => i !== deleteIndex);
    updateStorage(updated);
    setDeleteIndex(null);
  };

  // SAVE EDIT
  const saveEdit = () => {
    const updated = [...quizzes];
    updated[editData.index] = editData.data;
    updateStorage(updated);
    setEditData(null);
  };

  // STATUS TOGGLE
  const toggleStatus = (index, value) => {
    const updated = [...quizzes];
    updated[index].status = value;
    updateStorage(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          My Quizzes
        </h2>

        <table className="w-full border border-gray-300 text-center">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="border p-2">Quiz Title</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Created Date</th>
              <th className="border p-2">Total Questions</th>
               <th className="border p-2">Quiz Type</th> 
              
              
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quizzes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4">
                  No quizzes found
                </td>
              </tr>
            )}

            {quizzes.map((quiz, index) => (
              <tr key={index}>

                {/* TITLE */}
                <td
                  className="border p-2 cursor-pointer text-blue-600"
                  onClick={() =>
                    setEditData({ index, data: { ...quiz } })
                  }
                >
                  {quiz.quizTitle}
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  <label className="mr-3">
                    <input
                      type="radio"
                      checked={quiz.status === "Active"}
                      onChange={() =>
                        toggleStatus(index, "Active")
                      }
                    />
                    Active
                  </label>

                  <label>
                    <input
                      type="radio"
                      checked={quiz.status === "Inactive"}
                      onChange={() =>
                        toggleStatus(index, "Inactive")
                      }
                    />
                    Inactive
                  </label>
                </td>

                {/* DATE */}
                <td className="border p-2">
                  {quiz.createdAt}
                </td>

                {/* TOTAL QUESTIONS */}
                <td className="border p-2">
                  {quiz.questions?.length || 0}
                </td>
                {/* QUIZ TYPE */}
<td className="border p-2">
  {quiz.type === "mcq-single" && "MCQ (Single Correct)"}
  {quiz.type === "mcq-multi" && "MCQ (Multiple Correct)"}
  {quiz.type === "short" && "Short Answer"}
  {quiz.type === "description" && "Description"}
</td>

                {/* ACTIONS */}
                <td className="border p-2 space-x-2">
                  <button
  onClick={() =>
    navigate("/Create_New_quiz", {
      state: { quizData: quiz, quizIndex: index }
    })
  }
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Edit
</button>

                  <button
                    onClick={() => setDeleteIndex(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              Edit Quiz Title
            </h2>

            <input
              type="text"
              value={editData.data.quizTitle}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  data: {
                    ...editData.data,
                    quizTitle: e.target.value
                  }
                })
              }
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditData(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="bg-indigo-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => setDeleteIndex(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default My_quiz;