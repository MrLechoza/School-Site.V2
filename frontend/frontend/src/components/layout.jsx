import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const [materias, setMaterias] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  //const [ updateLayout, setUpdateLayout ] = useState(false)
  //const [ hasUpdateLayout, setHasUpdateLayout ] = useState(false)
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");

    console.log("Token al cargar:", token)
    console.log("Usuario almacenado:", storedUser );

    if (token) {
      setIsAuthenticated(true)
      setUsername(storedUser)
    } else {
      setIsAuthenticated(false)
    }
    
  }, []);

  useEffect(() => {
    const handleLogin = (e) => {
      setUsername(e.detail.user)
    setIsAuthenticated(true)
  }
  ;

  window.addEventListener('login', handleLogin);

  return () => {
    window.removeEventListener('login', handleLogin)
  }
  }, [])

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

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    setIsAuthenticated(false)
    navigate("/") 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar justify-between bg-black flex z-50 rounded-br-3xl rounded-bl-3xl">
        <div className="navbar-start my-auto ml-3">
          <a className="font-bold text-white my-auto">Escuela los especiales</a>
        </div>
        <div className="navbar-center hidden lg:flex space-x-4 my-auto">
          <button 
          onClick={() => navigate("/nosostros")}
          className="btn p-2 m-2  bg-black rounded text-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95">Nosotros</button>
          <>
            <div className="relative group mt-4">
              <button className="text-white px-2 ">Materias</button>
              <ul  className="absolute mt-2 p-2 text-center menu dropdown-content bg-black rounded z-[1] w-52 shadow hidden group-hover:block text-white">
                {materias.map((materia) => (
                  <li key={materia.id}>
                    <button className="hover:bg-[#1b1b1b] m-1 p-2 rounded-md">
                      {materia.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
          <a className="text-white p-4">Blog</a>
        </div>
        <div className="flex-col  my-auto navbar-end">
          {isAuthenticated ? (
            <>
              <details className="dropdown text-white mr-20">
                
                <summary className="text-white"> { username } </summary>
                <ul className="absolute p-2 text-center menu dropdown-content -mx-24 bg-black rounded z-[1] w-52 shadow">
                  <li>
                    <button
                      className="btn p-2 bg-black rounded text-white hover:bg-[#1b1b1b]  transition duration-200 ease-in-out transform active:scale-95"
                      onClick={Logout}
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
                className="btn p-2 m-3 bg-black rounded text-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95 "
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>
              <button
                className="btn p-2 m-3 mr-10 bg-black rounded text-white hover:bg-[#1b1b1b] transition duration-200 ease-in-out transform active:scale-95"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-grow p-4">{children}</main>

      <footer className="flex items-center justify-center bg-secondary text-black p-4 mt-auto">
        &copy; {new Date().getFullYear()} Escuela los especiales C.A
      </footer>
    </div>
  );
}

export default Layout
