import Buscador from "@/components/routes/buscar/Buscador";
import Resultados from "@/components/routes/buscar/Resultados";
import BarraLateral from "@/components/routes/buscar/BarraLateral";
import Header from "@/components/routes/buscar/Header";
import Redirect from "./Redirect";

// Este es un componente que usa la nueva sintaxis async/await para hacer fetching de datos en el servidor
export async function generateMetadata({ searchParams }) {
  const query = searchParams.query || '';
  return {
    title: query ? `${query} - Cumbre Buscador` : 'Cumbre Buscador',
  };
}

export default async function Buscar({ searchParams }) {
  const query = searchParams.query; // Obtener el parámetro "query" de la URL

  // Si no hay query, redirigimos a la página principal
  if (!query) {
    return <Redirect />;
  }

  let initialResults = [];
  let error = null;
  let tiempo_busqueda = 0;
  let inputCorregido = [];  // Variable para guardar input_corregido

  // Si hay query, hacemos la petición
  if (query) {
    try {
      const response = await fetch(
        `https://data.cumbre.icu/api/get-results/${query}`
        /* `https://data.cumbre.icu/api/get-resultss/${query}` */
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      initialResults = Array.isArray(data.resultados) ? data.resultados : [];

      // Guardamos el input corregido
      inputCorregido = Array.isArray(data.input_corregido) ? data.input_corregido : [];

      tiempo_busqueda = data.tiempo_busqueda || 0;
    } catch (err) {
      console.error("Error fetching results:", err);
      error = "Por el momento no tenemos vacantes para este trabajo";
    }
  }

  return (
    <>
      <div>
        <Header />
        {/* Mostrar resultados */}
        <div className="pt-16 pb-24 px-6">
          <div className="search-results w-full lg:w-[80%] mx-auto rounded-lg">
            <div className="my-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Cerca de {initialResults.length} resultados en {tiempo_busqueda.toFixed(4)} segundos
              </span>

              {inputCorregido.length > 0 && (
                <div className="mt-2">
                  <span>
                    Tal vez quisiste buscar:{" "}
                    <a href={`/buscar?query=${inputCorregido[0]}`} className="font-bold text-blue-500">
                      {inputCorregido[0]}
                    </a>
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="w-full lg:hidden">
                <BarraLateral query={query} />
              </div>
              <ul className="space-y-6 w-full lg:w-[80%]">
                <Resultados initialResults={initialResults} error={error} query={query} />
              </ul>
              <div className="hidden lg:flex w-[50%]">
                <BarraLateral query={query} />
              </div>
            </div>
            <div className="text-center py-4 pt-6">
              <button
                id="load-more"
                className="bg-gray-500 text-black p-2 px-4 rounded-full text-sm hidden"
              >
                Ver más
              </button>
            </div>
          </div>
        </div>
        <div
          className="
        fixed bottom-0 left-0 w-full 
        flex flex-col items-center 
        justify-center shadow-lg 
        pb-3 pt-6 px-6 lg:px-0 
        bg-[linear-gradient(to_bottom,transparent_5%,white_95%)] 
        dark:bg-[linear-gradient(to_bottom,transparent_5%,black_95%)]

      "
        >
          <Buscador query={query} botones={true} home={false} />
        </div>
      </div>
    </>
  );
}
