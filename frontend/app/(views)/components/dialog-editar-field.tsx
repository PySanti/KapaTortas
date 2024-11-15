'use client';

import { useState } from 'react';
import { Button } from '@/app/(views)/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/(views)/components/ui/dialog';
import { Input } from '@/app/(views)/components/ui/input';
import ClienteAPI from '@/app/controladores/api/users/ClienteAPI';
import { useSession } from 'next-auth/react';

type DialogEditarProps = {
  title: string;
  field: string; // Field being edited
  initialValue: string; // Initial value for the input
  email: string; // Email to identify the user
  onClose: () => void; // Callback to close the modal
};

function getPlaceholderText(field: string): string {
  switch (field) {
    case 'name':
      return 'nuevo nombre';
    case 'password':
      return 'nueva contraseña';
    case 'phone_number':
      return 'nuevo número de teléfono';
    case 'email':
      return 'nuevo correo';
    default:
      return `${field}`;
  }
}

export function DialogEditar({ title, field, initialValue, email, onClose }: DialogEditarProps) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Set the correct fields and include 'null' for non-updated ones
      const payload = {
        email, // Always include the email
        new_nombre_completo: field === 'name' ? value : null, // Only update name if it's the field being edited
        new_email: field === 'email' ? value : null, // Only update email if it's the field being edited
        new_password: field === 'password' ? value : null, // Only update password if it's the field being edited
        new_numero_telefonico: field === 'phone_number' ? value : null, // Only update phone if it's the field being edited
        new_fecha_nacimiento: field === 'birth_date' ? value : null, // Only update birth date if it's the field being edited
      };

      // Send the updated profile data to the API
      const perfilActualizado = await ClienteAPI.actualizarInfoCliente(
        payload.email,
        payload.new_nombre_completo,
        payload.new_email,
        payload.new_password,
        payload.new_numero_telefonico,
        payload.new_fecha_nacimiento
      );

      update(); // Update session next auth
      console.log('Perfil actualizado:', perfilActualizado);
      onClose(); // Close modal after success
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-xs sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-terciary'>{title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Input
            id={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Ingrese su ${getPlaceholderText(field)}`}
          />
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
