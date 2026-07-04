import React from "react";

export default function ProductCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
}) {
<<<<<<< HEAD
  if (!product) return null; // safeguard

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      {/* Image */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="h-32 w-32 object-cover mb-2"
        />
      )}

      {/* Name and Category */}
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.category}</p>

      {/* Price */}
      <p className="font-bold mt-1">₹{product.price}</p>

      {/* Quantity Controls */}
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={onDecrease}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <span>{quantity || 0}</span>

        <button
          onClick={onIncrease}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
=======
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  // Resolve image source dynamically
  const getProductImage = () => {
    if (!product.image) return null;
    if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
      return product.image;
    }
    // Fallback to backend uploads directory for local assets
    return `https://codeandsweet.onrender.com/uploads/${product.image}`;
  };

  const imageSrc = getProductImage();

  return (
    <div className="glass-light rounded-2xl p-5 flex flex-col items-center border border-white/5 hover:border-amber-500/30 transition-all duration-300 shadow-lg group hover:shadow-amber-900/5 relative overflow-hidden">
      {/* Stock status indicator badge */}
      <div className="absolute top-3 right-3 z-10">
        {isOutOfStock ? (
          <span className="bg-neutral-800 text-neutral-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider">
            Out of Stock
          </span>
        ) : product.stock <= 3 ? (
          <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider animate-pulse">
            Only {product.stock} Left!
          </span>
        ) : (
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider">
            In Stock ({product.stock})
          </span>
        )}
>>>>>>> d9f7208 (Redesign the webpage)
      </div>

      {/* Image container */}
      <div className="h-40 w-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-neutral-900/50 border border-white/5 relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="text-amber-500 text-3xl font-serif">🧁</div>
        )}
      </div>

      {/* Details */}
      <div className="text-center w-full flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
            {product.category}
          </span>
          <h3 className="font-semibold text-lg text-neutral-100 font-serif group-hover:text-amber-300 transition duration-300 truncate">
            {product.name}
          </h3>
          <p className="font-serif font-bold text-amber-400 text-xl mt-1">₹{product.price}</p>
        </div>

        <div className="mt-4 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center space-x-3 bg-neutral-950/60 rounded-xl px-2 py-1.5 border border-white/5">
            <button
              onClick={onDecrease}
              disabled={isOutOfStock || quantity <= 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 text-neutral-400 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer transition"
            >
              −
            </button>
            <span className="text-sm font-semibold w-6 text-neutral-200">
              {quantity || 0}
            </span>
            <button
              onClick={onIncrease}
              disabled={isOutOfStock || quantity >= product.stock}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 text-neutral-400 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer transition"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl transition duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
