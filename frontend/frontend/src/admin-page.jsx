import { useEffect, useState } from "react";
import Select from "react-select";

function AdminPage() {
  const [estudiante, setEstudiante] = useState([]);
  const [profesor, setProfesor] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  const [estudiantesConMaterias, setEstudiantesConMaterias] = useState([]);
  const [profesoresConMaterias, setProfesoresConMaterias] = useState([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/materias/")
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener materias");
        return response.json();
      })
      .then((data) => setMaterias(data))
      .catch((error) => console.error(error));

    fetch("http://127.0.0.1:8000/usuarios/")
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener usuarios");
        return response.json();
      })
      .then((data) => {
        const estudiantes = data.filter((user) => user.is_student);
        const profesores = data.filter((user) => user.is_teacher);
        setEstudiante(estudiantes);
        setProfesor(profesores);
      })
      .catch((error) => console.error(error));
  }, []);

  const asignarMateriasEstudiante = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontro el token, por favor inicie sesion");
      return;
    }

    fetch(
      `http://127.0.0.1:8000/admin-asignar-materiaEs/${selectedEstudiante.value}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          materias: selectedMaterias.map((materia) => materia.value),
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Materias asignadas a estudiante correctamente");
        } else {
          alert("Error al asignar materias a estudiante");
        }
      })
      .catch((error) =>
        console.error("Error en la asignación de materias:", error)
      );
  };

  const asignarMateriasProfesor = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontro el token, por favor inicie sesion");
      return;
    }

    fetch(
      `http://127.0.0.1:8000/admin-asignar-materiaPr/${selectedProfesor.value}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          materias: selectedMaterias.map((materia) => materia.value),
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Materias asignadas a profesor correctamente");
        } else {
          alert("Error al asignar materias a profesor");
        }
      })
      .catch((error) =>
        console.error("Error en la asignación de materias:", error)
      );
  };

  const estudianteOptions = estudiante.map((est) => ({
    value: est.id,
    label: est.username,
  }));
  const profesorOptions = profesor.map((prof) => ({
    value: prof.id,
    label: prof.username,
  }));
  const materiasOptions = materias.map((materia) => ({
    value: materia.id,
    label: materia.nombre,
  }));

  
  const eliminarMateriasAsignadas = () => {
    const token = localStorage.getItem("token");
    const usuarioId = selectedEstudiante
      ? selectedEstudiante.value
      : selectedProfesor.value;
    const materiasIds = selectedMaterias.map((materia) => materia.value);

    const url = selectedEstudiante
      ? `http://127.0.0.1:8000/eliminar_materias_Es/${usuarioId}/`
      : `http://127.0.0.1:8000/eliminar_materias_Pr/${usuarioId}/`;

    if (!usuarioId) {
      alert("Por favor selecciona al estudiante o profesor");
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ materias: materiasIds }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Materias eliminadas correctamente");
          setMateriasAsignadas((prevMaterias) =>
            prevMaterias.filter((m) => !materiasIds.includes(m.id))
          );
        } else {
          alert("Error al eliminar materias");
        }
      })
      .catch((error) => console.error("Error al eliminar materias:", error));
  };

  const obtenerEstudianteConMaterias = () => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/listar_materias_Es", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setEstudiantesConMaterias(data))
      .catch((error) => console.error("Error al obtener estudiantes: ", error));
  };

  const obtenerProfesorConMaterias = () => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/listar_materias_Pr", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProfesoresConMaterias(data))
      .catch((error) => console.error("Error al obtener profesores: ", error));
  };

  useEffect(() => {
    obtenerEstudianteConMaterias();
    obtenerProfesorConMaterias();
  }, []);

  return (
    <>
      <div className="max-w-xl mx-auto">
        <h2 className="text-center font-semibold">Asignar Materias</h2>

        <div className="flex flex-col mt-7">
          <h3 className="mb-4 font-semibold">Asignar a Estudiante</h3>
          <Select
            className="mb-4"
            options={estudianteOptions}
            onChange={setSelectedEstudiante}
            placeholder="Seleccionar Estudiante"
          />

          <Select
            className="mb-4"
            options={materiasOptions}
            onChange={setSelectedMaterias}
            isMulti
            placeholder="Seleccionar Materias"
          />

          <button
            className="mt-3 w-full bg-primary text-white py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
            onClick={asignarMateriasEstudiante}
          >
            Asignar
          </button>
        </div>

        <div className="flex flex-col mt-7">
          <h3 className="mb-4 font-semibold">Asignar a Profesor</h3>
          <Select
            className="mb-4"
            options={profesorOptions}
            onChange={setSelectedProfesor}
            placeholder="Seleccionar Profesor"
          />

          <Select
            className="mb-4"
            options={materiasOptions}
            onChange={setSelectedMaterias}
            isMulti
            placeholder="Seleccionar Materias"
          />

          <button
            className="mt-3 mb-10 w-full bg-primary text-white py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
            onClick={asignarMateriasProfesor}
          >
            Asignar
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <h1 className="text-center font-semibold">Eliminar Materias</h1>
        <div>
          <h3 className="mb-4 font-semibold">Seleccionar</h3>
          <Select
            className="mb-4"
            options={estudiantesConMaterias.map((estudiante) => ({
              value: estudiante.id,
              label: estudiante.nombre,
              materias: estudiante.materias,
            }))}
            onChange={(option) => {
              setSelectedEstudiante(option);
              setMateriasAsignadas(option.materias); 
            }}
            placeholder="Seleccionar Estudiante"
          />

         
          <Select
            options={profesoresConMaterias.map((profesor) => ({
              value: profesor.id,
              label: profesor.nombre,
              materias: profesor.materias,
            }))}
            onChange={(option) => {
              setSelectedProfesor(option);
              setMateriasAsignadas(option.materias); 
            }}
            placeholder="Seleccionar Profesor"
          />
        </div>

        <div className="flex flex-col mt-7">
          <h3 className="mb-4 font-semibold">
            Materias Asignadas (para Eliminar)
          </h3>
          <Select
            className="mb-4"
            options={materiasAsignadas.map((materia) => ({
              value: materia.id,
              label: materia.nombre,
            }))}
            onChange={setSelectedMaterias} 
            isMulti
            placeholder="Seleccionar Materias a Eliminar"
          />

          <button
            className="mt-3 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200 ease-in-out transform active:scale-95"
            onClick={eliminarMateriasAsignadas}
          >
            Eliminar Materias Seleccionadas
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
