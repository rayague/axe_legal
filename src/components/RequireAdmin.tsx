import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

type RequireAdminProps = { children: React.ReactNode };

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user || !user.isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default RequireAdmin;
