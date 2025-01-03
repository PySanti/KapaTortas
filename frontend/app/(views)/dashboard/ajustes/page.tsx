"use client";

import { useState } from "react";
import DashboardCard from "../../components/dashboard-card";
import DashboardContainer from "../../components/dashboard-container";
import { DashboardHeader } from "../../components/dashboard-header";
import { DialogEditar } from "../../components/dialog-editar-field";
import getCurrentUser from "@/app/controladores/utilities/get-current-user";
import DeleteProfileDialog from "../../components/dialog-eliminar-perfil";
import { Rol } from "@/app/models/RolEnum";

interface CardActions {
  edit?: {
    label: string;
    onClick?: () => void;
  };
  delete?: {
    onClick?: () => void;
  };
}

export default function AjustesPage() {
  const user = getCurrentUser();
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const closeEditModal = () => {
    setEditingField(null);
  };

  // Helper para retornar un label amigable
  const getFieldLabel = (field: string) => {
    switch (field) {
      case "name":
        return "Nombre Completo";
      case "password":
        return "Contraseña";
      case "phone_number":
        return "Número de Teléfono";
      default:
        return field;
    }
  };

  return (
    <DashboardContainer>
      {user && user.rol === Rol.CLIENTE ? (
        <>
          <DashboardHeader heading="Datos Personales" />
          <DashboardCard
            title="Nombre completo"
            useEditDialog={true}
            handleClick={() => handleEdit("name")}
          >
            <p>{user.name}</p>
          </DashboardCard>
          <DashboardCard
            title="Contraseña"
            handleClick={() => handleEdit("password")}
            useEditDialog={true}
          >
            <p>********</p>
          </DashboardCard>
          <DashboardCard
            title="Número de Teléfono"
            handleClick={() => handleEdit("phone_number")}
            useEditDialog={true}
          >
            <p>{user.phone_number}</p>
          </DashboardCard>
          <DeleteProfileDialog user={{ email: user?.email }} />
        </>
      ) : (
        <DashboardHeader heading="No estás autorizado para ver esta página" />
      )}
      {editingField && (
        <DialogEditar
          title={`Editar ${getFieldLabel(editingField)}`}
          email={user?.email!}
          field={editingField}
          initialValue={editingField in user! ? user![editingField as keyof typeof user] : ""}
          onClose={closeEditModal}
        />
      )}
    </DashboardContainer>
  );
}
