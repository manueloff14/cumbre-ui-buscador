import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutocompleteMobile({
    suggestions = [],
    handleSelectSuggestion,
    handleApplySuggestion,
    handleInputChange,
    initialQuery = "",
    onClose,
    isMobile,
}) {
    const [inputValue, setInputValue] = useState(initialQuery);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleInputChangeInternal = (e) => {
        const value = e.target.value;
        setInputValue(value);
        handleInputChange(e);
    };

    const handleApplySuggestionInternal = (suggestion) => {
        setInputValue(suggestion.description);
        handleApplySuggestion(suggestion);
    };

    const clearInput = () => {
        setInputValue("");
        handleInputChange({ target: { value: "" } });
    };

    return (
        <div className={`fixed inset-0 top-[60px] bg-[#0a0a0a] z-[9999] flex flex-col pt-4`}>
            {/* Input de búsqueda */}
            <div className="sticky top-0 px-4 pb-2 shadow-lg z-[10000] flex items-center">
                <div className="flex items-center px-3 border-2 border-gray-600 w-full rounded-full bg-gray-800">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChangeInternal}
                        autoFocus
                        placeholder="Buscar..."
                        className="flex-grow pl-3 py-3 bg-transparent text-white focus:outline-none w-full"
                    />
                    {inputValue && (
                        <>
                            <button
                                onClick={clearInput}
                                className="p-2 rounded-full text-white"
                                aria-label="Limpiar input"
                            >
                                ✕
                            </button>
                            <span className="text-gray-300 ml-2">|</span>
                        </>
                    )}
                    <button
                        onClick={() => {
                            if (inputValue.trim() !== "") {
                                window.location.href = `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`;
                            }
                        }}
                        className="p-2 rounded-full text-white"
                        aria-label="Buscar"
                    >
                        🔍
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="ml-2 p-2 rounded-full text-white"
                    aria-label="Cerrar panel"
                >
                    ✕
                </button>
            </div>

            {/* Lista de sugerencias */}
            <div className="flex-grow overflow-y-auto p-3 no-scrollbar">
                <ul className="space-y-3">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => {
                            const description = suggestion?.description || "";

                            const normalizedInput = inputValue.toLowerCase();
                            const matchIndex = description.toLowerCase().indexOf(normalizedInput);

                            let matchText = "";
                            let restText = description;

                            if (matchIndex >= 0) {
                                matchText = description.substring(0, matchIndex + inputValue.length);
                                restText = description.substring(matchIndex + inputValue.length);
                            }

                            return (
                                <div key={index} className="relative">
                                    <a
                                        href={`https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(description)}`}
                                        className="block p-3 rounded-2xl bg-transparent hover:bg-gray-900 transition flex items-center justify-between"
                                    >
                                        <span>
                                            <span className="text-gray-500">{matchText}</span>
                                            <span className="text-white">{restText}</span>
                                        </span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleApplySuggestionInternal(suggestion);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700"
                                        aria-label="Aplicar sugerencia"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 48 48"
                                            transform="rotate(-90)"
                                        >
                                            <path
                                                d="M15.978516 5.9804688a2.0002 2.0002 0 00-1.392578 3.4335937L29.171875 24 14.585938 38.585938a2.0002 2.0002 0 102.828124 2.828124L33.414062 25.414062a2.0002 2.0002 0 000-2.828124L17.414062 6.5859375a2.0002 2.0002 0 00-1.435546-.6054687z"
                                                fill="white"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <li className="p-3 rounded-2xl bg-gray-800 text-gray-400 text-center">
                            Sin sugerencias de búsqueda
                        </li>
                    )}
                </ul>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
