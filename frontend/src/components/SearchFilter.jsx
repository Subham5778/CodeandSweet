export default function SearchFilter({
  search,
  setSearch,
  menuSection,
  setMenuSection,
  category,
  setCategory,
  setShowAll,
}) {
  const sectionTabs = [
    { value: "all", label: "All Menu" },
    { value: "sweets", label: "Sweets" },
    { value: "food", label: "Dinner & Food" },
  ];

  const categoryGroups = {
    all: [
      { value: "all", label: "All Items" },
      { value: "sweet", label: "Sweets" },
      { value: "cake", label: "Cakes" },
      { value: "chocolate", label: "Chocolates" },
      { value: "chinese", label: "Chinese" },
      { value: "bihari", label: "Bihari" },
      { value: "rajasthani", label: "Rajasthani" },
    ],
    sweets: [
      { value: "all", label: "All Sweets" },
      { value: "sweet", label: "Traditional Sweets" },
      { value: "cake", label: "Cakes" },
      { value: "chocolate", label: "Chocolates" },
    ],
    food: [
      { value: "all", label: "All Food" },
      { value: "chinese", label: "Chinese" },
      { value: "bihari", label: "Bihari" },
      { value: "rajasthani", label: "Rajasthani" },
    ],
  };

  const categories = categoryGroups[menuSection] || categoryGroups.all;

  const changeSection = (section) => {
    setMenuSection(section);
    setCategory("all");
    setShowAll(true);
  };

  return (
    <div id="shop-collection" className="max-w-5xl mx-auto px-6 mb-12 space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold font-serif text-amber-100">Sweet & Restaurant Menu</h3>
        <p className="text-sm text-neutral-400 mt-1">
          Order sweets for delivery or food for your restaurant table.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {sectionTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => changeSection(tab.value)}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition cursor-pointer ${
              menuSection === tab.value
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-bold"
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
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
