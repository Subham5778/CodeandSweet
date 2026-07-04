import { useState, useEffect } from "react";
import { apiRequest } from "../api/api";
import { motion } from "framer-motion";

const BACKEND_URL = "https://codeandsweet.onrender.com";

export default function AdminPanel({ sweets = [], fetchSweets }) {
  const [activeTab, setActiveTab] = useState("sweets"); // "sweets" | "sales"
  const [transactions, setTransactions] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "sweet",
    price: "",
    stock: "",
    image: null,
  });

  const [editingSweet, setEditingSweet] = useState(null);

  // Fetch all transactions for admin sales reporting
  const fetchAllTransactions = async () => {
    setLoadingSales(true);
    try {
      const data = await apiRequest("/transactions/all");
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    if (activeTab === "sales") {
      fetchAllTransactions();
    }
  }, [activeTab]);

  /* ------------------ ADD SWEET ------------------ */
  const handleAddSweet = async () => {
    if (!newSweet.name || !newSweet.category || !newSweet.price || !newSweet.stock) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newSweet.name);
      formData.append("category", newSweet.category);
      formData.append("price", Number(newSweet.price));
      formData.append("stock", Number(newSweet.stock));
      if (newSweet.image) formData.append("image", newSweet.image);

      await apiRequest("/sweets", {
        method: "POST",
        body: formData,
      });

      alert("Product added successfully!");
      setNewSweet({ name: "", category: "sweet", price: "", stock: "", image: null });
      fetchSweets();
    } catch (err) {
      alert(err.message || "Error adding sweet");
    }
  };

  /* ------------------ UPDATE SWEET ------------------ */
  const handleUpdateSweet = async (sweetId) => {
    if (!editingSweet.name || !editingSweet.category || !editingSweet.price || !editingSweet.stock) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editingSweet.name);
      formData.append("category", editingSweet.category);
      formData.append("price", Number(editingSweet.price));
      formData.append("stock", Number(editingSweet.stock));

      formData.append("available", editingSweet.available !== false);

      if (editingSweet.image instanceof File) {
        formData.append("image", editingSweet.image);
      }

      await apiRequest(`/sweets/${sweetId}`, {
        method: "PUT",
        body: formData,
      });

      alert("Product updated successfully!");
      setEditingSweet(null);
      fetchSweets();
    } catch (err) {
      alert(err.message || "Error updating sweet");
    }
  };

  /* ------------------ DELETE ------------------ */
  const handleDeleteSweet = async (sweetId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await apiRequest(`/sweets/${sweetId}`, { method: "DELETE" });
      fetchSweets();
    } catch (err) {
      alert(err.message || "Error deleting sweet");
    }
  };

  /* ------------------ RESTOCK ------------------ */
  const handleRestockSweet = async (sweetId) => {
    const quantity = parseInt(prompt("Enter restock quantity:"), 10);
    if (!quantity || quantity <= 0) return;

    try {
      await apiRequest(`/sweets/${sweetId}/restock`, {
        method: "POST",
        body: { quantity },
      });
      fetchSweets();
    } catch (err) {
      alert(err.message || "Error restocking sweet");
    }
  };

  /* ------------------ IMAGE PREVIEW ------------------ */
  const previewImage = (img) => {
    if (!img) return null;

    if (typeof img === "string") {
      const src = img.startsWith("http") ? img : `${BACKEND_URL}/uploads/${img}`;
      return (
        <img
          src={src}
          alt="sweet"
          className="h-12 w-12 object-cover rounded-xl border border-white/10"
        />
      );
    }

    if (img instanceof File || img instanceof Blob) {
      try {
        return (
          <img
            src={URL.createObjectURL(img)}
            alt="sweet"
            className="h-12 w-12 object-cover rounded-xl border border-white/10"
          />
        );
      } catch {
        return null;
      }
    }
    return null;
  };

  // Calculate sales insights
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalOrders = transactions.length;

  const getBestSeller = () => {
    const counts = {};
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      });
    });
    let best = "None";
    let max = 0;
    Object.entries(counts).forEach(([name, qty]) => {
      if (qty > max) {
        max = qty;
        best = `${name} (${qty} units)`;
      }
    });
    return best;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 glass rounded-2xl border border-white/5 shadow-2xl mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-amber-100">Admin Dashboard</h2>
          <p className="text-xs text-neutral-400">Manage products, update stock and view sales orders</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("sweets")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition cursor-pointer ${
              activeTab === "sweets"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-bold"
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/10"
            }`}
          >
            📋 Catalog Management
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition cursor-pointer ${
              activeTab === "sales"
                ? "bg-amber-500 text-neutral-950 border-amber-500 font-bold"
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/10"
            }`}
          >
            📈 Sales & Orders
          </button>
        </div>
      </div>

      {activeTab === "sweets" ? (
        <div className="space-y-8">
          {/* ADD SWEET FORM */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end bg-neutral-900/40 p-5 rounded-2xl border border-white/5">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Product Info</label>
              <input
                placeholder="Product Name"
                value={newSweet.name}
                onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Category</label>
              <select
                value={newSweet.category}
                onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition"
              >
                <option value="sweet">Sweet</option>
                <option value="cake">Cake</option>
                <option value="chocolate">Chocolate</option>
                <option value="chinese">Chinese Food</option>
                <option value="bihari">Bihari Food</option>
                <option value="rajasthani">Rajasthani Food</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Price (₹)</label>
              <input
                type="number"
                placeholder="Price"
                value={newSweet.price}
                onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Stock Qty</label>
              <input
                type="number"
                placeholder="Stock"
                value={newSweet.stock}
                onChange={(e) => setNewSweet({ ...newSweet, stock: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Product Photo</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={(e) => setNewSweet({ ...newSweet, image: e.target.files[0] })}
                  className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20"
                />
                {previewImage(newSweet.image)}
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={handleAddSweet}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl shadow transition duration-300 cursor-pointer"
              >
                Add Product to Catalog
              </button>
            </div>
          </div>

          {/* CATALOG TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-4">Image</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {sweets.map((sweet) => (
                  <tr key={sweet._id} className="hover:bg-white/5 transition">
                    <td className="py-3 pr-4">{previewImage(sweet.image)}</td>
                    <td className="py-3 pr-4 font-semibold text-neutral-100">{sweet.name}</td>
                    <td className="py-3 pr-4 capitalize text-neutral-400">{sweet.category}</td>
                    <td className="py-3 pr-4 text-amber-400 font-medium">₹{sweet.price}</td>
                    <td className="py-3 pr-4">
                      <span className={sweet.stock <= 3 ? "text-amber-500 font-bold" : "text-neutral-300"}>
                        {sweet.stock}
                      </span>
                      <div className="text-[10px] mt-0.5">
                        {sweet.available !== false ? (
                          <span className="text-emerald-400">Available</span>
                        ) : (
                          <span className="text-red-400">Unavailable</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={async () => {
                            try {
                              await apiRequest(`/sweets/${sweet._id}/toggle-availability`, { method: "POST" });
                              fetchSweets();
                            } catch (e) {
                              alert(e.message || "Failed to toggle availability");
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded-lg transition cursor-pointer ${
                            sweet.available !== false
                              ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {sweet.available !== false ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => setEditingSweet(sweet)}
                          className="px-2 py-1 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/20 transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestockSweet(sweet._id)}
                          className="px-2 py-1 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition cursor-pointer"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleDeleteSweet(sweet._id)}
                          className="px-2 py-1 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT SWEET MODAL POPUP */}
          {editingSweet && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
              <div className="glass p-6 rounded-2xl w-full max-w-md shadow-2xl relative space-y-4">
                <h3 className="text-xl font-serif font-bold text-amber-100">Modify Product</h3>
                <div className="space-y-3">
                  <input
                    value={editingSweet.name}
                    onChange={(e) => setEditingSweet({ ...editingSweet, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100"
                  />
                  <select
                    value={editingSweet.category}
                    onChange={(e) => setEditingSweet({ ...editingSweet, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100"
                  >
                    <option value="sweet">Sweet</option>
                    <option value="cake">Cake</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="chinese">Chinese Food</option>
                    <option value="bihari">Bihari Food</option>
                    <option value="rajasthani">Rajasthani Food</option>
                  </select>
                  <input
                    type="number"
                    value={editingSweet.price}
                    onChange={(e) => setEditingSweet({ ...editingSweet, price: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100"
                  />
                  <input
                    type="number"
                    value={editingSweet.stock}
                    onChange={(e) => setEditingSweet({ ...editingSweet, stock: e.target.value })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-neutral-100"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-available"
                      checked={editingSweet.available !== false}
                      onChange={(e) => setEditingSweet({ ...editingSweet, available: e.target.checked })}
                      className="rounded border-white/10 bg-neutral-950 text-amber-500 focus:ring-0"
                    />
                    <label htmlFor="edit-available" className="text-sm text-neutral-300">Available for Order</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) => setEditingSweet({ ...editingSweet, image: e.target.files[0] })}
                      className="block w-full text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-400"
                    />
                    {previewImage(editingSweet.image)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSweet(editingSweet._id)}
                    className="flex-grow py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingSweet(null)}
                    className="px-4 py-2 border border-white/15 text-neutral-400 hover:text-neutral-200 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* SALES & TRANSACTIONS TAB */
        <div className="space-y-6">
          {/* Revenue KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Gross Sales</p>
              <p className="text-3xl font-serif font-bold text-amber-400">₹{totalRevenue}</p>
            </div>
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Total Transactions</p>
              <p className="text-3xl font-serif font-bold text-neutral-200">{totalOrders}</p>
            </div>
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">Best-Selling Product</p>
              <p className="text-lg font-serif font-bold text-emerald-400 truncate mt-1">{getBestSeller()}</p>
            </div>
          </div>

          {loadingSales ? (
            <div className="text-center py-10 text-neutral-500 animate-pulse">Retrieving order ledger analytics...</div>
          ) : (
            /* Order List */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4">Order ID / Date</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Items Ordered</th>
                    <th className="pb-3 pr-4">Total Price</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Tracking</th>
                    <th className="pb-3 text-right">Address / Table</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-white/5 transition align-top">
                      <td className="py-3 pr-4">
                        <div className="font-mono text-xs text-amber-300">{t._id}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {new Date(t.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-neutral-200">{t.userId?.name || "Unknown"}</div>
                        <div className="text-[10px] text-neutral-500">{t.userId?.email || t.customerEmail}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${t.orderType === "Dine-In" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                          {t.orderType || "Delivery"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 space-y-0.5">
                        {t.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="text-xs">
                            {item.name} <span className="text-neutral-500">x{item.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 pr-4 font-bold text-neutral-200">₹{t.totalAmount}</td>
                      <td className="py-3 pr-4 text-xs text-neutral-400">{t.paymentMethod}</td>
                      <td className="py-3 pr-4 text-xs text-neutral-400">{t.trackingStatus || t.status}</td>
                      <td className="py-3 text-right text-xs text-neutral-400 max-w-xs truncate">
                        {t.orderType === "Dine-In" ? `Table: ${t.tableNumber || "N/A"}` : t.shippingAddress}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-neutral-500">
                        No sales registered in system yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
