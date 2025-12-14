// frontend/src/components/ProductCard.jsx
import React from "react";

export default function ProductCard({ product, quantity, onIncrease, onDecrease, onAddToCart }) {
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
      </div>

      {/* Add to Cart */}
      <button
        onClick={onAddToCart}
        className="mt-2 px-4 py-1 bg-pink-500 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
