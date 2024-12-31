import { Producto } from "@/app/models/Producto";

class ProductoAPI {
  private static instance: ProductoAPI;

  private constructor() {}

  // Metodo para obtener la instancia
  public static getInstance(): ProductoAPI {
    if (!ProductoAPI.instance) {
      ProductoAPI.instance = new ProductoAPI();
    }
    return ProductoAPI.instance;
  }

  // Metodo para obtener el Producto
  // Cambiar T por Producto[]
  public async obtenerListaProductos(): Promise<Producto[] | null> {
    const url = `http://localhost:8000/api/productos/todos`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    return data.productos;
  }

  public async obtenerProducto(id: number): Promise<Producto | null> {
    const url = `http://localhost:8000/api/productos/${encodeURIComponent(id)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la base de datos: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      return data.producto;
    } catch (err) {
      console.error("Error en la petición del producto: ", err);
      return null;
    }
  }
}

export default ProductoAPI.getInstance();
