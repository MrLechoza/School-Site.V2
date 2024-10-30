import React, { useState } from "react";

function RegisterStudent() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("is_student");
  const [registered, setRegistered] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false)
  const [errorUsername, setErrorUsername] = useState(false)
  const [errorPasword, setErrorPasword] = useState(false)

  const handleRegisterStudent = (e) => {
    e.preventDefault();


    let isValidResult = true

    if (!email){
      setErrorEmail(true)
      isValidResult(false)
    } else {
      setErrorEmail(false)
    }

    if (!username){
      setErrorUsername(true)
      isValidResult(false)
    } else {
      setErrorUsername(false)
    }

    if (!password) {
      setErrorPasword(true)
      isValidResult(false)
    } else [
      setErrorPasword(false)
    ]
    
    fetch("http://127.0.0.1:8000/register/teacher-page/register-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        role,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al registrar usuario");
        }
        return response.json();
      })
      .then(() => {
        setRegistered(true);
        setEmail("");
        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="grid justify-items-center mx-auto p-5">
      <div className="relative font-bold text-gray-500">
        Registro de Estudiante
      </div>
      <form onSubmit={handleRegisterStudent}>
        <div className="flex flex-col p-4 ">
          <div className="flex justify-between items-center my-3">
            <input
              className={`pl-2 border rounded  w-72 p-1 ${errorEmail ? `border-red-500`: `border-gray-300`}`}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex justify-between my-3 items-center">
            <input
              className={`pl-2 border rounded  w-72 p-1 ${errorUsername ? `border-red-500`: `border-gray-300`}`}
              placeholder="Username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="flex justify-between items-center my-3">
            <input
              className={`pl-2 border rounded  w-72 p-1 ${errorPasword ? `border-red-500`: `border-gray-300`}`}
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <input type="hidden" value={role} />

          <button
            className="flex my-3 pl-2 place-content-center items-center border rounded w-72 p-1 bg-black text-white hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out transform active:scale-95"
            type="submit"
          >
            Registrar
          </button>
          {registered && (
            <div
              className="flex bg-green-100 border border-green-400 text-green-700 px-2 py-2 rounded relative place-content-center"
              role="alert"
            >
              <span className="block sm:inline">Registrado con éxito!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
export default RegisterStudent;
