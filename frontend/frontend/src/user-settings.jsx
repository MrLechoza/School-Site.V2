import React, { useEffect, useState } from "react";

const UserSettings = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    fetch("http://127.0.0.1:8000/usuarios/me/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("usuario actual", data);
        setUserData(data);
        setAvatarPreview(data.avatar || null); // Muestra la vista previa si existe un avatar
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      if (files && files[0]) {
        setUserData((prevState) => ({
          ...prevState,
          avatar: files[0],
        }));
        setAvatarPreview(URL.createObjectURL(files[0]));
      } else {
        // Si no se seleccionó un archivo, poner avatar como null
        setUserData((prevState) => ({
          ...prevState,
          avatar: null,
        }));
        setAvatarPreview(null); // Elimina la vista previa
      }
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const formData = new FormData();
  
    // Asegúrate de agregar solo los datos que existen
    for (const key in userData) {
      if (userData[key] !== null && userData[key] !== "") {
        formData.append(key, userData[key]);
      }
    }
  
    fetch("http://127.0.0.1:8000/settings/", {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user data");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        alert("Datos actualizados con éxito");
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        setError(error.message);
      });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-l m-10">Configuración de Usuario</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={userData.username || ""}
            onChange={handleChange}
            className="ml-2 border border-gray-800 rounded-md px-2 py-1"
          />
        </div>
        <div className="flex justify-between">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            className="ml-2 border border-gray-800 rounded-md px-2 py-1"
          />
        </div>
        <div className="flex justify-between">
          <label>Teléfono:</label>
          <input
            type="text"
            name="phone"
            value={userData.phone || ""}
            onChange={handleChange}
            className="ml-2 border border-gray-800 rounded-md px-2 py-1"
          />
        </div>
        <div className="flex justify-between">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={userData.password || ""}
            onChange={handleChange}
            className="ml-2 border border-gray-800 rounded-md px-2 py-1"
          />
        </div>

        <div className="">
          <label>Avatar:</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="ml-2 border border-gray-800 rounded-md px-2 py-1"
          />
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Vista previa del avatar"
              className="mt-2 w-20 h-20 rounded-full object-cover"
            />
          ) : (
            userData.avatar && (
              <img
                src={userData.avatar}
                alt="Avatar"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )
          )}
        </div>

        <button
          className="flex my-3 pl-2 place-content-center w-full border rounded p-1 bg-black text-white hover:bg-gray-100 hover:text-black transition duration-200 ease-in-out transform active:scale-95"
          type="submit"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default UserSettings;
