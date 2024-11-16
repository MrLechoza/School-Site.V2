import React, { useState } from "react";
import RegisterStudent from "./register-student";
import Assignments from "./asignaciones";
import Materia from "./materias";

function HomePageTeacher() {

  const [vista, setVista] = useState({showRegisterStudent: true, showAsignaciones: false, showMaterias: false })

  return (
    <>
      <div className="absolute flex w-[1050px] h-auto shadow-md bg-[#ffffff]">
        <div className="p-5">
          <h1 className="relative font-bold text-gray-500 mb-3">Categorias</h1>
          
          <div className="flex gap-3">
            <div className="relative  w-[65px] flex" alt="boton Registrar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute bg-white size-8 mx-4 mb-8 p-1 shadow rounded"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <button
                className="hover:bg-black hover:text-white mt-4 w-full h-[40px] rounded-br-[30%] rounded-bl-[30%] shadow text-[10px] flex flex-col justify-center transition-all duration-200 ease-in-out delay-300"
                onClick={() => setVista({showRegisterStudent: true, showAsignaciones: false, showMaterias: false })}
              >
                <span className="mx-auto mt-3">Registrar</span>
              </button>
            
                
              
            </div>

            <div className="relative w-[65px] flex" alt="boton Materias">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute bg-white size-8 mx-4 mb-8 p-1 shadow rounded"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>

              <button className="hover:bg-black hover:text-white mt-4 w-full h-[40px] rounded-br-[30%] rounded-bl-[30%] shadow text-[10px] flex flex-col justify-center transition-all duration-200 delay-300"
              onClick={() => setVista({showRegisterStudent: false, showAsignaciones: false, showMaterias: true })}
              >
              
                <span className="mx-auto mt-3">Materias</span>
              </button>
            </div>

            <div className="relative  w-[65px] flex" alt="boton Agregar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute bg-white size-8 mx-4 mb-8 p-1 shadow rounded"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <button
                onClick={() => setVista({ showRegisterStudent: false, showAsignaciones: true, showMaterias: false })}
                className="hover:bg-black hover:text-white mt-4 w-full h-[40px] rounded-br-[30%] rounded-bl-[30%] shadow text-[10px] flex flex-col justify-center transition-all duration-200 ease-in-out delay-300"
              >
                <span className="mx-auto mt-3">Asignaciones</span>
              </button>
              
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[1050px] h-auto shadow-md mt-36 bg-[#ffffff]">
        { vista.showRegisterStudent && <RegisterStudent />}
        { vista.showAsignaciones && <Assignments /> }
        { vista.showMaterias && <Materia />}

      </div>
    </>
  );
}

export default HomePageTeacher;
