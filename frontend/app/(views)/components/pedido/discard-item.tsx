import { CartItem } from "@/src/usePedidoStore";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

export default function DiscardItem({
  item,
  removeFromCart,
}: {
  item: CartItem;
  removeFromCart: (productId: string) => void;
}) {
  const handlerRemoveFromCart = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:self-end items-center py-2">
      <Button
        className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-300"
        onClick={handlerRemoveFromCart}
      >
        <XIcon />
      </Button>
    </div>
  );
}
