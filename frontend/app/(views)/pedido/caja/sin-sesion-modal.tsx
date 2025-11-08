"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/(views)/components/ui/dialog";
import { Button, buttonVariants } from "@/app/(views)/components/ui/button";
import { Separator } from "@/app/(views)/components/ui/separator";
import { LogIn } from "lucide-react";
import { cn } from "@/app/controladores/lib/utils";

export default function SinSesionModal() {
  const router = useRouter();

  const handleVolver = () => {
    router.back();
  };

  return (
    <Dialog open={true} modal={true}>
      <DialogContent 
        className="sm:max-w-[450px] [&>button]:hidden py-6"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4 pb-2">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-terciary text-center">
              Sesión Requerida
            </DialogTitle>
          </div>
          <Separator />
          <DialogDescription className="text-base text-foreground text-center pt-2 px-2">
            Por favor inicia sesión para realizar un pedido
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-center pt-4"> 
          <Button 
            onClick={handleVolver} 
            variant="outline" 
            className="w-full sm:w-auto min-w-[120px]"
          >
            Regresar
          </Button>
          <Link 
            href="/login"
            className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto min-w-[120px]")}
          >
            Iniciar Sesión
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

