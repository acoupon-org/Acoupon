import { ExternalLink, Plane, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";

const palette = ["from-slate-900 via-slate-800 to-slate-600", "from-indigo-950 via-indigo-700 to-slate-900", "from-emerald-950 via-emerald-700 to-slate-900", "from-rose-950 via-rose-700 to-slate-900", "from-amber-950 via-amber-700 to-slate-900"];

function hash(value) {
  return [...String(value || "ACoupon")].reduce((n, c) => n + c.charCodeAt(0), 0);
}

export default function OfferVisual({ name = "ACoupon", image = "", href = "#", type = "offer", className = "" }) {
  const [failed, setFailed] = useState(false);
  const gradient = palette[hash(name) % palette.length];
  const Icon = type === "travel" ? Plane : type === "store" ? ShoppingBag : Tag;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {!failed && image ? (
        <img
          src={image}
          alt={`${name} ${type}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-between overflow-hidden p-5 text-white">
          <div className="absolute -right-8 -top-10 size-36 rounded-full border-[22px] border-white/10" />
          <div className="absolute -bottom-14 -left-10 size-40 rounded-full border-[28px] border-white/10" />
          <div className="relative">
            <div className="mb-2 inline-flex rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur"><Icon className="size-5" /></div>
            <div className="max-w-[220px] text-xl font-black tracking-tight">{name}</div>
            <div className="mt-1 text-xs font-semibold text-white/70">Live savings on ACoupon</div>
          </div>
          <div className="relative grid size-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-lg font-black backdrop-blur">
            {String(name).split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}
      {href && href !== "#" && (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}`} className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-xl border border-white/30 bg-black/60 text-white backdrop-blur hover:bg-black">
          <ExternalLink className="size-4" />
        </a>
      )}
    </div>
  );
}
