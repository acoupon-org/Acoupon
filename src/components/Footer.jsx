import { Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            ACoupon helps shoppers discover coupons, deals and cashback from popular brands in India.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
            <ShieldCheck className="size-4 text-black" /> Offers are checked and updated regularly.
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Explore</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-500">
            <Link to="/coupons">Coupons</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/stores">Stores</Link>
            <Link to="/categories">Categories</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Company</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-500">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5">
        <div className="container-page flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ACoupon. All rights reserved.</span>
          <span className="inline-flex items-center gap-1"><Mail className="size-3.5" /> acoupon.org@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}
