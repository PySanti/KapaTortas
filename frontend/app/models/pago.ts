export interface Pago {
  fecha: string;
  hora: string;
  referencia: number;
  monto: number;
  datos_pago: PagoMovilRef | ZelleRef;
}

export interface PagoMovilRef {
    has_pago_recibido: boolean;
    referencia: number;
    monto_transferido: number;
    fecha: string;
    hora: string;
}

export interface ZelleRef {
    sender_name: string;
    amount: number;
    fecha: string | null;
    hora: string | null;
}
