import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/(views)/components/ui/form";  
import { Input } from "@/app/(views)/components/ui/input";  
import { UseFormReturn } from "react-hook-form";  
import { z } from "zod";  

type FormSchema = z.infer<typeof formSchema>;  

interface UsernameFieldProps {  
    form: UseFormReturn<FormSchema>; 
}  

const UsernameField: React.FC<UsernameFieldProps> = ({ form }) => {  
    return (  
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
    );  
};  

export default UsernameField;  