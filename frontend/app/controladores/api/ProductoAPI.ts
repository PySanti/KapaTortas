import { Producto } from "@/app/models/Producto";

class ProductoAPI {
  private static instance: ProductoAPI;

  private constructor() {}

  // Singleton
  public static getInstance(): ProductoAPI {
    if (!ProductoAPI.instance) {
      ProductoAPI.instance = new ProductoAPI();
    }
    return ProductoAPI.instance;
  }

  // Metodo para obtener el Producto
  public async obtenerListaProductos(): Promise<Producto[] | null> {
    const url = `http://localhost:8000/api/productos/all_productos/`;

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

  // Obtener producto dado id
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
