import React, { useState } from 'react';
import SetUp from './components/SetUp/SetUp';
import UserIcon from './components/UI/userIcon/userIcon';
import LogOutIcon from './components/UI/logoutButton/logoutButton';
import Auth from './components/Auth/Auth';
import useAuth from './hooks/authHelper'

import './App.css';

function App() {

   const [isAuth, setIsAuth] = useState(false); 
   const [userModal, setUserModal] = useState(false);
   const { userAuthState, auth, authCheckState } = useAuth()

   const toggleUserModal = () => {
      setUserModal(userModal => !userModal)
    }

  const submitAuth = (email, password, command) => {
    console.log('[App.js] triggered with:', email, password, command)
        auth(email, password, command)   
  }

  return (
    <div className='outer-wrapper'>
      {!isAuth ? <UserIcon click={toggleUserModal}/> : <LogOutIcon />}
      {!userModal && 
      <Auth 
      closeModal={toggleUserModal} 
      submitAuth={submitAuth}
      />}
      <div className='main-wrapper'>
        <h1>To Do (or Not to Do?) List</h1>
        <SetUp />
      </div>
    </div>
  )
}


export default App;
