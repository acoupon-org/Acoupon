import { ArrowUpRight, Baby, Banknote, Bike, BookOpen, Car, CheckCircle2, Coffee, Cpu, Dog, Gift, GraduationCap, HeartPulse, Home, Laptop, Plane, ReceiptText, ShoppingBag, Sparkles, Ticket, Utensils, WalletCards, Watch } from "lucide-react";
import { Link } from "react-router-dom";

const icons = {
  hotel: Home, restaurant: Utensils, shopping: ShoppingBag, cab: Car, fashion: Watch, electronics: Cpu,
  "food-dining": Coffee, grocery: ShoppingBag, "recharge-bills": ReceiptText, transport: Bike, travel: Plane,
  beauty: Sparkles, "home-living": Home, health: HeartPulse, "software-services": Laptop, entertainment: Ticket,
  education: GraduationCap, "bank-payment": WalletCards, automotive: Car, "baby-kids": Baby, "pet-care": Dog,
  gifts: Gift, "local-deals": Banknote,
};

export default function CategoryIcon({ category }) {
  const Icon = icons[category.slug] || Sparkles;
  return (
    <Link to={`/category/${category.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-950 group-hover:text-white"><Icon className="size-5" strokeWidth={2.2} /></div>
        <ArrowUpRight className="size-4 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900" />
      </div>
      <div className="mt-4 text-sm font-bold text-slate-900">{category.name}</div>
      <div className="mt-1 text-[11px] font-semibold text-slate-400">Live offers & savings</div>
    </Link>
  );
}
