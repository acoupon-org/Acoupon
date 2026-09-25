import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

const links = [
  ["Coupons", "/coupons"],
  ["Deals", "/deals"],
  ["Stores", "/stores"],
  ["Categories", "/categories"],
  ["Travel", "/category/travel"],
  ["Hotels", "/category/hotel"],
  ["Restaurants", "/category/restaurant"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-18 items-center gap-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "bg-slate-100 text-black" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden w-full max-w-sm md:block">
          <SearchBar />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto rounded-xl border border-slate-200 p-2.5 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 lg:hidden">
          <div className="container-page space-y-2">
            <SearchBar />
            {links.map(([label, href]) => (
              <Link key={href} onClick={() => setOpen(false)} to={href} className="block rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
