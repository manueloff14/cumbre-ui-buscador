import ChatComponent from "./Chat";
import Redirect from "../buscar/Redirect";

export async function generateMetadata({ searchParams }) {
    const query = searchParams.query || '';
    return {
        title: query ? `${query} - Cumbre Buscador` : 'Cumbre Buscador',
    };
}   

export default function Chat({ searchParams }) {
    const initialQuery = searchParams.query || '';

    /* Si no hay query, redireccionar a https://buscador.cumbre.icu/ */
    if (!initialQuery) {
        return <Redirect />;
    }

    return (
        <>
            <ChatComponent initialQuery={initialQuery} />
        </>
    );
}
