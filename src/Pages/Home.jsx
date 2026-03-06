import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Welcome to Quiz Builder
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Create New Quiz */}
          <div
            onClick={() => navigate("/Create_New_quiz")}
            className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Quiz</h3>
            <p className="text-gray-500">
              Build your own custom quiz with multiple question types.
            </p>
          </div>

          {/* My Quizes */}
          <div
            onClick={() => navigate("/My_quiz")}
            className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-4">My Quizes</h3>
            <p className="text-gray-500">
              View and manage quizzes you have created.
            </p>
          </div>

          {/* Play Quiz */}
          <div
           onClick={() => navigate("/play")}
            className="bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transform hover:scale-105 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-4">Play Quiz</h3>
            <p className="text-gray-500">
              Attempt quizzes and test your knowledge.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;