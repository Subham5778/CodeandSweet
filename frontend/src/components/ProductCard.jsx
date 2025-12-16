import React from "react";

// Backend base URL (same as AdminPanel)
const BACKEND_URL = "https://codeandsweet.onrender.com";

export default function ProductCard({
  product,
  quantity = 0,
  onIncrease,
  onDecrease,
  onAddToCart,
}) {
  if (!product) return null;

  // Build correct image URL
  const imageUrl =
    product.image && typeof product.image === "string"
      ? ${BACKEND_URL}/uploads/${product.image}
      : null;

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      {/* Product Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="h-32 w-32 object-cover mb-2 rounded"
          onError={(e) => {
            e.target.src = "/placeholder.png"; // optional fallback
          }}
        />
      ) : (
        <div className="h-32 w-32 bg-gray-200 flex items-center justify-center mb-2 rounded text-sm text-gray-500">
          No Image
        </div>
      )}

      {/* Product Name */}
      <h3 className="font-semibold text-center">{product.name}</h3>

      {/* Category */}
      <p className="text-sm text-gray-600">{product.category}</p>

      {/* Price */}
      <p className="font-bold mt-1">₹{product.price}</p>

      {/* Quantity Controls */}
      <div className="flex items-center mt-2 space-x-2">
        <button
          onClick={onDecrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          −
        </button>

        <span className="min-w-[20px] text-center">{quantity}</span>

        <button
          onClick={onIncrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={onAddToCart}
        className="mt-3 px-4 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
