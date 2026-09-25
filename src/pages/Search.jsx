import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { getCoupons, getStores } from "../services/api";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [stores, setStores] = useState([]); const [coupons, setCoupons] = useState([]);
  useEffect(() => { Promise.allSettled([getCoupons(q), getStores({ query: q })]).then(([c, s]) => { if (c.status === "fulfilled") setCoupons(c.value.data || []); if (s.status === "fulfilled") setStores(s.value.data || []); }); }, [q]);
  return <div className="container-page py-10"><div className="flex items-center gap-3"><SearchIcon className="size-6" /><h1 className="text-3xl font-black">Search results</h1></div><p className="mt-2 text-sm text-slate-500">Live results for “{q}”</p><section className="mt-10"><h2 className="text-xl font-black">Stores</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">{stores.length ? stores.slice(0, 25).map((s, i) => <Link key={`${s.slug}-${i}`} to={`/store/${s.slug}`} className="rounded-2xl border-2 border-black bg-white p-5 font-bold hover:bg-black hover:text-white">{s.name}</Link>) : <p className="text-sm text-slate-500">No live store matches found.</p>}</div></section><section className="mt-10"><h2 className="text-xl font-black">Coupons & Deals</h2><div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}</div></section></div>;
}
