import { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CartPage } from "./CartPage";
import { WishlistPage } from "./WishlistPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">NovaCart</Link>
          <nav className="hidden gap-8 text-sm md:flex">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded border border-slate-700 px-3 py-2 text-sm font-medium text-white">Login</Link>
            <Link to="/register" className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">Register</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Product Catalog</div>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Login Page</div>} />
          <Route path="/register" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Register Page</div>} />
          <Route path="/checkout" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Checkout Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
  return <div className="rounded-2xl bg-white p-10 shadow-sm ring-1 ring-slate-200">Home</div>;
}
