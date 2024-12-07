import React, { useRef } from "react";

function MateriasInfo() {
  const lenguaRef = useRef(null);
  const cienciasRef = useRef(null);
  const educacionFisicaRef = useRef(null);
  const inglesRef = useRef(null);
  const cienciasSocialesRef = useRef(null);
  const musicaRef = useRef(null);
  const educacionCivicaRef = useRef(null);
  const francesRef = useRef(null);
  const cienciasNaturalesRef = useRef(null);
  const informaticaRef = useRef(null);
  const inicioRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Referencia es null");
    }
  };

  return (
    <>
      <div ref={inicioRef} className="mb-5">
        <button
          className="border font-semibold border-black text-black px-2 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(lenguaRef)}
        >
          Lengua
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(cienciasRef)}
        >
          Ciencias
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(educacionFisicaRef)}
        >
          Educación Física
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(inglesRef)}
        >
          Inglés
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(cienciasSocialesRef)}
        >
          Ciencias Sociales
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(musicaRef)}
        >
          Música
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(educacionCivicaRef)}
        >
          Educación Cívica
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(francesRef)}
        >
          Francés
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(cienciasNaturalesRef)}
        >
          Ciencias Naturales
        </button>
        <button
          className="border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(informaticaRef)}
        >
          Informática
        </button>
      </div>

      <div
        ref={lenguaRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Lengua</h1>
        <p className="mb-4">
          El estudio de la lengua y la literatura abarca el análisis de la
          gramática, la ortografía, la comprensión lectora y la producción de
          textos. Se fomentará la apreciación de obras literarias y el
          desarrollo de habilidades de comunicación.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Desarrollar habilidades de lectura y escritura.</li>
          <li>
            Fomentar la creatividad a través de la escritura de relatos y
            poemas.
          </li>
          <li>Analizar diferentes géneros literarios.</li>
        </ul>
      </div>

      <div
        ref={cienciasRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Ciencias</h1>
        <p className="mb-4">
          Esta materia se centra en el estudio de los fenómenos naturales,
          promoviendo la curiosidad y la observación. Se explorarán conceptos
          básicos de biología, física y química.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Comprender el método científico.</li>
          <li>Realizar experimentos sencillos.</li>
          <li>Aprender sobre el entorno natural y su conservación.</li>
        </ul>
      </div>

      <div
        ref={educacionFisicaRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Educación Física</h1>
        <p className="mb-4">
          Las actividades físicas están diseñadas para promover el desarrollo de
          habilidades motrices y la importancia de una vida activa y saludable.
          Se realizarán juegos, deportes y ejercicios de acondicionamiento
          físico.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Fomentar hábitos saludables.</li>
          <li>Desarrollar habilidades de trabajo en equipo.</li>
          <li>Mejorar la coordinación y la resistencia física.</li>
        </ul>
      </div>

      <div
        ref={inglesRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Inglés</h1>
        <p className="mb-4">
          El estudio del idioma inglés incluye la práctica de la gramática,
          vocabulario y habilidades de conversación. Se utilizarán recursos
          multimedia y actividades interactivas para facilitar el aprendizaje.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Desarrollar habilidades básicas de conversación.</li>
          <li>Comprender y utilizar vocabulario cotidiano.</li>
          <li>Leer y escribir textos simples en inglés.</li>
        </ul>
      </div>

      <div
        ref={cienciasSocialesRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Ciencias Sociales</h1>
        <p className="mb-4">
          Esta materia examina la sociedad y sus fenómenos, incluyendo historia,
          geografía y cultura. Se fomentará el análisis crítico de la realidad
          social y la comprensión de la diversidad cultural.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Comprender la historia y la geografía de la comunidad.</li>
          <li>
            Fomentar el respeto y la tolerancia hacia diferentes culturas.
          </li>
          <li>Desarrollar habilidades de investigación y análisis.</li>
        </ul>
      </div>

      <div
        ref={musicaRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Música</h1>
        <p className="mb-4">
          El estudio de la teoría y práctica musical incluye la exploración de
          diferentes géneros musicales, la práctica de instrumentos y la
          apreciación de la música como forma de expresión.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Aprender a leer partituras.</li>
          <li>Desarrollar habilidades en la interpretación musical.</li>
          <li>Fomentar la creatividad a través de la composición.</li>
        </ul>
      </div>

      <div
        ref={educacionCivicaRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Educación Cívica</h1>
        <p className="mb-4">
          Esta materia se centra en el estudio de los deberes y derechos
          ciudadanos, promoviendo la participación activa y responsable en la
          sociedad. Se discutirán temas como la democracia, los derechos humanos
          y la convivencia pacífica.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Conocer los derechos y deberes de los ciudadanos.</li>
          <li>Fomentar la participación en actividades cívicas.</li>
          <li>Desarrollar un sentido de responsabilidad social.</li>
        </ul>
      </div>

      <div
        ref={francesRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Francés</h1>
        <p className="mb-4">
          El estudio del idioma francés incluye la práctica de la gramática,
          vocabulario y habilidades de conversación, con un enfoque en la
          cultura francófona.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Desarrollar habilidades básicas de conversación en francés.</li>
          <li>Comprender y utilizar vocabulario cotidiano.</li>
          <li>Leer y escribir textos simples en francés.</li>
        </ul>
      </div>

      <div
        ref={cienciasNaturalesRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Ciencias Naturales</h1>
        <p className="mb-4">
          Esta materia abarca el estudio de la biología, química y física,
          fomentando el interés por los fenómenos naturales y la investigación
          científica.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>Comprender conceptos básicos de biología, química y física.</li>
          <li>Realizar experimentos y observaciones.</li>
          <li>Fomentar el pensamiento crítico y analítico.</li>
        </ul>
      </div>

      <div
        ref={informaticaRef}
        className="mb-8 p-4 border rounded-lg shadow-md bg-white"
      >
        <h1 className="text-2xl font-bold mb-2">Informática</h1>
        <p className="mb-4">
          El estudio de la tecnología de la información incluye el uso de
          computadoras, software y herramientas digitales. Se abordarán temas
          como la programación básica y la seguridad en línea.
        </p>
        <h2 className="font-semibold mb-2">Objetivos</h2>
        <ul className="list-disc pl-5">
          <li>
            Desarrollar habilidades en el uso de herramientas informáticas.
          </li>
          <li>Comprender conceptos básicos de programación.</li>
          <li>Fomentar la responsabilidad en el uso de la tecnología.</li>
        </ul>
      </div>

      <div className="flex mt-16 place-content-center">
        <button
          className=" flex border font-semibold border-black text-black px-4 py-2 mr-2 mb-2 rounded-md hover:-translate-y-1 transition ease-in-out duration-300"
          onClick={() => scrollToSection(inicioRef)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            color="#000000"
            fill="none"
            className="mr-2"
          >
            <path
              d="M18.5 2.00195V8.00195M18.5 2.00195C17.7998 2.00195 16.4915 3.99625 16 4.50195M18.5 2.00195C19.2002 2.00195 20.5085 3.99625 21 4.50195"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.3913 21.998C15.3395 20.084 15.4684 19.8535 15.6052 19.4277C15.7419 19.002 16.6982 17.4665 17.0366 16.3695C18.1313 12.8202 17.111 12.0653 15.7507 11.0588C14.2422 9.94257 11.3968 9.37728 9.98573 9.49966V3.7462C9.98573 2.78288 9.20481 2.00195 8.24148 2.00195C7.27816 2.00195 6.49723 2.78288 6.49723 3.7462V9.96607M6.49774 21.9988V20.9854C6.43328 20.041 5.49529 18.9235 4.32672 17.3166C3.12509 15.576 2.86688 14.6973 3.05591 13.8848C3.15329 13.4694 3.40594 12.7832 4.64647 11.6104L6.49723 9.96607M6.49723 14.0323V9.96607"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
export default MateriasInfo;
