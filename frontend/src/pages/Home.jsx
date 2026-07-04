import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import SearchFilter from "../components/SearchFilter";
import AdminPanel from "../components/AdminPanel";
import { apiRequest } from "../api/api";


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
  menuSection,
  setMenuSection,
  category,
  setCategory,
  showAll,
  setShowAll,
}) {
  const foodCategories = ["chinese", "bihari", "rajasthani"];
  const sweetCategories = ["sweet", "cake", "chocolate"];
  const [now, setNow] = useState(new Date());
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiRequest("/reviews/public");
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const restaurantOpenMinute = 10 * 60;
  const restaurantCloseMinute = 21 * 60;
  const isRestaurantOpen =
    currentMinutes >= restaurantOpenMinute && currentMinutes < restaurantCloseMinute;
  const restaurantMessage = isRestaurantOpen
    ? "Restaurant is open now. Food service is available until 9:00 PM."
    : currentMinutes < restaurantOpenMinute
      ? "Restaurant is not open yet. Please wait until today at 10:00 AM."
      : "Restaurant is closed now. Please come tomorrow at 10:00 AM.";
  const showRestaurantStatus =
    menuSection === "food" || foodCategories.includes(category) || menuSection === "all";

  // Filter sweets based on search and category
  const filteredSweets = sweets.filter((sweet) => {
    const matchName = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchAvailability = user?.role === "admin" || sweet.available !== false;
    const matchSection =
      menuSection === "all" ||
      (menuSection === "food" && foodCategories.includes(sweet.category)) ||
      (menuSection === "sweets" && sweetCategories.includes(sweet.category));
    const matchCategory = category === "all" || sweet.category === category;
    return matchName && matchAvailability && matchSection && matchCategory;
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
        menuSection={menuSection}
        setMenuSection={setMenuSection}
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
                disabledReason={
                  foodCategories.includes(sweet.category) && !isRestaurantOpen
                    ? restaurantMessage
                    : ""
                }
                quantity={qty[sweet._id] || 0}
                onIncrease={() => increaseQty(sweet._id)}
                onDecrease={() => decreaseQty(sweet._id)}
                onAddToCart={() => addToCart(sweet)}
              />
            ))}
          </div>
        )}

        {showRestaurantStatus && (
          <div
            className={`mt-8 rounded-xl border p-4 text-center text-sm ${
              isRestaurantOpen
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/20 bg-amber-500/10 text-amber-100"
            }`}
          >
            <p className="font-semibold">Restaurant timing: 10:00 AM - 9:00 PM</p>
            <p className="mt-1">{restaurantMessage}</p>
            <p className="mt-1 text-xs text-neutral-400">
              Website time:{" "}
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
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

      {reviews.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20 w-full">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold font-serif text-amber-100">Customer Reviews</h3>
            <p className="text-sm text-neutral-400 mt-1">Recent feedback from purchased orders</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((review) => (
              <div key={review._id} className="rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-100">{review.productName}</p>
                    <p className="text-xs text-neutral-500">
                      by {review.userId?.name || "Customer"}
                    </p>
                  </div>
                  <span className="rounded-lg bg-amber-500 text-neutral-950 px-2 py-1 text-xs font-bold">
                    {review.rating}/5
                  </span>
                </div>
                {review.comment ? (
                  <p className="mt-3 text-sm text-neutral-300 line-clamp-3">{review.comment}</p>
                ) : (
                  <p className="mt-3 text-sm text-neutral-500">No comment added.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
