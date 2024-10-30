import { useEffect, useState } from "react";

function AdminPage() {
    const [estudiante, setEstudiante] = useState([]);
    const [profesor, setProfesor] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [selectedProfesor, setSelectedProfesor] = useState(null);
    const [selectedMaterias, setSelectedMaterias] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/materias/")
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener materias');
                return response.json();
            })
            .then(data => setMaterias(data))
            .catch(error => console.error(error));

        fetch("http://127.0.0.1:8000/usuarios/")
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener usuarios');
                return response.json();
            })
            .then(data => {
    
                const estudiantes = data.filter(user => user.is_student )
                console.log(estudiantes)
                const profesores = data.filter(user => user.is_teacher)
                setEstudiante(estudiantes);
                setProfesor(profesores);
                console.log(data.map(user => user.username));
               
            })
            .catch(error => console.error(error));
    }, []);

    const asignarMateriasEstudiante = () => {

        const token = localStorage.getItem('token')
        if (!token) {
            alert('No se encontro el token, por favor inicie sesion')
            return
        }

        fetch(`http://127.0.0.1:8000/admin-asignar-materiaEs/${selectedEstudiante}/`, {
            method: 'POST',
            headers: { 
                'Content-Type' : 'application/json',
                'Authorization' : `Token ${token}`
             },
            body: JSON.stringify({ materias: selectedMaterias })
        })
        .then(response => {
            if (response.ok) {
                alert('Materias asignadas a estudiante correctamente');
            } else {
                alert('Error al asignar materias a estudiante');
            }
        })
        .catch(error => console.error('Error en la asignación de materias:', error));
    };

    const asignarMateriasProfesor = () => {

        const token = localStorage.getItem('token')
        if (!token) {
            alert('No se encontro el token, por favor inicie sesion')
            return
        }

        fetch(`http://127.0.0.1:8000/admin-asignar-materiaPr/${selectedProfesor}/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ materias: selectedMaterias })
        })
        .then(response => {
            if (response.ok) {
                alert('Materias asignadas a profesor correctamente');
            } else {
                alert('Error al asignar materias a profesor');
            }
        })
        .catch(error => console.error('Error en la asignación de materias:', error));
    };

    return (
        <div>
            <h2 className="text-center">Asignar Materias</h2>

            <div className="flex flex-col mt-7">
                <h3 className="mb-4">Asignar a Estudiante</h3>
                <select className="mb-4" onChange={(e) => setSelectedEstudiante(e.target.value)}>
                    <option value="">Seleccionar Estudiante</option>
                    {estudiante.map(estudiante => (
                        <option key={estudiante.id} value={estudiante.id}>{estudiante.username}</option>
                    ))}
                </select>

                <select className="mb-4" multiple onChange={(e) => setSelectedMaterias([...e.target.selectedOptions].map(o => o.value))}>
                    {materias.map(materia => (
                        <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                    ))}
                </select>

                <button
                className="mt-3 w-full bg-primary text-[#ffffffdc] py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"  
                onClick={asignarMateriasEstudiante}>Asignar</button>
            </div>

            <div className="flex flex-col mt-7">
                <h3 className="mb-4" >Asignar a Profesor</h3>
                <select className="mb-4" onChange={(e) => setSelectedProfesor(e.target.value)}>
                    <option className="mb-4" value="">Seleccionar Profesor</option>
                    {profesor.map(profesor => (
                        <option key={profesor.id} value={profesor.id}>{profesor.username}</option>
                    ))}
                </select>

                <select className="mb-4" multiple onChange={(e) => setSelectedMaterias([...e.target.selectedOptions].map(o => o.value))}>
                    {materias.map(materia => (
                        <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                    ))}
                </select>

                <button 
                className="mt-3 w-full bg-primary text-[#ffffffdc] py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95" 
                 onClick={asignarMateriasProfesor}>Asignar</button>
            </div>
        </div>
    );
}


export default AdminPage;
