import { useEffect } from "react";
import AuthCard from "../components/AuthCard";
import FormRegister from "../components/FormRegister";

function Register() {
  useEffect(()=>{
    document.title = 'Register - Unahur Anti-Social Net'
  }, []);  
  return (
    <AuthCard
      titulo="Registro"
    >
      <FormRegister/>
    </AuthCard>
  )
}
export default Register
