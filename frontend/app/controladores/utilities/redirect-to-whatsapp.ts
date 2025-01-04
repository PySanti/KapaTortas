import { Pedido } from "@/app/models/Pedido";

type OptionWhats = "contacto" | "pedido";

const formatMessages: Record<OptionWhats, string> = {
  contacto:
    "¡Hola! 👋 Vengo de la página de Kapa Tortas 🎂 y quisiera saber información sobre:",
  pedido:
    "¡Hola! 👋 Vengo de la página de Kapa Tortas 🎂. Aquí están los detalles de mi pedido:",
};

export default function redirectToWhatsapp({
  variant = "contacto",
  pedidoDetails,
  name,
}: {
  variant?: OptionWhats;
  pedidoDetails: Pedido | null;
  name: string;
}) {
  const phoneNumber = "584242185034";

  // Format item details for each item in the order
  const itemDetails = pedidoDetails?.descripciones
    .map(
      (item) =>
        `🍰 Producto: ${item.titulo} (Presentación: ${item.presentacion}) - Cantidad: ${item.cantidad}`,
    )
    .join("\n");

  // Address information for delivery (if applicable)
  const addressDetails =
    pedidoDetails?.metodo_entrega === "delivery"
      ? `📍 Dirección:\n🏠 ${pedidoDetails?.direccion_entrega.direccion}\n🔖 Referencia: ${pedidoDetails?.direccion_entrega.referencia}\n✉️ Código Postal: ${pedidoDetails?.direccion_entrega.codigo_postal}`
      : "🚶‍♂️ Recogeré en la tienda. 🏬";

  // Create the WhatsApp message
  const message = `
${formatMessages[variant]}
🙋‍♂️ Nombre del cliente: ${name}

${itemDetails}

${pedidoDetails?.metodo_entrega === "delivery" ? addressDetails : ""}

🚚 Método de entrega: ${pedidoDetails?.metodo_entrega}
💳 Método de pago: ${pedidoDetails?.metodo_pago}
💰 Total: $${pedidoDetails?.monto_total.toFixed(2)}

¡Al realizar tú pago pondremos el pedido en preparación! 🎉
  `.trim();

  // Encode the message to use in the WhatsApp URL
  const encodedMessage = encodeURIComponent(message);

  // Create WhatsApp Web URL and redirect
  const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  window.location.href = whatsappWebUrl;
}
