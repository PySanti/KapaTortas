import { Cliente } from '@/app/models/Cliente';
import { DireccionEntrega } from '@/app/models/Pedido';

// Tiene un singleton
class ClienteAPI {
  private static instance: ClienteAPI;

  private constructor() {}

  // Metodo para obtener la instancia
  public static getInstance(): ClienteAPI {
    if (!ClienteAPI.instance) {
      ClienteAPI.instance = new ClienteAPI();
    }
    return ClienteAPI.instance;
  }

  // Metodo para obtener el Cliente
  public async obtenerCliente(email: string): Promise<Cliente | null> {
    const url = `http://localhost:8000/api/perfiles/${encodeURIComponent(email)}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (err) {
      console.error('Error en la peticion de consultar cliente: ', err);
      return null;
    }
  }

  // Metodo para obtener direcciones de envio del Cliente
  public async obtenerDireccionesEnvio(email: string): Promise<DireccionEntrega[] | null> {
    const url = `http://localhost:8000/api/perfiles/buscar_direcciones_cliente/${encodeURIComponent(
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

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      return data.direcciones;
    } catch (err) {
      console.error('Error en la peticion de consultar direcciones de envio: ', err);
      return null;
    }
  }
}

export default ClienteAPI.getInstance();
