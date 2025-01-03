import { z } from "zod";

export const DireccionEnvioSchema = z.object({
    id: z.number().optional(),
    correo_cliente: z.string().email({ message: "Por favor, ingresa un correo electrónico válido" }).optional(),
    pais: z.string().min(3, { message: "Por favor, ingresa un país válido" }).default("VENEZUELA").optional(),
    ciudad: z.string().min(3, { message: "Por favor, ingresa una ciudad válida" }),
    estado: z.string().min(3, { message: "Por favor, ingresa un estado válido" }),
    direccion: z.string().min(3, { message: "Por favor, ingresa una dirección válida" }),
    referencia: z.string().min(3, { message: "Por favor, ingresa una referencia válida" }),
    codigo_postal: z.preprocess(
        (value) => (value === '' ? undefined : Number(value)),
        z.number({
            required_error: "Por favor, ingresa un código postal válido",
            invalid_type_error: "Por favor, ingresa un código postal válido"
        })
        .min(3, { message: "Por favor, ingresa un código postal válido" })
    )
});

export type DireccionEnvioType = z.infer<typeof DireccionEnvioSchema>;

// EditarDireccionEnvioSchema, HAS THE same fields as DireccionEnvioSchema but they're nullable
export const EditarDireccionEnvioSchema = z.object({
    pais: z.string().min(3, { message: "Por favor, ingresa un país válido" }).nullable(),
    ciudad: z.string().min(3, { message: "Por favor, ingresa una ciudad válida" }).nullable(),
    estado: z.string().min(3, { message: "Por favor, ingresa un estado válido" }).nullable(),
    direccion: z.string().min(3, { message: "Por favor, ingresa una dirección válida" }).nullable(),
    referencia: z.string().min(3, { message: "Por favor, ingresa una referencia válida" }).nullable(),
    codigo_postal: z.coerce.number().min(3, { message: "Por favor, ingresa un código postal válido" }).nullable()
});

export type EditarDireccionEnvioType = z.infer<typeof EditarDireccionEnvioSchema>;
