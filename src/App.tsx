import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<LogIn/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/feed' element={<Feed/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App

