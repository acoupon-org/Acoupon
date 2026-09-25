import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import CouponCard from "../components/CouponCard";
import SectionHeader from "../components/SectionHeader";
import { demoCoupons } from "../data/demo";
import { getDeals } from "../services/api";

export default function Deals() {
  const [deals, setDeals] = useState(demoCoupons);
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); try { const r = await getDeals(); if (r.data?.length) setDeals(r.data); } catch {} finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  return <div className="container-page py-10"><div className="flex items-end justify-between gap-4"><SectionHeader eyebrow="Live feed" title="Today's Deals" description="Current deals, promo codes and savings normalized into one ACoupon feed." /><button onClick={load} className="mb-5 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{deals.map((deal) => <CouponCard key={deal.id} coupon={deal} />)}</div></div>;
}
