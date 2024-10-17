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
            <a href="https://cumbre.icu/ayuda">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 48 48"
              >
                <path
                  d="M 5.4453125 4.0019531 A 1.50015 1.50015 0 0 0 4.1015625 6.0410156 L 9.6015625 20.242188 A 1.50015 1.50015 0 0 0 10.759766 21.179688 L 25.701172 23.605469 C 26.073404 23.665819 26.037109 23.77328 26.037109 24 C 26.037109 24.22672 26.073399 24.334183 25.701172 24.394531 L 10.759766 26.820312 A 1.50015 1.50015 0 0 0 9.6015625 27.757812 L 4.1015625 41.958984 A 1.50015 1.50015 0 0 0 6.1699219 43.841797 L 43.169922 25.341797 A 1.50015 1.50015 0 0 0 43.169922 22.658203 L 6.1699219 4.1582031 A 1.50015 1.50015 0 0 0 5.4453125 4.0019531 z"
                  fill="white"
                ></path>
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
