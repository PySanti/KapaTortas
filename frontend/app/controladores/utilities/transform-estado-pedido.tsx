import { EstadoEnum } from "@/app/models/Pedido";

export const estadosPedido = [
  { label: "Recibido", value: EstadoEnum.RECIBIDO },
  { label: "En proceso", value: EstadoEnum.EN_PROCESO },
  { label: "Cancelado", value: EstadoEnum.CANCELADO },
  { label: "Finalizado", value: EstadoEnum.FINALIZADO },
];

// Helper function to transform the estado field to a readable string
export const transformEstadoPedido = (estadoInput: EstadoEnum): string => {
  const estado = estadosPedido.find((estado) => estado.value === estadoInput);
  return estado ? estado.label : "Estado no disponible";
};
