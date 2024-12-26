"use client";

import { useState, useEffect, useRef } from "react";
import ChatIcon from "./ChatIcon";
import SearchIcon from "./SearchIcon";
import Link from "next/link";

export default function Buscador({
    query = "",
    iconChat,
    chatActive,
    onNewMessage,
    sessionId,
    onLoading,
}) {
    const [inputValue, setInputValue] = useState(query);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Para autocompletar
    const [suggestions, setSuggestions] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    // Ref para detectar clic fuera
    const inputRef = useRef(null);

    // 1. Actualiza el input si cambia 'query'
    useEffect(() => {
        setInputValue(query);
    }, [query]);

    // 2. Detectar modo oscuro
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener("change", handleChange);
        return () => {
            darkModeMediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    // 3. Detectar si es móvil (max-width: 768px)
    useEffect(() => {
        const mobileQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mobileQuery.matches);

        const handleResize = (e) => {
            setIsMobile(e.matches);
        };
        mobileQuery.addEventListener("change", handleResize);
        return () => {
            mobileQuery.removeEventListener("change", handleResize);
        };
    }, []);

    // 4. Cerrar el autocomplete al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowAutocomplete(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputRef]);

    // 5. Manejo de input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim() !== "") {
            fetchGoogleXMLAutocomplete(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleInputFocus = () => {
        setShowAutocomplete(true);
        if (inputValue.trim() !== "") {
            fetchGoogleXMLAutocomplete(inputValue);
        }
    };

    // 6. Llamar a nuestro endpoint local en lugar de Google, forzando UTF-8
    // 1) En vez de response.text(), usa arrayBuffer() + TextDecoder.
    const fetchGoogleXMLAutocomplete = async (input) => {
        try {
            const url = `/api/autocomplete?input=${encodeURIComponent(input)}`;

            const response = await fetch(url, {
                headers: {
                    // Pedimos XML en UTF-8
                    Accept: "application/xml, text/xml, */*; q=0.01",
                    "Content-Type": "application/xml; charset=UTF-8",
                },
            });

            if (!response.ok) {
                throw new Error("Error al llamar a /api/autocomplete");
            }

            // 2) Obtenemos el arrayBuffer
            const arrayBuffer = await response.arrayBuffer();

            // 3) Decodificamos manualmente como UTF-8
            const decoder = new TextDecoder("utf-8");
            const xmlText = decoder.decode(arrayBuffer);

            // 4) Parseamos con DOMParser
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            // 5) Extraemos las sugerencias
            const suggestionNodes = xmlDoc.getElementsByTagName("suggestion");
            const formattedSuggestions = [];

            for (let i = 0; i < suggestionNodes.length; i++) {
                const dataAttr = suggestionNodes[i].getAttribute("data");
                if (dataAttr) {
                    formattedSuggestions.push({ description: dataAttr });
                }
            }

            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error("Error parseando XML desde /api/autocomplete:", error);
            setSuggestions([]);
        }
    };


    // 7. Seleccionar sugerencia y cerrar
    const handleSelectSuggestion = (suggestion) => {
        setInputValue(suggestion.description);
        setShowAutocomplete(false);
    };

    // 7.1. Aplicar sugerencia (solo actualizar input y recargar sugerencias)
    const handleApplySuggestion = (suggestion) => {
        // Rellena el input y vuelve a solicitar sugerencias sin hacer búsqueda final
        setInputValue(suggestion.description);
        fetchGoogleXMLAutocomplete(suggestion.description);
    };

    // 8. Submit formulario (modo chat)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;

        onNewMessage?.({ sender: "user", message: inputValue });
        setInputValue("");

        if (chatActive) {
            onLoading?.(true);
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
                onNewMessage?.({ sender: "bot", message: data.respuesta });
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
            } finally {
                onLoading?.(false);
            }
        } else {
            window.location.assign(
                `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(
                    inputValue
                )}`
            );
        }
    };

    // 9. Submit formulario (modo búsqueda)
    const handleSearch = (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;
        window.location.assign(
            `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(
                inputValue
            )}`
        );
    };

    return (
        <div
            className="
        fixed bottom-0 left-0 w-full flex flex-col items-center 
        shadow-lg justify-center pb-3 pt-6 px-6 lg:px-0 
        bg-[linear-gradient(to_bottom,transparent_5%,white_95%)] 
        dark:bg-[linear-gradient(to_bottom,transparent_5%,black_95%)]
      "
        >
            {/* Botones para cambiar entre Resultados y Chat */}
            <div className="flex items-center gap-3 my-3 text-sm">
                <Link href={`/buscar?query=${inputValue}`}>
                    <button
                        className={`${!chatActive
                            ? "bg-gradient-to-r from-blue-500 to-pink-500"
                            : "bg-gray-700"
                            } text-white p-2 px-4 rounded-full font-bold border-2 
               border-white dark:border-gray-950 hover:border-gray-600 
               dark:hover:border-white transition-all duration-200`}
                    >
                        Resultados
                    </button>
                </Link>

                <Link href={`/chat?query=${inputValue}`}>
                    <button
                        className={`${chatActive
                            ? "bg-gradient-to-r from-blue-500 to-pink-500"
                            : "bg-gray-700"
                            } text-white p-2 px-4 rounded-full font-bold border-2 
               border-white dark:border-gray-950 hover:border-gray-600 
               dark:hover:border-white transition-all duration-200`}
                    >
                        Chat AI
                    </button>
                </Link>
            </div>

            {/* Formulario principal */}
            <form
                onSubmit={chatActive ? handleSubmit : handleSearch}
                className="
          relative w-full lg:w-[50%] flex items-center 
          bg-gray-200 dark:bg-gray-900 rounded-full 
          border-[2px] border-gray-300 dark:border-gray-800 
          hover:border-gray-400 dark:hover:border-gray-600 
          transition-all duration-200
        "
                ref={inputRef}
            >
                <input
                    name="query"
                    type="text"
                    autoComplete="off"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder={
                        chatActive ? "Escribe una pregunta" : "Buscar empleo en Cumbre"
                    }
                    className="
            w-full pl-6 pr-2 py-4 bg-transparent 
            text-black dark:text-white 
            border-none focus:outline-none
          "
                />

                <button
                    className="
            flex items-center justify-center p-3 m-1 mr-2 
            rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 
            transition-all duration-200
          "
                    type="submit"
                >
                    {iconChat ? (
                        <ChatIcon isDarkMode={isDarkMode} />
                    ) : (
                        <SearchIcon isDarkMode={isDarkMode} />
                    )}
                </button>

                {/* Mostrar Autocomplete si showAutocomplete y hay sugerencias */}
                {showAutocomplete && suggestions.length > 0 && (
                    <>
                        {console.log(
                            "Mostrando",
                            isMobile ? "AUTOCOMPLETE (MÓVIL)" : "AUTOCOMPLETE (PC)",
                            "con",
                            suggestions.length,
                            "sugerencias"
                        )}

                        {/* Versión MÓVIL */}
                        {isMobile && (
                            <div
                                style={{
                                    scrollbarWidth: "none",      // Firefox
                                    msOverflowStyle: "none",     // IE/Edge
                                }}
                                className="
                  no-scrollbar    /* Oculta scrollbar en navegadores basados en WebKit */
                  absolute bottom-20 w-full 
                  p-3 rounded-3xl 
                  border-2 border-white
                  bg-gray-950/80 
                  backdrop-blur-xl
                  h-40 
                  overflow-y-auto 
                  z-50
                "
                            >
                                <ul className="w-full text-white space-y-1">
                                    {suggestions.map((sugg, index) => (
                                        <li
                                            key={index}
                                            className="
                        px-3 py-2 flex items-center justify-between 
                        hover:bg-gray-200 hover:text-black
                        dark:hover:bg-gray-800 dark:hover:text-white
                        cursor-pointer transition-colors
                        rounded-xl
                      "
                                        >
                                            {/* Clic en texto => Selecciona y cierra */}
                                            <span onClick={() => handleSelectSuggestion(sugg)}>
                                                {sugg.description}
                                            </span>

                                            {/* Botón para "Aplicar" la sugerencia en el input */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault(); // Evita submit accidental
                                                    e.stopPropagation(); // Evita que se dispare onClick del <li>
                                                    handleApplySuggestion(sugg);
                                                }}
                                                className="p-1 rounded-full"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                    <path d="M 15.978516 5.9804688 A 2.0002 2.0002 0 0 0 14.585938 9.4140625 L 29.171875 24 L 14.585938 38.585938 A 2.0002 2.0002 0 1 0 17.414062 41.414062 L 33.414062 25.414062 A 2.0002 2.0002 0 0 0 33.414062 22.585938 L 17.414062 6.5859375 A 2.0002 2.0002 0 0 0 15.978516 5.9804688 z" fill="white"></path>
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Versión DESKTOP */}
                        {!isMobile && (
                            <div
                                style={{
                                    scrollbarWidth: "none",      // Firefox
                                    msOverflowStyle: "none",     // IE/Edge
                                }}
                                className="
                  no-scrollbar
                  absolute bottom-[70px] w-full 
                  p-3 rounded-3xl 
                  border-2 border-white
                  bg-gray-950/80 
                  backdrop-blur-xl
                  h-80
                  overflow-y-auto 
                  z-50
                "
                            >
                                <ul className="w-full text-white space-y-1">
                                    {suggestions.map((sugg, index) => (
                                        <li
                                            key={index}
                                            className="
                        px-3 py-2 flex items-center justify-between 
                        hover:bg-gray-200 hover:text-black
                        dark:hover:bg-gray-800 dark:hover:text-white
                        cursor-pointer transition-colors
                        rounded-xl
                      "
                                        >
                                            <span onClick={() => handleSelectSuggestion(sugg)}>
                                                {sugg.description}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleApplySuggestion(sugg);
                                                }}
                                                className="
                          ml-2 bg-blue-500 hover:bg-blue-600 
                          text-white px-2 py-1 rounded 
                          transition-colors
                        "
                                            >
                                                Aplicar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </form>

            {/*
        Clases para ocultar scrollbar en navegadores basados en WebKit 
        y hacerlo limpio en todos.
      */}
            <style jsx>{`
        /* Para Chrome, Safari y Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
