import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where,} from "firebase/firestore";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../providers/AuthProvider";
import { toast } from "sonner";



type BasketItem = {
  id: string;
  category: string;
  image: string;
  name: string;
  pizzaId: string;
  price: number;
  quantity: number;
  size: number;
  type: string;
};

export default function BasketPage() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
const navigate=useNavigate();

const {user}=useAuthContext();
  useEffect(() => {
    getBasket();
  }, []);

  const getBasket = async () => {
  if (!user) return;

  const q = query(
    collection(db, "basket"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BasketItem[];

  setBasket(data);
};

  const createOrder = async () => {
  if (basket.length === 0) return;

  const orderData = {
    userId: user?.uid,
    userEmail: user?.email,
    items: basket,
    totalCount,
    totalPrice,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "orders"), orderData);

  // orderdan keyin basketni tozalash
  await clearBasket();

  toast.success("Order created successfully!");
};




const increase = (item: BasketItem) => {
  setBasket((prev) =>
    prev.map((el) =>
      el.id === item.id
        ? { ...el, quantity: el.quantity + 1 }
        : el
    )
  );
};

const decrease = (item: BasketItem) => {
  if (item.quantity === 1) return;

  setBasket((prev) =>
    prev.map((el) =>
      el.id === item.id
        ? { ...el, quantity: el.quantity - 1 }
        : el
    )
  );
};




  

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, "basket", id));
    getBasket();
  };

  const clearBasket = async () => {
    await Promise.all(
      basket.map((item) =>
        deleteDoc(doc(db, "basket", item.id))
      )
    );

    getBasket();
  };

  const totalCount = basket.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  
return (
  <div className="min-h-screen bg-[#fff7f0] py-5 px-4">
    <div className="max-w-6xl mx-auto p-5 bg-white rounded-[40px] shadow-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 md:px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            🍕
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-wide">
              REACT PIZZA
            </h1>

            <p className="text-gray-400">
              самая вкусная пицца во вселенной
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        {/* Basket Title */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-4xl font-black flex items-center gap-3">
            🛒 Корзина
          </h1>

          <button
            onClick={clearBasket}
            className="text-gray-400 hover:text-red-500 transition"
          >
            Очистить корзину
          </button>
        </div>

        {/* Empty Basket */}
        {basket.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-5">🍕</div>

            <h2 className="text-3xl font-bold mb-3">
              Корзина пустая
            </h2>

            <p className="text-gray-400 mb-8">
              Добавьте пиццу для оформления заказа
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition"
            >
              Вернуться назад
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-5 flex flex-col gap-2">
              {basket.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-5"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-6">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-contain hover:scale-105 transition"
                    />

                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="text-2xl font-bold">
                        {item.name}
                      </h2>

                      <p className="text-gray-400 mt-1">
                        {item.type}, {item.size} см.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decrease(item)}
                        className="w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500 font-bold text-xl hover:bg-orange-500 hover:text-white transition"
                      >
                        −
                      </button>

                      <span className="text-2xl font-bold min-w-[40px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(item)}
                        className="w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500 font-bold text-xl hover:bg-orange-500 hover:text-white transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-3xl font-black text-orange-500 min-w-[140px] text-center">
                      {item.price * item.quantity} ₽
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500 transition"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 bg-orange-50 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <p className="text-2xl">
                  Всего пицц:
                  <span className="font-black ml-2">
                    {totalCount} шт.
                  </span>
                </p>

                <p className="text-2xl">
                  Сумма заказа:
                  <span className="font-black text-orange-500 ml-2">
                    {totalPrice} ₽
                  </span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 rounded-full border-2 border-gray-300 font-semibold hover:border-orange-500 hover:text-orange-500 transition"
              >
                ← Вернуться назад
              </button>

              <button
                onClick={createOrder}
                className="px-5 py-4 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg hover:scale-105 transition"
              >
                Оплатить сейчас
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);


}