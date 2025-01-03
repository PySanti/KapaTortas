'use client'

import { Button } from '@/app/(views)/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/(views)/components/ui/dialog"
import { useState } from 'react';

interface CardClientActionsProps {
  idElement: number;
  actions: {
    edit?: {
      label: string;
      action?: (id: number) => Promise<void>;
    };
    delete?: {
      action?: (id: number) => Promise<void>;
    };
  };
  useEditDialog?: boolean;
}

export function CardClientActions({ idElement, actions, useEditDialog = false }: CardClientActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = async () => {
    if (actions.edit?.action) {
      try {
        await actions.edit.action(idElement);
      } finally {
        setDialogOpen(false);
      }
    } 
  };

  const handleDelete = async () => {
    if (actions.delete?.action) {
      try {
        await actions.delete.action(idElement);
      } finally {
        setDialogOpen(false);
      }
    }
  };

  return (
    <>
      {actions.edit && (
        <>
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>

          {!useEditDialog && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de querer modificar este elemento?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleEdit}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
      
      {actions.delete && (
        <Button 
          variant="outline" 
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}