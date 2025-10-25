import { useEffect } from "react";

function Feed() {
  useEffect(()=>{
    document.title = 'Feed - Unahur Anti-Social Net'
  }, []);  
  return (
    <main>
      <h1>Feed</h1>
    </main>
  )
}

export default Feed
