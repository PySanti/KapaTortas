"use client"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Form} from "@/components/ui/form"
import UsernameField from "./FormComponents/UsernameField"
import EmailField from "./FormComponents/EmailField"
import PasswordField from "./FormComponents/PasswordField"
import ConfirmPasswordField from "./FormComponents/ConfirmPasswordField"







export default function RegistroClienteForm() {
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
                <UsernameField          form={form}/>
                <EmailField             form={form}/>
                <PasswordField          form={form}/>
                <ConfirmPasswordField   form={form}/>
                <Button type="submit">Enviar</Button>  
            </form>  
        </Form>  
    )
}

