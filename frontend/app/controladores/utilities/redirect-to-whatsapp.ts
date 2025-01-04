import { Pedido } from "@/app/models/Pedido";

type OptionWhats = "contacto" | "pedido";

const formatMessages: Record<OptionWhats, string> = {
  contacto:
    "¡Hola!, vengo de la página de Kapa Tortas, quisiera saber información sobre: ",
  pedido:
    "¡Hola!, vengo de la página de Kapa Tortas. Aquí están los detalles de mi pedido:%0A",
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
        `- Producto: ${item.titulo} (Presentación: ${item.presentacion}) - Cantidad: ${item.cantidad}`,
    )
    .join("%0A");

  // Address information for delivery (if applicable)
  const addressDetails =
    pedidoDetails?.metodo_entrega === "delivery"
      ? `Dirección:%0A${pedidoDetails?.direccion_entrega.direccion}%0AReferencia: ${pedidoDetails?.direccion_entrega.referencia}%0ACódigo Postal: ${pedidoDetails?.direccion_entrega.codigo_postal}`
      : "Recogeré en la tienda.";

  // Create the WhatsApp message
  const message = `
        ${formatMessages[variant]}%0A
        Nombre del cliente: ${name}%0A
        ${itemDetails}%0A%0A
        ${pedidoDetails?.metodo_entrega === "delivery" ? addressDetails : ""}%0A
        Método de entrega: ${pedidoDetails?.metodo_entrega}%0A
        Método de pago: ${pedidoDetails?.metodo_pago}%0A
        Total: $${pedidoDetails?.monto_total.toFixed(2)}
    `.trim();

  // Encode the message to use in the WhatsApp URL
  const encodedMessage = encodeURIComponent(message);

  // Create the WhatsApp URL and redirect to it
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.location.href = whatsappUrl;
}
