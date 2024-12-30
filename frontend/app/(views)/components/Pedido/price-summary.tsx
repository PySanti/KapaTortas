"use client";

type PriceSummaryProps = {
  subtotal: number;
  iva: number;
  total: number;
  deliveryPrice: number;
};

export default function PriceSummary({
  subtotal,
  iva,
  total,
  deliveryPrice,
}: PriceSummaryProps) {
  return (
    <dl className="space-y-6 border-t border-secondary-light border-opacity-10 pt-6  font-medium text-secondary-light text-base">
      <div className="flex items-center justify-between">
        <dt>Subtotal</dt>
        <dd>${subtotal}</dd>
      </div>

      <div className="flex items-center justify-between">
        <dt>Delivery</dt>
        <dt>${deliveryPrice}</dt>
      </div>

      <div className="flex items-center justify-between">
        <dt>IVA</dt>
        <dd>${iva}</dd>
      </div>

      <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-secondary-light">
        <dt className="text-base">Total</dt>
        <dd className="text-base">${total}</dd>
      </div>
    </dl>
  );
}
