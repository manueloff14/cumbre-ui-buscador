"use client";

import { useState, useEffect } from "react";
import ChatIcon from "./ChatIcon";
import SearchIcon from "./SearchIcon";
import Link from "next/link";

export default function Buscador({ query, iconChat, chatActive, onNewMessage, sessionId, onLoading }) {
    const [inputValue, setInputValue] = useState(query);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setInputValue(query); // Actualiza el valor de inputValue si cambia el query de la URL
    }, [query]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputValue.trim() === "") return;

        // Mostrar el mensaje del usuario y limpiar el input
        onNewMessage({ sender: "user", message: inputValue });
        setInputValue(""); // Limpia el input inmediatamente

        console.log("Chat Active:", chatActive); // Para depuración

        if (chatActive) {
            onLoading(true); // Activa el estado de carga en Chat

            try {
                const response = await fetch("https://data.cumbre.icu/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: inputValue, sessionId }),
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }

                const data = await response.json();
                onNewMessage({ sender: "bot", message: data.respuesta }); // Mensaje de la API
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
            } finally {
                onLoading(false); // Desactiva el estado de carga en Chat
            }
        } else {
            // Redireccionar utilizando window.location.assign
            window.location.assign(`https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.assign(`https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center shadow-lg justify-center pb-3 pt-6 px-6 lg:px-0 bg-[linear-gradient(to_bottom,transparent_5%,white_95%)] dark:bg-[linear-gradient(to_bottom,transparent_5%,black_95%)]">
            <div className="flex items-center gap-3 my-3 text-sm">
                <Link href={`/buscar?query=${inputValue}`}>
                    <button className={`${!chatActive ? "bg-gradient-to-r from-blue-500 to-pink-500" : "bg-gray-700"} text-white p-2 px-4 rounded-full font-bold border-2 border-white dark:border-gray-950 hover:border-gray-600 dark:hover:border-white transition-all duration-200`}>
                        Resultados
                    </button>
                </Link>

                <Link href={`/chat?query=${inputValue}`}>
                    <button className={`${chatActive ? "bg-gradient-to-r from-blue-500 to-pink-500" : "bg-gray-700"} text-white p-2 px-4 rounded-full font-bold border-2 border-white dark:border-gray-950 hover:border-gray-600 dark:hover:border-white transition-all duration-200`}>
                        Chat AI
                    </button>
                </Link>
            </div>

            <form onSubmit={chatActive ? handleSubmit : handleSearch} className="w-full lg:w-[50%] flex items-center bg-gray-200 dark:bg-gray-900 rounded-full border-[2px] border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200">
                <input
                    name="query"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={chatActive ? "Escribe una pregunta" : "Buscar empleo en Cumbre"}
                    className="w-full pl-6 pr-2 py-4 bg-transparent text-black dark:text-white border-none focus:outline-none"
                />
                <button className="flex items-center justify-center p-3 m-1 mr-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-200" type="submit">
                    {iconChat ? <ChatIcon isDarkMode={isDarkMode} /> : <SearchIcon isDarkMode={isDarkMode} />}
                </button>
            </form>
        </div>
    );
}
