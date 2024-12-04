"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tippy from '@tippyjs/react'; // Importar Tippy
import 'tippy.js/dist/tippy.css'; // Estilos por defecto de Tippy

export default function BarraLateral({ query }) {
    const [mensaje, setMensaje] = useState('');
    const [mensajeVisible, setMensajeVisible] = useState('');
    const [loading, setLoading] = useState(true);
    const [indiceLetra, setIndiceLetra] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false); // Nuevo estado para el modal

    useEffect(() => {
        const obtenerMensajeMotivacional = async () => {
            try {
                const response = await axios.get(`https://buscadorcumbre.pythonanywhere.com/api/mensaje_motivacional/${query}`);
                const mensajeCompleto = response.data.mensaje;

                if (mensajeCompleto) {
                    setMensaje(mensajeCompleto);
                    setLoading(false);
                    setIndiceLetra(0); // Reiniciar el índice de la animación
                } else {
                    setMensaje('El mensaje no está disponible en este momento.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al obtener el mensaje motivacional:', error);
                setMensaje('No pudimos obtener un mensaje en este momento.');
                setLoading(false);
            }
        };

        if (query) {
            obtenerMensajeMotivacional();
        }
    }, [query]);

    useEffect(() => {
        if (!loading && mensaje && indiceLetra < mensaje.length) {
            const intervalo = setTimeout(() => {
                setMensajeVisible(mensaje.slice(0, indiceLetra + 1)); // Mostrar una letra más
                setIndiceLetra(indiceLetra + 1); // Aumentar el índice
            }, 10); // Retardo de 10 milisegundos por letra

            return () => clearTimeout(intervalo); // Limpiar el intervalo al desmontar
        }
    }, [mensaje, indiceLetra, loading]);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    return (
        <>
            <div className="w-full min-w-full p-4 rounded-3xl border-[1px] border-gray-300 dark:border-gray-800 relative">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-600 dark:text-gray-400 text-xs">Cumbre dice:</span>

                    {/* Botón con tooltip */}
                    <Tippy content={<span className="font-sans font-bold">¿Por qué veo esto?</span>} arrow={true} theme={isDarkMode ? "dark" : "light"}>
                        <button onClick={handleButtonClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                <path d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 33.406609 33.406615 41 24 41 C 14.593385 41 7 33.406609 7 24 C 7 14.593391 14.593385 7 24 7 z M 24 14 A 2 2 0 0 0 24 18 A 2 2 0 0 0 24 14 z M 23.976562 20.978516 A 1.50015 1.50015 0 0 0 22.5 22.5 L 22.5 33.5 A 1.50015 1.50015 0 1 0 25.5 33.5 L 25.5 22.5 A 1.50015 1.50015 0 0 0 23.976562 20.978516 z" fill={isDarkMode ? "white" : "black"}></path>
                            </svg>
                        </button>
                    </Tippy>
                </div>

                <div id="cumbre-dice" className="min-h-[60px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[60px]">
                            <img
                                className="w-[20px]"
                                src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                                alt="Cargando..."
                            />
                        </div>
                    ) : (
                        <p>{mensajeVisible}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t-[1px] border-gray-300 dark:border-gray-800 text-xs text-gray-400">
                    <span className="font-semibold text-gray-600 dark:text-gray-400 text-xs">¿Es relevante esta respuesta?</span>
                    <div className="flex items-center gap-[1px]">
                        <button className="p-2 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-900 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48">
                                <path d="M 15 7 C 8.9424416 7 4 11.942442 4 18 C 4 22.096154 7.0876448 25.952899 10.851562 29.908203 C 14.615481 33.863507 19.248379 37.869472 22.939453 41.560547 A 1.50015 1.50015 0 0 0 25.060547 41.560547 C 28.751621 37.869472 33.384518 33.863507 37.148438 29.908203 C 40.912356 25.952899 44 22.096154 44 18 C 44 11.942442 39.057558 7 33 7 C 29.523564 7 26.496821 8.8664883 24 12.037109 C 21.503179 8.8664883 18.476436 7 15 7 z M 15 10 C 17.928571 10 20.3663 11.558399 22.732422 15.300781 A 1.50015 1.50015 0 0 0 25.267578 15.300781 C 27.6337 11.558399 30.071429 10 33 10 C 37.436442 10 41 13.563558 41 18 C 41 20.403846 38.587644 24.047101 34.976562 27.841797 C 31.68359 31.30221 27.590312 34.917453 24 38.417969 C 20.409688 34.917453 16.31641 31.30221 13.023438 27.841797 C 9.4123552 24.047101 7 20.403846 7 18 C 7 13.563558 10.563558 10 15 10 z" fill={isDarkMode ? "white" : "black"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 backdrop-blur-sm">
                    <div className="shadow-gray-300 dark:shadow-gray-900 shadow-md bg-white dark:bg-gray-950 border border-gray-500 dark:border-gray-700 rounded-3xl p-6 w-11/12 max-w-md relative">
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className="text-xl font-semibold">Te explicamos</h2>
                            <button onClick={() => setShowModal(false)} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className='text-sm'>Te presentamos esta frase con el objetivo de inspirarte a explorar nuevas oportunidades laborales. Nuestra filosofía se basa en fomentar un entorno en el que las personas se sientan cómodas y respaldadas al utilizar nuestra plataforma.</p>
                    </div>
                </div>
            )}
        </>
    );
}