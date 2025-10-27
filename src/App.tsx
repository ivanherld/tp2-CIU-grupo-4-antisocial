import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import AuthProvider from './context/AuthProvider';

function App() {
  //no se a quienes deberia envolver AuthProvider
  return (
    <>
      <AuthProvider> 
        <Routes>
          <Route path='/' element={<LogIn/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/feed' element={<Feed/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
