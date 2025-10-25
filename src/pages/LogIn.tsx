import { useEffect } from "react";

function LogIn() {
  useEffect(()=>{
    document.title = 'LogIn - Unahur Anti-Social Net'
  }, []);  
  return (
    <main>
      <h1>Log in</h1>
    </main>
  )
}

export default LogIn
