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
    const router = useRouter();

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

    const handleSearch = () => {
        if (inputValue.trim() !== "") {
            router.push(
                `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(inputValue)}`
            );
        }
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
                        className="flex-grow pl-3 pr-4 py-3 bg-transparent text-white focus:outline-none w-full"
                    />
                    {inputValue && (
                        <>
                            <button
                                onClick={clearInput}
                                className="p-2 rounded-full text-gray-200"
                                aria-label="Limpiar input"
                            >
                                ✕
                            </button>
                            <span className="text-gray-300 ml-1">|</span>
                        </>
                    )}
                    <button
                        onClick={handleSearch}
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
                                <li
                                    key={index}
                                    className="p-3 rounded-2xl bg-transparent hover:bg-gray-900 cursor-pointer transition flex items-center justify-between"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(
                                            `https://buscador.cumbre.icu/buscar?query=${encodeURIComponent(description)}`
                                        );
                                    }}
                                >
                                    <span>
                                        <span className="text-gray-500">{matchText}</span>
                                        <span className="text-white">{restText}</span>
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleApplySuggestionInternal(suggestion);
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-700"
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
                                </li>
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
