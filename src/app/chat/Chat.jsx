"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/routes/buscar/Header";
import Buscador from "@/components/routes/buscar/Buscador";
import { v4 as uuidv4 } from 'uuid';
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";

export default function ChatComponent({ initialQuery }) {
    const [query, setQuery] = useState(initialQuery);
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    useEffect(() => {
        if (sessionId && query) {
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "user", message: query }
            ]);
            setIsLoading(true);
            fetchInitialMessage(query);
            setQuery("");
        }
    }, [sessionId, query]);

    const fetchInitialMessage = async (initialQuery) => {
        try {
            const response = await fetch("https://data.cumbre.icu/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: initialQuery, sessionId }),
            });

            if (!response.ok) {
                throw new Error("Error in API response");
            }

            const data = await response.json();
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", message: data.respuesta },
            ]);
        } catch (error) {
            console.error("Error sending request:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "bot", message: "Lo siento, ocurrió un error al procesar tu solicitud." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleLoading = (loadingState) => {
        setIsLoading(loadingState);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div>
            <Header />
            <div className="pt-16 pb-24 px-6">
                <div className="search-results w-full flex flex-col items-center justify-center mt-2 mb-[50px]">
                    <div className="w-full h-full lg:w-[50%]">
                        {messages.map((msg, index) => (
                            msg.sender === "user" ? (
                                <UserMessage key={index} message={msg.message} />
                            ) : (
                                <BotMessage key={index} message={msg.message} />
                            )
                        ))}
                        {isLoading && (
                            <div className="text-gray-500 dark:text-gray-400 mt-4">Cargando...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <Buscador
                query={query}
                iconChat={true}
                chatActive={true}
                onNewMessage={handleNewMessage}
                sessionId={sessionId}
                onLoading={handleLoading}
            />
        </div>
    );
}

