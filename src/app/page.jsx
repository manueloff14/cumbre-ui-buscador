import Image from "next/image";
import Logo from "@/components/Logo";
import BtnSearch from "@/components/BtnSearch";

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
          <Logo />
          <form action="/buscar" className="flex items-center bg-gray-200 dark:bg-gray-900 rounded-full w-[90%] md:w-[50%] border-2 border-transparent dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200">
            <input
              type="text"
              placeholder="Buscar algo con Cumbre..."
              className="w-full px-6 py-3 bg-transparent text-black dark:text-white border-none outline-none"
              name="query"
            />
            <BtnSearch />
          </form>
          <span className="mt-3 text-gray-600 dark:text-gray-400 text-sm">Encuentra tu empleo ahora con Cumbre</span>
        </div>

        <footer className="p-4 flex justify-between items-center w-full text-sm text-black dark:text-white">
          <div>© Cumbre, 2024</div>
          <div>Con ❤️ desde Cúcuta</div>
        </footer>
      </div>
    </>
  );
}
