import { useState } from "react";

const BRAND_DOMAINS = {
  amazon: "amazon.in", ajio: "ajio.com", flipkart: "flipkart.com", myntra: "myntra.com", swiggy: "swiggy.com", zomato: "zomato.com",
  blinkit: "blinkit.com", ola: "olacabs.com", uber: "uber.com", rapido: "rapido.bike", oyo: "oyorooms.com", paytm: "paytm.com",
  makemytrip: "makemytrip.com", redbus: "redbus.in", cleartrip: "cleartrip.com", meesho: "meesho.com", nykaa: "nykaa.com",
  croma: "croma.com", tatacliq: "tatacliq.com", pharmeasy: "pharmeasy.in", zepto: "zeptonow.com"
};

export default function BrandLogo({ name, src, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const key = String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const simpleIcon = key ? `https://cdn.simpleicons.org/${key}` : "";
  const imageSrc = src || simpleIcon;
  const initials = String(name || "AC").trim().split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  const box = size === "lg" ? "size-20 rounded-2xl text-2xl" : size === "sm" ? "size-10 rounded-xl text-xs" : "size-14 rounded-xl text-base";

  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden border border-slate-200 bg-white font-black text-slate-900 shadow-sm ${box}`} aria-label={`${name || "Store"} logo`}>
      {imageSrc && !failed ? (
        <img src={imageSrc} alt={`${name || "Store"} logo`} loading="lazy" decoding="async" className="h-full w-full object-contain p-2.5" onError={() => setFailed(true)} />
      ) : <span>{initials}</span>}
    </div>
  );
}
