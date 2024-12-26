"use client";

import { useState, useEffect, useRef } from "react";
import ChatIcon from "./ChatIcon";
import SearchIcon from "./SearchIcon";
import Link from "next/link";
import { AutocompleteDesktop } from "@/components/DesktopAutocomplete";
import { AutocompleteMobile } from "@/components/MobileAutocomplete";

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
    const [suggestions, setSuggestions] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const inputRef = useRef(null);
    const debounceTimer = useRef(null);

    // Cuando se actualiza la prop 'query'
    useEffect(() => {
        setInputValue(query);
    }, [query]);

    // Detecta si el usuario prefiere modo oscuro
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener("change", handleChange);
        return () => {
            darkModeMediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    // Detecta si la pantalla es móvil (max-width: 768px)
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

    // Cierra el autocomplete al hacer clic fuera
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

    // Maneja el cambio de texto en el input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowAutocomplete(true);

        // Limpiar el timer existente
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Solo hacer fetch si hay texto
        if (value.trim() !== "") {
            // Esperar 300ms antes de la llamada
            debounceTimer.current = setTimeout(() => {
                fetchGoogleXMLAutocomplete(value);
            }, 300);
        } else {
            setSuggestions([]);
        }
    };

    // Cuando el input obtiene foco
    const handleInputFocus = () => {
        setShowAutocomplete(true);
        if (inputValue.trim() !== "") {
            fetchGoogleXMLAutocomplete(inputValue);
        }
    };

    // Llamada a la API de Autocomplete (formato XML)
    const fetchGoogleXMLAutocomplete = async (input) => {
        try {
            const url = `/api/autocomplete?input=${encodeURIComponent(input)}`;
            const response = await fetch(url, {
                headers: {
                    Accept: "application/xml, text/xml, */*; q=0.01",
                    "Content-Type": "application/xml; charset=UTF-8",
                },
            });
            if (!response.ok) {
                throw new Error("Error al llamar a /api/autocomplete");
            }

            const arrayBuffer = await response.arrayBuffer();
            const decoder = new TextDecoder("utf-8");
            const xmlText = decoder.decode(arrayBuffer);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

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

    // Seleccionar una sugerencia del autocomplete
    const handleSelectSuggestion = (suggestion) => {
        setInputValue(suggestion.description);
    };

    // Aplicar una sugerencia pero seguir mostrando results
    const handleApplySuggestion = (suggestion) => {
        setInputValue(suggestion.description);
        fetchGoogleXMLAutocomplete(suggestion.description);
    };

    // Acción de búsqueda normal
    const handleSearch = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;
        window.location.assign(
            `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`
        );
    };

    return (
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
            {/* Botones de navegación */}
            <div className="flex items-center gap-3 my-3 text-sm">
                <Link href={`/buscar?query=${inputValue}`}>
                    <button
                        className={`
              ${!chatActive
                                ? "bg-gradient-to-r from-blue-500 to-pink-500"
                                : "bg-gray-700"}
              text-white p-2 px-4 rounded-full font-bold 
              border-2 border-white dark:border-gray-950 
              hover:border-gray-600 dark:hover:border-white 
              transition-all duration-200
            `}
                    >
                        Resultados
                    </button>
                </Link>
                <Link href={`/chat?query=${inputValue}`}>
                    <button
                        className={`
              ${chatActive
                                ? "bg-gradient-to-r from-blue-500 to-pink-500"
                                : "bg-gray-700"}
              text-white p-2 px-4 rounded-full font-bold 
              border-2 border-white dark:border-gray-950 
              hover:border-gray-600 dark:hover:border-white 
              transition-all duration-200
            `}
                    >
                        Chat AI
                    </button>
                </Link>
            </div>

            {/* Formulario de búsqueda */}
            <form
                onSubmit={handleSearch}
                className="
          relative w-full lg:w-[50%] 
          flex items-center 
          bg-gray-200 dark:bg-gray-900 
          rounded-full 
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
                    placeholder={chatActive ? "Escribe una pregunta" : "Buscar empleo en Cumbre"}
                    className="
            w-full pl-6 pr-2 py-4 
            bg-transparent 
            text-black dark:text-white 
            border-none focus:outline-none
          "
                />

                <button
                    className="
            flex items-center justify-center 
            p-3 m-1 mr-2 rounded-full 
            hover:bg-gray-400 dark:hover:bg-gray-700 
            transition-all duration-200
          "
                    type="submit"
                >
                    {iconChat
                        ? <ChatIcon isDarkMode={isDarkMode} />
                        : <SearchIcon isDarkMode={isDarkMode} />
                    }
                </button>

                {/* Autocomplete */}
                {showAutocomplete && (
                    <>
                        {isMobile ? (
                            <AutocompleteMobile
                                suggestions={suggestions}
                                handleSelectSuggestion={handleSelectSuggestion}
                                handleApplySuggestion={handleApplySuggestion}
                                handleInputChange={handleInputChange}
                                initialQuery={inputValue}
                            />
                        ) : (
                            <AutocompleteDesktop
                                suggestions={suggestions}
                                handleSelectSuggestion={handleSelectSuggestion}
                                handleApplySuggestion={handleApplySuggestion}
                            />
                        )}
                    </>
                )}
            </form>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
