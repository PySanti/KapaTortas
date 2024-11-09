import { Cliente } from "@/app/models/Cliente";

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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error en la peticion de consultar cliente: ", err);
      return null;
    }
  }
}

export default ClienteAPI.getInstance();