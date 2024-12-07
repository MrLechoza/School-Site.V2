import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UploadComponent from "./fileupload";
import getFileIcon from "./obtenerIcono";
import VerEntregas from "./ver-entregas";
import { Link } from "react-router-dom";

function Assignments() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [newAsignaciones, setNewAsignaciones] = useState({
    materia_id: "",
    titulo: "",
    descripcion: "",
    fechaLimite: "",
    profesor: "",
    archivo: null,
  });
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [materias, setMaterias] = useState([]);
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
        if (user.is_teacher) {
          setNewAsignaciones((prev) => ({
            ...prev,
            profesor_nombre: user.username,
          }));

          fetch("http://127.0.0.1:8000/obtener-materias-Pr/", {
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
    if (newAsignaciones.materia_id) {
      fetch("http://127.0.0.1:8000/usuarios/me/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((user) => {
          const endpoint = user.is_teacher
            ? `http://127.0.0.1:8000/asignacionesPr/${newAsignaciones.materia_id}/`
            : `http://127.0.0.1:8000/asignacionesEs/${newAsignaciones.materia_id}/`;

          fetch(endpoint, {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setAsignaciones(data);
              } else {
                console.error("La respuesta no es un array:", data);
                setAsignaciones([]);
              }
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    }
  }, [newAsignaciones.materia_id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newAsignaciones.titulo ||
      !newAsignaciones.descripcion ||
      !newAsignaciones.materia_id ||
      !fechaLimite
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", newAsignaciones.titulo);
    formData.append("descripcion", newAsignaciones.descripcion);
    formData.append("fechaLimite", fechaLimite.toISOString().split("T")[0]);
    formData.append("materia_id", newAsignaciones.materia_id);
    formData.append("profesor_nombre", newAsignaciones.profesor_nombre);

    if (newAsignaciones.archivo && newAsignaciones.archivo.length > 0) {
      newAsignaciones.archivo.forEach((file) => {
        formData.append("archivo", file);
      });
    }

    console.log("Datos a enviar: ", formData);
    console.log("id del profesor: ", newAsignaciones.profesor_nombre);

    const asignacion = {
      titulo: newAsignaciones.titulo,
      descripcion: newAsignaciones.descripcion,
      fechaLimite: fechaLimite.toISOString().split("T")[0],
      materia_id: newAsignaciones.materia_id,
    };

    console.log(asignacion);
    console.log("ID del profesor:", newAsignaciones.profesor_nombre);

    fetch("http://127.0.0.1:8000/crear_asignacion/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return response.json();
      })
      .then((data) => {
        setAsignaciones([...asignaciones, data]);
        console.log("datos", data);
        setNewAsignaciones({
          materia_id: "",
          titulo: "",
          descripcion: "",
          fechaLimite: "",
          profesor: "",
          archivo: null,
        });
        setFechaLimite(new Date());
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`error : ${error.message}`);
        if (error.response) {
          console.error("Data:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else {
          console.error("Error message:", error.message);
        }
      });
  };


  

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://127.0.0.1:8000/eliminar_asignacion/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token  ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la asignación");
        }
        setAsignaciones(
          asignaciones.filter((asignacion) => asignacion.id !== id)
        );
      })
      .catch((error) => console.error(error));
  };

  const handleFileChange = (file) => {
    setNewAsignaciones((prev) => ({
      ...prev,
      archivo: file,
    }));
  };

  return (
    <div className="p-4 w-10/12 mx-auto bg-white rounded-lg shadow-md m-10">
      <h1 className="font-bold text-xl text-center mb-4">Asignaciones</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Materia:</label>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={newAsignaciones.materia_id}
            onChange={(e) => {
              const selectedMateriaId = Number(e.target.value);
              setNewAsignaciones({
                ...newAsignaciones,
                materia_id: selectedMateriaId,
              });
              setAsignaciones([]);
            }}
          >
            <option value="">Seleccionar una materia</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Titulo:</label>
          <input
            className="w-full p-2 mt-1 border rounded"
            value={newAsignaciones.titulo}
            onChange={(e) =>
              setNewAsignaciones({
                ...newAsignaciones,
                titulo: e.target.value,
              })
            }
          ></input>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Descripción:</label>
          <textarea
            className="w-full p-2 mt-1 border rounded"
            value={newAsignaciones.descripcion}
            onChange={(e) =>
              setNewAsignaciones({
                ...newAsignaciones,
                descripcion: e.target.value,
              })
            }
          ></textarea>
        </div>

        <div className="mb-4">
          <h1 className="block font-medium mb-1">Subir Archivo:</h1>
          <UploadComponent onFileChange={handleFileChange} />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Fecha Límite:</label>
          <DatePicker
            className="w-full p-2 mt-1 border rounded"
            selected={fechaLimite}
            onChange={(date) => setFechaLimite(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <button className="w-full font-bold   bg-black text-white p-2 rounded  hover:bg-gray-100 hover:text-black hover:border-black transition duration-200 ease-in-out transform active:scale-95">
          Guardar
        </button>
      </form>

      <h2 className="font-bold text-lg text-center mt-6">
        Asignaciones Publicadas
      </h2>
      <ul className="mt-4 space-y-4">
        {Array.isArray(asignaciones) && asignaciones.length === 0 ? (
          <li className="text-center text-gray-500">
            No hay asignaciones disponibles.
          </li>
        ) : (
          asignaciones.map((asignacion) => (
            <li
              key={asignacion.id}
              className="p-4 border rounded shadow-md flex justify-between items-start"
            >
              <div className="">
                <h3 className="font-bold">{asignacion.titulo}</h3>
                <p>{asignacion.descripcion}</p>

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
                <p className="text-gray-600">
                  Fecha Límite: {asignacion.fechaLimite}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="border border-gray-400 hover:border-red-700 hover:text-red-700 hover:-translate-y-1 px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95"
                  onClick={() => handleDelete(asignacion.id)}
                >
                  Eliminar
                </button>

                <div className="border border-gray-400 hover:border-black hover:-translate-y-1 px-4 py-2 font-semibold rounded-md justify-center transition duration-200 ease-in-out transform active:scale-95">
                  <Link to={`/asignaciones/${asignacion.id}/ver-entregas`}>
                    Ver Entregas
                  </Link>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Assignments;
