import { Button } from "@/app/(views)/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(views)/components/ui/dialog";
import FormAgregarDireccionEnvio from "@/app/(views)/components/form-agregar-direccion-envio";
import { Separator } from "@/app/(views)/components/ui/separator";

type DialogAgregarDireccionProps = {
  email: string;
};

export default function DialogAgregarDireccion({ email }: DialogAgregarDireccionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar Dirección</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader className="gap-y-2">
          <DialogTitle className="text-2xl text-terciary">Agregar nueva dirección</DialogTitle>
          <Separator />
        </DialogHeader>
        <FormAgregarDireccionEnvio email={email} />
        {/* <DialogFooter>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}