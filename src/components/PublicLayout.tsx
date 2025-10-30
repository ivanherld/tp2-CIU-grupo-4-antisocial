import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <>
        <Navbar/>
        <main style={{backgroundColor: "#f0f2f5"}}>
            <Outlet/>
        </main>
    </>
  )
}
