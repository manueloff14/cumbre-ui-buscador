"use client"

import { useState, useEffect, useRef } from "react"

const anuncianteInfo = {
    numero: "3507187007"
}

const anunciosEjemplo = [
    {
        servicio: "Disney+",
        bg: "bg-gray-950",
        logoPlataforma:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Disney_Plus_logo.svg/589px-Disney_Plus_logo.svg.png",
        descripcion: "Disfruta tus series y películas favoritas, cuando quieras y donde quieras.",
        subdescripcion: (
            <>
                ¡Ahora por sólo <br />
                <span className="text-2xl font-extrabold">$6.500 COP/mes</span>!
            </>
        ),
        imagenPortada: "https://www.indiependent.co.uk/wp-content/uploads/2020/12/the-mandalorian.jpg",
        logoPortada:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Mandalorian.svg/800px-The_Mandalorian.svg.png",
        logoEmpresa: "https://www.rendaz.shop/rendaz-logo.svg",
        url: "https://www.rendaz.shop",
        buttonGradient: "from-blue-600 to-blue-700",
        precio: "$6.500 COP/mes"
    },
    {
        servicio: "Netflix",
        bg: "bg-gray-900",
        logoPlataforma: "/img/netflix.png",
        descripcion: "Disfruta tus series y películas favoritas, cuando quieras y donde quieras.",
        subdescripcion: (
            <>
                ¡Ahora por sólo <br />
                <span className="text-2xl md:text-2xl font-extrabold">$6.500 COP/mes</span>!
            </>
        ),
        imagenPortada:
            "https://media.es.wired.com/photos/64381a4e0a1c25ac00cad6ec/16:9/w_2560%2Cc_limit/stranger%2520thing%2520serie%2520animada%2520de%2520television.jpg",
        logoPortada:
            "https://libreriavictoria.es/wp-content/uploads/2022/11/Stranger-Things-logo-blanco.webp",
        logoEmpresa: "https://www.rendaz.shop/rendaz-logo.svg",
        url: "https://www.rendaz.shop",
        buttonGradient: "from-red-600 to-red-700",
        precio: "$6.500 COP/mes"
    },
    {
        servicio: "Prime Video",
        bg: "bg-yellow-900",
        logoPlataforma: "https://m.media-amazon.com/images/G/01/digital/video/web/prime-video-horizontal-logo-white-dec-2024.png",
        descripcion: "Disfruta tus series y películas favoritas, cuando quieras y donde quieras.",
        subdescripcion: (
            <>
                ¡Ahora por sólo <br />
                <span className="text-2xl md:text-2xl font-extrabold">$6.500 COP/mes</span>!
            </>
        ),
        imagenPortada:
            "https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2019/08/hipertextual-llega-primera-imagen-nueva-temporada-the-boys-2019625345.jpg?fit=1920%2C1080&quality=50&strip=all&ssl=1",
        logoPortada:
            "https://images.squarespace-cdn.com/content/v1/6303b61f86ef470453496e16/1661187806990-COZVF6H3N8N7F1J8RS7D/KS_website+logos_The+Boys.png",
        logoEmpresa: "https://www.rendaz.shop/rendaz-logo.svg",
        url: "https://www.rendaz.shop",
        buttonGradient: "from-yellow-600 to-yellow-700",
        precio: "$6.500 COP/mes"
    },
    // Puedes agregar más anuncios aquí si quieres
]

