import { CheckCircle2, ExternalLink, Percent, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CouponCard from "../components/CouponCard";
import BrandLogo from "../components/BrandLogo";
import { getCashback, getCoupons } from "../services/api";
import { popularStores } from "../data/demo";

export default function Store() {
  const { slug } = useParams();
  const fallback = popularStores.find((s) => s.slug === slug) || { name: slug?.replaceAll("-", " "), category: "Shopping", logo: "AC", cashbackRate: 0, url: "#" };
  const [coupons, setCoupons] = useState([]);
  const [store, setStore] = useState(fallback);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const domain = fallback.url && fallback.url !== "#" ? (() => { try { return new URL(fallback.url).hostname; } catch { return ""; } })() : `${slug}.com`;
    const [couponResult, cashbackResult] = await Promise.allSettled([getCoupons({ store: slug }), getCashback(domain)]);
    if (couponResult.status === "fulfilled") {
      setCoupons((couponResult.value.data || []).slice(0, 25));
    }
    if (cashbackResult.status === "fulfilled" && cashbackResult.value.matched) {
      setStore((s) => ({ ...s, name: cashbackResult.value.name || s.name, cashbackRate: cashbackResult.value.cashback?.rate ?? s.cashbackRate, url: cashbackResult.value.shopUrl || s.url, logo: s.logo }));
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, [slug]);

  return <div className="container-page py-10">
    <Link to="/stores" className="text-sm font-bold underline underline-offset-4">← Back to stores</Link>
    <section className="mt-5 rounded-3xl border-2 border-black bg-white p-7 shadow-sm md:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <BrandLogo name={store.name} src={store.logoUrl || (typeof store.logo === "string" && store.logo.startsWith("http") ? store.logo : undefined)} size="lg" />
        <div className="flex-1"><div className="text-xs font-extrabold uppercase tracking-wider">{store.category}</div><h1 className="mt-1 text-3xl font-black capitalize">{store.name}</h1><p className="mt-2 text-sm text-slate-500">Live coupons, deals and cashback opportunities.</p></div>
        <div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1 rounded-xl bg-black px-3 py-2 text-sm font-bold text-white"><Percent className="size-4" /> {store.cashbackRate || 0}% cashback</span>{store.url && store.url !== "#" && <a href={store.url} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-xl border-2 border-black hover:bg-black hover:text-white"><ExternalLink className="size-4" /></a>}</div>
      </div>
    </section>
    <div className="mt-10 flex items-center justify-between gap-4"><div className="flex items-center gap-2"><CheckCircle2 className="size-5" /><h2 className="text-2xl font-black">Latest offers</h2></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></div>
    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{coupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}</div>
    {!coupons.length && !loading && <div className="mt-6 rounded-2xl border-2 border-black bg-white p-8 text-center text-sm text-slate-500">No matching live coupons were returned for this merchant right now.</div>}
  </div>;
}
