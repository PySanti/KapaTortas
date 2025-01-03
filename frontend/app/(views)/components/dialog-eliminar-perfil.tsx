"use client";

import { useState } from "react";
import { Button } from "@/app/(views)/components/ui/button";
import { Input } from "@/app/(views)/components/ui/input";
import { Label } from "@/app/(views)/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { User } from "next-auth";
import passwordsMatch from "@/app/controladores/utilities/passwords-match";
import ClienteAPI from "@/app/controladores/api/cliente-api";
import { signOut } from "next-auth/react";

interface DeleteProfileDialogProps {
  user: Pick<User, "email">;
}

export default function DeleteProfileDialog({ user }: DeleteProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDeleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    const isPasswordValid = await passwordsMatch(user.email!, password);

    if (!isPasswordValid) {
      setError("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
      setIsLoading(false);
    } else {
      // Llama al endpoint de liminación del perfil
      const perfilEliminado = await ClienteAPI.eliminarPerfil(user.email!);
      setIsOpen(false);

      if (perfilEliminado) {
        setIsLoading(false);
        // console.log("Perfil eliminado con éxito");
        signOut({
          callbackUrl: `${window.location.origin}/login`,
        });
      } else {
        console.error("Error al eliminar el perfil");
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setPassword("");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Eliminar Perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Eliminar Perfil</DialogTitle>
          <DialogDescription>
            ¿Deseas eliminar tu perfil? Ingresa tu contraseña para confirmar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeleteProfile}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} variant="destructive">
              {isLoading ? "Eliminando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
