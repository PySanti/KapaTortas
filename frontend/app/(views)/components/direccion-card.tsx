"use client";

import { useState } from "react";
import DashboardCard from "./dashboard-card";
import DialogEditarDireccion from "./dialog-editar-direccion-envio";
import { deleteDireccion } from "@/app/controladores/actions/delete-direccion";
import { DireccionEntrega } from "@/app/models/Pedido";

type DireccionCardProps = {
  direccion: DireccionEntrega;
  userName: string;
  email: string;
};

export default function DireccionCard({
  direccion,
  userName,
  email,
}: DireccionCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DashboardCard
        badge={direccion.is_favorite ? "Dirección de envío preferida" : undefined}
        idElement={direccion.id}
        actions={{
          edit: {
            label: "Editar",
            action: async () => {
              setIsEditDialogOpen(true);
            },
          },
          delete: {
            action: deleteDireccion,
          },
        }}
      >
        <p>{userName}</p>
        <p>
          {direccion.direccion}
          {direccion.referencia && `, ${direccion.referencia}`}
        </p>
      </DashboardCard>
      <DialogEditarDireccion
        email={email}
        direccion={direccion}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
    </>
  );
}

