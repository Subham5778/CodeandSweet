// frontend/src/components/AdminPanel.jsx
import { useState } from "react";
import { apiRequest } from "../api/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminPanel({ sweets = [], fetchSweets }) {
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: null,
  });

  const [editingSweet, setEditingSweet] = useState(null);

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

      alert("Sweet added successfully!");
      setNewSweet({ name: "", category: "", price: "", stock: "", image: null });
      fetchSweets();
    } catch (err) {
      alert(err.message);
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

      if (editingSweet.image instanceof File) {
        formData.append("image", editingSweet.image);
      }

      await apiRequest(`/sweets/${sweetId}`, {
        method: "PUT",
        body: formData,
      });

      alert("Sweet updated successfully!");
      setEditingSweet(null);
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ------------------ DELETE ------------------ */
  const handleDeleteSweet = async (sweetId) => {
    if (!window.confirm("Delete this sweet?")) return;

    try {
      await apiRequest(`/sweets/${sweetId}`, { method: "DELETE" });
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ------------------ RESTOCK ------------------ */
  const handleRestockSweet = async (sweetId) => {
    const quantity = parseInt(prompt("Enter restock quantity:"), 10);
    if (!quantity || quantity <= 0) return;

    try {
      await apiRequest(`/sweets/${sweetId}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      fetchSweets();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ------------------ IMAGE PREVIEW ------------------ */
  const previewImage = (img) => {
    if (!img) return null;

    if (typeof img === "string") {
      return (
        <img
          src={`${API_URL}/uploads/${img}`}
          alt="sweet"
          className="h-16"
        />
      );
    }

    return (
      <img
        src={URL.createObjectURL(img)}
        alt="sweet"
        className="h-16"
      />
    );
  };

  return (
    <div className="p-6 mb-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      {/* ADD */}
      <div className="mb-6">
        <input placeholder="Name" value={newSweet.name}
          onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />

        <input placeholder="Category" value={newSweet.category}
          onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} />

        <input type="number" placeholder="Price" value={newSweet.price}
          onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} />

        <input type="number" placeholder="Stock" value={newSweet.stock}
          onChange={e => setNewSweet({ ...newSweet, stock: e.target.value })} />

        <input type="file"
          onChange={e => setNewSweet({ ...newSweet, image: e.target.files[0] })} />

        {previewImage(newSweet.image)}
        <button onClick={handleAddSweet}>Add Sweet</button>
      </div>

      {/* LIST */}
      <table>
        <tbody>
          {sweets.map((sweet) => (
            <tr key={sweet._id}>
              <td>{sweet.name}</td>
              <td>{sweet.category}</td>
              <td>₹{sweet.price}</td>
              <td>{sweet.stock}</td>
              <td>{previewImage(sweet.image)}</td>
              <td>
                <button onClick={() => setEditingSweet(sweet)}>Edit</button>
                <button onClick={() => handleDeleteSweet(sweet._id)}>Delete</button>
                <button onClick={() => handleRestockSweet(sweet._id)}>Restock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT */}
      {editingSweet && (
        <div className="mt-4">
          <input value={editingSweet.name}
            onChange={e => setEditingSweet({ ...editingSweet, name: e.target.value })} />

          <input value={editingSweet.category}
            onChange={e => setEditingSweet({ ...editingSweet, category: e.target.value })} />

          <input type="number" value={editingSweet.price}
            onChange={e => setEditingSweet({ ...editingSweet, price: e.target.value })} />

          <input type="number" value={editingSweet.stock}
            onChange={e => setEditingSweet({ ...editingSweet, stock: e.target.value })} />

          <input type="file"
            onChange={e => setEditingSweet({ ...editingSweet, image: e.target.files[0] })} />

          {previewImage(editingSweet.image)}

          <button onClick={() => handleUpdateSweet(editingSweet._id)}>Save</button>
          <button onClick={() => setEditingSweet(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
