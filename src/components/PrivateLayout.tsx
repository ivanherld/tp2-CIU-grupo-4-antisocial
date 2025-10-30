import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";



export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return null; // Le voy a poner un spinner de carga

  return usuario ? <>{children}</> : <Navigate to="/login" replace />;
}

