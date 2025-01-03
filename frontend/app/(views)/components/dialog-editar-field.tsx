"use client";

import { useState } from "react";
import { Button } from "@/app/(views)/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import { Input } from "@/app/(views)/components/ui/input";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import { useSession } from "next-auth/react";
import { ajustesClienteSchema } from "@/app/controladores/lib/validations/ajustes-cliente";
import { Eye, EyeOff } from "lucide-react";

type DialogEditarProps = {
  title: string;
  field: string; // Field being edited
  initialValue: string; // Initial value for the input
  email: string; // Email to identify the user
  onClose: () => void; // Callback to close the modal
};

function getPlaceholderText(field: string): string {
  switch (field) {
    case "name":
      return "nuevo nombre";
    case "password":
      return "nueva contraseña";
    case "phone_number":
      return "nuevo número de teléfono";
    default:
      return `${field}`;
  }
}

const getInputType = (field: string, showPassword: boolean): string => {
  if (field === "password") return showPassword ? "text" : "password";
  if (field === "phone_number") return "tel";
  return "text";
};

export function DialogEditar({ title, field, initialValue, email, onClose }: DialogEditarProps) {
  const [value, setValue] = useState(initialValue);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { update } = useSession();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Explicitly include all fields, setting non-relevant ones to `null`
    const payload = {
      email, // Always include email
      new_nombre_completo: field === "name" ? value : null,
      new_password: field === "password" ? value : null,
      new_numero_telefonico: field === "phone_number" ? value : null,
      new_fecha_nacimiento: field === "birth_date" ? value : null,
    };

    console.log("Prepared payload:", payload); // Debugging log

    // Validate the payload using Zod
    const validationResult = ajustesClienteSchema.safeParse(payload);

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.errors);

      // Show the first error
      const firstError = validationResult.error.errors[0];
      setError(firstError.message); // Display the error message
      setLoading(false);
      return;
    }

    try {
      // Send the updated profile data to the API
      const perfilActualizado = await ClienteAPI.actualizarInfoCliente(
        payload.email!,
        payload.new_nombre_completo,
        payload.new_password,
        payload.new_numero_telefonico,
        payload.new_fecha_nacimiento
      );

      update(); // Update session next-auth
      console.log("Perfil actualizado:", perfilActualizado);
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-terciary">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 relative">
          <Input
            id={field}
            value={value}
            type={getInputType(field, showPassword)} // Update input type dynamically
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Ingrese su ${getPlaceholderText(field)}`}
          />
          {field === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>} {/* Error message */}
        <DialogFooter>
          <Button
            type="submit"
            variant={"terciary"}
            className="text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
