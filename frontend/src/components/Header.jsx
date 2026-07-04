import { useState } from "react";
import logo from "../assets/logo1.png";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  cart = [],
  user,
  activeView,
  setActiveView,
  showLogin,
  setShowLogin,
  showRegister,
  setShowRegister,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  registerName,
  setRegisterName,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  handleLogin,
  handleRegister,
  handleLogout,
  removeFromCart,
  updateCartQty,
  handleBuy,
}) {
  const [showCart, setShowCart] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* HEADER BAR */}
      <nav className="sticky top-0 z-40 glass backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setActiveView("home");
            setShowCart(false);
          }}
        >
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain hover:scale-105 transition" />
          <div>
            <h1 className="text-xl font-bold gold-text-gradient font-serif tracking-wide leading-none">Cacao & Confection</h1>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Bespoke Sweet Engineering</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Order history shortcut for logged in users */}
          {user && (
            <button
              onClick={() => {
                setActiveView(activeView === "orders" ? "home" : "orders");
                setShowCart(false);
              }}
              className={`text-sm font-medium hover:text-amber-400 transition cursor-pointer px-3 py-1.5 rounded-lg border ${
                activeView === "orders" 
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300" 
                  : "border-white/5 text-neutral-300"
              }`}
            >
              📜 Order Ledger
            </button>
          )}

          {/* CART BUTTON */}
          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 bg-neutral-900/60 hover:bg-neutral-900 border border-white/10 rounded-xl flex items-center gap-2 hover:border-amber-500/50 transition duration-300 text-sm font-medium cursor-pointer"
          >
            <span>🛒</span>
            <span className="text-neutral-300">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 gold-gradient text-neutral-950 font-bold text-xs rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* AUTHENTICATION / PROFILE BUTTONS */}
          {!user ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 border border-white/15 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 rounded-xl text-sm transition duration-300 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 font-semibold rounded-xl text-sm transition duration-300 cursor-pointer"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-amber-500/20 transition"
              >
                👤 {user.name}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-white/5 text-xs text-neutral-500">
                    Logged in as <p className="font-semibold text-neutral-300 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView("orders");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-amber-400 rounded-lg transition mt-1 cursor-pointer"
                  >
                    View Order Ledger
                  </button>
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        setActiveView("home");
                        setShowProfileMenu(false);
                        // Admin panel will auto show in home view if admin
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-amber-400 rounded-lg transition cursor-pointer"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition mt-1 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SLIDE-OUT CART DRAWER */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 border-l border-white/10 shadow-2xl p-6 z-50 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <h3 className="text-xl font-bold font-serif text-amber-200">Cart Inventory</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-neutral-400 hover:text-amber-500 transition text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {!user ? (
                  <div className="text-center py-10">
                    <p className="text-neutral-400 mb-4 text-sm">Please register or log in to sync your bespoke cart.</p>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setShowLogin(true);
                      }}
                      className="px-4 py-2 border border-amber-500/30 text-amber-300 rounded-xl hover:bg-amber-500/10 transition text-sm cursor-pointer"
                    >
                      Login Now
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-20 text-neutral-500">Your cart is empty. Add some gourmet sweets!</div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="flex gap-4 pb-4 border-b border-white/5 text-sm"
                    >
                      {item.image ? (
                        <img
                          src={item.image.startsWith("http") ? item.image : `https://codeandsweet.onrender.com/uploads/${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border border-white/10"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-center text-amber-500 text-xs">
                          Sweet
                        </div>
                      )}
                      <div className="flex-grow">
                        <h4 className="font-semibold text-neutral-200">{item.name}</h4>
                        <p className="text-amber-300 font-semibold mt-0.5">₹{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQty(item._id || item.productId, -1)}
                            className="w-7 h-7 border border-white/10 text-neutral-400 hover:text-amber-500 rounded-lg flex items-center justify-center text-sm transition cursor-pointer"
                          >
                            −
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item._id || item.productId, 1)}
                            className="w-7 h-7 border border-white/10 text-neutral-400 hover:text-amber-500 rounded-lg flex items-center justify-center text-sm transition cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id || item.productId)}
                            className="ml-auto text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {user && cart.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-amber-200 text-lg">₹{totalPrice}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      handleBuy();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl shadow-lg transition duration-300 cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && !user && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-amber-500 text-2xl transition"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold font-serif text-amber-100 text-center mb-6">Welcome Back</h2>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Bespoke Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
                <button
                  onClick={handleLogin}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 font-bold rounded-xl transition duration-300 mt-2 cursor-pointer"
                >
                  Indulge
                </button>
              </div>

              <p className="text-xs text-neutral-500 text-center mt-6">
                New to Cacao & Confection?{" "}
                <span
                  className="text-amber-400 cursor-pointer hover:underline"
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Create your profile
                </span>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER MODAL */}
      <AnimatePresence>
        {showRegister && !user && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowRegister(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-amber-500 text-2xl transition"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold font-serif text-amber-100 text-center mb-6">Create Sweet Profile</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Gourmet Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
                <input
                  type="password"
                  placeholder="Choose Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
                <button
                  onClick={handleRegister}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 font-bold rounded-xl transition duration-300 mt-2 cursor-pointer"
                >
                  Create Account
                </button>
              </div>

              <p className="text-xs text-neutral-500 text-center mt-6">
                Already registered?{" "}
                <span
                  className="text-amber-400 cursor-pointer hover:underline"
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                >
                  Login instead
                </span>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
