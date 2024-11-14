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

  const guardarVisita = async ({ query }) => {
    console.log(`Guardando visita para query: ${query}`); // Log para verificar ejecución
    try {
      // Solicitud para obtener la ubicación del usuario (mantiene caché)
      const locationResponse = await fetch('https://ipapi.co/json/');
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        const ip = locationData.ip;
        const country_name = locationData.country_name;
        const city = locationData.city;
        console.log(`Datos de ubicación obtenidos: IP=${ip}, País=${country_name}, Ciudad=${city}`); // Log

        // Solicitud para guardar la visita (sin caché)
        await fetch(`https://data.cumbre.icu/api/consulta/${ip}/${country_name}/${city}/${query}`, { cache: 'no-store' });
        console.log('Visita guardada correctamente'); // Log
      } else {
        console.warn('No se pudo obtener la ubicación, usando valores predeterminados');
        // Solicitud para guardar la visita con valores predeterminados (sin caché)
        await fetch(`https://data.cumbre.icu/api/consulta/0.0.0.0/0/0/${query}`, { cache: 'no-store' });
      }
    } catch (error) {
      console.error("Error al guardar la visita:", error);
    }
  };

  // Llama a guardarVisita sin await para no bloquear el renderizado
  guardarVisita({ query });

  let initialResults = [];
  let error = null;
  let tiempo_busqueda = 0;
  let inputCorregido = [];  // Variable para guardar input_corregido

  // Si hay query, hacemos la petición
  if (query) {
    try {
      const response = await fetch(
        `https://api.cumbre.icu/buscar/${query}`
        // `${process.env.SEARCH_API_URL}/buscar/${query}`
        // Nota: No se desactiva el caché aquí
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
                Cerca de {initialResults.length} resultados en {tiempo_busqueda.toFixed(8)} segundos
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
        <Buscador query={query} />
      </div>
    </>
  );
}
