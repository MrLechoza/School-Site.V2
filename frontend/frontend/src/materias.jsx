import React, { useEffect, useState } from "react";

function Materia() {
    const [materias, setMaterias] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/materias/')
            .then(response => response.json())
            .then(data => setMaterias(data));
    }, [])

    return (
        
        <div>
            {materias.map(materia => (
                <div key={materia.id}>
                    <h2> {materia.nombre} </h2>
                    <p> {materia.descripcion} </p>
                    <p>Nivel escolar: {materia.nivel_escolar} </p>
                </div>
            ))}
        </div>
    )
}

export default Materia