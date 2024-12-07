import { useState } from "react"
import { useParams } from "react-router-dom"


function ResponderAsignacion() {

    const { id : asignacionId } = useParams()
    const [ contenido, setContenido ] = useState('')
    const estudianteId  = localStorage.getItem('estudianteId')
    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        const data = {
            contenido,
            asignacion : asignacionId,
            estudiante : estudianteId,
        }

        fetch('http://127.0.0.1:8000/respuestas/', {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error('Error al enviar la respuesta')
            }
            return response.json()
        })
        .then((result) => {
            setContenido('')
        })
        .catch((error) => {
            console.error('Error: ', error)
        })
    }

    return (
        <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-7">
        Responder Asignación #{asignacionId}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <textarea
          placeholder="Escribe tu respuesta aquí..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
          rows="6"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
        >
          Enviar Respuesta
        </button>
      </form>
    </div>
    )
}

export default ResponderAsignacion