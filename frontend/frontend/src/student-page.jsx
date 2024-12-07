import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentPage() {
  const [materias, setMaterias] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("No está logueado, inicia sesión");
      return;
    }

    fetch("http://127.0.0.1:8000/usuarios/me/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((user) => {
        console.log(user);
        if (user.is_student) {
          fetch("http://127.0.0.1:8000/obtener-materias-Es/", {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => setMaterias(data))
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  }, [token]);

  const handleMateriaSeleccionada = (materiaId) => {
    console.log("materia seleccionada", materiaId);
    navigate(`/asignaciones/${materiaId}`);
  };

  return (
    <div>
      {materias.length === 0 ? (
        <h1 className="text-center mt-10">No hay Materias asignadas</h1>
      ) : (
        <div className="flex flex-wrap justify-center mt-20">
          {materias.map((materia) => (
            <button
              key={materia.id}
              onClick={() => handleMateriaSeleccionada(materia.id)}
              
            >
              <div
                key={materia.id}
                className="border-2 text-gray-600 hover:text-black  hover:border-black border-gray-300 rounded-md w-52 h-52 m-2 p-4 flex flex-col items-center justify-center  hover:-translate-y-2 transition duration-300 ease-in-out"
              >
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
                <div className="flex items-center text-center border-gray-300 w-52 " />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentPage;
