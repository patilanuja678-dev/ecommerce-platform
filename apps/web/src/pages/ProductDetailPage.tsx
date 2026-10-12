import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "../lib/format";
import { api } from "../lib/api";

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/products/slug/${slug}`);
        setProduct(response.data);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      load();
    }
  }, [slug]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (!product) {
    return <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Product not found</div>;
  }

  const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";
  const price = product.priceInCents / 100;
  const compareAt = product.compareAtPriceInCents ? product.compareAtPriceInCents / 100 : null;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-slate-800">Products</Link>
          <span>/</span>
          <span className="text-slate-700">{product.name}</span>
        </div>
      </nav>

      <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:grid-cols-2">
        <div>
          <img src={imageUrl} alt={product.name} className="h-[520px] w-full rounded-xl object-cover" />
        </div>

        <div className="space-y-5">
          <div className="text-sm uppercase tracking-wide text-orange-600">{product.category?.name || "Category"}</div>
          <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-amber-500">★</span>
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span>({product.ratingCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatCurrency(price)}</span>
            {compareAt && <span className="text-lg text-slate-400 line-through">{formatCurrency(compareAt)}</span>}
          </div>

          <p className="text-slate-700">{product.shortDescription || product.description}</p>

          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
              Add to cart
            </button>
            <button className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:border-slate-400">
              Buy now
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Availability</span>
              <span className={product.inStock ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Description</h2>
        <p className="mt-4 text-slate-700">{product.description}</p>
      </div>
    </div>
  );
}
