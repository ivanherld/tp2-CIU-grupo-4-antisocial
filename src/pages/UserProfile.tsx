import { useEffect } from "react";
//se le pasa el nick name... Osea vos entras a tu perfil y te sale arriba en la pestaña el nickname del usuario y el nombre de la pagina
export default function UserProfile() {
  useEffect(()=>{
    document.title = 'nickName - Unahur Anti-Social Net'
  }, []);  
  return (
    <main>
        <h1>Perfil</h1>
    </main>
  )
}
