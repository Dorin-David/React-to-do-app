import React from 'react';
import './App.css';
import SetUp from './components/SetUp/SetUp';
import UserIcon from './components/UI/userIcon/userIcon';
import Auth from './components/Auth/Auth';

function App() {
  return (
    <div className='outer-wrapper'>
      <UserIcon />
      <Auth />
      <div className='main-wrapper'>
        <h1>To Do (or Not to Do?) List</h1>
        <SetUp />
      </div>
    </div>
  )
}


export default App;
