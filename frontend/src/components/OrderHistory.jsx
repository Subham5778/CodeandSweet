import { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import { motion } from "framer-motion";

export default function OrderHistory({ onBackToShop }) {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForms, setReviewForms] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const reviewKey = (orderId, productId) => `${orderId}-${productId}`;

  const fetchOrders = async () => {
    try {
      const [orderData, reviewData] = await Promise.all([
        apiRequest("/transactions"),
        apiRequest("/reviews/mine"),
      ]);
      setOrders(orderData);
      setReviews(reviewData);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const findReview = (orderId, productId) =>
    reviews.find(
      (review) =>
        review.transactionId === orderId &&
        (review.productId === productId || review.productId?._id === productId)
    );

  const getForm = (orderId, productId) => {
    const existingReview = findReview(orderId, productId);
    return (
      reviewForms[reviewKey(orderId, productId)] || {
        rating: existingReview?.rating || 5,
        comment: existingReview?.comment || "",
      }
    );
  };

  const updateReviewForm = (orderId, productId, patch) => {
    const key = reviewKey(orderId, productId);
    setReviewForms((prev) => ({
      ...prev,
      [key]: {
        ...getForm(orderId, productId),
        ...patch,
      },
    }));
  };

  const submitReview = async (order, item) => {
    const productId = item.productId?._id || item.productId;
    const form = getForm(order._id, productId);

    try {
      const savedReview = await apiRequest("/reviews", {
        method: "POST",
        body: {
          transactionId: order._id,
          productId,
          rating: Number(form.rating),
          comment: form.comment,
        },
      });

      setReviews((prev) => {
        const withoutOld = prev.filter(
          (review) => !(review.transactionId === order._id && review.productId === productId)
        );
        return [savedReview, ...withoutOld];
      });
      setReviewMessage("Review saved successfully.");
      setTimeout(() => setReviewMessage(""), 2500);
    } catch (err) {
      setReviewMessage(err.message || "Failed to save review");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold font-serif text-amber-100">Order Ledger</h2>
          <p className="text-sm text-neutral-400">Your receipts, table orders, delivery tracking, and reviews</p>
        </div>
        <button
          onClick={onBackToShop}
          className="px-4 py-2 border border-amber-500/30 text-amber-300 rounded-xl hover:bg-amber-500/10 transition cursor-pointer"
        >
          Return to Shop
        </button>
      </div>

      {reviewMessage && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          {reviewMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-neutral-500 animate-pulse">
          Loading your order ledger...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-neutral-400 mb-4">You have not placed any orders yet.</p>
          <button
            onClick={onBackToShop}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 gold-gradient text-neutral-950 font-bold text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                {order.status}
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-white/5 text-sm">
                <div>
                  <span className="text-neutral-500">Order Reference: </span>
                  <span className="text-amber-300 font-mono">{order._id}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Placed On: </span>
                  <span className="text-neutral-300">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-5 mb-4">
                {order.items.map((item, itemIdx) => {
                  const productId = item.productId?._id || item.productId;
                  const existingReview = findReview(order._id, productId);
                  const form = getForm(order._id, productId);

                  return (
                    <div key={itemIdx} className="rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-3">
                          {item.image ? (
                            <img
                              src={item.image.startsWith("http") ? item.image : `https://codeandsweet.onrender.com/uploads/${item.image}`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border border-white/10"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center text-amber-500 text-xs">
                              Item
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-neutral-200">{item.name}</p>
                            <p className="text-xs text-neutral-500">Rs.{item.price} per item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-200">Rs.{item.price * item.quantity}</p>
                          <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <span className="text-xs uppercase tracking-wider text-neutral-500">Your Review</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => updateReviewForm(order._id, productId, { rating })}
                                className={`h-8 w-8 rounded-lg border text-sm font-bold transition cursor-pointer ${
                                  Number(form.rating) >= rating
                                    ? "border-amber-500 bg-amber-500 text-neutral-950"
                                    : "border-white/10 bg-neutral-900 text-neutral-500 hover:text-amber-300"
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                          {existingReview && (
                            <span className="text-xs text-emerald-400">Saved review</span>
                          )}
                        </div>
                        <textarea
                          rows="2"
                          value={form.comment}
                          onChange={(e) => updateReviewForm(order._id, productId, { comment: e.target.value })}
                          placeholder="Write about taste, packing, table service, or delivery..."
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => submitReview(order, item)}
                          className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold rounded-xl hover:bg-amber-400 transition cursor-pointer text-sm"
                        >
                          {existingReview ? "Update Review" : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row md:justify-between text-sm space-y-2 md:space-y-0">
                <div className="text-xs text-neutral-500 space-y-1">
                  <p>
                    <span className="font-medium text-neutral-400">Order Type:</span> {order.orderType || "Delivery"}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400">Tracking:</span> {order.trackingStatus || order.status}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400">
                      {order.orderType === "Dine-In" ? "Table:" : "Ship To:"}
                    </span>{" "}
                    {order.orderType === "Dine-In" ? order.tableNumber || "N/A" : order.shippingAddress}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400">Payment:</span> {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 mr-2 text-xs uppercase tracking-wider font-semibold">Total Invoice:</span>
                  <span className="text-2xl font-serif font-bold text-amber-300">Rs.{order.totalAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
