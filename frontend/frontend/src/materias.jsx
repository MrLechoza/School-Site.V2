import React, { useEffect, useState } from "react";

function Materia() {
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No esta logueado, inicie sesion");
      return;
    }

    fetch("http://127.0.0.1:8000/obtener-materias-Pr/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener materias");
        return response.json();
      })
      .then((data) => setMaterias(data))
      .catch((error) => console.log(("Error", error)));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap justify-center m-10">
        {materias.map((materia) => (
          <div className="border-2 border-gray-300 rounded-md w-52 h-52 m-2 p-4 flex flex-col items-center justify-center   ">
            
            <div className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="text-center font-bold">{materia.nombre}</h3>
            <br />
            <div className="absolute mt-[125px] border-b-2 border-gray-300 w-52 "  />
            <button
              key={materia.id}
              onClick={() => handleMateriaSeleccionada(materia.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute size-7 mt-6 ml-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Materia;
