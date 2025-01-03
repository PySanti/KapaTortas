"use client";

import { Button } from "@/app/(views)/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/(views)/components/ui/dialog";
import { useState } from "react";

interface CardClientActionsProps {
  idElement: number;
  actions: {
    edit?: {
      label: string;
      action?: (id: number) => Promise<void>;
      form?: React.ReactNode;
    };
    delete?: {
      action?: (id: number) => Promise<void>;
    };
  };
  handleClick?: () => void;
  useEditDialog?: boolean;
}

export function CardClientActions({
  idElement,
  actions,
  handleClick,
  useEditDialog,
}: CardClientActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = async () => {
    if (actions.edit?.action) {
      try {
        setEditDialogOpen(true);
        await actions.edit.action(idElement);
      } finally {
        setEditDialogOpen(false);
      }
    }
  };

  const handleDelete = async () => {
    if (actions.delete?.action) {
      try {
        setDeleteDialogOpen(true);
        await actions.delete.action(idElement);
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  return (
    <>
      {!useEditDialog && actions?.edit && (
        <>
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-terciary">Editar</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de querer modificar este elemento?
                </DialogDescription>
              </DialogHeader>
              {actions.edit.form}
              <div className="flex justify-end space-x-2">
                <Button variant={"terciary"} className="text-white" onClick={handleEdit}>
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {!useEditDialog && actions?.delete && (
        <>
          <Button variant="outline" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-terciary">Eliminar</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de querer eliminar este elemento?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant={"destructive"} onClick={handleDelete}>
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {useEditDialog && (
        <Button className="bg-white text-terciary hover:bg-gray-50 border-2" onClick={handleClick}>
          Editar
        </Button>
      )}
    </>
  );
}
