import { useEffect } from "react";
import Footer from "../components/Footer";
import UserProfile from "./UserProfile";

function LogIn() {
  useEffect(()=>{
    document.title = 'LogIn - Unahur Anti-Social Net'
  }, []);  
  return (
    <main>
      <UserProfile />
      <Footer />
    </main>
  )
}

export default LogIn
