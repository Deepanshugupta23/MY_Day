import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Start_quiz({ setUserName }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) return;

    setUserName(name);
    navigate("/play");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Enter Your Full Name
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Start Quiz
        </button>

      </div>
    </div>
  );
}

export default Start_quiz;