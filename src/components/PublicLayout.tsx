import Footer from './Footer/Footer'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className='d-flex flex-column min-vh-100'>
        <Navbar/>
        <main style={{backgroundColor: "#f0f2f5"}} className='flex-fill'>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}
