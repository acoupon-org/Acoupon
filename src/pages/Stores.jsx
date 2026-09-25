import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import StoreCard from "../components/StoreCard";
import { popularStores } from "../data/demo";
import { getStores } from "../services/api";

export default function Stores() {
  const [category, setCategory] = useState("Shopping");
  const [stores, setStores] = useState(popularStores);
  const [source, setSource] = useState("demo");

  useEffect(() => {
    getStores(category).then((r) => {
      if (Array.isArray(r.data) && r.data.length) {
        const mapped = r.data.map((s) => ({
          ...s,
          name: s.name || s.title,
          slug: s.slug || s.name?.toLowerCase().replaceAll(" ", "-"),
          cashbackRate: s.cashbackRate ?? s.cashback?.rate
        }));
        setStores(mapped);
        setSource(r.source);
      }
    }).catch(() => setSource("demo"));
  }, [category]);

  return (
    <div className="container-page py-10">
      <SectionHeader eyebrow="Discover merchants" title="Popular Stores" description={`Showing up to 25 stores, sorted by cashback for ${category}.`} />
      <div className="mb-7 flex flex-wrap gap-2">
        {["Shopping", "Fashion", "Beauty", "Electronics", "Health", "Grocery", "Travel", "Sports"].map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-black text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-black"}`}>{item}</button>
        ))}
      </div>
      <div className="mb-5 text-xs font-semibold text-slate-400">Data source: {source}</div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stores.map((store, index) => <StoreCard key={`${store.slug}-${index}`} store={store} />)}
      </div>
    </div>
  );
}
