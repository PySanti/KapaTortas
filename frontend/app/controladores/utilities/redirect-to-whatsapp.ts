import { OrderDetails } from "@/app/models/Pedido";
import { useRouter } from "next/router";

type optionWhats = "contacto" | "pedido"

const format: Record<optionWhats, string> = {
    contacto: "¡Hola!, vengo de la página de Kapa Tortas, quisiera saber información sobre: ",
    pedido: "¡Hola!, vengo de la página de Kapa Tortas. Aquí están los detalles de mi pedido:%0A",
}

export default function redirectToWhatsapp({ variant = "contacto", orderDetails }: { variant?: optionWhats, orderDetails: OrderDetails }) {
    const phoneNumber = "584242185034";
    
    // Format item details for each item in the order
    const itemDetails = orderDetails.items.map(item => 
        `- ${item.title} (Cantidad: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join("%0A");

    // Format address details for delivery
    const addressDetails = `Dirección de envío:%0A${orderDetails.address.direccion}%0AReferencia: ${orderDetails.address.referencia}%0ACódigo Postal: ${orderDetails.address.codigo_postal}`;

    // Message template based on variant
    const variantMessage = {
        "contacto": "Detalles de contacto:",
        "pedido": "Detalles de tu pedido:"
    }[variant] || "Detalles:";

    // Construct the final message for WhatsApp
    const message = `
        ${variantMessage}%0A%0A
        Total: $${orderDetails.price.toFixed(2)}%0A%0A
        ${itemDetails}%0A%0A
        ${addressDetails}%0A%0A
        Método de entrega: ${orderDetails.deliveryMethod}%0A%0A
        Método de pago: ${orderDetails.paymentMethod}
    `.trim();

    // Encode the message to use in the URL
    const encodedMessage = encodeURIComponent(message);

    // Create the WhatsApp URL and redirect to it
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.location.href = whatsappUrl;
}
