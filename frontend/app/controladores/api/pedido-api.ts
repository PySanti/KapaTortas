import { EstadoEnum, Pedido } from "@/app/models/Pedido";
import { CartItem } from "@/src/usePedidoStore";
import { Venta } from "@/app/models/venta";

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
  // Trae todos los pedidos del cliente iniciado
  public async obtenerPedidosCliente(email: string): Promise<Pedido[] | null> {
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
      console.error(
        "Error en la peticion de consultar pedidos del cliente: ",
        err,
      );
      return null;
    }
  }

  // Trae todos los pedidos de la db
  public async obtenerPedidos(): Promise<Pedido[] | null> {
    const url = `http://localhost:8000/api/pedidos/all_pedidos/`;

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

  // Trae todas las ventas de la db
  public async obtenerVentas(): Promise<Venta[] | null> {
    const url = `http://localhost:8000/api/pedidos/all_ventas/`;

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

      return data.ventas;
    } catch (err) {
      console.error("Error en la peticion de consultar ventas: ", err);
      return null;
    }
  }

  // Crear un pedido en la db
  public async postPedido(
    correo_cliente: string,
    metodo_entrega: string,
    metodo_pago: string,
    iva: number,
    total: number,
    direccion_entrega_id: number,
    items: CartItem[],
    nota?: string | undefined,
  ): Promise<Pedido | null> {
    const url = `http://localhost:8000/api/pedidos/crear/`;

    const body = JSON.stringify({
      correo_cliente: correo_cliente,
      metodo_entrega: metodo_entrega,
      metodo_pago: metodo_pago,
      iva: iva,
      precio: total,
      nota: nota,
      direccion_entrega_id: direccion_entrega_id,
      descripciones: items.map((item) => {
        return {
          cantidad: item.quantity,
          id_producto: item.product.id,
          id_presentacion: item.present?.id,
        };
      }),
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data?.pedido);
      return data?.pedido;
    } catch (err) {
      console.error("Error al postear el pedido: ", err);
      return null;
    }
  }

  // Editar el estado de un pedido en la db
  public async editarEstadoPedido(numeroOrden: number, estado: EstadoEnum): Promise<boolean> {
    const url = `http://localhost:8000/api/pedidos/editar_estado/`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          numero_orden: numeroOrden, 
          estado: estado 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error("Error al actualizar el estado del pedido: ", err);
      return false;
    }
  }
}

export default PedidoAPI.getInstance();
