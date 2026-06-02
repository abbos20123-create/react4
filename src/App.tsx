import { Route, Routes } from "react-router-dom"
import PizzaPage from "./pages/PizzaPage"
import BasketPage from "./pages/BasketPage"
import AdminFace from "./Admin/AdminFace"
import PizzaControl from "./Admin/PizzaControl"
import Orders from "./Admin/Orders"
import Users from "./Admin/Users"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminRoute from "./providers/AdminRoute"
import { Toaster } from "sonner";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <>
    <Toaster position="top-right" richColors/>  
    <Routes>
      
      <Route path="/" element={<PizzaPage/>} />
      <Route path="/basket" element={<BasketPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminFace />
    </AdminRoute>
  }
>
  <Route path="pizzas" element={<PizzaControl />} />
  <Route path="orders" element={<Orders />} />
  <Route path="users" element={<Users />} />
</Route>



    </Routes>
    </>
    
  )
}

export default App