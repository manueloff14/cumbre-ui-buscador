// MobileAutocomplete.js
"use client";
import React from "react";

export default function MobileAutocomplete({ suggestions, onSelectSuggestion }) {
    return (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mt-1 z-50 rounded-lg">
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => onSelectSuggestion(suggestion)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                        {suggestion.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}
