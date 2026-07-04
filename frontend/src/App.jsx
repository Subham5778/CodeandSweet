import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OrderHistory from "./components/OrderHistory";
import CheckoutModal from "./components/CheckoutModal";
import { apiRequest } from "./api/api";

export default function App() {
  const [sweets, setSweets] = useState([]);
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("home"); // "home" | "orders"

  // Cart & quantity
  const [qty, setQty] = useState({});
  const [cart, setCart] = useState([]);

  // Search & filter
  const [search, setSearch] = useState("");
  const [menuSection, setMenuSection] = useState("all");
  const [category, setCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // Login/Register modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);

  // Login/Register form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  /* ------------------ VERIFY TOKEN & USER ON LOAD ------------------ */
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await apiRequest("/auth/me");
          if (res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token");
        }
      }
    };
    verifyUser();
  }, []);

  /* ------------------ FETCH SWEETS ------------------ */
  const fetchSweets = async () => {
    try {
      const data = await apiRequest("/sweets");
      setSweets(data);
    } catch (err) {
      console.error("Failed to fetch sweets:", err);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  /* ------------------ FETCH CART FROM DB ------------------ */
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await apiRequest("/cart");
      if (data && data.items) {
        setCart(data.items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  /* ------------------ QUANTITY HANDLERS ------------------ */
  const increaseQty = (id) => {
    setQty((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQty = (id) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  /* ------------------ CART HANDLERS ------------------ */
  const addToCart = async (product) => {
    const quantity = qty[product._id] || 1;
    if (user) {
      try {
        const updatedCart = await apiRequest("/cart/add", {
          method: "POST",
          body: { productId: product._id, quantity },
        });
        if (updatedCart && updatedCart.items) {
          setCart(updatedCart.items);
        }
      } catch (err) {
        alert(err.message || "Failed to add to cart");
      }
    } else {
      // Local storage guest cart
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product._id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];
      });
    }
    setQty((prev) => ({ ...prev, [product._id]: 0 }));
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const updatedCart = await apiRequest(`/cart/item/${itemId}`, {
          method: "DELETE",
        });
        if (updatedCart && updatedCart.items) {
          setCart(updatedCart.items);
        }
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.productId !== itemId && item._id !== itemId));
    }
  };

  const updateCartQty = async (itemId, delta) => {
    const item = cart.find((i) => i._id === itemId || i.productId === itemId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    if (user && item._id) {
      try {
        const updatedCart = await apiRequest("/cart/update", {
          method: "PUT",
          body: { itemId: item._id, quantity: newQty },
        });
        if (updatedCart && updatedCart.items) {
          setCart(updatedCart.items);
        }
      } catch (err) {
        console.error("Failed to update cart quantity:", err);
      }
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.productId === itemId || i._id === itemId
            ? { ...i, quantity: newQty }
            : i
        )
      );
    }
  };

  const handleBuy = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    fetchSweets();
    setActiveView("orders");
  };

  /* ------------------ USER AUTH ------------------ */
  const handleLogin = async () => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email: loginEmail, password: loginPassword },
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowLogin(false);
      // Clear forms
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: {
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        },
      });
      // Automatically log them in by fetching token and user from a login trigger or API
      // Since backend register returns success message, trigger standard login after register:
      const loginRes = await apiRequest("/auth/login", {
        method: "POST",
        body: { email: registerEmail, password: registerPassword },
      });
      localStorage.setItem("token", loginRes.token);
      setUser(loginRes.user);
      setShowRegister(false);
      // Clear forms
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);
    setActiveView("home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <Header
        cart={cart}
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        showRegister={showRegister}
        setShowRegister={setShowRegister}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        registerName={registerName}
        setRegisterName={setRegisterName}
        registerEmail={registerEmail}
        setRegisterEmail={setRegisterEmail}
        registerPassword={registerPassword}
        setRegisterPassword={setRegisterPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
        removeFromCart={removeFromCart}
        updateCartQty={updateCartQty}
        handleBuy={handleBuy}
      />

      <main className="flex-grow">
        {activeView === "home" ? (
          <Home
            sweets={sweets}
            fetchSweets={fetchSweets}
            user={user}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            menuSection={menuSection}
            setMenuSection={setMenuSection}
            qty={qty}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            addToCart={addToCart}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        ) : (
          <OrderHistory onBackToShop={() => setActiveView("home")} />
        )}
      </main>

      <Footer />

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          totalPrice={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
