import { Pedido } from "@/app/models/Pedido";
import { CartItem } from "@/src/usePedidoStore";

// Tiene un singleton
class PedidoAPI {
  private static instance: PedidoAPI;

  private constructor() {}

  // Metodo para obtener la instancia
  public static getInstance(): PedidoAPI {
    if (!PedidoAPI.instance) {
      PedidoAPI.instance = new PedidoAPI();
    }
    return PedidoAPI.instance;
  }

  public async obtenerPedidos(email: string): Promise<Pedido[] | null> {
    const url = `http://localhost:8000/api/perfiles/buscar_pedidos_cliente/${encodeURIComponent(
      email,
    )}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      return data.pedidos;
    } catch (err) {
      console.error("Error en la peticion de consultar pedidos: ", err);
      return null;
    }
  }

  // // POST Pedido
  public async postPedido(
    cliente_id: number,
    metodo_entrega: string,
    metodo_pago: string,
    direccion_entrega_id: number,
    items: CartItem[],
  ): Promise<Pedido | null> {
    const url = `http://localhost:8000/api/pedidos/crear`;

    const body = JSON.stringify({
      cliente_id: cliente_id,
      metodo_entrega: metodo_entrega,
      metodo_pago: metodo_pago,
      direccion_entrega_id: direccion_entrega_id,
      descripciones: items.map((item) => {
        return {
          cantidad: item.quantity,
          id_producto: item.product.id,
          id_presentacion: item.present?.id,
        };
      }),
    });

    console.log("BODY", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      console.error("Error al postear el pedido: ", err);
      return null;
    }
  }
}

export default PedidoAPI.getInstance();
