import { Venta } from "./venta";

export interface Factura {
  id: number;
  fecha_emision_factura: string;
  domicilio_fiscal: string;
  numero_telefonico_empresa: string;
  rif_empresa: string;
  venta_asociada: Venta;
}
