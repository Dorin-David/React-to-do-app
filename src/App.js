import React from 'react';
import './App.css';
import SetUp from './components/SetUp/SetUp';

function App() {
  return (<div className='main-wrapper'>
            <h1>To Do (or Not to Do?) List</h1>
            <SetUp />
         </div>)
} 


export default App;

/*
ToDO

1) add filter buttons for showing various colors
2) editing must be done in place
3) add a delete button for the done tasks
4) learn drag in drop and add it to organize tasks
*/