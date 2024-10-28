"use client";

import { useState, useEffect } from "react";

export default function Logo() {

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <div>
            {/* mostrar para light "/img/cumbre_logo.png" y dark "/img/cumbre_logo_negro.png" */ }
            <img src={`/img/cumbre_logo${isDarkMode ? "" : "_negro"}.png`} alt="Logo Cumbre" className="mb-6 w-[140px]" />
        </div>

    )
}

