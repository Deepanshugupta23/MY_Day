import { NavLink } from "react-router-dom";


function Navbar({userName}) {
  return (
    <nav className="bg-white shadow-md px-8 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-indigo-600">QuizApp</h1>

        <div className="flex flex-wrap items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
                : "text-gray-600 hover:text-indigo-500"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/My_quiz"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
                : "text-gray-600 hover:text-indigo-500"
            }
          >
            My Quiz
          </NavLink>

          <NavLink
            to="/play"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
                : "text-gray-600 hover:text-indigo-500"
            }
          >
            Play Quiz
          </NavLink>
           {/*  Username show here */}
  {userName && (
    <span className="ml-4 font-semibold text-indigo-600">
      {userName}
    </span>
  )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;