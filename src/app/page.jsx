import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-950 text-white h-screen flex flex-col justify-between items-center">
      <div class="flex flex-col items-center justify-center w-full h-full">
      <img src="/img/cumbre_logo.png" alt="Logo Cumbre" class="mb-6 w-[140px]" />
      <form action="/buscar" class="flex items-center bg-gray-800 rounded-full w-[90%] md:w-[50%] border-2 border-transparent hover:border-2 hover:border-gray-600 transition-all duration-200">
        <input
          type="text"
          placeholder="Buscar algo con Cumbre..."
          class="w-full px-6 pl-4 bg-transparent text-white border-none outline-none"
          name="query"
        />
        <button class="flex items-center justify-center p-3 rounded-full m-2 ml-0 hover:bg-gray-800 transition-all duration-200">
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
      <span class="mt-3 text-gray-400 text-sm">Encuentra tu empleo ahora con Cumbre</span>
    </div>

    <footer class="p-4 flex justify-between items-center w-full text-sm">
      <div>© Cumbre, 2024</div>
      <div>Con ❤️ desde Cúcuta</div>
    </footer>
    </div>
  );
}
