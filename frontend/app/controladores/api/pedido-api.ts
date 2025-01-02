import { Pedido } from '@/app/models/Pedido';
import { Venta } from '@/app/models/venta';

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
      email
    )}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      return data.pedidos;
    } catch (err) {
      console.error('Error en la peticion de consultar pedidos del cliente: ', err);
      return null;
    }
  }

  // Trae todos los pedidos de la db
  public async obtenerPedidos(): Promise<Pedido[] | null> {
    const url = `http://localhost:8000/api/pedidos/all_pedidos/}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      return data.pedidos;
    } catch (err) {
      console.error('Error en la peticion de consultar pedidos: ', err);
      return null;
    }
  }

  // Trae todas las ventas de la db
  public async obtenerVentas(): Promise<Venta[] | null> {
    const url = `http://localhost:8000/api/pedidos/all_ventas/`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      return data.ventas;
    } catch (err) {
      console.error('Error en la peticion de consultar ventas: ', err);
      return null;
    }
  }
}

export default PedidoAPI.getInstance();
