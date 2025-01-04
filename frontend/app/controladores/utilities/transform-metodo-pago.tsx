import { MetodoPago } from "@/app/models/Pedido";

const metodoPagoArray = [
  { metodo: MetodoPago.ZELLE, label: "Zelle" },
  { metodo: MetodoPago.PAGO_MOVIL, label: "Pago Móvil" },
];

// Helper function to transform the metodo_pago field to a readable string
export const transformMetodoPago = (metodoPago: MetodoPago): string => {
  const metodo = metodoPagoArray.find((metodo) => metodo.metodo === metodoPago);
  return metodo ? metodo.label : "Método de pago no disponible";
};
