import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

type Pizza = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
};

const emptyForm = { name: "", price: "", image: "", category: "" };

export default function PizzaControl() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pizzas"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Pizza, "id">),
      }));
      setPizzas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;

    try {
      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "pizzas", editingId), { ...form });
        setEditingId(null);
      } else {
        // CREATE
        await addDoc(collection(db, "pizzas"), { ...form });
      }
      setForm(emptyForm);
      fetchPizzas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingId(pizza.id);
    setForm({
      name: pizza.name,
      price: pizza.price,
      image: pizza.image,
      category: pizza.category,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pizzas", id));
      fetchPizzas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
  <div className="min-h-screen bg-gray-100 p-4">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🍕 Pizza Control</h2>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? "Edit Pizza" : "Add New Pizza"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Price"
            type="text"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price:e.target.value})
            }
          />

          <input
            className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <input
            className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition"
          >
            {editingId ? "Save Changes" : "Add Pizza"}
          </button>

          {editingId && (
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-md rounded-2xl mt-4 overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pizzas.map((pizza) => (
                <tr
                  key={pizza.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>

                  <td className="p-3 font-medium">{pizza.name}</td>
                  <td className="p-3 text-orange-600 font-semibold">
                    {pizza.price} ₽
                  </td>
                  <td className="p-3">{pizza.category}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(pizza)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(pizza.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
}