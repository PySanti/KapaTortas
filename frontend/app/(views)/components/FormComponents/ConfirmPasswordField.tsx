import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/(views)/components/ui/form";  
import { Input } from "@/app/(views)/components/ui/input";  
import { UseFormReturn } from "react-hook-form";  
import { z } from "zod"; 
import {useState} from "react"

type FormSchema = z.infer<typeof formSchema>;  

interface ConfirmPasswordFieldProps {  
    form: UseFormReturn<FormSchema>; 
}  

const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({ form }) => {  
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
    return (  
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
        );  
};  

export default ConfirmPasswordField;  