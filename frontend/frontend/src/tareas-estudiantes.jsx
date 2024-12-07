import { useEffect, useState } from "react";
import { useActionData, useParams } from "react-router-dom";
import getFileIcon from "./obtenerIcono";
import UploadComponent from "./fileupload";

function TareasEs() {
  const { materiaId } = useParams();
  const [materias, setMaterias] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [archivo, setArchivo] = useState([]);
  const [entregado, setEntregado] = useState({});
  const [asignacionEntregada, setAsignacionEntregada] = useState([]);
  const [profesoresData, setProfesoresData] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [id, setId] = useState([]);

  const BASE_URL = "http://127.0.0.1:8000";

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
        setUsuario(user);
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
    if (asignaciones.length > 0) {
      const entregasPromises = asignaciones.map((asignacion) => {
        return fetch(`http://127.0.0.1:8000/entregas/${asignacion.id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al obtener las entregas");
            }
            return response.json();
          })
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              console.log("Estos son los datos para la entrega");
              return { asignacionId: asignacion.id, entregaId: data[0].id };
            }
            return null;
          });
      });

      Promise.all(entregasPromises)
        .then((resultados) => {
          const entregasValidas = resultados.filter(
            (entrega) => entrega !== null
          );

          const nuevasEntregas = {};
          entregasValidas.forEach(({ asignacionId, entregaId }) => {
            nuevasEntregas[asignacionId] = entregaId;
          });
          setAsignacionEntregada(nuevasEntregas);

          entregasValidas.forEach(({ asignacionId }) => {
            setEntregado((prevEntregado) => ({
              ...prevEntregado,
              [asignacionId]: true,
            }));
          });
        })
        .catch((error) => {
          console.error("Error al obtener entregas: ", error);
        });
    }
  }, [asignaciones]);

  useEffect(() => {
    if (materiaId) {
      fetchAsignaciones(materiaId);
    }
  }, [usuario]);

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
        const asignacionesFiltradas = data.map((asignacion) => {
          const estudiantesConNotas = asignacion.estudiantes
            .map((estudiante) => {
              if (estudiante.email === usuario.email) {
                return {
                  ...estudiante,
                  notas: estudiante.notas.filter(
                    (nota) => nota.asignacion === asignacion.id
                  ),
                };
              }
              return null;
            })
            .filter((estudiante) => estudiante !== null);

          return {
            ...asignacion,
            estudiantes: estudiantesConNotas,
          };
        });

        setAsignaciones(asignacionesFiltradas);
        const initialEntregado = {};
        data.forEach((asignacion) => {
          initialEntregado[asignacion.id] = false;
          fetchProfesor(asignacion.profesor);
        });
        setEntregado(initialEntregado);
      })
      .catch((error) => {
        console.error("Error en fetchAsignaciones:", error);
      });
  };

  const fetchProfesor = (profesoresData) => {
    console.log(profesoresData);

    fetch(`http://127.0.0.1:8000/usuarios/username/${profesoresData}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del profesor");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos del profesor:", data);
        setProfesoresData((prevData) => {
          const exists = prevData.some(
            (prof) => prof.username === data.username
          );
          if (!exists) {
            return [...prevData, data];
          }
          return prevData;
        });
      })
      .catch((error) => {
        console.error("Error al obtener datos del profesor:", error);
      });
  };

  const abrirModal = (asignacion) => {
    setAsignacionSeleccionada(asignacion);
    setModal(true);
  };

  const cerrarModal = () => {
    setComentario("");
    setArchivo([]);
    setModal(false);
    setAsignacionSeleccionada(null);
  };

  const handleFileChange = (selectedFiles) => {
    setEntregado(true);
    setArchivo(selectedFiles);
  };

  const enviarTrabajo = () => {
    if (!comentario && archivo.length === 0) {
      console.log("Debes seleccionar al menos un archivo para entregar");
      return;
    }

    console.log("Archivo seleccionado:", archivo);
    console.log("Es Array: ", Array.isArray(archivo));

    const formData = new FormData();
    formData.append("comentario", comentario);
    formData.append("asignacionId", asignacionSeleccionada.id);

    archivo.forEach((file) => {
      formData.append("archivo", file);
    });

    fetch("http://127.0.0.1:8000/entrega-trabajo/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("trabajo entregado con exito");
          setEntregado((prevEntregado) => ({
            ...prevEntregado,
            [asignacionSeleccionada.id]: true,
          }));

          cerrarModal();
        } else {
          return response.json().then((data) => {
            alert("Error al entregar el trabajo: " + data.message);
          });
        }
      })
      .catch((error) => {
        console.error("Error al enviar: ", error);
        alert("Error al enviar");
      });
  };

  const anularEntrega = (asignacionId) => {
    const entregaId = asignacionEntregada[asignacionId];

    if (!entregaId) {
      alert("No se encontró la entrega para anular.");
      return;
    }

    console.log("ID de entrega a anular:", entregaId);
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/anular/${entregaId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Entrega anulada con éxito");
          setEntregado((prevEntregado) => ({
            ...prevEntregado,
            [asignacionId]: false,
          }));
        } else {
          return response.json().then((data) => {
            alert(
              "Error al anular la entrega: " +
                (data.detail || "Error desconocido")
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error al anular la entrega", error);
        alert("Error al anular la entrega");
      });
  };



  return (
    <div className="flex">
      <div className="w-[20%] rounded-md bg-white shadow-lg text-center">
        {profesoresData.length > 0 ? (
          profesoresData.map((profesor) => {
            console.log("Avatar del profesor:", profesor.avatar);
            const avatarUrl = profesor.avatar
              ? `${BASE_URL}${profesor.avatar}`
              : null;
            const phone = profesor.phone;

            return (
              <div
                key={profesor.id}
                className="flex flex-col items-center mt-6"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    className="size-24 rounded-full border-2 border-gray-10 "
                    alt={`Avatar de ${profesor.username}`}
                  />
                ) : (
                  <div className="mt-14" />
                )}

                <div className="flex">
                  <p className="font-semibold">Profesor: </p>
                  <p className="ml-2">{profesor.username}</p>
                </div>

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
                  {profesor.email}
                </p>

                {phone ? (
                  <p className="flex items-center">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 mr-2"
                    >
                      <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                      <path
                        fillRule="evenodd"
                        d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {profesor.phone}
                  </p>
                ) : (
                  ""
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 mt-32">No hay profesores disponibles.</p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-md w-[80%] max-w-5xl bg-white shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Asignaciones para Estudiantes
        </h1>

        <div className="flex flex-col space-y-6">
          {asignaciones.length === 0 ? (
            <p className="text-gray-500 text-center  m-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="100"
                height="100"
                color="#000000"
                fill="none"
                className="mx-auto m-5"
              >
                <path
                  d="M14 2H10C6.72077 2 5.08116 2 3.91891 2.81382C3.48891 3.1149 3.1149 3.48891 2.81382 3.91891C2 5.08116 2 6.72077 2 10C2 13.2792 2 14.9188 2.81382 16.0811C3.1149 16.5111 3.48891 16.8851 3.91891 17.1862C5.08116 18 6.72077 18 10 18H14C17.2792 18 18.9188 18 20.0811 17.1862C20.5111 16.8851 20.8851 16.5111 21.1862 16.0811C22 14.9188 22 13.2792 22 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M18.8295 2.75418C19.1276 2.43123 19.2766 2.26976 19.435 2.17557C19.8171 1.9483 20.2876 1.94124 20.6761 2.15693C20.8372 2.24632 20.9908 2.40325 21.298 2.7171C21.6053 3.03096 21.7589 3.18789 21.8464 3.35237C22.0575 3.74925 22.0506 4.22992 21.8281 4.62028C21.7359 4.78206 21.5779 4.93431 21.2617 5.2388L17.5003 8.86172C16.9012 9.43875 16.6016 9.72727 16.2272 9.87349C15.8528 10.0197 15.4413 10.009 14.6181 9.98743L14.5062 9.9845C14.2556 9.97795 14.1303 9.97467 14.0574 9.89202C13.9846 9.80936 13.9945 9.68173 14.0144 9.42647L14.0252 9.28786C14.0812 8.56942 14.1092 8.2102 14.2495 7.88729C14.3898 7.56438 14.6318 7.30219 15.1158 6.7778L18.8295 2.75418Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.6557 22L14.2369 21.5811C13.2926 20.6369 13.0585 19.1944 13.6557 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9.00051 22L9.41937 21.5811C10.3636 20.6369 10.5977 19.1944 10.0005 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M7 22H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 10H15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              No hay asignaciones disponibles para esta materia.
            </p>
          ) : (
            asignaciones.map((asignacion) => (
              <div key={asignacion.id} className="flex">
                <div className="flex w-[1100px]  justify-between items-start mr-10 border-t border-b border-gray-200 p-4">
                  <div className="flex-1">
                    <h1 className="text-xl text-gray-800 font-semibold capitalize">
                      {asignacion.titulo}
                    </h1>
                    <p className="text-l text-gray-700">
                      {" "}
                      {asignacion.fechaLimite}{" "}
                    </p>
                    <p className="text-l text-gray-700">
                      {" "}
                      {asignacion.descripcion}{" "}
                    </p>
                    {asignacion.archivo && (
                      <a
                        href={`http://127.0.0.1:8000/download/${asignacion.id}/asignacion/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {getFileIcon(asignacion.archivo)}
                      </a>
                    )}
                    {asignacion.estudiantes.map((estudiante) => (
                      <div key={estudiante.id}>
                        {estudiante.notas.map((nota) => (
                          <p
                            className="capitalize text-l text-gray-700"
                            key={nota.id}
                          >
                            Nota: {parseInt(nota.calificacion)} - Comentario:{" "}
                            {nota.comentarios}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-80 flex flex-col items-center border rounded-lg border-gray-200 p-4 shadow-lg">
                  {entregado[asignacion.id] ? (
                    <div className="text-end">
                      <p className="text-green-600 font-semibold text-center">
                        Entregado
                      </p>
                      <a
                        href={asignacion.archivoUrl}
                        className="text-blue-500 underline"
                      >
                        {asignacion.archivoNombre}
                      </a>
                      <button
                        className="mt-14 flex border border-gray-400 hover:border-red-700 hover:text-red-700  hover:-translate-y-1  px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
                        onClick={() => anularEntrega(asignacion.id)}
                      >
                        Anular la entrega
                      </button>
                    </div>
                  ) : (
                    <div className="text-end">
                      <p className="text-gray-500 text-center">No entregado</p>
                      <button
                        className="mt-14 flex border border-gray-400 hover:border-black hover:text-black  hover:-translate-y-1  px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
                        onClick={() => abrirModal(asignacion)}
                      >
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

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/2 h-[80%]">
            <h2 className="text-xl font-bold mb-4">
              Entregar trabajo: {asignacionSeleccionada?.titulo}
            </h2>
            <textarea
              placeholder="Escribe un comentario..."
              className="w-full border resize-none border-gray-300 rounded p-2  mb-4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>

            <UploadComponent onFileChange={handleFileChange} />

            <div className="flex relaive justify-end space-x-4 mt-16">
              <button
                onClick={cerrarModal}
                className="bg-gray-500 text-white px-4 py-2  rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={enviarTrabajo}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TareasEs;
