"use client"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import {useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"







export default function RegistroClienteForm() {
    const [showPassword, setShowPassword] = useState(false);  
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
    const formSchema = z.object({  
        username: z.string()  
            .min(5, { message: "El nombre completo debe contener al menos 5 caracteres." })  
            .regex(/^[^0-9]+$/, { message: "Nombre completo no puede contener números." }),
        email: z.string()  
            .email({ message: "Debes ingresar un email válido." }),
        password: z.string()  
            .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
        confirmPassword: z.string()  
            .min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres." })  
            .superRefine((val, ctx) => {  
                if (val !== form.watch("password")) {  
                    ctx.addIssue({  
                        code: z.ZodIssueCode.custom,  
                        message: "Las contraseñas no coinciden",  
                    });  
                }  
            }), 
    });  
    const form = useForm<z.infer<typeof formSchema>>({  
        resolver: zodResolver(formSchema),  
        defaultValues: {  
            username: "",  
            email: "",  
            password: "",  
            confirmPassword: "",  
        },  
    });  
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (  
        <Form {...form}>  
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">  
                <FormField  
                    control={form.control}  
                    name="username"  
                    render={({ field }) => (  
                        <FormItem>  
                            <FormLabel>Nombre Completo</FormLabel>  
                            <FormControl>  
                                <Input placeholder="Tu nombre completo" {...field} />  
                            </FormControl>  
                            <FormMessage />  
                        </FormItem>  
                    )}  
                />  
                
                <FormField  
                    control={form.control}  
                    name="email"  
                    render={({ field }) => (  
                        <FormItem>  
                            <FormLabel>Email</FormLabel>  
                            <FormControl>  
                                <Input placeholder="tu-email@ejemplo.com" {...field} />  
                            </FormControl>  
                            <FormMessage />  
                        </FormItem>  
                    )}  
                />  
                <FormField  
                    control={form.control}  
                    name="password"  
                    render={({ field }) => (  
                    <FormItem>  
                    <FormLabel>Contraseña</FormLabel>  
                    <FormControl>  
                        <div className="relative">  
                        <Input  
                            type={showPassword ? "text" : "password"}  
                            placeholder="Tu contraseña"  
                            {...field}  
                        />  
                        <button  
                            type="button"  
                            onClick={() => setShowPassword((prev) => !prev)}  
                            className="absolute inset-y-0 right-0 flex items-center pr-3"  
                        >  
                            {showPassword ? "Ocultar" : "Mostrar"}  
                        </button>  
                        </div>  
                    </FormControl>  
                    <FormMessage />  
                    </FormItem>  
                )}  
            />  

                <FormField  
                    control={form.control}  
                    name="confirmPassword"  
                    render={({ field }) => (  
                        <FormItem>  
                          <FormLabel>Confirmar Contraseña</FormLabel>  
                          <FormControl>  
                            <div className="relative">  
                              <Input  
                                type={showConfirmPassword ? "text" : "password"}  
                                placeholder="Confirma tu contraseña"  
                                {...field}  
                              />  
                              <button  
                                type="button"  
                                onClick={() => setShowConfirmPassword((prev) => !prev)}  
                                className="absolute inset-y-0 right-0 flex items-center pr-3"  
                              >  
                                {showConfirmPassword ? "Ocultar" : "Mostrar"}  
                              </button>  
                            </div>  
                          </FormControl>  
                          <FormMessage />  
                        </FormItem>  
                    )}  
                /> 
                <Button type="submit">Enviar</Button>  
            </form>  
        </Form>  

    )
}

