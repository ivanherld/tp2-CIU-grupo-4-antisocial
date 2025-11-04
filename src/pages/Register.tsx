import { useEffect } from "react";

import FormRegister from "../components/FormRegister";
import AuthCard from "../components/AuthCard/AuthCard";

function Register() {
  useEffect(() => {
    document.title = "Register - Unahur Anti-Social Net";
  }, []);
  return (
     <AuthCard
      titulo="Registro"
      mostrarLink={false}
      textoLink="Inicia sesión"
      rutaLink="/login"
    >
      <FormRegister />
    </AuthCard>
  )
}
export default Register;
