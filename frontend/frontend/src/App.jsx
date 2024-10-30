import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home"
import Login from "./login";
import Register from "./register";
import Layout from "./components/layout";
import StudentRegistrationConfirmation from "./message"
import HomePageTeacher from "./teacher-page";
import RegisterStudent from "./register-student"
import Assignments from "./asignaciones";
import Materia from "./materias";
import StudentPage from "./student-page";
import Nosotros from "./nosotros"
import AdminPage from "./admin-page";

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/message" element={<StudentRegistrationConfirmation />} />
              <Route path="/register/message" element={<StudentRegistrationConfirmation />} />
              <Route path="/message" element={<StudentRegistrationConfirmation />}/>
              <Route path="/register/teacher-page" element={<HomePageTeacher />} />
              <Route path="student-page" element={ <StudentPage /> }/>
              <Route path="admin" element={ <AdminPage /> }/>
              <Route path="/teacher-page" element={<HomePageTeacher />} />
              <Route path="/register/teacher-page/register-student" element={<RegisterStudent />} />
              <Route path="/teacher-page/register-student" element={<RegisterStudent />} />
              <Route path="/asignment" element={<Assignments />} />
              <Route path="/materias" element={<Assignments />} />
              <Route path="/ver_materias" element={<Materia />} />
              <Route path="/nosostros" element={<Nosotros />} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;