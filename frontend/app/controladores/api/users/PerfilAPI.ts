import { Perfil } from "@/app/models/Perfil";

// Tiene un singleton
class PerfilAPI {
  private static instance: PerfilAPI;

  private constructor() {}

  // Metodo para obtener la instancia
  public static getInstance(): PerfilAPI {
    if (!PerfilAPI.instance) {
      PerfilAPI.instance = new PerfilAPI();
    }
    return PerfilAPI.instance;
  }

  // Metodo para obtener el Perfil
  public async obtenerPerfil(email: string): Promise<Perfil | null> {
    try {
      const response = await fetch(
        `http://localhost:8000/api/perfiles/consultar/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        console.error("Error al consultar el perfil: ", response.statusText);
      }

      const data = await response.json();
      return data.cliente || data.perfil;
    } catch (err) {
      console.error("Error en la peticion de consultar perfil: ", err);
      return null;
    }
  }
}

export default PerfilAPI.getInstance();
