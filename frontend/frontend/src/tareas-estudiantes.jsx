import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TareasEs() {
  const { materiaId } = useParams();
  const [materias, setMaterias] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (materiaId) {
      fetchAsignaciones(materiaId);
    }
  }, [materiaId]);

  const fetchAsignaciones = (materiaId) => {
    console.log("Fetching asignaciones  materiaId:", materiaId);
    fetch(`http://127.0.0.1:8000/asignacionesEs/${materiaId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          response
            .json()
            .then((error) => console.error("Error en la respuesta: ", error));
          throw new Error(
            `Error al obtener las asignaciones: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Asignaciones obtenidas:", data);
        setAsignaciones(data);
        if (data.length === 0) {
          alert("No hay asignaciones para esta materia.");
        }
      })
      .catch((error) => {
        console.error("Error en fetchAsignaciones:", error);
      });
  };

  return (
    <div className="flex flex-col gap-4 rounded-md w-full max-w-5xl bg-white shadow-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Asignaciones para Estudiantes
      </h1>

      <div className="flex flex-col space-y-6">
        {asignaciones.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay asignaciones disponibles para esta materia.
          </p>
        ) : (
          asignaciones.map((asignacion) => (
            <div className="flex">
              <div
                key={asignacion.id}
                className="flex w-[1100px]  justify-between items-start mr-10 border-t border-b border-gray-200 p-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-700">
                    {asignacion.titulo}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Prof. {asignacion.profesor} • {asignacion.fechaLimite}
                  </p>

                  <p className="mt-2  text-gray-600">
                    {asignacion.descripcion}
                  </p>
                  {asignacion.archivo_url && (
                    <a
                      href={`http://127.0.0.1:8000/download/${asignacion.id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {asignacion.archivo}
                    </a>
                  )}

                  <p className="mt-2  font-medium text-gray-700">
                    Puntos: {asignacion.puntos}
                  </p>
                </div>
              </div>

              <div className="w-80 flex flex-col items-center border rounded-lg border-gray-200 p-4 shadow-lg">
                {asignacion.entregado ? (
                  <div className="text-end">
                    <p className="text-gray-500">Entregado</p>
                    <a
                      href={asignacion.archivoUrl}
                      className="text-blue-500 underline"
                    >
                      {asignacion.archivoNombre}
                    </a>
                    <button className="mt-2 text-red-500 text-sm">
                      Anular la entrega
                    </button>
                  </div>
                ) : (
                  <div className="text-end">
                    <p className="text-gray-500">No entregado</p>
                    <button className="mt-14 border-2 border-slate-200  text-black py-1 px-4 rounded-md hover:bg-slate-300">
                      Entregar trabajo
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TareasEs;
