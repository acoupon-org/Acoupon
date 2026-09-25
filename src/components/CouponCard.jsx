import { CheckCircle2, Copy, ExternalLink, Tag } from "lucide-react";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import OfferVisual from "./OfferVisual";

export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);
  const store = typeof (coupon.store || coupon.merchant || coupon.storeName) === "object" ? ((coupon.store || coupon.merchant || coupon.storeName)?.domain || "Store") : (coupon.store || coupon.merchant || coupon.storeName || "Store");
  const offerUrl = coupon.url || coupon.affiliateLink || coupon.link || "#";
  const imageUrl = coupon.image || coupon.imageUrl || coupon.banner || coupon.thumbnail || coupon.logo || "";
  async function copy() { if (coupon.code) { try { await navigator.clipboard?.writeText(coupon.code); } catch {} } setCopied(true); setTimeout(() => setCopied(false), 1600); }

  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative h-44 overflow-hidden border-b border-slate-200 bg-slate-100"><OfferVisual name={store} image={imageUrl} href={offerUrl} type="offer" className="h-full w-full" />
      <div className="absolute left-4 top-4 rounded-xl bg-white p-1 shadow-md"><BrandLogo name={store} src={coupon.logo || coupon.storeLogo || coupon.merchantLogo} size="md" /></div>
      {coupon.hot && <div className="absolute right-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">Hot</div>}
    </div>
    <div className="p-5">
      <div className="flex items-start gap-3"><BrandLogo name={store} src={coupon.logo || coupon.storeLogo || coupon.merchantLogo} size="sm" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="text-xs font-black uppercase tracking-wider text-slate-500">{store}</div>{coupon.verified && <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-label="Verified coupon" />}</div><h3 className="mt-1 text-lg font-extrabold leading-6 text-slate-950">{coupon.title || coupon.name || "Latest offer"}</h3></div></div>
      <div className="mt-4 rounded-xl bg-slate-950 p-4 text-white"><div className="text-xl font-black">{coupon.discount || coupon.offer || "Special offer"}</div>{coupon.expires && <div className="mt-1 text-xs text-white/60">Expires {coupon.expires}</div>}</div>
      <div className="mt-4 flex gap-2">{coupon.code ? <button onClick={copy} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">{copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}{copied ? "Copied" : coupon.code}</button> : <a href={offerUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">Get offer</a>}<a href={offerUrl} target="_blank" rel="noopener noreferrer" className="grid size-12 place-items-center rounded-xl border border-slate-300 hover:bg-slate-50" aria-label={`Open ${store} offer`}><ExternalLink className="size-4" /></a></div>
      <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>{coupon.source || "ACoupon"}</span>{offerUrl !== "#" && <span className="inline-flex items-center gap-1 text-slate-700"><Tag className="size-3" /> Direct link</span>}</div>
    </div>
  </article>;
}
