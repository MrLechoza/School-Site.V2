import { useEffect, useState } from "react";
import { useParams } from "react-router";
import getFileIcon from "./obtenerIcono";

const VerEntregas = () => {
  const { id: asignacionId } = useParams();
  const [entregas, setEntregas] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const token = localStorage.getItem("token");
  const [nuevaNota, setNuevaNota] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [estudiante, setEstudiante] = useState(null);
  const [ notas, setNotas ] = useState([])

  useEffect(() => {
    if (!asignacionId) {
      console.error("No se proporcionó un id válido");
      setError("ID de asignación no proporcionada");
      return;
    }

    fetch(`http://127.0.0.1:8000/ver_entregas/${asignacionId}/`, {
      method: "GET",
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
      .then((data) => 
        setEntregas(data),
      console.log('entregas', entregas)
    )

      
      .catch((error) => setError(error.message));
  }, [asignacionId, token]);


  useEffect(() => {
    if (entregas.length > 0) {
      entregas.forEach((entrega) => {
        fetch(`http://127.0.0.1:8000/obtener_notas/${entrega.id}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al obtener las notas");
            }
            return response.json();
          })
          .then((data) => {
            setNotas((prev) => ({
              ...prev,
              [entrega.id]: data,
            }), console.log('notasssssssss',data));
          })
          .catch((error) => setError(error.message));
      });
    }
  }, [entregas, token]);
    
  

  useEffect(() => {
    if (selectedEntrega && selectedEntrega.estudiante) {

      console.log("selectedEntrega:", selectedEntrega.estudiante);
      fetch(
        `http://127.0.0.1:8000/estudiante/${selectedEntrega.estudiante}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setEstudiante(data))
        .catch((error) =>
          console.error("Error al obtener los datos del estudiante", error)
        );
    }
  }, [selectedEntrega, token]);

  const openModal = (entrega) => {
    console.log("Entrega seleccionada para el modal:", entrega);
    if (!entrega || !entrega.id) {
      console.error("Entrega inválida.");
      return;
    }
    setSelectedEntrega({ ...entrega })
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEntrega(null);
    setNuevaNota("");
    setNuevoComentario("");
  };

  const handleSubmitNota = (e) => {
    e.preventDefault();
    console.log("selectedEntrega:", selectedEntrega);
    console.log(  'estudiantes' , estudiante)

    if (!selectedEntrega || !selectedEntrega.id) {
      console.error("selectedEntrega está vacío o no tiene un ID.");
      alert("No se ha seleccionado una entrega válida.");
      return;
    }

    const payload = {
      calificacion: nuevaNota,
      comentarios: nuevoComentario,
      estudiante_id: estudiante.id,
      asignacion_id: asignacionId, 
      entrega: selectedEntrega.id, 
    };
    console.log(  'payload', payload)
    console.log( "id para la entrega ", selectedEntrega.id)
    fetch(`http://127.0.0.1:8000/asignar_nota/${selectedEntrega.id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al asignar la nota");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Nota enviada con éxito:", data);
        alert("Nota asignada correctamente");
        closeModal(); 
      })
      .catch((error) => {
        console.error("Error al enviar la nota:", error);
      });
  };

  

  return (
    <div className="p-10 w-10/12 mx-auto bg-white rounded-lg shadow-md m-10">
      <h2 className="font-bold text-xl text-center mb-4">
        Entregas de la Asignación #{asignacionId}
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {entregas.length === 0 ? (
          <li>No hay entregas disponibles para esta asignación.</li>
        ) : (
          entregas.map((entrega) => (
            <li key={entrega.id} className="mb-6">
              <div className="flex gap-2 shadow-md p-6">
                <div className="flex flex-col w-10/12">
                  <p className="font-semibold">Estudiante:</p>
                  {entrega.estudiante}
                  <p className="font-semibold">Comentario:</p>
                  {entrega.comentario} 
                  {entrega.archivo && (
                  <a
                    href={`http://127.0.0.1:8000/download/${entrega.id}/asignacion/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {getFileIcon(entrega.archivo)}
                  </a>
                )}
                  <div className="mt-4" >
                    <p className="font-semibold" >Calificaciones:</p>
                    {notas[entrega.id]?.length > 0 ? (
                      <ul >
                        {notas[entrega.id].map((nota) => (
                          <li key={nota.id}>
                            {Math.floor(nota.calificacion)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay calificaciones para esta entrega.</p>
                    )}
                  </div>
                </div>
                <div className="flex w-44 border-l items-center pl-8">
                  <button
                    onClick={() => openModal(entrega)}
                    className="border block border-gray-400 hover:border-black px-4 py-2 font-semibold rounded-md hover:-translate-y-1 justify-center transition duration-200 ease-in-out transform active:scale-95"
                  >
                    Asignar Nota
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {modalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="font-bold text-lg mb-4">
              Asignar Nota - Estudiante: {estudiante?.username || "Cargando..."}
            </h3>
            <form onSubmit={handleSubmitNota}>
              <label className="block mb-2">
                Nota:
                <input
                  type="number"
                  id="nota"
                  value={nuevaNota}
                  required
                  onChange={(e) => setNuevaNota(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
              <label className="block mb-4">
                Comentarios:
                <textarea
                  id="comentarios"
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded"
                ></textarea>
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border px-4 py-2 font-semibold rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="border px-4 py-2 font-semibold rounded-md"
                >
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default VerEntregas;