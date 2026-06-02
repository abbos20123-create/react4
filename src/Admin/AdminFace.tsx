import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

function AdminFace() {
  const navigate = useNavigate();
  const location = useLocation();


  if (location.pathname === "/admin") {
    navigate("/admin/pizzas");
  }

// const {user}=useAuthContext();

//   const isAdmin = user?.role === "admin";
//   if (!isAdmin) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="bg-white p-5 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Access Denied
//           </h1>
//           <p className="text-gray-500 mt-2">
//             You do not have permission to access this page.
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="mt-4 text-blue-500 hover:underline"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

  const navItems = [
    { label: "Pizza Control", path: "/admin/pizzas" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Management Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-gray-400">
          © 2026 Pizza Admin
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminFace;