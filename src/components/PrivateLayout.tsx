import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import FeedNav from "./FeedNav/FeedNav";



export default function PrivateLayout() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>; // Le voy a poner un spinner de carga

  if(!usuario) return <Navigate to="/login" replace />

  return (
    <>
      <FeedNav/>
      <Outlet/>
    </>
  );
}

