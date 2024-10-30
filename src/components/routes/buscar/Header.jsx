"use client"

import { useState, useEffect } from "react";

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full py-4 px-6 bg-white dark:bg-[#0a0a0a] flex justify-between items-center z-20">
            <a href="https://buscador.cumbre.icu">
                <div className="flex items-center gap-2">
                    <div className='bg-[url("/img/cumbre_logo_negro.png")] dark:bg-[url("/img/cumbre_logo.png")] bg-cover bg-center w-[100px] h-[30px]'>

                    </div>
                    {/* <img
                    src={isDarkMode ? "/img/cumbre_logo.png" : "/img/cumbre_logo_negro.png"}
                    alt="Logo Cumbre"
                    className="w-[110px]"
                    /> */}
                    <span className="w-[2px] h-[15px] bg-black dark:bg-white hidden md:flex"></span>
                    <div className="text-black dark:text-gray-300 text-sm hidden md:flex">
                        <span>El buscador de empleos</span>
                    </div>
                </div>
            </a>
            <div className="flex items-center gap-3">
                <div className="text-sm text-black dark:text-gray-400 hidden md:flex">
                    <span>Con ❤️ desde <span className="text-black dark:text-white">Cúcuta</span></span>
                </div>
                <a href="https://www.cumbre.icu/contacto">
                    <button className="bg-gradient-to-r from-blue-600 to-pink-600 p-2 px-4 font-bold text-white rounded-full text-sm">
                        Optener Ayuda
                    </button>
                </a>
            </div>
        </header>
    )
}