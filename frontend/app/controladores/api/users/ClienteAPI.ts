import { Cliente } from '@/app/models/Cliente';
import { DireccionEntrega } from '@/app/models/Pedido';
import { Perfil } from '@/app/models/Perfil';

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
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (err) {
      console.error(email);
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

  // Metodo para actualizar la información del Cliente
  public async actualizarInfoCliente(
    email: string,
    new_nombre_completo?: string | null,
    new_password?: string | null,
    new_numero_telefonico?: string | null,
    new_fecha_nacimiento?: string | null
  ): Promise<Perfil | null> {
    const url = `http://127.0.0.1:8000/api/perfiles/editar/`;

    // Prepare the request body
    const body = JSON.stringify({
      email: email,
      new_nombre_completo: new_nombre_completo,
      new_password: new_password,
      new_numero_telefonico: new_numero_telefonico,
      new_fecha_nacimiento: new_fecha_nacimiento,
    });

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      // Handle the response data, you can return success or additional data
      const data = await response.json();
      console.log('Datos actualizados:', data);
      return data.new_profile;
    } catch (err) {
      console.error('Error al actualizar la información del cliente: ', err);
      return null;
    }
  }
}

export default ClienteAPI.getInstance();
