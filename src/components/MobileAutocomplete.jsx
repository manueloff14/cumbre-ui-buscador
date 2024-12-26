import { useState } from "react";

export function AutocompleteMobile({
    suggestions,
    handleSelectSuggestion,
    handleApplySuggestion,
    handleInputChange,
    initialQuery = "",
}) {
    const [inputValue, setInputValue] = useState(initialQuery);

    const handleInputChangeInternal = (e) => {
        const value = e.target.value;
        setInputValue(value);
        handleInputChange(e); // Llama a la función pasada desde `Buscador`
    };

    return (
        <div
            className="fixed inset-0 top-[70px] bg-[#0a0a0a] z-[9999] flex flex-col"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {/* Input de búsqueda */}
            <div className="sticky top-0 px-4 pb-2 shadow-lg z-[10000]">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChangeInternal}
                    autoFocus
                    placeholder="Buscar..."
                    className="w-full px-4 p-3 rounded-full bg-gray-800 text-white focus:outline-none border-2 border-gray-600 focus:border-gray-400"
                />
            </div>

            {/* Lista de sugerencias */}
            <div className="flex-grow overflow-y-auto p-3">
                <ul className="space-y-3">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="p-3 rounded-2xl bg-gray-800 hover:bg-gray-700 cursor-pointer transition"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                <span>{suggestion.description}</span>
                            </li>
                        ))
                    ) : (
                        // Espacio vacío con un mínimo tamaño para cuando no hay sugerencias
                        <li className="p-3 rounded-2xl bg-gray-800 text-gray-400 text-center">
                            Sin sugerencias de búsqueda
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
