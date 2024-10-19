import Image from "next/image";

export const metadata = {
  title: "Cumbre Empleos"
}

export default function Home() {
  return (
    <>
      <div className="text-white h-screen flex flex-col">
        <div className="flex justify-end items-center p-4">
          <div>
            <a href="https://cumbre.icu/contacto">
              <button className="bg-gradient-to-r from-blue-600 to-pink-600 p-2 px-4 font-bold text-white rounded-full text-sm">Obtener Ayuda</button>
            </a>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center">
          <img src="/img/cumbre_logo.png" alt="Logo Cumbre" className="mb-6 w-[140px]" />
          <form action="/buscar" className="flex items-center bg-gray-800 rounded-full w-[90%] md:w-[50%] border-2 border-transparent hover:border-gray-600 transition-all duration-200">
            <input
              type="text"
              placeholder="Buscar algo con Cumbre..."
              className="w-full px-6 py-3 bg-transparent text-white border-none outline-none"
              name="query"
            />
            <button className="flex items-center justify-center p-3 rounded-full m-2 ml-0 hover:bg-gray-700 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" fill="white"></path>
              </svg>
            </button>
          </form>
          <span className="mt-3 text-gray-400 text-sm">Encuentra tu empleo ahora con Cumbre</span>
        </div>

        <footer className="p-4 flex justify-between items-center w-full text-sm">
          <div>© Cumbre, 2024</div>
          <div>Con ❤️ desde Cúcuta</div>
        </footer>
      </div>
    </>
  );
}
