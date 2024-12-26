"use client";
import React from "react";

export function AutocompleteDesktop({
    suggestions,
    handleSelectSuggestion,
    handleApplySuggestion
}) {
    if (!suggestions.length) return null;

    return (
        <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                {suggestions.map((suggestion, index) => (
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
                        <span onClick={() => handleSelectSuggestion(suggestion)}>
                            {suggestion.description}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleApplySuggestion(suggestion);
                            }}
                            className="p-1 rounded-full hover:bg-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                <path d="M15.978516 5.9804688a2.0002 2.0002 0 00-1.392578 3.4335937L29.171875 24 14.585938 38.585938a2.0002 2.0002 0 102.828124 2.828124L33.414062 25.414062a2.0002 2.0002 0 000-2.828124L17.414062 6.5859375a2.0002 2.0002 0 00-1.435546-.6054687z" fill="white" />
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}