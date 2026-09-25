export default function StaticPage({ title, children }) {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl">
        <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-black">ACoupon</div>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <div className="prose prose-slate mt-7 max-w-none text-sm leading-7 text-slate-600">{children}</div>
      </div>
    </div>
  );
}
