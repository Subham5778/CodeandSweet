import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import SearchFilter from "../components/SearchFilter";
import AdminPanel from "../components/AdminPanel";


export default function Home({
  sweets = [],
  fetchSweets,
  user,
  qty,
  increaseQty,
  decreaseQty,
  addToCart,
  search,
  setSearch,
  category,
  setCategory,
  showAll,
  setShowAll,
}) {
  // Filter sweets based on search and category
  const filteredSweets = sweets.filter((sweet) => {
    const matchName = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || sweet.category === category;
    return matchName && matchCategory;
  });

  // Limit visible sweets
  const visibleSweets =
    category === "all" && !showAll ? filteredSweets.slice(0, 6) : filteredSweets;

  return (
    <div className="flex flex-col space-y-4">
      <Hero />
      <Stats />
      
      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        setShowAll={setShowAll}
      />

      {user?.role === "admin" && (
        <AdminPanel fetchSweets={fetchSweets} sweets={sweets} />
      )}

      <section className="max-w-6xl mx-auto px-6 pb-20 flex-grow w-full">
        {visibleSweets.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No confections found matching the current selections.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {visibleSweets.map((sweet) => (
              <ProductCard
                key={sweet._id}
                product={sweet}
                quantity={qty[sweet._id] || 0}
                onIncrease={() => increaseQty(sweet._id)}
                onDecrease={() => decreaseQty(sweet._id)}
                onAddToCart={() => addToCart(sweet)}
              />
            ))}
          </div>
        )}

        {category === "all" && !showAll && filteredSweets.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 bg-neutral-900 border border-white/10 hover:border-amber-500/50 text-amber-400 font-semibold rounded-xl transition duration-300 shadow hover:bg-neutral-950 cursor-pointer"
            >
              Examine Full Catalog
            </button>
          </div>
        )}
      </section>
    </div>
  );
}