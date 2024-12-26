// app/api/autocomplete/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
    // 1. Leemos el "input" de los query params
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    // 2. Validar
    if (!input) {
        return NextResponse.json(
            { error: "Missing 'input' query param" },
            { status: 400 }
        );
    }

    // 3. Construimos la URL a Google (XML)
    const url = `https://suggestqueries.google.com/complete/search?output=toolbar&hl=es&q=${encodeURIComponent(
        input
    )}`;

    try {
        // 4. Llamada a Google desde el servidor de Next
        const response = await fetch(url, {
            headers: {
                // Opcionalmente, indicamos que deseamos UTF-8 en la respuesta
                Accept: "application/xml; charset=utf-8, text/xml; q=0.9, */*; q=0.1",
            },
        });

        if (!response.ok) {
            // Si falla la respuesta de Google, retornamos el status y un error
            return NextResponse.json(
                { error: "Error calling Google", status: response.status },
                { status: response.status }
            );
        }

        // 5. Obtenemos el arrayBuffer de la respuesta
        const arrayBuffer = await response.arrayBuffer();

        // 6. Decodificamos manualmente como UTF-8
        const decoder = new TextDecoder("utf-8");
        const xmlText = decoder.decode(arrayBuffer);

        // 7. Retornamos el contenido, indicando charset UTF-8
        return new Response(xmlText, {
            status: 200,
            headers: {
                "Content-Type": "text/xml; charset=UTF-8",
            },
        });
    } catch (error) {
        console.error("Error en /api/autocomplete:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
