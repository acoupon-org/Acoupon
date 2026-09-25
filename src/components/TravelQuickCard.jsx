import { ArrowUpRight, BusFront, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const travel = [
  {
    name: "redBus",
    label: "Bus tickets",
    text: "Compare bus offers and grab live savings.",
    href: "https://www.redbus.in/",
    image: "https://cdn.simpleicons.org/redbus",
    icon: BusFront,
  },
  {
    name: "MakeMyTrip",
    label: "Flights & hotels",
    text: "Find flight, hotel and holiday savings.",
    href: "https://www.makemytrip.com/",
    image: "https://cdn.simpleicons.org/makemytrip",
    icon: Plane,
  },
];

export default function TravelQuickCard() {
  return (
    <section className="container-page py-7">
      <div className="overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,.16)] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-white/80">Easy & fast travel</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Travel in fewer clicks.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Jump directly to trusted travel brands while ACoupon keeps your deal discovery fast and lightweight.</p>
          </div>
          <Link to="/category/travel" className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white">All travel offers <ArrowUpRight className="size-4" /></Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {travel.map(({ name, label, text, href, image, icon: Icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.07] p-5 transition hover:-translate-y-1 hover:bg-white/[.11]">
              <div className="absolute -right-12 -top-12 size-32 rounded-full border-[20px] border-white/5" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-white p-2 shadow-lg">
                  <img src={image} alt={`${name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.innerHTML = `<span class='font-black text-slate-900'>${name.slice(0,2).toUpperCase()}</span>`; }} />
                </div>
                <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5"><Icon className="size-5" /></div>
              </div>
              <div className="relative mt-6 text-xs font-black uppercase tracking-widest text-white/50">{label}</div>
              <div className="relative mt-1 text-2xl font-black">{name}</div>
              <p className="relative mt-2 max-w-sm text-sm leading-6 text-white/60">{text}</p>
              <div className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">Visit {name} <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
