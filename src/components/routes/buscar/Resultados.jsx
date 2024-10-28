"use client"

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function Resultados({ initialResults, error, query }) {
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Número de elementos a mostrar por página
  const observerRef = useRef(); // Referencia para el observador
  const url_base = "empleo.cumbre.icu"
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calcular los elementos actuales para mostrar
  const paginatedResults = initialResults.slice(0, currentPage * itemsPerPage);

  const obtenerNombreEmpresa = (fuente) => {
    switch (fuente) {
      case 'www.elempleo.com':
        return 'Elempleo';
      case 'www.computrabajo.com.ec':
        return 'Computrabajo';
      case 'co.trabajosdiarios.com':
        return 'Trabajos Diarios';
      default:
        return 'Fuente desconocida';
    }
  };

  const optenerIconoEmpresa = (fuente) => {
    switch (fuente) {
      case 'www.elempleo.com':
        return "https://seeklogo.com/images/E/elempleo_com-logo-55C906ECA9-seeklogo.com.png";
      case 'www.computrabajo.com.ec':
        return "https://seeklogo.com/images/C/computrabajo-logo-556E800004-seeklogo.com.png";
      case 'co.trabajosdiarios.com':
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAP1BMVEUGR4Dx9fhag6lukbL///8APny9z94GR4AFR4AARH/f6PArW42huM2RrMXX4uyAoL1Ab5vI2OQVUoinv9Pl6/LwEGuFAAAACHRSTlOs////////1mqaPp0AAAC7SURBVCiRxdHdDoMgDAVgS6GjUv7U93/WVZ06pvNu2YmGiy+Qk7br/Nd0N6b6U+Q9J2R3oHPcIAfp91T03GC0b0mlQS8NmvamqQAwgx6ThL3Vgr4g5qQoiBjcMPB7Wy0ZSNG4gka/V+NtCLxinIT6UeLa+AMJMkGMlpaXT0gJqFpAd4GSY45IVq5uZoMGy2jjFQrmnPV10zw76JigEKxZ6+775DJWZExztuEfy9Zluflf0g7hMn/BG308Adg7F9ncwhKhAAAAAElFTkSuQmCC";
      default:
        return null;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage * itemsPerPage < initialResults.length) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, { threshold: 1.0 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [currentPage, initialResults]);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      {initialResults.length > 0 ? (
        <>
          <ul>
            {paginatedResults.map((resultado) => (
              <Link href={`https://${url_base}/${resultado.id}?query=${encodeURIComponent(query)}`}>
                <li key={resultado.id} className="p-4 border-[1px] border-gray-300 dark:border-gray-800 rounded-3xl mb-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
                  <div className='flex items-start justify-between'>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1 flex bg-gray-200 dark:bg-white rounded-full">
                        <img
                          src={optenerIconoEmpresa(resultado.fuente)}
                          alt="Placeholder"
                          className="w-[20px] h-[20px] m-1 object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <span className="text-sm font-medium">{obtenerNombreEmpresa(resultado.fuente)}</span>
                        <span className="text-xs text-gray-500">{resultado.fuente}</span>
                      </div>
                    </div>
                    <div>
                      <button className="p-1 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                          <path d="M24 34A4 4 0 1024 42 4 4 0 1024 34zM24 20A4 4 0 1024 28 4 4 0 1024 20zM24 6A4 4 0 1024 14 4 4 0 1024 6z" fill={isDarkMode ? "white" : "black"}></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{resultado.titulo}</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <ReactMarkdown>{resultado.miniDescription}</ReactMarkdown>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
          {/* Div invisible que será observado */}
          {currentPage * itemsPerPage < initialResults.length && (
            <div ref={observerRef} className="h-4"></div>
          )}
        </>
      ) : (
        <p>{error || 'No hay resultados disponibles.'}</p>
      )}
    </>
  );
}
