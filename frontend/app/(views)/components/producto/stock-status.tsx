import { CircleX, CheckIcon } from "lucide-react";

export default function StockStatus({ stock }: { stock: number | undefined }) {
  if (stock && stock > 0) {
    return (
      <div className="flex items-center mt-4">
        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
        <p className="ml-2 text-sm text-terciary opacity-80">Disponible</p>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <CircleX className="h-5 w-5 flex-shrink-0 text-red-500" />
      <p className="ml-2 text-sm text-terciary opacity-80">
        No está Disponible
      </p>
    </div>
  );
}
