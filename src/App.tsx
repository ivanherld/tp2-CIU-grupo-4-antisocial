import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import AuthProvider from './context/AuthProvider';
import PublicLayout from './components/PublicLayout';
import PrivateLayout from './components/PrivateLayout';
import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';
import About from './pages/About';
import Terms from './pages/Terms';
import Help from './pages/Help';

function App() {
  
  return (
    <>
      <AuthProvider> 
        <Routes>
          <Route element={<PublicLayout/>}>
            <Route path='/' element={<Inicio/>}/>
            <Route path='/nosotros' element={<Nosotros/>}/>
            <Route path='/login' element={<LogIn/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/help' element={<Help/>}/>
          </Route>

          <Route element={<PrivateLayout/>}>
            <Route path='/feed' element={<Feed/>}/>
            <Route path="/users/:username" element={<UserProfile/>}/>
            <Route path='profile/me' element={<UserProfile/>}/>
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

