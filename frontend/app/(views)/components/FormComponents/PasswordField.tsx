import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/(views)/components/ui/form";  
import { Input } from "@/app/(views)/components/ui/input";  
import { UseFormReturn } from "react-hook-form";  
import { z } from "zod"; 
import {useState} from "react"

type FormSchema = z.infer<typeof formSchema>;  

interface PasswordFieldProps {  
    form: UseFormReturn<FormSchema>; 
}  

const PasswordField: React.FC<PasswordFieldProps> = ({ form }) => {  
    const [showPassword, setShowPassword] = useState(false);  
    return (  
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
            </FormItem>  )}  />  
    );  
};  

export default PasswordField;  