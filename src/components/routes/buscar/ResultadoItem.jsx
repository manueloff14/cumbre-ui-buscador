"use client"

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ResultadoItem({
    resultado,
    url_base,
    query,
    isDarkMode,
    obtenerNombreEmpresa,
    optenerIconoEmpresa
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const menuRef = useRef();

    // Cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleReport = (e) => {
        e.preventDefault();
        alert(`Has reportado el resultado: ${resultado.titulo}`);
        setIsMenuOpen(false);
    };

    const handleInfo = (e) => {
        e.preventDefault();
        setIsInfoOpen(true);
        setIsMenuOpen(false);
    };

    const handleComment = (e) => {
        e.preventDefault();
        setIsCommentOpen(true);
        setIsMenuOpen(false);
    };

    const closeInfo = () => setIsInfoOpen(false);
    const closeComment = () => setIsCommentOpen(false);

    const menu = [
        {
            name: "Denunciar",
            function: handleReport
        },
        {
            name: "Más información sobre la fuente",
            function: handleInfo
        },
        {
            name: "Enviar comentarios",
            function: handleComment
        }
    ]

    return (
        <>
            <Link href={`https://${url_base}/${resultado.id}?query=${encodeURIComponent(query)}`}>
                <li className="p-4 border-[1px] border-gray-300 dark:border-gray-800 rounded-3xl mb-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
                    <div className='flex items-start justify-between'>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-1 flex bg-gray-200 dark:bg-white rounded-full">
                                <img
                                    src={optenerIconoEmpresa(resultado.fuente)}
                                    alt={obtenerNombreEmpresa(resultado.fuente)}
                                    className="w-[20px] h-[20px] m-1 object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <span className="text-sm font-medium">{obtenerNombreEmpresa(resultado.fuente)}</span>
                                <span className="text-xs text-gray-500">{resultado.fuente}</span>
                            </div>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => { e.preventDefault(); toggleMenu(); }}
                                className="p-1 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-full z-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                    <path d="M24 34A4 4 0 1024 42 4 4 0 1024 34zM24 20A4 4 0 1024 28 4 4 0 1024 20zM24 6A4 4 0 1024 14 4 4 0 1024 6z" fill={isDarkMode ? "white" : "black"}></path>
                                </svg>
                            </button>
                            {isMenuOpen && (
                                <div className={`absolute p-2 right-0 top-0 w-60 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-3 cursor-auto`} onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>
                                    <div className="flex gap-3 items-start">
                                        <div>
                                            {
                                                menu.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            item.function(e);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                        <button
                                            className="p-2 rounded-full"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                                <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" fill={isDarkMode ? "white" : "black"}></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
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

            {/* Modal para Más Información sobre la Fuente */}
            {isInfoOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 backdrop-blur-sm">
                    <div className="shadow-gray-300 dark:shadow-gray-900 shadow-md bg-white dark:bg-gray-950 border border-gray-500 dark:border-gray-700 rounded-3xl p-6 w-11/12 max-w-md relative">
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className="text-xl font-semibold">Información sobre la fuente</h2>
                            <button onClick={closeInfo} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-700 text-sm dark:text-gray-300">
                            {obtenerDescripcionFuente(resultado.fuente)}
                        </p>
                    </div>
                </div>
            )}

            {/* Modal para Enviar Comentarios */}
            {isCommentOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 backdrop-blur-sm">
                    <div className="shadow-gray-300 dark:shadow-gray-900 shadow-md bg-white dark:bg-gray-950 border border-gray-500 dark:border-gray-700 rounded-3xl p-6 w-11/12 max-w-md relative">
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className="text-xl font-semibold">Enviar comentarios</h2>
                            <button onClick={closeComment} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleEnviarComentario(e); }}>
                            <textarea
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="Escribe tus comentarios aquí..."
                                required
                            ></textarea>
                            <button type="submit" className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 w-full">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

// Función para obtener la descripción de la fuente
function obtenerDescripcionFuente(fuente) {
    const descripciones = {
        'www.elempleo.com': 'Elempleo es una de las plataformas de empleo más grandes de América Latina, ofreciendo una amplia variedad de ofertas laborales en múltiples sectores.',
        'co.computrabajo.com': 'Computrabajo es una plataforma de búsqueda de empleo que conecta a profesionales con oportunidades laborales en diversas industrias.',
        'co.trabajosdiarios.com': 'Trabajos Diarios ofrece una variedad de empleos temporales y permanentes en diferentes áreas laborales.',
        'empleos.elpais.com.co': 'Clasificados El País es la sección de empleo del reconocido periódico El País, proporcionando ofertas laborales verificadas y confiables.',
        // Agrega más fuentes según tus necesidades
    };

    return descripciones[fuente] || 'No se dispone de información adicional sobre esta fuente.';
}

// Función para manejar el envío de comentarios
function handleEnviarComentario(e) {
    const comentario = e.target.querySelector('textarea').value;
    alert('Gracias por tus comentarios: ' + comentario);
    // Aquí puedes agregar lógica adicional, como enviar el comentario a un servidor
}
