import React, { useState } from "react";

const CrearUsuario = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
      is_student: isStudent,
      is_teacher: isTeacher,
    };

    fetch("http://127.0.0.1:8000/crear_usuario/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al crear el usuario");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result)
        setMessage(`Usuario creado: ${result.user.username}`);
        setUsername("");
        setEmail("");
        setPassword("");
        setIsStudent(false);
        setIsTeacher(false);
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
        setMessage("Error al crear el usuario");
      });
  };

  return (
    <div className="grid  mx-auto m-10">
      <h1 className="text-center mb-4 font-semibold">Crear Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Nombre de Usuario"
            type="text"
            value={username}
            className=' w-full p-2 border border-gray-300 rounded mb-4'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Correo Electronico"
            type="email"
            className=' w-full p-2 border border-gray-300 rounded mb-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Contraseña"
            type="password"
            className=' w-full p-2 border border-gray-300 rounded mb-4'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              className="mb-4 mx-2"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
            />
            Estudiante
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              className="mb-4 mx-2"
              checked={isTeacher}
              onChange={(e) => setIsTeacher(e.target.checked)}
            />
            Profesor
          </label>
        </div>
        <button
          className="flex font-semibold my-3 pl-2 place-content-center items-center border rounded w-full p-2 bg-black text-white hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out transform active:scale-95"
          type="submit"
        >
          Crear Usuario
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CrearUsuario;
