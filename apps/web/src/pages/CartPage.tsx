import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../lib/format";

export function CartPage() {
  const { items, subtotalInCents, totalInCents, fetchCart, updateItem, removeItem, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Shopping cart</h1>
        <button onClick={clearCart} className="text-sm font-medium text-orange-600">Clear cart</button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-800">Your cart is empty</p>
          <Link to="/products" className="mt-4 inline-block rounded bg-orange-500 px-4 py-2 text-white">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <img src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"} alt={item.product.name} className="h-28 w-28 rounded-xl object-cover" />

                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.product.name}</h2>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateItem(item.id, item.quantity - 1)} className="rounded border px-2 py-1 text-sm">-</button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="rounded border px-2 py-1 text-sm">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <span className="text-lg font-bold text-slate-900">{formatCurrency((item.priceSnapshotInCents * item.quantity) / 100)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-sm text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotalInCents / 100)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹0</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹0</span></div>
              <div className="flex justify-between border-t pt-3 text-base font-bold text-slate-900"><span>Total</span><span>{formatCurrency(totalInCents / 100)}</span></div>
            </div>
            <Link to="/checkout" className="mt-6 block rounded-xl bg-orange-500 px-4 py-3 text-center font-semibold text-white hover:bg-orange-600">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
