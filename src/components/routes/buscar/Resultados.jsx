// Resultados.jsx
"use client"

import { useState, useEffect, useRef } from 'react';
import ResultadoItem from './ResultadoItem'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import AnuncioItemResultado from '@/components/AnuncioItemResultado';
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
      case 'co.computrabajo.com':
        return 'Computrabajo';
      case 'co.trabajosdiarios.com':
        return 'Trabajos Diarios';
      case 'empleos.elpais.com.co':
        return "Clasificados El País";
      case 'www.magneto365.com':
        return "Magneto Empleos"
      default:
        return 'Fuente desconocida';
    }
  };

  const optenerIconoEmpresa = (fuente) => {
    switch (fuente) {
      case 'www.elempleo.com':
        return "https://seeklogo.com/images/E/elempleo_com-logo-55C906ECA9-seeklogo.com.png";
      case 'co.computrabajo.com':
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFF3M9gOk6vZRAFrqt6dxJGhTS917I6_fdog&s";
      case 'co.trabajosdiarios.com':
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAP1BMVEUGR4Dx9fhag6lukbL///8APny9z94GR4AFR4AARH/f6PArW42huM2RrMXX4uyAoL1Ab5vI2OQVUoinv9Pl6/LwEGuFAAAACHRSTlOs////////1mqaPp0AAAC7SURBVCiRxdHdDoMgDAVgS6GjUv7U93/WVZ06pvNu2YmGiy+Qk7br/Nd0N6b6U+Q9J2R3oHPcIAfp91T03GC0b0mlQS8NmvamqQAwgx6ThL3Vgr4g5qQoiBjcMPB7Wy0ZSNG4gka/V+NtCLxinIT6UeLa+AMJMkGMlpaXT0gJqFpAd4GSY45IVq5uZoMGy2jjFQrmnPV10zw76JigEKxZ6+775DJWZExztuEfy9Zluflf0g7hMn/BG308Adg7F9ncwhKhAAAAAElFTkSuQmCC";
      case 'empleos.elpais.com.co':
        return "https://empleos.elpais.com.co/images/favicon.png";
      case 'www.magneto365.com':
        return "https://www.magneto365.com/co/favicon.ico"
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
            {paginatedResults.map((resultado, index) => (
              <>
                <ResultadoItem
                  key={`result-${resultado.id || index}`} // Usar un ID único si está disponible
                  resultado={resultado}
                  url_base={url_base}
                  query={query}
                  isDarkMode={isDarkMode}
                  obtenerNombreEmpresa={obtenerNombreEmpresa}
                  optenerIconoEmpresa={optenerIconoEmpresa}
                />
                {/* Insertar un anuncio después de cada 2 resultados */}
                {(index + 1) % 2 === 0 && index < paginatedResults.length - 1 && (
                  <li key={`ad-${index}`} className="my-4">
                    <AnuncioItemResultado />
                  </li>
                )}
              </>
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