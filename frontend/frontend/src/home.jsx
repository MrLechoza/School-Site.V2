import React, { useState } from "react";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { id: 0, src: "Escuela.jpg" },
    { id: 1, src: "Escuela1.jpg" },
    { id: 2, src: "Escuela2.jpg" },
  ];

  const imagesCount = images.length;

  const handleNext = () => {
    if (currentIndex === imagesCount - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handlePrev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(imagesCount - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="relative">
        <div
          className="carousel-inner flex"
          style={{
            transform: `translateX(${currentIndex * -100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`w-full h-[300px] flex-shrink-0 ${
                index === currentIndex ? "active" : ""
              }`}
            >
              <img
                src={image.src}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full  shadow-2xl"
              ></img>
            </div>
          ))}
        </div>

        <button
          className="absolute  top-1/2 left-0 transform -translate-y-5 ml-3 bg-[#fcfcfc63] hover:bg-[#fcfcfcbe] rounded-full p-1"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-5 mr-3 bg-[#fcfcfc63] hover:bg-[#fcfcfcbe] rounded-full p-1"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      <div className="shadow-2xl bg-[#9491912d] h-auto w-full flex flex-wrap p-5">
        <div className="w-1/2 my-auto pl-5 flex justify-center items-center">
          <img
            src="descargar (1).jpeg"
            className="w-auto rounded-br-[30px] rounded-tl-[30px]"
          />
        </div>

        <div className="w-1/2 justify-end">
          <div className="flex justify-center pt-5">
            <h1 className="text-2xl font-bolt mb-2 font-sans items-center">
              BIENVENIDOS
            </h1>
            <p className="absolute mt-9">------------------------------</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 ml-2 mt-1"
            >
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
            </svg>
          </div>
          <p className="text-lg text-[#807373e8] text-center p-10 pb-10">
            Estamos emocionados de que estés aquí. Explora nuestro contenido y
            descubre lo que tenemos para ofrecerte.
          </p>
        </div>
      </div>

      <div className="bg-black p-10">
        <div className="flex justify-center">
          <h1 className="text-center  text-2xl text-white font-bolt mb-2 font-sans">
            MATERIAS
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="size-6 ml-2 mt-1  "
          >
            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
            <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
          </svg>
        </div>
        <p className="grid justify-center mb-7 text-white">
          ----------------------------
        </p>

        <div className="grid place-content-center 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 ml-10">

          <div className="card bg-white w-[320px] h-[400px] shadow-xl rounded-xl">
            <figure>
              <img src="estadistica.jpeg" className="rounded-xl w-full h-36 " />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title mt-5 capitalize">ESTADISTICA</h2>
              <p className="m-5">La estadística es la ciencia que se encarga de recopilar, analizar e interpretar datos para extraer conclusiones y patrones. </p>
              <div className="card-actions flex justify-end mr-10">
                <button className="btn btn-primary  ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-9"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-white w-[320px] h-[400px] shadow-xl rounded-xl">
            <figure>
              <img src="ciencia.png" className="rounded-xl w-full h-36 " />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title mt-5 capitalize">CIENCIAS</h2>
              <p className="m-5">La ciencia es el estudio sistemático de la naturaleza y el universo a través de la observación, experimentación y evidencia.</p>
              <div className="card-actions flex justify-end mr-10">
                <button className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-9"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-white w-[320px] h-[400px] shadow-xl rounded-xl">
            <figure>
              <img src="ingles.jpeg" className="rounded-xl w-full h-36 " />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title mt-5 ">INGLES</h2>
              <p className="m-5">El inglés es un idioma germánico hablado en muchos países del mundo, especialmente en Estados Unidos</p>
              <div className="card-actions flex justify-end mr-10">
                <button className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-9"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-white w-[320px] h-[400px] shadow-xl rounded-xl">
            <figure>
              <img src="matematicas.png" className="rounded-xl w-full h-36 " />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title mt-5">MATEMATICAS</h2>
              <p className="m-5">La matemática es la ciencia que se ocupa del estudio de números, cantidades, espacios y estructuras.</p>
              <div className="card-actions flex justify-end mr-10">
                <button className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-9 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
