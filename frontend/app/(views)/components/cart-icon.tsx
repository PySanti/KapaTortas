"use client";

import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";
import { usePedidoStore } from "@/src/usePedidoStore";
import Link from "next/link";

export function CartIcon() {
  const quantity = usePedidoStore((state) => state.quantity);

  useEffect(() => {
    usePedidoStore.persist.rehydrate();
  }, []);

  return (
    <Link href="/pedido/caja">
      <div className="relative cursor-pointer">
        <ShoppingCart className="h-6 w-6" />
        {quantity > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {quantity}
          </Badge>
        )}
      </div>
    </Link>
  );
}
