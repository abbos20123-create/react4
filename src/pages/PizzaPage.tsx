import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

type Pizza = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
};

type BasketItem = {
  id: string;
  pizzaId: string;
  price: number;
  quantity:number
};

const sortLabels = {
  popular: "популярности",
  price: "по цене",
  alphabet: "по алфавиту",
};

export default function PizzaPage() {

  const {user}=useAuthContext()

  



  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Bce");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState<"popular" | "price" | "alphabet">("popular");
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { type: string; size: number }>>({});
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getPizzas();
    getCategories();
  }, []);

  useEffect(() => {
  getBasket();
}, [user]);

  const getBasket = async () => {
  if (!user) {
    setBasket([]);
    return;
  }

  try {
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
  } catch (error) {
    console.error(error);
  }
};

  const getPizzas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pizzas"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Pizza, "id">),
      }));
      setPizzas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Category, "id">),
      }));
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToBasket = async (pizza: Pizza) => {

    if(!user){
      toast.warning("login qiling")
      return;
    }

    

    const current = selectedOptions[pizza.id] || {
      type: "тонкое",
      size: 30,
    };

    try {
      await addDoc(collection(db, "basket"), {
        userId: user.uid,
        userEmail: user.email,

        pizzaId: pizza.id,
        name: pizza.name,
        image: pizza.image,
        price: pizza.price,
        category: pizza.category,
        type: current.type,
        size: current.size,
        quantity: 1,
      });
      toast.success("qoshildi")
      getBasket();
    } catch (error) {
      console.error(error);
    }
  };

  const Logout=()=>{
    signOut(auth)
    navigate("/login")
  }








  const filteredPizzas = (
    selectedCategory === "Bce"
      ? pizzas
      : pizzas.filter((pizza) => pizza.category === selectedCategory)
  ).sort((a, b) => {
    if (sortType === "price") return a.price - b.price;
    if (sortType === "alphabet") return a.name.localeCompare(b.name);
    return 0;
  });

  const basketCount = basket.length;
  
  const basketPrice = basket.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

  return (
    <div className="pizza-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="pizza-icon">🍕</span>
          <div>
            <h2>REACT PIZZA</h2>
            <p>самая вкусная пицца во вселенной</p>
          </div>
        </div>

        <div >
          <button onClick={() => navigate("/basket")} className="cart-btn">
          {basketPrice} ₽ <span>|</span> 🛒 {basketCount}
        </button>

        <button
        onClick={() => navigate("/login")}
        className="bg-emerald-500 mx-3 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded shadow-md transition-all duration-300 hover:scale-105"
      >
        Login
      </button>

      <button
        onClick={Logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded shadow-md transition-all duration-300 hover:scale-105"
      >
        Logout
      </button>

        </div>

        
        
      </header>

      {/* Filters */}
      <div className="filters">
        <div className="categories">
          <button
            className={selectedCategory === "Bce" ? "active" : ""}
            onClick={() => setSelectedCategory("Bce")}
          >
            Bce
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={selectedCategory === category.name ? "active" : ""}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="sort">
          <span>Сортировка по:</span>

          <button className="sort-btn" onClick={() => setSortOpen(!sortOpen)}>
            {sortLabels[sortType]}
          </button>

          {sortOpen && (
            <div className="dropdown">
              {(["popular", "price", "alphabet"] as const).map((type) => (
                <p
                  key={type}
                  className={sortType === type ? "selected" : ""}
                  onClick={() => {
                    setSortType(type);
                    setSortOpen(false);
                  }}
                >
                  {sortLabels[type]}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <h1 className="title">Bce пиццы</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="pizza-grid">
          {filteredPizzas.map((pizza) => (
            <div className="pizza-card" key={pizza.id}>
              <img src={pizza.image} alt={pizza.name} />

              <h3>{pizza.name}</h3>

              <div className="options">
                {(() => {
                  const current = selectedOptions[pizza.id] || {
                    type: "тонкое",
                    size: 30,
                  };

                  return (
                    <>
                      <div className="types">
                        {["тонкое", "традиционное"].map((type) => (
                          <button
                            key={type}
                            className={current.type === type ? "active" : ""}
                            onClick={() =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [pizza.id]: { ...current, type },
                              })
                            }
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="sizes">
                        {[26, 30, 40].map((size) => (
                          <button
                            key={size}
                            className={current.size === size ? "active" : ""}
                            onClick={() =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [pizza.id]: { ...current, size },
                              })
                            }
                          >
                            {size} см.
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bottom">
                <span>от {pizza.price} ₽</span>
                <button onClick={() => addToBasket(pizza)} className="add-btn">
                  + Добавить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}