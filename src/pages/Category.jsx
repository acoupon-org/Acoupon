import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import StoreCard from "../components/StoreCard";
import CouponCard from "../components/CouponCard";
import { categories } from "../data/categories";
import { popularStores } from "../data/demo";
import { getStores, getCoupons, getDeals } from "../services/api";

export default function Category() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug) || categories[0];
  const [stores, setStores] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [deals, setDeals] = useState([]);
  useEffect(() => {
    Promise.allSettled([
      getStores(category.apiCategory),
      getCoupons({ category: category.apiCategory }),
      getDeals({ category: category.apiCategory }),
    ]).then(([storeResult, couponResult, dealResult]) => {
      if (storeResult.status === "fulfilled") setStores((storeResult.value.data || []).slice(0, 25).map((s) => ({ ...s, name: s.name || s.title, slug: s.slug || s.name?.toLowerCase().replaceAll(" ", "-"), cashbackRate: s.cashbackRate ?? s.cashback?.rate })));
      if (couponResult.status === "fulfilled") setCoupons((couponResult.value.data || []).slice(0, 25));
      if (dealResult.status === "fulfilled") setDeals((dealResult.value.data || []).slice(0, 25));
    });
  }, [category.apiCategory]);

  return (
    <div className="container-page py-10">
      <Link to="/categories" className="text-sm font-bold text-black">← All categories</Link>
      <div className="mt-5 rounded-3xl bg-black p-7 text-white md:p-10">
        <div className="text-5xl">{category.icon}</div>
        <h1 className="mt-4 text-3xl font-black">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Find coupons, deals and popular stores across {category.name.toLowerCase()}.</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {category.subcategories.map((sub) => <span key={sub} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">{sub}</span>)}
      </div>
      <div className="mt-12">
        <SectionHeader eyebrow="Stores" title={`Popular ${category.name} stores`} />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stores.slice(0, 25).map((store, i) => <StoreCard key={`${store.slug}-${i}`} store={store} />)}
        </div>
      </div>
      <div className="mt-12">
        <SectionHeader eyebrow="Coupons" title={`${category.name} coupons`} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {coupons.slice(0, 25).map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}
        </div>
      </div>
      <div className="mt-12">
        <SectionHeader eyebrow="Deals" title={`${category.name} deals`} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deals.slice(0, 25).map((deal) => <CouponCard key={deal.id} coupon={deal} />)}
        </div>
      </div>
    </div>
  );
}
