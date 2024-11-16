import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistroExitoso = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login')
  };

  return (
    <div className="max-w-md mx-auto mt-28">
      <h1 className="text-2xl font-bold text-center mb-4">Registro Exitoso</h1>
      <p className="text-center mb-4">Tu registro ha sido completado exitosamente.</p>
      <p className="text-center mb-6">Ya puedes iniciar sesión con tus credenciales.</p>
      <button
        onClick={handleLoginRedirect}
        className="mt-3 w-full bg-primary text-white py-2 rounded bg-[#020202] hover:bg-[#1b1b1b] transition duration-200 ease-in-out"
      >
        Ir a Iniciar Sesión
      </button>
    </div>
  );
};

export default RegistroExitoso;