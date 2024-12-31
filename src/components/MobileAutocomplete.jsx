import { useState, useEffect } from "react";

export function AutocompleteMobile({
    suggestions = [],
    handleSelectSuggestion,
    handleApplySuggestion,
    handleInputChange,
    initialQuery = "",
    onClose,
    isMobile,
    isDarkMode,
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

    const handleScroll = () => {
        // Ocultar teclado al desplazarse
        if (document.activeElement && document.activeElement.tagName === "INPUT") {
            document.activeElement.blur();
        }
    };

    return (
        <div className={`fixed inset-0 top-[0px] bg-white dark:bg-[#0a0a0a] z-[9999] flex flex-col`}>
            <div className="py-4 px-3 flex items-center justify-between">
                <div className='bg-[url("/img/cumbre_logo_negro.png")] dark:bg-[url("/img/cumbre_logo.png")] bg-cover bg-center w-[130px] h-[40px]'></div>
                <a href="https://cumbre.icu/contacto">
                    <button className="bg-gradient-to-r from-blue-600 to-pink-600 p-2 px-4 font-bold text-white rounded-full text-sm">Obtener Ayuda</button>
                </a>
            </div>

            {/* Input de búsqueda */}
            <div className="sticky top-0 px-4 pb-2 z-[10000] flex items-center">
                <div className="flex items-center px-3 border-2 border-gray-200 dark:border-gray-600 w-full rounded-full bg-gray-300 dark:bg-gray-800">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChangeInternal}
                        autoFocus
                        placeholder="Buscar..."
                        className="flex-grow pl-3 py-3 bg-transparent focus:outline-none w-full"
                    />
                    {inputValue && (
                        <>
                            <button
                                onClick={clearInput}
                                className="p-2 rounded-full"
                                aria-label="Limpiar input"
                            >
                                ✕
                            </button>
                            <span className="ml-2">|</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                            <path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" fill={isDarkMode ? "white" : "black"}></path>
                        </svg>
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="ml-2 p-2 rounded-full"
                    aria-label="Cerrar panel"
                >
                    ✕
                </button>
            </div>

            {/* Lista de sugerencias */}
            <div
                className="flex-grow overflow-y-auto p-3 no-scrollbar"
                onScroll={handleScroll} // Ocultar teclado al desplazarse
            >
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
                                        className="p-3 rounded-2xl bg-transparent dark:hover:bg-gray-900 hover:bg-gray-200 transition flex items-center justify-between"
                                    >
                                        <span>
                                            <span className="text-gray-400 dark:text-gray-500">{matchText}</span>
                                            <span>{restText}</span>
                                        </span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleApplySuggestionInternal(suggestion);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                                        aria-label="Aplicar sugerencia"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                            <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z" fill={isDarkMode ? "white" : "black"}></path>
                                        </svg>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <li className="p-3 rounded-2xl bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-center">
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
        </div >
    );
}
