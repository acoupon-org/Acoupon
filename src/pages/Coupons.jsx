import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import CouponCard from "../components/CouponCard";
import SectionHeader from "../components/SectionHeader";
import { demoCoupons } from "../data/demo";
import { getCoupons } from "../services/api";

export default function Coupons() {
  const [coupons, setCoupons] = useState(demoCoupons);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("live aggregate");
  async function load() { setLoading(true); try { const r = await getCoupons(); if (r.data?.length) setCoupons(r.data); setSource(r.source || "live"); } catch {} finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  return <div className="container-page py-10"><div className="flex items-end justify-between gap-4"><SectionHeader eyebrow="Live savings" title="Coupons" description="Up to 25 normalized offers from the connected live providers." /><button onClick={load} className="mb-5 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></div><div className="mb-6 flex flex-wrap gap-2"><span className="rounded-full bg-black px-4 py-2 text-xs font-black text-white">{source}</span><span className="rounded-full border border-black bg-white px-4 py-2 text-xs font-black">Max 25</span></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{coupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}</div></div>;
}
