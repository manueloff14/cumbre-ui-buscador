"use client"

import { useState } from "react";

export default function Buscador({ query }) {
    // Usamos el estado local para manejar el valor del input
    const [inputValue, setInputValue] = useState(query);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  // Actualizamos el valor del input cuando el usuario escribe
    };

    return (
        <div
            className="fixed bottom-0 left-0 w-full flex flex-col items-center shadow-lg justify-center pb-3 pt-6 px-6 lg:px-0"
            style={{
                background: 'linear-gradient(to bottom, transparent 5%, black 95%)',
            }}
        >
            <div className="flex items-center gap-3 my-3 text-sm">
                <button className="p-2 px-4 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full font-bold border-2 border-gray-950 hover:border-white transition-all duration-200">
                    Resultados
                </button>
                <button className="p-2 px-4 bg-gray-800 rounded-full hover:bg-red-950 transition-all duration-200 cursor-not-allowed">
                    Chat AI 🔒
                </button>
            </div>
            <form
                action="/buscar"
                className="w-full lg:w-[50%] flex items-center bg-gray-900 rounded-full border-[2px] border-gray-400 hover:border-gray-600 transition-all duration-200"
            >
                <input
                    name="query"
                    type="text"
                    value={inputValue}  // Valor controlado por el estado
                    onChange={handleInputChange}  // Manejador de cambios para permitir edición
                    placeholder="Buscar empleo por título, empresa o ubicación…"
                    className="w-full pl-6 pr-2 py-4 bg-transparent text-white border-none focus:outline-none"
                />
                <button
                    className="flex items-center justify-center p-3 m-1 mr-2 rounded-full hover:bg-gray-700 transition-all duration-200"
                    type="submit"  
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" fill="white"></path>
                    </svg>
                </button>
            </form>
        </div>
    );
}
