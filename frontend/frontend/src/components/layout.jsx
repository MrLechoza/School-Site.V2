import React, { useState, useEffect } from "react";
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

function Layout({ children }) {
  const [materias, setMaterias] = useState([]);
  const [materiasAsignadas, setMatriasAsignadas] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("Usuario");
  const [userRol, setUserRole] = useState({});
  //const [ updateLayout, setUpdateLayout ] = useState(false)
  //const [ hasUpdateLayout, setHasUpdateLayout ] = useState(false)
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("Token al cargar:", token);
    console.log("Usuario almacenado:", storedUser);

    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUser || "Usuario");

      const estudiante = localStorage.getItem("is_student") === "true";
      const profesor = localStorage.getItem("is_teacher") === "true";
      const admin = localStorage.getItem("is_staff") === "true";

      console.log("Valor en localStorage is_student:", estudiante);
      console.log("Valor en localStorage is_teacher:", profesor);
      console.log("Valor en localStorage is_staff:", admin);
      setUserRole({ profesor, estudiante, admin });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  useEffect(() => {
    const handleLogin = (e) => {
      setUsername(e.detail.user);
      setIsAuthenticated(true);
    };

    window.addEventListener("login", handleLogin);

    return () => {
      window.removeEventListener("login", handleLogin);
    };
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/materias/")
      .then((response) => response.json())
      .then((data) => {
        setMaterias(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("No esta logueado, iniciar sesion");
      return;
    }

    fetch("http://127.0.0.1:8000/usuarios/me/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.is_teacher) {
          fetch("http://127.0.0.1:8000/obtener-materias-Pr/", {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error en la respuesta de la API");
              }
              return response.json();
            })
            .then((data) => setMatriasAsignadas(data))
            .catch((error) => console.error(error));
        } else if (user.is_student) {
          fetch("http://127.0.0.1:8000/obtener-materias-Es/", {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => setMatriasAsignadas(data))
            .catch((error) => console.error(error));
        }
      });
  }, [token]);

  const handleRedirect = (role) => {
    console.log("roles", role);
    if (!role || Object.keys(role).length === 0) {
      console.error("Los roles no estan definidos");
      navigate("/login");
      return;
    }

    const { profesor, estudiante, admin } = role;
    console.log("Redireccionando segun los roles: ", role);

    console.log("userRol.profesor ", profesor);
    console.log("userRol.admin ", admin);
    console.log("userRol.estudiante ", estudiante);

    if (profesor) {
      navigate("/teacher-page");
    } else if (admin) {
      navigate("/admin");
    } else if (estudiante) {
      navigate("/student-page");
    } else {
      navigate("/login");
    }
  };

  function handleLogout() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No hay usuario autenticado");
      return;
    }

    fetch("http://127.0.0.1:8000/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
        "X-CSRFToken": getCookie("csrftoken"),
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al hacer logout");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("is_student");
        localStorage.removeItem("is_teacher");
        localStorage.removeItem("is_staff");
        localStorage.clear();
        setIsAuthenticated(false);
        setUserRole({ profesor: false, estudiante: false, admin: false });
        navigate("/login");
      })
      .catch((error) => console.error("Error al hacer logout: ", error));
  }

  const handleMateriaNavigate = (id) => {
    setLoading(true)
    const rol = localStorage.getItem("is_student") === "true"
    rol ? navigate(`/asignaciones/${id}`) : navigate(`/asignacionesPr/${id}`);
    console.log("rol de navegacion: ", rol);

    window.location.reload();
  };

  const settings = () => {
    navigate('/settings/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar justify-between h-14 bg-black flex z-50 rounded-br-3xl rounded-bl-3xl">
        <div className="navbar-start my-auto ml-3">
          <a className="font-bold text-white my-auto">Nombre de la Escuela</a>
        </div>
        <div className="navbar-center hidden lg:flex space-x-4 my-auto">
        <button
            onClick={() => navigate("/")}
            className="btn p-2 m-2  bg-black rounded text-white hover:border-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
          >
            Inicio
          </button>

          <button
            onClick={() => navigate("/nosostros")}
            className="btn p-2 m-2  bg-black rounded text-white hover:border-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
          >
            Nosotros
          </button>

          {isAuthenticated ? (
            <>
              <div className="relative group mt-4">
                <button className="text-white px-2">Materias</button>
                <ul className="absolute mt-2 p-2 text-center menu dropdown-content bg-black rounded z-[1] w-52 shadow hidden group-hover:block text-white">
                  {materiasAsignadas.map((materia) => (
                    <li key={materia.id}>
                      <button
                        className="hover:bg-[#1b1b1b] m-1 p-2 rounded-md"
                        onClick={() => handleMateriaNavigate(materia.id)}
                      >
                        {materia.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="flex">
                <button 
                className="text-white p-2 m-2 hover:border-white hover:bg-[#1b1b1b] rounded-md"
                onClick={() => navigate('/materias_info')}
                >
                  
                  Materias</button>
                
              </div>
            </>
          )}

          
          {isAuthenticated && (
            <button
              onClick={() => handleRedirect(userRol)}
              className="btn p-2 m-2 bg-black rounded text-white hover:bg-[#1b1b1b]  transition duration-200 ease-in-out transform active:scale-95"
            >
              Pagina Principal
            </button>
          )}
        </div>
        <div className="flex-col  my-auto navbar-end">
          {isAuthenticated ? (
            <>
              <details className="dropdown text-white mr-20">
                <summary className="text-white"> {username} </summary>
                <ul className="absolute p-2 text-center menu dropdown-content -mx-24 bg-black rounded z-[1] w-52 shadow">
                  <li className="flex flex-col">
                  <button
                   className="btn p-2 bg-black rounded text-white hover:bg-[#1b1b1b]  transition duration-200 ease-in-out transform active:scale-95"
                   onClick={settings}
                  > 
                      Settings
                    </button>
                    <button
                      className="btn p-2 bg-black rounded text-white hover:bg-[#1b1b1b]  transition duration-200 ease-in-out transform active:scale-95"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </details>
            </>
          ) : (
            <div>
              <button
                className="btn p-2 m-3 bg-black rounded text-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95 my-auto"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>
              <button
                className="btn p-2 m-2 mr-10 bg-black rounded text-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-grow p-4">{children}</main>

      <footer className="flex items-center justify-center bg-secondary bg-black text-white p-4 mt-auto">
        &copy; {new Date().getFullYear()} Nombre de la Escuela C.A
      </footer>
    </div>
  );
}

export default Layout;
