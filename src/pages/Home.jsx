import { ArrowRight, CheckCircle2, Flame, RefreshCw, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import StoreCard from "../components/StoreCard";
import CouponCard from "../components/CouponCard";
import SectionHeader from "../components/SectionHeader";
import CategoryIcon from "../components/CategoryIcon";
import { categories, dailyUse } from "../data/categories";
import { demoCoupons, popularStores } from "../data/demo";
import { getCoupons, getProviderStatus, getStores } from "../services/api";
import TravelQuickCard from "../components/TravelQuickCard";

export default function Home() {
  const [coupons, setCoupons] = useState(demoCoupons);
  const [stores, setStores] = useState(popularStores);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [couponResult, storeResult, providerResult] = await Promise.allSettled([getCoupons(), getStores("Shopping"), getProviderStatus()]);
    if (couponResult.status === "fulfilled" && couponResult.value.data?.length) setCoupons(couponResult.value.data);
    if (storeResult.status === "fulfilled" && storeResult.value.data?.length) setStores(storeResult.value.data);
    if (providerResult.status === "fulfilled") setStatus(providerResult.value.status);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-32 -top-32 size-96 rounded-full border-[60px] border-slate-100" />
        <div className="container-page relative py-16 md:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-sm">
              <Zap className="size-3.5" /> Live offers • India
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] text-slate-950 md:text-7xl">Save more. Shop smarter.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">One place for verified coupons, cashback, hotel deals, restaurant offers, travel savings and everyday discounts.</p>
            <div className="mx-auto mt-8 max-w-2xl"><SearchBar large /></div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500"><span>Popular:</span>{["Amazon", "Myntra", "Swiggy", "Hotels", "Travel"].map((x) => <Link key={x} to={`/search?q=${encodeURIComponent(x)}`} className="font-bold text-black underline-offset-4 hover:underline">{x}</Link>)}</div>
          </div>
        </div>
      </section>

      <TravelQuickCard />

      <section className="container-page py-10">
        <SectionHeader eyebrow="Everyday savings" title="Daily Use" description="Jump straight to the brands and services people use most." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dailyUse.map((item) => <Link key={item.name} to={item.href || `/category/${item.category}`} className="group rounded-2xl border-2 border-black bg-white p-5 transition hover:bg-black hover:text-white"><div className="flex items-start justify-between"><div className="grid size-12 place-items-center rounded-xl border border-black bg-white text-2xl group-hover:border-white">{item.icon}</div><ArrowRight className="size-5 transition group-hover:translate-x-1" /></div><h3 className="mt-4 font-extrabold">{item.name}</h3><p className="mt-2 text-xs leading-5 text-slate-500 group-hover:text-slate-300">{item.brands.join(" · ")}</p></Link>)}</div>
      </section>

      <section className="container-page py-6">
        <SectionHeader eyebrow="Live merchant data" title="Top Stores" description="Merchant data is refreshed through the connected offer and cashback providers." href="/stores" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{stores.slice(0, 8).map((store, i) => <StoreCard key={`${store.slug}-${i}`} store={store} />)}</div>
      </section>

      <section className="container-page py-8">
        <div className="rounded-3xl bg-black p-7 text-white md:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div><div className="inline-flex items-center gap-2 text-sm font-bold text-white"><Flame className="size-4" /> Live deal engine</div><h2 className="mt-2 text-3xl font-black">Coupons + cashback in one experience.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">ACoupon combines LinkMyDeals, CashJosh and your RapidAPI MCP providers, normalizes the data and keeps the customer-facing experience consistent.</p></div>
            <Link to="/coupons" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black">Explore coupons <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="container-page py-6">
        <div className="mb-5 flex items-center justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-slate-500">Fresh feed</div><h2 className="mt-1 text-3xl font-black">Latest Offers</h2></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{coupons.slice(0, 8).map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}</div>
      </section>

      <section className="container-page py-8"><SectionHeader eyebrow="Explore" title="Browse Categories" description="Find savings across fashion, electronics, food, hotels, travel and more." href="/categories" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{categories.map((category) => <CategoryIcon key={category.slug} category={category} />)}</div></section>

      <section className="container-page py-10"><div className="rounded-3xl border-2 border-black bg-white p-8 md:p-10"><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="size-4" /> Provider health</div><h2 className="mt-2 text-2xl font-black">Built around live feeds, not static listings.</h2><p className="mt-2 text-sm text-slate-500">CashJosh, LinkMyDeals and RapidAPI MCP providers are monitored by the ACoupon server.</p></div><div className="flex flex-wrap gap-2">{status && Object.entries(status).map(([key, value]) => <span key={key} className={`rounded-full border-2 border-black px-3 py-2 text-xs font-black uppercase ${value ? "bg-black text-white" : "bg-white text-black"}`}>{key}: {value ? "live" : "offline"}</span>)}</div></div></div></section>
    </>
  );
}
