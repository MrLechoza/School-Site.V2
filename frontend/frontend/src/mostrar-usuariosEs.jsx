import { useEffect, useState } from "react";

function MostrarEstudiantes({ materiaId }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (materiaId) {
      fetch(`http://127.0.0.1:8000/asignacionesPr/${materiaId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se encontraron los datos");
          }
          return response.json();
        })
        .then((data) => {
          const estudiantesSet = new Set();
          data.forEach((asignacion) => {
            asignacion.estudiantes.forEach((estudiante) => {
              estudiantesSet.add(estudiante.id);
            });
          });
          const estudiantesUnicos = Array.from(estudiantesSet).map((id) =>
            data
              .flatMap((asignacion) => asignacion.estudiantes)
              .find((est) => est.id === id)
          );
          setEstudiantes(estudiantesUnicos);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        });
    }
  }, [materiaId]);

  return (
    <div className="m-10 p-6">
      <h1 className="flex font-semibold justify-center">
        Estudiantes Asignados
      </h1>
      {error ? (
        <p>{error}</p>
      ) : estudiantes.length > 0 ? (
        <ul>
          {estudiantes.map((estudiante) => (
            <li key={estudiante.id}>
              <div className="mt-10">
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {estudiante.username}
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 mr-2"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>

                  {estudiante.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes asignados</p>
      )}
    </div>
  );
}

export default MostrarEstudiantes;
