"use client";

import { useState, useEffect, useRef } from "react";

// Función para obtener o generar el ID del usuario
const getUserId = () => {
    const id = document.cookie.match(/user_id=([^;]+)/)?.[1];
    if (!id) {
        const newId = 'user_' + Math.random().toString(36).substr(2, 9);
        document.cookie = `user_id=${newId};path=/;max-age=${365 * 24 * 60 * 60}`; // Guardar en cookie por 1 año
        return newId;
    }
    return id;
};

export default function UserTracking() {
    const [userId, setUserId] = useState(null);
    const [sessionTime, setSessionTime] = useState(0); // Tiempo de la sesión
    const inactivityTimer = useRef(null); // Temporizador de inactividad
    const sessionStart = useRef(new Date()); // Momento en que la sesión comienza

    useEffect(() => {
        const id = getUserId();
        setUserId(id);

        // Registrar la hora de inicio de sesión y mostrarlo en consola
        const startTime = new Date();
        console.log("Sesión iniciada a las:", startTime.toLocaleTimeString());

        // Establecer la hora de inicio de la sesión
        sessionStart.current = startTime;

        const handleExit = async () => {
            const endTime = new Date();
            const duration = Math.round((endTime - sessionStart.current) / 1000); // Duración en segundos
            // Mostramos la sesión en consola antes de enviarla a la API
            console.log("Sesión a enviar a la API:", {
                userId,
                sessionStart: sessionStart.current.toISOString(),
                sessionEnd: endTime.toISOString(),
                duration,
            });

            // Intentamos enviar la sesión a la API
            await sendSessionToApi({
                userId,
                sessionStart: sessionStart.current.toISOString(),
                sessionEnd: endTime.toISOString(),
                duration,
            });
        };

        // Detectar cuando el usuario cierra la pestaña o recarga la página
        window.addEventListener("beforeunload", handleExit);

        // Detectar inactividad (sin interacción por 1 minuto)
        const handleInactivity = () => {
            inactivityTimer.current = setTimeout(() => {
                // Si el usuario está inactivo durante 1 minuto
                stopSession();
            }, 1000 * 60); // 1 minuto
        };

        // Resetear el temporizador cada vez que el usuario interactúe con la página
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer.current); // Limpiar el temporizador anterior
            handleInactivity(); // Iniciar el nuevo temporizador de inactividad
        };

        // Agregar los listeners de eventos
        document.addEventListener("mousemove", resetInactivityTimer);
        document.addEventListener("keydown", resetInactivityTimer);

        // Iniciar el temporizador de inactividad
        handleInactivity();

        // Limpiar los eventos al desmontar el componente
        return () => {
            handleExit();
            window.removeEventListener("beforeunload", handleExit);
            document.removeEventListener("mousemove", resetInactivityTimer);
            document.removeEventListener("keydown", resetInactivityTimer);
            clearTimeout(inactivityTimer.current); // Limpiar temporizador de inactividad
        };
    }, [userId]);

    useEffect(() => {
        // Si el usuario regresa después de estar inactivo, reanudamos la sesión
        const interval = setInterval(() => {
            setSessionTime(Math.round((new Date() - sessionStart.current) / 1000)); // Actualizamos el tiempo de la sesión
        }, 1000); // Actualizar cada segundo

        return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    // Detener la sesión cuando el usuario está inactivo
    const stopSession = async () => {
        const endTime = new Date();
        const duration = Math.round((endTime - sessionStart.current) / 1000); // Duración en segundos
        // Mostramos la sesión en consola antes de enviarla a la API
        console.log("Sesión a enviar a la API (inactividad):", {
            userId,
            sessionStart: sessionStart.current.toISOString(),
            sessionEnd: endTime.toISOString(),
            duration,
        });
        await sendSessionToApi({
            userId,
            sessionStart: sessionStart.current.toISOString(),
            sessionEnd: endTime.toISOString(),
            duration,
        });
        sessionStart.current = new Date(); // Reiniciar la sesión
        setSessionTime(0); // Restablecer el contador
    };

    // Función para enviar los datos de la sesión a la API
    const sendSessionToApi = async (sessionData) => {
        try {
            const response = await fetch("https://data.cumbre.icu/api/register-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sessionData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Session registered", data);
        } catch (error) {
            console.error("Error sending session data", error);
        }
    };

    return null; // Este componente no tiene contenido visual
}
