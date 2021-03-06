import React, { useState, useEffect, Fragment, useCallback } from 'react';
import SetUp from './components/SetUp/SetUp';
import UserIcon from './components/UI/userIcon/userIcon';
import LogOutIcon from './components/UI/logoutButton/logoutButton';
import Auth from './components/Auth/Auth';
import useAuth from './hooks/authHelper';
import Spinner from './components/UI/Spinner/Spinner';
import './App.css';

const App = () => {
  const [userModal, setUserModal] = useState(false);
  const { userAuthState, auth, authCheckState, logout } = useAuth()
  const { token, userId, error, loading } = userAuthState;

  const toggleUserModal = useCallback(() => {
    setUserModal(userModal => !userModal)
  }, [])

  const submitAuth = useCallback((email, password, command) => {
      auth(email, password, command)
  }, [auth])

  useEffect(() => {
    authCheckState().then(res => {
      //added Promise to make sure it waits for async response
    })
  }, [authCheckState])

  let userInterface = (
    <Fragment>
      <Spinner />
      <h2 className='loading-header'>Loading, please wait...</h2>
    </Fragment>
  );
  if (!loading) {
    userInterface = (
      <div className='outer-wrapper'>
        {!token ? <UserIcon click={toggleUserModal} /> : <LogOutIcon onLogOut={logout} />}
        {!userModal && !token &&
          <Auth
            closeModal={toggleUserModal}
            submitAuth={submitAuth}
            errorMessage={error}
          />}
        <div className='main-wrapper'>
          <h1>To Do (or Not to Do?) List</h1>
          <SetUp
            userId={userId}
            token={token}
          />
        </div>
      </div>
    )
  }

  return userInterface
}


export default App;
