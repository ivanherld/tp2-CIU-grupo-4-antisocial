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

function App() {
  //no se a quienes deberia envolver AuthProvider
  return (
    <>
      <AuthProvider> 
        <Routes>
          <Route element={<PublicLayout/>}>
            <Route path='/' element={<Inicio/>}/>
            <Route path='/nosotros' element={<Nosotros/>}/>
            <Route path='/login' element={<LogIn/>}/>
            <Route path='/register' element={<Register/>}/>
          </Route>


          
            <Route path='/feed' element={<Feed/>}/>
            <Route path='/profile' element={
              <PrivateLayout>
                <UserProfile/>
              </PrivateLayout>}/>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

