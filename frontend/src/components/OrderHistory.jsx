import { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import { motion } from "framer-motion";

export default function OrderHistory({ onBackToShop }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const data = await apiRequest("/transactions");
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold font-serif text-amber-100">Order Ledger</h2>
          <p className="text-sm text-neutral-400">Your receipts, table orders, and delivery tracking</p>
        </div>
        <button
          onClick={onBackToShop}
          className="px-4 py-2 border border-amber-500/30 text-amber-300 rounded-xl hover:bg-amber-500/10 transition cursor-pointer"
        >
          ← Return to Shop
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-neutral-500 animate-pulse">
          Loading your luxury order ledger...
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
              {/* Gold status tag */}
              <div className="absolute top-0 right-0 gold-gradient text-neutral-950 font-bold text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                {order.status}
              </div>

              {/* Receipt Header */}
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

              {/* Order Items */}
              <div className="space-y-4 mb-4">
                {order.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                      {item.image ? (
                        <img
                          src={item.image.startsWith("http") ? item.image : `https://codeandsweet.onrender.com/uploads/${item.image}`}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-900 border border-white/10 rounded-lg flex items-center justify-center text-amber-500 text-xs">
                          Sweet
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-200">{item.name}</p>
                        <p className="text-xs text-neutral-500">₹{item.price} per item</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-200">₹{item.price * item.quantity}</p>
                      <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Receipt Footer */}
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
                  <span className="text-2xl font-serif font-bold text-amber-300">₹{order.totalAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