export default function AnuncioSlider() {
    const [indiceActual, setIndiceActual] = useState(0)
    const intervaloRef = useRef(null)

    const resetInterval = () => {
        if (intervaloRef.current) {
            clearInterval(intervaloRef.current)
            intervaloRef.current = setInterval(() => {
                setIndiceActual((prev) => (prev + 1) % anunciosEjemplo.length)
            }, 10000)
        }
    }

    useEffect(() => {
        intervaloRef.current = setInterval(() => {
            setIndiceActual((prev) => (prev + 1) % anunciosEjemplo.length)
        }, 10000) // Cambia cada 10 segundos

        return () => clearInterval(intervaloRef.current)
    }, [])

    const handleDotClick = (index) => {
        setIndiceActual(index)
        resetInterval()
    }

    const handlePrevClick = () => {
        /* aqio simplemente restamos uno al indice actual */
        setIndiceActual((prev) => (prev - 1 + anunciosEjemplo.length) % anunciosEjemplo.length)
        resetInterval()
    }

    const handleNextClick = () => {
        setIndiceActual((prev) => (prev + 1) % anunciosEjemplo.length)
        resetInterval()
    }

    /* buenos dias, buenas tardes o buenas noches dependiendo de la hora */
    const hora = new Date().getHours()
    let saludo = ""
    if (hora >= 6 && hora < 12) {
        saludo = "buenos días"
    } else if (hora >= 12 && hora < 18) {
        saludo = "buenas tardes"
    } else {
        saludo = "buenas noches"
    }

    const message = `Hola, ${saludo}, me interesa el producto ${anunciosEjemplo[indiceActual].servicio} por ${anunciosEjemplo[indiceActual].precio}, ¿podrías darme más información sobre los métodos de pago?`

    return (
        <div className="w-full relative rounded-3xl overflow-hidden shadow-xl border-2 border-white h-full">
            {/* Contenedor principal que contiene todos los slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{
                    width: `${anunciosEjemplo.length * 100}%`,
                    transform: `translateX(-${(100 / anunciosEjemplo.length) * indiceActual}%)`,
                }}
            >
                {anunciosEjemplo.map((anuncio, index) => (
                    <div
                        key={index}
                        onClick={() => window.open(`https://wa.me/+57${anuncianteInfo.numero}?text=${message}`, '_blank')}
                        className={`${anuncio.bg} w-full flex-shrink-0 cursor-pointer`}
                        style={{ width: `${100 / anunciosEjemplo.length}%` }}
                    >
                        <div className="flex flex-col md:flex-row w-full z-20 relative h-full">
                            {/* Image section - Full width on mobile, half width on desktop */}
                            <div className="w-full md:w-1/2 md:order-2 relative">
                                {/* Main image */}
                                <img
                                    src={anuncio.imagenPortada || "/placeholder.svg"}
                                    alt="Imagen Portada"
                                    className="w-full h-[250px] md:h-full object-cover"
                                />

                                {/* Rendaz logo */}
                                <div className="absolute top-4 right-4">
                                    <img
                                        src={anuncio.logoEmpresa || "/placeholder.svg"}
                                        alt="Logo Empresa"
                                        className="w-20 md:w-16 h-auto"
                                    />
                                </div>

                                {/* Serie logo */}
                                <div className="absolute bottom-4 right-4">
                                    <img
                                        src={anuncio.logoPortada || "/placeholder.svg"}
                                        alt="Logo Portada"
                                        className="w-20 md:w-24 h-auto"
                                    />
                                </div>
                            </div>

                            {/* Content section - Full width on mobile, half width on desktop */}
                            <div className="w-full md:w-1/2 md:order-1 p-4 md:p-6 md:pr-16 flex flex-col justify-between items-start relative z-20 h-full">
                                <span className="mb-4 md:mb-10 font-extrabold text-white text-xs md:text-sm">Anuncio</span>
                                <img
                                    src={anuncio.logoPlataforma || "/placeholder.svg"}
                                    alt="Logo Plataforma"
                                    className="w-[110px] md:w-[150px] h-auto object-contain mb-4 md:mb-6 relative z-20"
                                />

                                <div className="space-y-2 md:space-y-4 relative z-20">
                                    <p className="text-white text-xs md:text-sm font-bold">{anuncio.descripcion}</p>
                                    <p className="text-white text-sm md:text-base font-bold">{anuncio.subdescripcion}</p>
                                </div>

                                <button className={`border-2 border-white mt-4 bg-gradient-to-r ${anuncio.buttonGradient} transition-colors text-white font-bold text-xs md:text-sm py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl text-center relative z-20 w-full md:w-auto`}>
                                    ¡COMPRAR AHORA!
                                </button>
                            </div>

                            {/* Gradiente horizontal */}
                            <div className="md:hidden absolute top-1/2 right-0 left-0 transform -translate-y-1/2 h-[70%] z-5 bg-gradient-to-b from-transparent via-black to-transparent z-10"></div>


                            {/* Gradiente vertical */}
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[50%] z-5 bg-gradient-to-r from-transparent via-black to-transparent z-10"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={handlePrevClick}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 transition-colors rounded-full p-1 md:p-2 z-30"
                aria-label="Anterior anuncio"
            >
                <img className="w-6 rotate-180" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsUlEQVR4nO3ZwQqCYBRE4esTJlK4qGd3oRRIvUHBESvIhe3nXuZbRSuH8wtaEWY6gBPwAK5AGxkBDXDn5wn0kREwb4bkHQN034svMea4M+YFXCIbPEYULiMKlxGFy4hyGVUuo8plVFUr0/95OWujyJgpigwZI5MSR4vP72J7N/s5svAIFS6hwiVUuIQKl1CBHztE4BIiKFLiUOLPUGBKP2IF3NKP2BytERjWz+8vzWpaAFg7XsQMSUrmAAAAAElFTkSuQmCC" alt="forward--v1" />
            </button>

            <button
                onClick={handleNextClick}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 transition-colors rounded-full p-1 md:p-2 z-30"
                aria-label="Siguiente anuncio"
            >
                <img className="w-6" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsUlEQVR4nO3ZwQqCYBRE4esTJlK4qGd3oRRIvUHBESvIhe3nXuZbRSuH8wtaEWY6gBPwAK5AGxkBDXDn5wn0kREwb4bkHQN034svMea4M+YFXCIbPEYULiMKlxGFy4hyGVUuo8plVFUr0/95OWujyJgpigwZI5MSR4vP72J7N/s5svAIFS6hwiVUuIQKl1CBHztE4BIiKFLiUOLPUGBKP2IF3NKP2BytERjWz+8vzWpaAFg7XsQMSUrmAAAAAElFTkSuQmCC" alt="forward--v1" />
            </button>

            {/* Indicator dots */}
            <div className="absolute top-4 md:top-auto md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
                {anunciosEjemplo.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${index === indiceActual ? "bg-white w-4 md:w-6 opacity-100" : "bg-white w-1.5 md:w-2 opacity-50"
                            }`}
                        aria-label={`Ir al anuncio ${index + 1}`}
                    />
                ))}
            </div>

        </div>
    )
}
