export default function SearchFilter({ search, setSearch, category, setCategory, setShowAll }) {
  const categories = [
    { value: "all", label: "All Treats" },
    { value: "cake", label: "Gourmet Cakes" },
    { value: "chocolate", label: "Premium Chocolates" },
    { value: "sweet", label: "Artisanal Sweets" },
  ];

  return (
    <div id="shop-collection" className="max-w-4xl mx-auto px-6 mb-12 space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold font-serif text-amber-100">Our Boutique Catalog</h3>
        <p className="text-sm text-neutral-400 mt-1">Select an engineering category or query below</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search sweets..."
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-neutral-600">🔍</span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setShowAll(true);
              }}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition cursor-pointer ${
                category === cat.value
                  ? "bg-amber-500 text-neutral-950 border-amber-500 font-bold"
                  : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
