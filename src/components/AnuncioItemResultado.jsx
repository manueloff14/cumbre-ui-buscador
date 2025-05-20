"use client"

export default function AnuncioItemResultado({
}) {
    const anunciante = {
        numero: "3507187007"
    }
    /* segun la hora el saludo, buenos dias, buenas tardes o buenas noches */
    const hora = new Date().getHours()
    let saludo = ""
    if (hora >= 6 && hora < 12) {
        saludo = "buenos días"
    } else if (hora >= 12 && hora < 18) {
        saludo = "buenas tardes"
    } else {
        saludo = "buenas noches"
    }

    const message = `Hola, ${saludo}. Me interesa la oferta de trabajo que vi en tu anuncio de *Cumbre Empleos*. ¿Podrías darme más información sobre cómo empezar?`

    return (
        <div onClick={() => window.open(`https://wa.me/+57${anunciante.numero}?text=${message}`, '_blank')} className="cursor-pointer p-4 border-[1px] border-gray-300 dark:border-gray-800 rounded-3xl mb-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200">
            <div className="mb-3">
                <span className="text-xs font-bold">Patrocinado</span>
            </div>
            <div className="flex gap-6 justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full flex items-center justify-center">
                            <img className="w-[20px]" src="https://www.rendaz.shop/rendaz-logotipo.svg" alt="Logo de la plataforma" />
                        </div>
                        <div className="flex flex-col text-xs gap-1">
                            <span>www.rendaz.shop</span>
                            <span className="text-[#127df7]">https://www.rendaz.shop</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">¡Gana $150,000 DIARIOS sin salir de casa!</h3>
                        <p className="text-sm text-gray-400">Más de 1,000 personas ya están triunfando como revendedores Rendaz. ¿Vas a quedarte fuera mientras ellos cambian su vida? Únete AHORA y descubre cómo multiplicar tus ingresos fácilmente. ¡No esperes más, el éxito te está llamando!</p>
                    </div>
                </div>
                {/* <div>
                    <img className="w-[200px] h-full object-cover" src="https://i.blogs.es/4285e7/netflix-portada/1366_2000.jpeg" alt="" />
                </div> */}
            </div>
        </div>
    )
}