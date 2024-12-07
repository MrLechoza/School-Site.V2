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
import RegistroExitoso from './registro-exitoso'
import TareasEs from "./tareas-estudiantes";
import VerEntregas from "./ver-entregas";
import ResponderAsignacion from "./respuesta-asignacion";
import UserSettings from "./user-settings";
import MateriasInfo from "./materias_info";



function App() {
  return (
      <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
      >
        <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registro-exitoso" element={<RegistroExitoso />} />
              <Route path="/register/message" element={<StudentRegistrationConfirmation />} />
              <Route path="/materias_info"  element={<MateriasInfo />}/>
              <Route path="/register/message" element={<StudentRegistrationConfirmation />} />
              <Route path="/message" element={<StudentRegistrationConfirmation />}/>
              <Route path="/register/teacher-page" element={<HomePageTeacher />} />
              <Route path="student-page" element={ <StudentPage /> }/>
              <Route path="admin" element={ <AdminPage /> }/>
              <Route path="/teacher-page" element={<HomePageTeacher />} />
              <Route path="/register/teacher-page/register-student" element={<RegisterStudent />} />
              <Route path="/teacher-page/register-student" element={<RegisterStudent />} />
              <Route path="/asignment" element={<Assignments />} />
              <Route path="/asignacionesEs/:id" element={<TareasEs />} />
              <Route path="/asignacionesPr/:id" element={<Assignments />} />
              <Route path="/asignaciones/:materiaId" element={<TareasEs />} />
              <Route path="/asignaciones/:id/responder" element={<ResponderAsignacion />} />
              <Route path="/asignaciones/:id/ver-entregas" element={<VerEntregas />} />
              <Route path="/materias" element={<Assignments />} />
              <Route path="/ver_materias" element={<Materia />} />
              <Route path="/nosostros" element={<Nosotros />} />
              <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;