import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import FeedNav from "./FeedNav/FeedNav";
import { ScrollToTopButton } from "./ScrollTopButton";
import { Spinner } from "react-bootstrap";



export default function PrivateLayout() {
  const { usuario, cargando } = useAuth();

  if (cargando) return <Spinner animation="border" role="status" style={{ fontFamily: "Montserrat, Arial, Helvetica, sans-serif", fontWeight: "600" }}><p className="visually-hidden">Cargando...</p></Spinner>; 

  if(!usuario) return <Navigate to="/login" replace />

  return (
    <>
      <FeedNav/>
      <Outlet/>
      <ScrollToTopButton
        estilos={{
          position: "fixed",
          bottom: "30px",
          right:"30px",
          backgroundColor:"#5fa92c",
          color:"white",
          border:"none",
          borderRadius:"50%",
          width:"45px",
          height:"45px",
          fontSize:"1.2rem",
          boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
          cursor:"pointer"
        }}
      />
    </>
  );
}



