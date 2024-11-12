import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/app/(views)/components/ui/form";  
import { Input } from "@/app/(views)/components/ui/input";  
import { UseFormReturn } from "react-hook-form";  
import { z } from "zod";  

type FormSchema = z.infer<typeof formSchema>;  

interface EmailFieldProps {  
    form: UseFormReturn<FormSchema>; 
}  

const EmailField: React.FC<EmailFieldProps> = ({ form }) => {  
    return (  
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
    );  
};  

export default EmailField;  