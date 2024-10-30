import React from "react";

function StudentRegistrationConfirmation() {
  return (
    <div className="w-auto h-auto shadow-2xl my-10 mx-20 p-10">
      <h1 className="text-[20px] md:text-[25px] lg:text-[30px] font-bold px-5 pb-5 text-center ">Solicitud de registro enviada...</h1>
      <p className="text-[15px] md:text-[15px] lg:text-[20px]  text-center ">
        Se ha enviado una solicitud de registro al profesor. Por favor, espere a
        que el profesor lo registre.
      </p>
    </div>
  );
}

export default StudentRegistrationConfirmation;
