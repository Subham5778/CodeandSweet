export default function Stats() {
  const statList = [
    { value: "⭐ 4.9", label: "Client Rating", detail: "Over 5,000 gourmands" },
    { value: "50+", label: "Sweet Masterpieces", detail: "Curated confectionery" },
    { value: "100%", label: "Fresh Daily", detail: "Baked and tempered daily" },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {statList.map((stat, idx) => (
        <div
          key={idx}
          className="glass-light rounded-2xl p-6 border border-white/5 text-center transition duration-300 hover:border-amber-500/20"
        >
          <p className="text-3xl font-bold font-serif gold-text-gradient mb-1">
            {stat.value}
          </p>
          <p className="text-sm font-semibold text-neutral-300 tracking-wide uppercase">
            {stat.label}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {stat.detail}
          </p>
        </div>
      ))}
    </section>
  );
}
