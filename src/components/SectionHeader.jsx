import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SectionHeader({ eyebrow, title, description, href = "/stores", action = "View all" }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-5">
      <div>
        {eyebrow && <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-black">{eyebrow}</div>}
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>}
      </div>
      <Link to={href} className="hidden items-center gap-1 text-sm font-bold text-black sm:flex">
        {action}<ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
