import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { apiRequest } from "./api/api";

export default function App() {
  const [sweets, setSweets] = useState([]);
  const [user, setUser] = useState(null);

  // Cart & quantity
  const [qty, setQty] = useState({});
  const [cart, setCart] = useState([]);

  // Search & filter
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // Login/Register modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Login/Register form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

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

  /* ------------------ CART HANDLERS ------------------ */
  const increaseQty = (id) => {
    setQty((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQty = (id) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  const addToCart = (product) => {
    const quantity = qty[product._id] || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setQty((prev) => ({ ...prev, [product._id]: 0 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleBuy = () => {
    alert("Purchase successful! 🎉");
    setCart([]);
  };

  /* ------------------ USER AUTH ------------------ */
  const handleLogin = async () => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowLogin(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowRegister(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        cart={cart}
        user={user}
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
        <Home
          sweets={sweets}
          fetchSweets={fetchSweets}
          user={user}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          qty={qty}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          addToCart={addToCart}
          showAll={showAll}
          setShowAll={setShowAll}
        />
      </main>

      <Footer />
    </div>
  );
}
