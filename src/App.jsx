import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './components/Header';
import ExpenseList from './components/ExpenseList';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import SignUp from './components/SignUp';
import { BASE_URL } from '../config';

function App() {

  const [isLoggedIn,setIsLoggedIn] = useState(false);
 
  useEffect(()=>{
   if(localStorage.getItem("loggedInUser")){
      setIsLoggedIn(true);
   }
  },[])
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      
      <Routes>
        <Route path='/' element={isLoggedIn?<ExpenseList />:<Home/>}></Route>
        <Route path='/Login' element={<Login setIsLoggedIn={setIsLoggedIn}/>}></Route>
        <Route path='/SignUp' element={<SignUp/>}></Route>
      </Routes>
    </>
  )
}



export default App
