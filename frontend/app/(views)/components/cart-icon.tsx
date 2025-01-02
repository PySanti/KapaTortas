"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";
import { usePedidoStore } from "@/src/usePedidoStore";

export function CartIcon() {
  const { quantity } = usePedidoStore();

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {quantity > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {quantity}
        </Badge>
      )}
    </div>
  );
}
