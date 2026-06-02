import { Navigate } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.email !== "admin@gmail.com") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}