import { useState } from "react";
import logo from "../assets/logo1.png";

export default function Header({
  cart,
  user,
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

  // ✅ SAFE cart items
  const cartItems = cart || [];

  // ✅ Cart count
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ✅ Total price
  const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);


  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow relative z-10">
      <img src={logo} alt="Logo" className="w-24" />

      <div className="flex items-center gap-6 relative">
        {/* CART */}
        <div>
          <button
            onClick={() => setShowCart((prev) => !prev)}
            className="text-lg font-medium"
          >
            🛒 Cart ({cartCount})
          </button>

          {showCart && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg p-4 z-50">
              {!user ? (
                <p className="text-gray-500">Please login to see cart</p>
              ) : cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-start border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>

                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() =>
                                updateCartQty(item._id, -1)
                              }
                              className="px-2 py-1 border rounded text-sm"
                            >
                              −
                            </button>
                            <button
                              onClick={() =>
                                updateCartQty(item._id, 1)
                              }
                              className="px-2 py-1 border rounded text-sm"
                            >
                              +
                            </button>
                            <button
                              onClick={() =>
                                removeFromCart(item._id)
                              }
                              className="px-2 py-1 border rounded text-sm text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <p className="font-bold mb-2">
                      Total: ₹{totalPrice}
                    </p>
                    <button
                      onClick={handleBuy}
                      className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* AUTH BUTTONS */}
        {!user ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowLogin(true)}
              className="border px-3 py-1 rounded"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="border px-3 py-1 rounded"
            >
              Register
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="border px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && !user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-3 py-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) =>
                setLoginPassword(e.target.value)
              }
              className="w-full px-3 py-2 mb-4 border rounded"
            />

            <button
              onClick={handleLogin}
              className="w-full py-2 bg-pink-500 text-white rounded mb-2"
            >
              Login
            </button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <span
                className="text-pink-600 cursor-pointer"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && !user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Register
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={registerName}
              onChange={(e) =>
                setRegisterName(e.target.value)
              }
              className="w-full px-3 py-2 mb-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
              className="w-full px-3 py-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) =>
                setRegisterPassword(e.target.value)
              }
              className="w-full px-3 py-2 mb-4 border rounded"
            />

            <button
              onClick={handleRegister}
              className="w-full py-2 bg-pink-500 text-white rounded mb-2"
            >
              Register
            </button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-pink-600 cursor-pointer"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
