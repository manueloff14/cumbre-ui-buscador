// GuardarVisita.jsx
"use client";

import { useEffect } from "react";

// Variable a nivel de módulo para rastrear si la visita ya ha sido guardada
let hasSaved = false;

export default function GuardarVisita({ query }) {
    useEffect(() => {
        // Si ya se ha guardado la visita, no hacer nada
        if (hasSaved) return;

        const getLocation = async () => {
            try {
                // Obtener información de ubicación
                const locationResponse = await fetch('https://ipapi.co/json/');
                if (locationResponse.ok) {
                    const locationData = await locationResponse.json();
                    const ip = locationData.ip;
                    const country_name = locationData.country_name;
                    const city = locationData.city;
                    console.log("Datos de ubicación obtenidos:", ip, country_name, city);

                    // Verificar si se obtuvieron todos los datos necesarios
                    if (ip && country_name && city) {
                        // Realizar la solicitud para guardar la visita con datos completos
                        const saveResponse = await fetch(`https://data.cumbre.icu/api/consulta/${ip}/${country_name}/${city}/${query}`);
                        if (saveResponse.ok) {
                            console.log("Visita guardada correctamente.");
                        } else {
                            console.error("Error al guardar la visita con datos completos.");
                        }
                    } else {
                        // Realizar la solicitud para guardar la visita con datos faltantes
                        const saveResponse = await fetch(`https://data.cumbre.icu/api/consulta/0.0.0.0/0/0/${query}`);
                        if (saveResponse.ok) {
                            console.log("Visita guardada con datos faltantes.");
                        } else {
                            console.error("Error al guardar la visita con datos faltantes.");
                        }
                    }
                } else {
                    console.error("Error al obtener la información de ubicación.");
                }
            } catch (error) {
                console.error("Error al guardar la visita:", error);
            } finally {
                // Marcar como guardado para evitar futuras solicitudes
                hasSaved = true;
            }
        };

        // Ejecutar la función para obtener la ubicación y guardar la visita
        getLocation();
    }, [query]); // Dependencia: query

    return null; // Este componente no renderiza nada en la UI
}
