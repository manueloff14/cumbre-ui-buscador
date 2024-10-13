import Link from "next/link";
import Buscador from "@/components/routes/buscar/Buscador";
import Resultados from "@/components/routes/buscar/Resultados";
import BarraLateral from "@/components/routes/buscar/BarraLateral";

// Este es un componente que usa la nueva sintaxis async/await para hacer fetching de datos en el servidor
export async function generateMetadata({ searchParams }) {
  const query = searchParams.query || '';
  return {
    title: query ? `${query} - Cumbre Buscador` : 'Cumbre Buscador',
  };
}

export default async function Buscar({ searchParams }) {
  const query = searchParams.query || ''; // Obtener el parámetro "query" de la URL
  let initialResults = [];
  let error = null;
  let tiempo_busqueda = 0;
  let inputCorregido = [];  // Añadimos una variable para guardar input_corregido

  // Si no hay query, no hacemos la petición
  if (query) {
    try {
      const response = await fetch(
        `https://buscadorcumbre.pythonanywhere.com/api/buscar/${query}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Asegurarse de que initialResults se extraiga correctamente del campo "resultados"
      initialResults = Array.isArray(data.resultados) ? data.resultados : [];

      // Guardamos el input corregido
      inputCorregido = Array.isArray(data.input_corregido) ? data.input_corregido : [];

      // Calcular el tiempo de búsqueda
      const {
        tiempo_buscar_palabras,
        tiempo_buscar_sinonimos,
        tiempo_ram,
        tiempo_input_corregido,
      } = data;

      // Convertimos cualquier valor potencialmente no numérico a un número
      const tiempoPalabras = Number(tiempo_buscar_palabras) || 0;
      const tiempoSinonimos = Number(tiempo_buscar_sinonimos) || 0;
      const tiempoRam = Number(tiempo_ram) || 0;
      const tiempoInputCorregido = Number(tiempo_input_corregido) || 0;

      // Sumamos los tiempos y nos aseguramos de que no sea NaN
      tiempo_busqueda = (
        tiempoPalabras +
        tiempoSinonimos +
        tiempoRam +
        tiempoInputCorregido
      ).toFixed(4);
    } catch (err) {
      console.error("Error fetching results:", err);
      error = "Por el momento no tenemos vacantes para este trabajo";
    }
  }

  return (
    <>
      <div>
        <header class="fixed top-0 left-0 w-full py-4 px-6 bg-[#0a0a0a] flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <img
              src="/img/cumbre_logo.png"
              alt="Logo Cumbre"
              class="w-[110px]"
            />
            <span className="w-[2px] h-[15px] bg-white hidden md:flex"></span>
            <div className="text-gray-300 text-sm hidden md:flex">
              <span>El buscador de empleos</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400 hidden md:flex">
              Con ❤️ desde <span className="text-white">Cúcuta</span>
            </div>
            <a href="">
              <button className="bg-gradient-to-r from-blue-600 to-pink-600 p-2 px-4 font-bold text-white rounded-full text-sm">
                Optener Ayuda
              </button>
            </a>
          </div>
        </header>
        {/* Mostrar resultados */}
        <div class="pt-16 pb-24 px-6">
          <div class="search-results w-full lg:w-[80%] mx-auto rounded-lg">
            <div class="my-3">
              <span class="text-sm text-gray-300">
                Cerca de {initialResults.length} resultados en {tiempo_busqueda} segundos
              </span>
                  
                  {inputCorregido.length > 0 ? (
                    <div className="mt-2">
                      <span>
                      Tal vez quisiste buscar:{" "}
                      <a href={`/buscar?query=${inputCorregido[0]}`} className="font-bold text-blue-500">
                        {inputCorregido[0]}
                      </a>
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
            </div>
            <div class="flex flex-col lg:flex-row gap-4 items-start">
              <div className="w-full lg:hidden">
                <BarraLateral query={query} />
              </div>
              <ul class="space-y-6 w-full lg:w-[80%]">
                <Resultados initialResults={initialResults} error={error} />
              </ul>
              <div className="hidden lg:flex w-[50%]">
                <BarraLateral query={query} />
              </div>
            </div>
            <div class="text-center py-4 pt-6">
              <button
                id="load-more"
                class="bg-gray-500 text-black p-2 px-4 rounded-full text-sm hidden"
              >
                Ver más
              </button>
            </div>
          </div>
        </div>
        <Buscador query={query} />
      </div>
    </>
  );
}
