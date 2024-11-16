import React from "react";

function Nosotros() {
  return (
    <section  className="py-10">
      <div className="mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Nosotros</h2>
        <p className="text-lg mb-8">
          Somos una organización que se dedica a [describir la misión y la
          visión de la organización].
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">Historia</h3>
            <p className="text-lg mb-4">
              La organización fue fundada en [año] por [nombre del fundador].
            </p>
            <p className="text-lg mb-4">
              Desde entonces, hemos [describir los logros y desafíos de la
              organización].
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">Misión y visión</h3>
            <p className="text-lg mb-4">
              Nuestra misión es [describir la misión de la organización].
            </p>
            <p className="text-lg mb-4">
              Nuestra visión es [describir la visión de la organización].
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">Valores y principios</h3>
            <p className="text-lg mb-4">
              Nuestros valores y principios son [describir los valores y
              principios de la organización].
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">Equipo y liderazgo</h3>
            <p className="text-lg mb-4">
              Nuestro equipo de liderazgo está compuesto por [describir a los
              miembros del equipo de liderazgo].
            </p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">Logros y reconocimientos</h3>
            <p className="text-lg mb-4">
              Hemos recibido [describir los logros y reconocimientos de la
              organización].
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Nosotros