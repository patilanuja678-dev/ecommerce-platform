import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, total, fetchProducts } = useProductStore();

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "featured";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    fetchProducts({
      query: query || undefined,
      category: category || undefined,
      sort,
      page,
      limit: 12,
    });
  }, [category, fetchProducts, page, query, sort]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Featured products</h1>
            <p className="mt-1 text-sm text-slate-600">{total} results found</p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set("query", e.target.value);
                else next.delete("query");
                next.set("page", "1");
                setSearchParams(next);
              }}
              placeholder="Search products"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />

            <select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                next.set("sort", e.target.value);
                next.set("page", "1");
                setSearchParams(next);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(page - 1));
              setSearchParams(next);
            }
          }}
          className={page <= 1 ? "pointer-events-none text-slate-300" : "text-slate-700"}
        >
          Previous
        </Link>

        <span className="text-sm text-slate-600">Page {page}</span>

        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            const next = new URLSearchParams(searchParams);
            next.set("page", String(page + 1));
            setSearchParams(next);
          }}
          className="text-slate-700"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
