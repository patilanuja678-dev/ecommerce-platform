import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/format";

export type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDescription?: string | null;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    ratingAvg: number;
    ratingCount: number;
    inStock: boolean;
    images?: Array<{ url: string; altText?: string | null; isPrimary?: boolean }>;
    category?: { name?: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  const price = product.priceInCents / 100;
  const compareAt = product.compareAtPriceInCents ? product.compareAtPriceInCents / 100 : null;

  return (
    <Link to={`/products/${product.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-[4/4.5] overflow-hidden bg-slate-100">
        <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </div>

      <div className="space-y-3 p-4">
        <div className="text-xs uppercase tracking-wide text-orange-600">{product.category?.name || "Featured"}</div>
        <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold text-slate-800">{product.name}</h3>

        <div className="flex items-center gap-1 text-sm text-amber-500">
          <span>★</span>
          <span className="font-medium text-slate-700">{product.ratingAvg.toFixed(1)}</span>
          <span className="text-slate-500">({product.ratingCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">{formatCurrency(price)}</span>
          {compareAt && (
            <span className="text-sm text-slate-400 line-through">{formatCurrency(compareAt)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={product.inStock ? "text-emerald-600" : "text-red-600"}>
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
          <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">Save {compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0}%</span>
        </div>
      </div>
    </Link>
  );
}
