"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Para manejar redirección

export function AutocompleteDesktop({
    suggestions = [], // Aseguramos que siempre sea un array
    handleSelectSuggestion,
    handleApplySuggestion,
    inputValue = "", // Aseguramos que tenga un valor por defecto
    isDarkMode,
    home
}) {
    const router = useRouter(); // Hook para redirecciones

    if (!suggestions.length) return null;

    return (
        <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className={`
                no-scrollbar
                absolute w-full 
                ${home ? 'top-[70px]' : 'bottom-[70px]'}
                p-3 rounded-3xl 
                border-2 dark:border-gray-500 border-gray-400
                dark:bg-gray-950/90 bg-gray-100/90
                backdrop-blur-sm
                ${home ? 'h-44' : 'h-80'}
                overflow-y-auto 
                z-50
                shadow-lg
                dark:shadow-gray-800 shadow-gray-300
            `}
        >
            <ul className="w-full space-y-1">
                {suggestions.map((suggestion, index) => {
                    const description = suggestion?.description || ""; // Default a string
                    const normalizedInput = inputValue?.toLowerCase() || ""; // Default a string

                    // Divide el texto en dos partes: coincidente y resto
                    const matchIndex = description.toLowerCase().indexOf(normalizedInput);
                    const matchText =
                        matchIndex >= 0
                            ? description.substring(0, matchIndex + normalizedInput.length)
                            : "";
                    const restText =
                        matchIndex >= 0
                            ? description.substring(matchIndex + normalizedInput.length)
                            : description;

                    return (
                        <li>
                            <a href={`https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(description)}`}
                                key={index}
                                className="
              px-3 py-2 flex items-center justify-between 
              hover:bg-gray-200 hover:text-black
              dark:hover:bg-gray-800 dark:hover:text-white
              cursor-pointer transition-colors
              rounded-xl
            "
                            >
                                {/* Resaltar la coincidencia en negrita */}
                                <span>
                                    <span className="text-gray-400 dark:text-gray-500">{matchText}</span>
                                    <span>{restText}</span>
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleApplySuggestion(suggestion);
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                        <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z" fill={isDarkMode ? "white" : "black"}></path>
                                    </svg>
                                </button>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
