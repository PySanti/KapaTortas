import { Cliente } from "@/app/models/Cliente";
import { DireccionEntrega } from "@/app/models/Pedido";
import { Perfil } from "@/app/models/Perfil";
import { DireccionEnvioType } from "../lib/validations/direccion-envio";

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
    const url = `http://localhost:8000/api/perfiles/${encodeURIComponent(email)}/`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (err) {
      console.error(email);
      console.error("Error en la peticion de consultar cliente: ", err);
      return null;
    }
  }

  // Metodo para obtener direcciones de envio del Cliente
  public async obtenerDireccionesEnvio(
    email: string,
  ): Promise<DireccionEntrega[] | null> {
    const url = `http://localhost:8000/api/perfiles/buscar_direcciones_cliente/${encodeURIComponent(
      email,
    )}/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      return data.direcciones;
    } catch (err) {
      console.error(
        "Error en la peticion de consultar direcciones de envio: ",
        err,
      );
      return null;
    }
  }

  // Metodo para actualizar la información del Cliente
  public async actualizarInfoCliente(
    email: string,
    new_nombre_completo?: string | null,
    new_password?: string | null,
    new_numero_telefonico?: string | null,
    new_fecha_nacimiento?: string | null,
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      // Handle the response data, you can return success or additional data
      const data = await response.json();
      console.log("Datos actualizados:", data);
      return data.new_profile;
    } catch (err) {
      console.error("Error al actualizar la información del cliente: ", err);
      return null;
    }
  }

  public async eliminarPerfil(email: string): Promise<boolean> {
    const url = `http://localhost:8000/api/perfiles/eliminar/${encodeURIComponent(email)}/`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      // Handle the response data, you can return success or additional data
      const data = await response.json();
      console.log("Perfil eliminado:", data);
      return true;
    } catch (error) {
      console.error("Error al eliminar el perfil: ", error);
      return false;
    }
  }

  public async agregarDireccionEnvio(
    direccion: DireccionEnvioType,
  ): Promise<Response> {
    const url = "http://localhost:8000/api/clientes/crear_direccion/";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pais: direccion.pais,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                direccion: direccion.direccion,
                referencia: direccion.referencia,
                codigo_postal: direccion.codigo_postal,
                correo_cliente: direccion.correo_cliente
            }),
        });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      return response; // Return the Response object
    } catch (error) {
      console.error("Error al agregar nueva dirección:", error);
      throw error;
    }
  }
  // Postear dirección
  public async crearDireccionCliente(
    email: string,
    direccion: string,
    codigo_postal: number,
    ref?: string,
  ): Promise<number | null> {
    const url = `http://localhost:8000/api/clientes/crear_direccion/`;

    const body = JSON.stringify({
      correo_cliente: email,
      // Cambiar esto pronto
      estado: "Dto Capital",
      direccion: direccion,
      referencia: ref,
      codigo_postal: codigo_postal,
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
      return data?.new_direccion.id;
    } catch (err) {
      console.error("Error al postear la dirección: ", err);
      return null;
    }
  }
}

export default ClienteAPI.getInstance();
