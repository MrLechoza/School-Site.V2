import React, { useState } from "react";
import RegisterStudent from "./register-student";
import Assignments from "./asignaciones";
import Materia from "./materias";

function HomePageTeacher() {
  const [vista, setVista] = useState({
    showRegisterStudent: true,
    showAsignaciones: false,
    showMaterias: false,
  });

  return (
    <>
      <div className="absolute flex w-[100%] h-auto shadow-md bg-[#ffffff]">
        <div className="p-5">
          <h1 className="relative font-semibold text-black mb-3">Categorias</h1>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <button
              className="flex border border-gray-400 hover:border-black hover:-translate-y-1  px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
              onClick={() =>
                setVista({
                  showRegisterStudent: true,
                  showAsignaciones: false,
                  showMaterias: false,
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 mr-2 "
              >
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>
              Registrar
            </button>

            <button
              className="flex border border-gray-400 hover:border-black hover:-translate-y-1  px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
              onClick={() =>
                setVista({
                  showRegisterStudent: false,
                  showAsignaciones: false,
                  showMaterias: true,
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 mr-2"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
              Materias
            </button>

            <button
              onClick={() =>
                setVista({
                  showRegisterStudent: false,
                  showAsignaciones: true,
                  showMaterias: false,
                })
              }
              className="flex border border-gray-400 hover:border-black hover:-translate-y-1  px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z"
                  clipRule="evenodd"
                />
                <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
              </svg>
              Asignaciones
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-[100%] h-auto shadow-md mt-36 bg-[#ffffff]">
        {vista.showRegisterStudent && <RegisterStudent />}
        {vista.showAsignaciones && <Assignments />}
        {vista.showMaterias && <Materia />}
      </div>
    </>
  );
}

export default HomePageTeacher;
