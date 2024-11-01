"use client"

import { useRouter } from "next/navigation";

export default function Redirect() {
    const router = useRouter();
    router.push('https://buscador.cumbre.icu/');
}