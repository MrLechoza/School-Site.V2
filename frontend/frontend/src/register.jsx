import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie("csrftoken");

function Register() {
  const [email, setEmail] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [successMessage, setSuccessMenssage] = useState("");
  const navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPasword, setErrorPasword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    let isValid = true;

    if (!email) {
      setErrorEmail(true);
      isValid = false;
    } else {
      setErrorEmail(false);
    }

    if (!username) {
      setErrorUsername(true);
      isValid = false;
    } else {
      setErrorUsername(false);
    }

    if (!password) {
      setErrorPasword(true);
      isValid = false;
    } else {
      setErrorPasword(false);
    }

    if (!isValid) {
      return;
    }

    fetch("http://127.0.0.1:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        is_teacher: role === "teacher",
        is_student: role === "student",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al registrar usuario");
        }
        return response.json();
      })
      .then((data) => {
        

        localStorage.getItem('token', data.token)
        localStorage.getItem('username' , data.username)

        if (role == 'student') {
          navigate('/register/message/', {relative: true})
        } else {
          setSuccessMenssage('Usuario registrado exitosamente')
          navigate('/registro-exitoso', {relative: true})
        }
      })
      .catch((error) => {
        console.log("Error a registrar el usuario: ", error);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-7">Registro</h1>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {successMessage}
        </div>
      )}
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md"
      >
        <div className="m-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3  border ${
              errorEmail ? `border-red-500` : `border-gray-300`
            } rounded`}
          />

          <input
            type="text"
            placeholder="Nombre"
            value={username}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 border ${
              errorUsername ? `border-red-500` : `border-gray-300`
            } rounded mt-3`}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border ${
              errorPasword ? `border-red-500` : `border-gray-300`
            } rounded mt-3`}
          />
          <select
            className="rounded mt-3 border p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Estudiante</option>
            <option value="teacher">Profesor</option>
          </select>
          <button
            type="submit"
            className="mt-3 w-full bg-primary text-[#ffffffdc] py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
