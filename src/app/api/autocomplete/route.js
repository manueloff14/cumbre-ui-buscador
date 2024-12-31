// app/api/autocomplete/route.js
import { NextResponse } from "next/server";
import iconv from "iconv-lite"; // Importar iconv-lite

export async function GET(request) {
    // 1. Leer el "input" de los query params
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    // 2. Validar el input
    if (!input) {
        console.error("Falta el parámetro 'input' en la consulta.");
        return NextResponse.json(
            { error: "Missing 'input' query param" },
            { status: 400 }
        );
    }

    console.log(`Input recibido: ${input}`);

    // 3. Construir la URL a Google (XML)
    const url = `https://suggestqueries.google.com/complete/search?output=toolbar&hl=es&q=${encodeURIComponent(
        input
    )}`;

    try {
        // 4. Llamada a Google desde el servidor de Next
        const response = await fetch(url, {
            headers: {
                // Solicitamos explícitamente ISO-8859-1
                Accept: "application/xml; charset=ISO-8859-1, text/xml; q=0.9, */*; q=0.1",
            },
        });

        // Verificar los encabezados de la respuesta
        const contentType = response.headers.get("Content-Type");
        console.log("Headers de la respuesta de Google:", contentType);

        if (!response.ok) {
            // Si falla la respuesta de Google, retornar el status y un error
            console.error(`Error al llamar a Google: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: "Error calling Google", status: response.status },
                { status: response.status }
            );
        }

        // 5. Obtener el arrayBuffer de la respuesta
        const arrayBuffer = await response.arrayBuffer();

        // 6. Decodificar manualmente como ISO-8859-1
        const buffer = Buffer.from(arrayBuffer);
        const xmlText = iconv.decode(buffer, "ISO-8859-1");

        // 7. Ajustar la declaración de encoding en el XML a UTF-8
        const correctedXmlText = xmlText.replace('<?xml version="1.0"?>', '<?xml version="1.0" encoding="UTF-8"?>');

        // 8. Retornar el contenido, indicando charset UTF-8
        return new Response(correctedXmlText, {
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
