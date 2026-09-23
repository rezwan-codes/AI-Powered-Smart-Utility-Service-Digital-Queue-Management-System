import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "citizen" | "technician" | "admin";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: Role[];
};

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, token, loading, initialized } = useAuth();
  const storedRole = (typeof window !== "undefined" ? localStorage.getItem("role") : null) as Role | null;
  const role = (user?.role.toLowerCase() as Role | undefined) ?? storedRole;

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/user/login" replace />;
  }

  if (roles && (!role || !roles.includes(role))) {
    const redirect =
      role === "admin"
        ? "/admin/dashboard"
        : role === "technician"
          ? "/technician/dashboard"
          : "/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
