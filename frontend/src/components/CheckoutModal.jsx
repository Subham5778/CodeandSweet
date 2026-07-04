import { useState } from "react";
import { apiRequest } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutModal({ cart, totalPrice, onClose, onSuccess }) {
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Card details mock state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI details mock state
  const [upiId, setUpiId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderType === "Delivery" && !address.trim()) {
      setError("Please enter your delivery address");
      return;
    }
    if (orderType === "Dine-In" && !tableNumber.trim()) {
      setError("Please enter your table number");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      // Map cart items to the transaction backend expectations
      const mappedItems = cart.map((item) => ({
        productId: item.productId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      }));

      await apiRequest("/transactions", {
        method: "POST",
        body: {
          items: mappedItems,
          totalAmount: totalPrice,
          shippingAddress: orderType === "Delivery" ? address : "Restaurant dine-in",
          orderType,
          tableNumber: orderType === "Dine-In" ? tableNumber : "",
          paymentMethod: paymentMethod === "Card" ? `Card (...${cardNumber.slice(-4) || "4242"})` : paymentMethod === "UPI" ? `UPI (${upiId})` : "Cash on Delivery",
        },
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message || "Something went wrong during checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass w-full max-w-lg rounded-2xl p-6 relative overflow-hidden shadow-2xl"
      >
        {/* Glow decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
                <h3 className="text-2xl font-bold text-amber-100 font-serif">Checkout Boutique</h3>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-amber-500 transition text-2xl"
                >
                  &times;
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Order Summary */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">Order Summary</h4>
                  <div className="max-h-24 overflow-y-auto space-y-1 mb-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-neutral-300">
                        <span>{item.name} <span className="text-neutral-500">x{item.quantity}</span></span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold border-t border-white/10 pt-2 text-amber-200">
                    <span>Grand Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Delivery", "Dine-In"].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-3 rounded-xl border text-sm font-medium transition cursor-pointer ${
                          orderType === type
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        {type === "Delivery" ? "Delivery" : "Table Service"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping Address / Table Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    {orderType === "Delivery" ? "Delivery Address" : "Table Number"}
                  </label>
                  {orderType === "Delivery" ? (
                    <>
                      <textarea
                        rows="3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, city, state, PIN code, India"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition resize-none"
                        required
                      ></textarea>
                      <p className="text-xs text-neutral-500 mt-1">Delivery is available inside India only.</p>
                    </>
                  ) : (
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Example: Table 7"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Card", "UPI", "Cash"].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl border text-sm font-medium transition cursor-pointer ${
                          paymentMethod === method
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        {method === "Card" ? "💳 Card" : method === "UPI" ? "📱 UPI" : "💵 COD"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mock Card Input */}
                {paymentMethod === "Card" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-2 p-3 bg-neutral-900/60 rounded-xl border border-white/5"
                  >
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                        required
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="bg-neutral-900 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Mock UPI Input */}
                {paymentMethod === "UPI" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="p-3 bg-neutral-900/60 rounded-xl border border-white/5"
                  >
                    <input
                      type="text"
                      placeholder="e.g. user@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : `Place Order (₹${totalPrice})`}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 text-4xl animate-bounce">
                ✓
              </div>
              <h3 className="text-3xl font-serif font-bold text-amber-200">Order Complete!</h3>
              <p className="text-neutral-400 max-w-sm">
                Your order is confirmed. Receipt and tracking details have been sent to your email.
              </p>
              <div className="text-xs text-neutral-600 animate-pulse pt-2">
                Redirecting to order dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
