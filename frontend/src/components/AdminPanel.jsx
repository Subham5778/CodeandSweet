// frontend/src/components/AdminPanel.jsx
import { useState } from "react";
import { apiRequest } from "../api/api";

const API_URL = import.meta.env.VITE_API_URL || "https://codeandsweet.onrender.com";

export default function AdminPanel({ sweets = [], fetchSweets }) {
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });

  const [editingSweet, setEditingSweet] = useState(null);

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

      await apiRequest("/sweets", { method: "POST", body: formData });

      alert("Sweet added successfully!");
      setNewSweet({ name: "", category: "", price: "", stock: "", image: null });
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

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
      if (editingSweet.image instanceof File) formData.append("image", editingSweet.image);

      await apiRequest(`/sweets/${sweetId}`, { method: "PUT", body: formData });

      alert("Sweet updated successfully!");
      setEditingSweet(null);
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSweet = async (sweetId) => {
    if (!window.confirm("Delete this sweet?")) return;
    try {
      await apiRequest(`/sweets/${sweetId}`, { method: "DELETE" });
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestockSweet = async (sweetId) => {
    const quantity = parseInt(prompt("Enter restock quantity:"), 10);
    if (!quantity || quantity <= 0) return;

    try {
      await apiRequest(`/sweets/${sweetId}/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  const previewImage = (img) => {
    if (!img) return null;
    return typeof img === "string" ? (
      <img src={`${API_URL}/uploads/${img}`} alt="sweet" className="h-16 w-16 object-cover rounded" />
    ) : (
      <img src={URL.createObjectURL(img)} alt="sweet" className="h-16 w-16 object-cover rounded" />
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🍬 Admin Panel</h2>

        {/* ADD SWEET */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Sweet</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <input
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              value={newSweet.name}
              onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
            />
            <input
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Category"
              value={newSweet.category}
              onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
            />
            <input
              type="number"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Price"
              value={newSweet.price}
              onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
            />
            <input
              type="number"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Stock"
              value={newSweet.stock}
              onChange={(e) => setNewSweet({ ...newSweet, stock: e.target.value })}
            />
            <input
              type="file"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setNewSweet({ ...newSweet, image: e.target.files[0] })}
            />
            {previewImage(newSweet.image)}
            <button
              onClick={handleAddSweet}
              className="col-span-1 md:col-span-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Add Sweet
            </button>
          </div>
        </div>

        {/* SWEETS LIST */}
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">All Sweets</h3>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet._id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border">{sweet.name}</td>
                  <td className="p-2 border">{sweet.category}</td>
                  <td className="p-2 border">₹{sweet.price}</td>
                  <td className="p-2 border">{sweet.stock}</td>
                  <td className="p-2 border">{previewImage(sweet.image)}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => setEditingSweet(sweet)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSweet(sweet._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleRestockSweet(sweet._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EDIT SWEET */}
        {editingSweet && (
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Sweet</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <input
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingSweet.name}
                onChange={(e) => setEditingSweet({ ...editingSweet, name: e.target.value })}
              />
              <input
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingSweet.category}
                onChange={(e) => setEditingSweet({ ...editingSweet, category: e.target.value })}
              />
              <input
                type="number"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingSweet.price}
                onChange={(e) => setEditingSweet({ ...editingSweet, price: e.target.value })}
              />
              <input
                type="number"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingSweet.stock}
                onChange={(e) => setEditingSweet({ ...editingSweet, stock: e.target.value })}
              />
              <input
                type="file"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setEditingSweet({ ...editingSweet, image: e.target.files[0] })}
              />
              {previewImage(editingSweet.image)}
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdateSweet(editingSweet._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSweet(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
