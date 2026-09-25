import { ArrowUpRight, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import OfferVisual from "./OfferVisual";

export default function StoreCard({ store }) {
  const href = `/store/${store.slug || store.name?.toLowerCase().replaceAll(" ", "-")}`;
  const image = store.image || store.banner || store.imageUrl || "";
  return (
    <Link to={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <div className="relative h-32">
        <OfferVisual name={store.name} image={image} href={store.url} type="store" className="h-full w-full" />
        <div className="absolute left-4 bottom-[-20px]"><BrandLogo name={store.name} src={store.logoUrl || (typeof store.logo === "string" && store.logo.startsWith("http") ? store.logo : undefined)} /></div>
        <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-xl bg-white/90 text-slate-900 shadow-sm backdrop-blur"><ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" /></div>
      </div>
      <div className="p-4 pt-7">
        <h3 className="font-bold text-slate-950">{store.name}</h3>
        <p className="mt-1 text-xs text-slate-500">{store.category || "Shopping"}</p>
        {store.cashbackRate ? <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white"><Percent className="size-3.5" /> Up to {store.cashbackRate}% cashback</div> : <div className="mt-4 inline-flex rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700">View offers</div>}
      </div>
    </Link>
  );
}
