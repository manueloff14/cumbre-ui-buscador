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
    botones,
    home
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

    // Manejo del estado del hash (#mobile) con popstate
    useEffect(() => {
        const currentUrl = window.location.href.split("#")[0]; // Base de la URL sin hash

        const handlePopState = () => {
            if (window.location.hash === "#mobile") {
                setShowAutocomplete(true);
            } else {
                setShowAutocomplete(false);
            }
        };

        // Escuchar cambios en el historial
        window.addEventListener("popstate", handlePopState);

        return () => {
            // Eliminar el listener al desmontar
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // Actualizar URL al mostrar/ocultar autocomplete móvil
    useEffect(() => {
        const currentUrl = window.location.href.split("#")[0]; // Base de la URL sin hash
        if (showAutocomplete && isMobile) {
            // Agregar `#mobile` al mostrar el autocomplete móvil
            window.history.pushState(null, "", `${currentUrl}#mobile`);
        } else if (!showAutocomplete && isMobile) {
            // Eliminar `#mobile` al ocultar el autocomplete móvil
            window.history.replaceState(null, "", currentUrl);
        }
    }, [showAutocomplete, isMobile]);

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

    // Acción de búsqueda normal
    const handleSearch = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;
        window.location.assign(
            `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`
        );
    };

    return (
        <>
            {/* Botones de navegación */}
            {botones && (
                <div className="flex items-center gap-3 my-3 text-sm">
                    <Link href={`/buscar?query=${encodeURIComponent(inputValue)}`}>
                        <button
                            className={`${!chatActive
                                ? "bg-gradient-to-r from-blue-500 to-pink-500"
                                : "bg-gray-700"
                                } text-white p-2 px-4 rounded-full font-bold 
                border-2 border-white dark:border-gray-950 
                hover:border-gray-600 dark:hover:border-white 
                transition-all duration-200`}
                        >
                            Resultados
                        </button>
                    </Link>
                    <Link href={`/chat?query=${encodeURIComponent(inputValue)}`}>
                        <button
                            className={`${chatActive
                                ? "bg-gradient-to-r from-blue-500 to-pink-500"
                                : "bg-gray-700"
                                } text-white p-2 px-4 rounded-full font-bold 
                border-2 border-white dark:border-gray-950 
                hover:border-gray-600 dark:hover:border-white 
                transition-all duration-200`}
                        >
                            Chat AI
                        </button>
                    </Link>
                </div>
            )}

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
                    {iconChat ? (
                        <ChatIcon isDarkMode={isDarkMode} />
                    ) : (
                        <SearchIcon isDarkMode={isDarkMode} />
                    )}
                </button>

                {/* Autocomplete */}
                {showAutocomplete && (
                    <>
                        {isMobile ? (
                            <AutocompleteMobile
                                suggestions={suggestions}
                                handleSelectSuggestion={(s) => setInputValue(s.description)}
                                handleApplySuggestion={(s) => setInputValue(s.description)}
                                handleInputChange={handleInputChange}
                                initialQuery={inputValue}
                                onClose={() => setShowAutocomplete(false)}
                                isMobile={isMobile}
                                isDarkMode={isDarkMode}
                                home={home}
                            />
                        ) : (
                            <AutocompleteDesktop
                                suggestions={suggestions}
                                inputValue={inputValue}
                                handleSelectSuggestion={(s) => setInputValue(s.description)}
                                handleApplySuggestion={(s) => setInputValue(s.description)}
                                isDarkMode={isDarkMode}
                                home={home}
                            />
                        )}
                    </>
                )}
            </form>
        </>
    );
}
