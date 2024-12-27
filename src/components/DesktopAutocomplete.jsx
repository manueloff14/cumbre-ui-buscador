"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Para manejar redirección

export function AutocompleteDesktop({
    suggestions = [], // Aseguramos que siempre sea un array
    handleSelectSuggestion,
    handleApplySuggestion,
    inputValue = "", // Aseguramos que tenga un valor por defecto
}) {
    const router = useRouter(); // Hook para redirecciones

    if (!suggestions.length) return null;

    return (
        <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="
        no-scrollbar
        absolute bottom-[70px] w-full 
        p-3 rounded-3xl 
        border-2 border-gray-500
        bg-gray-950/90 
        backdrop-blur-sm
        h-80
        overflow-y-auto 
        z-50
        shadow-lg
        shadow-gray-800
      "
        >
            <ul className="w-full text-white space-y-1">
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
                        <li
                            key={index}
                            className="
              px-3 py-2 flex items-center justify-between 
              hover:bg-gray-200 hover:text-black
              dark:hover:bg-gray-800 dark:hover:text-white
              cursor-pointer transition-colors
              rounded-xl
            "
                            onClick={() => {
                                router.push(`https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(description)}`);
                            }}
                        >
                            {/* Resaltar la coincidencia en negrita */}
                            <span>
                                <span className="text-gray-500">{matchText}</span>
                                <span>{restText}</span>
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleApplySuggestion(suggestion);
                                }}
                                className="p-1 rounded-full hover:bg-gray-700"
                            >
                                <svg className="rotate-90" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                    <path d="M15.978516 5.9804688a2.0002 2.0002 0 00-1.392578 3.4335937L29.171875 24 14.585938 38.585938a2.0002 2.0002 0 102.828124 2.828124L33.414062 25.414062a2.0002 2.0002 0 000-2.828124L17.414062 6.5859375a2.0002 2.0002 0 00-1.435546-.6054687z" fill="white" />
                                </svg>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
