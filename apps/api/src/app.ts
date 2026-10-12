import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useAuthStore } from "./store/authStore";

export default function App() {
  const { user, isAuthenticated, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMe();
  }, [isAuthenticated, fetchMe]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            NovaCart
          </Link>

          <nav className="hidden gap-8 text-sm md:flex">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/checkout">Checkout</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-slate-200 md:inline">Hi, {user?.name}</span>
                <button
                  onClick={() => logout()}
                  className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded border border-slate-700 px-3 py-2 text-sm font-medium text-white">
                  Login
                </Link>
                <Link to="/register" className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Product Catalog</div>} />
          <Route path="/checkout" element={<div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">Checkout</div>} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-100">New arrival</p>
        <h1 className="mt-4 text-4xl font-black">Big tech, smarter living.</h1>
        <p className="mt-4 max-w-xl text-orange-50">
          Discover premium essentials, everyday favorites, and curated deals that make shopping easier.
        </p>
        <Link to="/products" className="mt-6 inline-block rounded bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
          Shop deals
        </Link>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Smartphones", price: "From ₹24,999" },
          { title: "Home Essentials", price: "Up to 40% off" },
          { title: "Accessories", price: "Trending picks" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.price}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
