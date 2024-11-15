'use client';

import { useState } from 'react';
import DashboardCard from '../../components/dashboard-card';
import DashboardContainer from '../../components/dashboard-container';
import { DashboardHeader } from '../../components/dashboard-header';
import { DialogEditar } from '../../components/dialog-editar-field';
import getCurrentUser from '@/app/controladores/utilities/get-current-user';

export default function AjustesPage() {
  const user = getCurrentUser();
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const closeEditModal = () => {
    setEditingField(null);
  };

  return (
    <DashboardContainer>
      <DashboardHeader heading='Datos Personales' />
      {user && (
        <>
          <DashboardCard title='Información Personal' editable onEdit={() => handleEdit('name')}>
            <p>{user.name}</p>
          </DashboardCard>
          <DashboardCard title='Correo' editable onEdit={() => handleEdit('email')}>
            <p>{user.email}</p>
          </DashboardCard>
          <DashboardCard title='Contraseña' editable onEdit={() => handleEdit('password')}>
            <p>********</p>
          </DashboardCard>
          <DashboardCard
            title='Número de Teléfono'
            editable
            onEdit={() => handleEdit('phone_number')}
          >
            <p>{user.phone_number}</p>
          </DashboardCard>
          {/* <DashboardCard title='Fecha de Nacimiento' editable onEdit={() => handleEdit('phone_number')}>
            <p>{user.phone_number}</p>
          </DashboardCard> */}
        </>
      )}
      {editingField && (
        <DialogEditar
          title={`Editar ${editingField === 'name' ? 'Información Personal' : editingField}`}
          email={user?.email!}
          field={editingField}
          initialValue={editingField in user! ? user![editingField as keyof typeof user] : ''}
          onClose={closeEditModal}
        />
      )}
    </DashboardContainer>
  );
}
