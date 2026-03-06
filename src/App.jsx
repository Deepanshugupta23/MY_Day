import { useState } from "react";
import {  Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import My_quiz from "./Pages/My_quiz";
import Play from "./Pages/play";
import Create_New_quiz from "./Pages/Create_New_quiz";
import Start_quiz from "./Pages/Start_quiz";
import Result from "./Pages/Result";

function App() {
  const [userName, setUserName] = useState("");
  return (
    
      
      <>
      <Navbar userName={userName} />
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/Create_New_quiz" element={<Create_New_quiz />} />
        <Route path="/My_quiz" element={<My_quiz />} />
        <Route path="/play" element={<Play setUserName={setUserName} />} />
        <Route
          path="/start_quiz"
          element={<Start_quiz setUserName={setUserName} />}
        />
        <Route path="/Result" element={<Result />} /> 

      </Routes>

      
      
      </>
     
    
  )
}

export default App