import { useEffect, useState } from "react";

function StudentPage() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se esta logueado, inicie sesion");
      return;
    }

    fetch("http://127.0.0.1:8000/obtener-materias-Es/", {
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
      .catch((error) => console.error(("Error", error)));
  }, []);

  return (
    <div>
      <h1 className="bg-white">Estudiates</h1>
      <h2>Mis materias</h2>

      <button>
        <div className="border rounded-md w-64 h-64">
          <ul className=" text-center mt-44 ">
            {materias.map((materia) => (
              <li key={materia.id}>{materia.nombre}</li>
            ))}
          </ul>
        </div>
      </button>
    </div>
  );
}

export default StudentPage;
