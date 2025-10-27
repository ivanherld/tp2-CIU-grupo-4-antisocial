import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
    </>
  )
}
