import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBar({ large = false }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={submit} className={`flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm ${large ? "w-full" : "w-full max-w-md"}`}>
      <Search className="ml-3 size-5 shrink-0 text-slate-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={large ? "Search Amazon, AJIO, Ola, Swiggy..." : "Search stores & coupons..."}
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-slate-400"
      />
      <button className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/85">
        Search
      </button>
    </form>
  );
}
