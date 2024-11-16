import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ loading, setLoading] = useState(false)

  const navigate = useNavigate()
  
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true)
  
    fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
          throw new Error("Correo electronico o contraseña incorrectas");
        }
        throw new Error('Correo electronico o contraseña incorrectas')
      }
        return response.json();
      })
      .then((data) => {
        console.log('Respuesta del login:', data)
        localStorage.setItem("token", data.token);
        console.log('Roles:', data.is_student, data.is_teacher, data.is_staff);
        if (data.token) {
  
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", data.user); 

          localStorage.setItem("is_student", data.is_student ? "true" : "false");
          localStorage.setItem("is_teacher", data.is_teacher ? "true" : "false");
          localStorage.setItem("is_staff", data.is_staff ? "true" : "false");

          let role =  '' 
          if (data.is_teacher) {
            role = 'is_teacher'
          } else if (data.is_student) {
            role = 'is_student'
          } else if (data.is_staff) {
            role  = 'is_staff'
          }
          localStorage.setItem("role", role);
          
          const loginEvent = new CustomEvent('login', { detail: {user : data.user, data: data}})
          window.dispatchEvent(loginEvent)

          console.log(role)
          console.log("Inicio de sesión exitoso: ", data);
            
          if (role === 'is_staff') {
            navigate('/admin')
          } else if (role === 'is_teacher'){
            navigate('/teacher-page')
          } else {
            navigate('/student-page')
          }
        } else {
          console.error("Error de inicio de sesión: ", data);
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión: ", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false); 
      });
  };


  return (
    <div className="max-w-md  mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-7">Inicio de Sesión</h1>
      
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <div className="m-3">
          <input
          type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            ></input>
            
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mt-3"
          />
          <button 
            type='submit' 
            className="mt-3 w-full bg-primary text-[#ffffffdc] py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
            disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </div>
        {error && <p className="text-red-500 text-center"> {error} </p>}
      </form>
    </div>
  );
}

export default Login;


