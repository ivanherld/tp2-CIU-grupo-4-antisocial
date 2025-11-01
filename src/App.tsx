import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Terms from './pages/Terms';
import Help from './pages/Help';

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' element={<LogIn/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/feed' element={<Feed/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
  <Route path='/about' element={<About/>}/>
  <Route path='/terms' element={<Terms/>}/>
  <Route path='/help' element={<Help/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
