import { useRouter } from "next/router";

type optionWhats = "contacto" | "pedido"

const format: Record<optionWhats, string> = {
    contacto: "¡Hola!, vengo de la página de Kapa Tortas, quisiera saber información sobre: ",
    pedido: "¡Hola!, vengo de la página de Kapa Tortas. Aquí están los detalles de mi pedido:%0A",
}

export default function redirectToWhatsapp({ variant = "contacto", orderDetails = "" }: { variant?: optionWhats, orderDetails?: string }) {
    const phoneNumber= "584242185034";
    const message = `${ format[variant] }${orderDetails}`

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Redirect directly to Whatsapp
    window.location.href = whatsappUrl;
}