import ProductCard from "../components/ProductCard"; 
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import SearchFilter from "../components/SearchFilter";
import AdminPanel from "../components/AdminPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const filteredSweets = sweets.filter(sweet => {
    const matchName = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || sweet.category === category;
    return matchName && matchCategory;
  });

  // Limit visible sweets
  const visibleSweets = category === "all" && !showAll
    ? filteredSweets.slice(0, 6)
    : filteredSweets;

  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <SearchFilter
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        setShowAll={setShowAll}
      />

      {user?.role === "admin" && (
        <AdminPanel fetchSweets={fetchSweets} sweets={sweets} />
      )}

      <section className="px-6 pb-20 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {visibleSweets.map(sweet => (
            <ProductCard
              key={sweet._id}
              product={{
                ...sweet,
                image: sweet.image ? `${API_URL}/uploads/${sweet.image}` : null
              }}
              quantity={qty[sweet._id] || 0}
              onIncrease={() => increaseQty(sweet._id)}
              onDecrease={() => decreaseQty(sweet._id)}
              onAddToCart={() => addToCart(sweet)}
            />
          ))}
        </div>

        {category === "all" && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 bg-pink-500 text-white rounded"
            >
              See More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
