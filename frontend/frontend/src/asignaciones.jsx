import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Assignments() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [newAsignaciones, setNewAsignaciones] = useState({
    nombre: '',
    description: '',
    fechaLimite: '',
  });
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/asignment/")
      .then((response) => response.json())
      .then((data) => setAsignaciones(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/materias/")
      .then((response) => response.json())
      .then((data) => setMaterias(data))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newAsignaciones.nombre ||
      !newAsignaciones.description ||
      !fechaLimite
    ) {
      console.error("Los campos son obligatorios");
      return;
    }

    const fechaLimiteString = fechaLimite.toISOString().split('T')[0]
    const asignacion  = {
      nombre: newAsignaciones.nombre.toString(),
      description: newAsignaciones.description.toString(),
      fechaLimite: fechaLimiteString,
    };

    fetch("http://127.0.0.1:8000/asignment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asignacion),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setAsignaciones([...asignaciones, data]);
        setNewAsignaciones({
          nombre: '',
          description: '',
          fechaLimite: '',
        })
      })
      .catch(error => {console.error(error)});
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-100 rounded-md w-full h-auto ">
      <h1 className="font-bold m-3 mx-auto">Asignaciones</h1>
    
      <form className="mx-auto" onSubmit={handleSubmit}>
        <div className="mb-2 ">
          <label className="m-2">
            Materia:
            <select
              className="rounded p-1 justify-center ml-10 w-80" 
              value={newAsignaciones.nombre}
              onChange={(e) =>
                setNewAsignaciones({
                  ...newAsignaciones,
                  nombre: e.target.value,
                })
              }
            >
              <option>Seleccionar una materia</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.nombre}>
                  {materia.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="m-2">
          <label className="flex justify-start">
            Descripcion:
            <textarea
              className="rounded p-1 ml-3 w-80"
              type="text"
              value={newAsignaciones.description}
              onChange={(e) =>
                setNewAsignaciones({
                  ...newAsignaciones,
                  description: e.target.value,
                })
              }
            ></textarea>
          </label>
        </div>
        <div className="flex flex-col m-2">
          <label>
            Fecha Limite:
            <DatePicker
              className="rounded p-1 justify-center ml-[7px] w-80"
              selected={fechaLimite}
              onChange={(date) => setFechaLimite(date)}
              dateFormat="yyyy-MM-dd"
            />
          </label>
        </div>
        <button
          className="flex bg-black hover:bg-gray-500 text-white hover:text-black p-2 rounded-md mx-auto"
          onClick={handleSubmit}
        >
          Guardar
        </button>
      </form>

      <h2 className="mx-auto font-bold mt-8">Asignaciones Publicadas</h2>
      <ul className="mx-auto w-[500px]">
        {asignaciones.map((asignacion) => (
          <li key={asignacion.id}>
            <h3 className="mt-10"> {asignacion.nombre} </h3>
            <p> {asignacion.description} </p>
            <p>Fecha Limite: {asignacion.fechaLimite} </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assignments;
