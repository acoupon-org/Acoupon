import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { name: "Hotel", href: "/category/hotel", image: "https://cdn.simpleicons.org/oyo", note: "Deals" },
  { name: "Restaurant", href: "/category/restaurant", image: "https://cdn.simpleicons.org/zomato", note: "Offers" },
  { name: "OYO", href: "https://www.oyorooms.com/", image: "https://cdn.simpleicons.org/oyo", note: "Hotels", external: true },
  { name: "Cab", href: "/category/cab", image: "https://cdn.simpleicons.org/uber", note: "Coupons" },
  { name: "OLA", href: "https://book.olacabs.com/", image: "https://cdn.simpleicons.org/ola", note: "Cabs", external: true },
  { name: "Uber", href: "https://www.uber.com/in/en/", image: "https://cdn.simpleicons.org/uber", note: "Rides", external: true },
  { name: "Rapido", href: "https://www.rapido.bike/", image: "https://cdn.simpleicons.org/rapido", note: "Bike taxi", external: true },
  { name: "Shopping", href: "/category/shopping", image: "https://cdn.simpleicons.org/amazon", note: "Deals" },
  { name: "Recharge", href: "/category/recharge-bills", image: "https://cdn.simpleicons.org/paytm", note: "Save more" },
];

export default function QuickAccessBar() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-page py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const className = "group flex min-w-[108px] shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-black hover:bg-black hover:text-white";
            const content = <><img src={item.image} alt="" className="size-8 rounded-lg border border-slate-200 bg-white object-contain p-1" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /><span className="min-w-0"><span className="block truncate text-xs font-black">{item.name}</span><span className="block text-[10px] text-slate-500 group-hover:text-slate-300">{item.note}</span></span>{item.external && <ExternalLink className="ml-auto size-3 shrink-0" />}</>;
            return item.external ? <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a> : <Link key={item.name} to={item.href} className={className}>{content}</Link>;
          })}
        </div>
      </div>
    </section>
  );
}
