import React, { useState } from 'react';
import './App.css';
import SetUp from './components/SetUp/SetUp';
import UserIcon from './components/UI/userIcon/userIcon';
import LogOutIcon from './components/UI/logoutButton/logoutButton';
import Auth from './components/Auth/Auth';

function App() {

   const [isAuth, setIsAuth] = useState(false)
   const [userModal, setUserModal] = useState(false);

   const toggleUserModal = () => {
     setUserModal(userModal => !userModal)
   }

   

  return (
    <div className='outer-wrapper'>
      {/* add some display message with user email */}
      {!isAuth ? <UserIcon click={toggleUserModal}/> : <LogOutIcon onLogOut={toggleUserModal} />}
      {!userModal && <Auth closeModal={toggleUserModal}/>}
      <div className='main-wrapper'>
        <h1>To Do (or Not to Do?) List</h1>
        <SetUp />
      </div>
    </div>
  )
}


export default App;
