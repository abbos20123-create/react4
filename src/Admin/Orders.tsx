import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

type Order = {
  id: string;
  userId:string;
  userEmail:string;
  items: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: number;
    type: string;
  }[];
  totalPrice: number;
  totalCount: number;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }));
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Orders
        </h2>

        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No orders yet
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md border p-5 hover:shadow-lg transition"
            >
              {/* TOP INFO */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-medium text-gray-800">
                    {order.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>
                  <p className="font-mono text-sm text-gray-700">
                    {order.id}
                  </p>
                  
                </div>
                

                <div className="flex gap-4">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Items: {order.totalCount}
                  </div>

                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    {order.totalPrice} ₽
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 border rounded-xl p-3 hover:bg-gray-50 transition"
                  >
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {item.type} • {item.size} cm
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity} × {item.price} ₽
                      </p>
                    </div>
                    
                  </div>
                  
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}