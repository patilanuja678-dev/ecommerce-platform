import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { formatCurrency } from "../lib/format";

export function WishlistPage() {
  const { items, fetchWishlist, removeItem } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Wishlist</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-800">No saved items yet</p>
          <Link to="/products" className="mt-4 inline-block rounded bg-orange-500 px-4 py-2 text-white">Browse products</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <img src={item.product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"} alt={item.product.name} className="h-52 w-full rounded-xl object-cover" />
              <div className="mt-4">
                <Link to={`/products/${item.product.slug}`} className="text-lg font-semibold text-slate-900">{item.product.name}</Link>
                <p className="mt-2 text-lg font-bold text-slate-900">{formatCurrency(item.product.priceInCents / 100)}</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="mt-4 text-sm text-red-600">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
