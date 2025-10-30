import { useEffect } from "react";
import FormLogin from "../components/FormLogin";
import AuthCard from "../components/AuthCard/AuthCard";

function LogIn() {

  useEffect(()=>{
    document.title = 'Login - Unahur Anti-Social Net'
  }, []);  


  return (
    <AuthCard
      titulo="Iniciar sesión"
      mostrarLink={true}
      textoLink="¿No tenés una cuenta?"
      rutaLink="/register"
    >
      <FormLogin onLoginSuccess={() => { /* no-op: login flow handled inside FormLogin */ }} />
    </AuthCard>
        
  )
}

export default LogIn
