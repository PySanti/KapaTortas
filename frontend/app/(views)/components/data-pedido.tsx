"use-client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

//   Esquema
// Define Zod schema for validation with min(1) instead of nonempty()
const direccionSchema = z.object({
    direccion: z.string().min(1, "La dirección es requerida"),
    referencia: z.string().optional(), // Reference can be optional
    codigo_postal: z.number()
      .int()
      .positive("El código postal es requerido")
      .min(1000, "Código postal inválido")
      .max(99999, "Código postal inválido"),
  });
  

// Direccion
type DireccionFormData = z.infer<typeof direccionSchema>;

export default function DataPedido({ perfilDir = "" }: { perfilDir: string }) {

    const { register, handleSubmit, formState: { errors } } = useForm<DireccionFormData>({
        resolver: zodResolver(direccionSchema),
        defaultValues: {},
      });

    const onSubmit = (data: DireccionFormData) => {
        console.log(data);
    }
    
    // return (
        
    // )

}