import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { CartItem } from "@/src/usePedidoStore";
import { useState } from "react";

export default function QuantityCard({
  item,
  updateCartItem,
}: {
  item: CartItem;
  updateCartItem: (productId: number, quantity: number) => void;
}) {
  const [advice, setAdvice] = useState<string>("");

  const handleQuantity = (type: string) => {
    setAdvice("");
    return updateCartItem(
      item.product.id,
      type === "minus" ? item.quantity - 1 : item.quantity + 1,
    );
  };

  const handleMinus = () => {
    if (item.quantity > 1) {
      return handleQuantity("minus");
    }
    return setAdvice("Si quieres descartar el producto presiona la X");
  };

  return (
    <div className="flex flex-col sm:self-center items-center">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 bg-terciary-muted rounded-lg p-2">
          <Button
            size="sm"
            className="h-8 w-8 rounded-full bg-white hover:bg-white"
            onClick={handleMinus}
          >
            <Minus className="h-4 w-4 bg-white text-terciary" />
          </Button>

          <span className="w-12 text-center font-bold text-white">
            {item.quantity}
          </span>

          <Button
            size="sm"
            className="h-8 w-8 rounded-full bg-white hover:bg-white"
            onClick={() => handleQuantity("plus")}
          >
            <Plus className="h-4 w-4 bg-white text-terciary" />
          </Button>
        </div>
      </div>
      {advice !== "" && (
        <span className="mt-2 py-2 text-red-400 font-bold bg-white p-2 rounded-lg">
          {advice}
        </span>
      )}
    </div>
  );
}
