import React, { Fragment, useState } from 'react';
import Card from '../Card/Card';
import FilterButtons from '../Filter/Filter';
import Semaphore from '../Semaphore/Semaphore';
import Buttons from '../Buttons/Buttons';
import ErrorModal from '../UI/ErrorModal/ErrorModal';

import './SetUp.css';


const SetUp = props => {

  const [buttons, setButtons] = useState({ hideAdd: false, hideSemaphore: true });
  const [warningMessage, setWarningMessage] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [toRenderList, setToRenderList] = useState([]);
  const [error, setError] = useState('')

  const toggleButtons = () => {
    setButtons(state => ({
      hideAdd: !state.hideAdd,
      hideSemaphore: !state.hideSemaphore
    }))
  }

  const validateInput = () => {
    if (list.find(el => el.info === currentTask.trim())) {
      setWarningMessage(true)
      setTimeout(() => setWarningMessage(false), 1500)
      return
    }
    toggleButtons();
  }

  const addTOList = (color) => {
    let currTask = currentTask.trim();
    if (list.find(element => element.info === currTask) || currTask === '') {
      toggleButtons();
      return setCurrentTask('')
    }

    setList(currList => [...currList, { info: currTask, color: color }]);
    setToRenderList(currList => [...currList, { info: currTask, color: color }])
    setCurrentTask('');
    toggleButtons();
  }

  const handleChange = (e) => {
    setCurrentTask(e.target.value)
  }

  const filterItems = (target) => {
    let currentFilteredItems = [...filteredItems];
    if (currentFilteredItems.includes(target)) {
      currentFilteredItems = currentFilteredItems.filter(el => el !== target)
    } else {
      currentFilteredItems = [...currentFilteredItems, target]
    }

    setFilteredItems(currentFilteredItems)
    setToRenderList(() => list.filter(el => currentFilteredItems.includes(el.color)))
  }

  const markAsDone = (target) => {
    let targetIndex = list.findIndex(element => element.info === target)
    let listCopy = [...list];

    if (listCopy[targetIndex].color === 'done') {
      listCopy[targetIndex] = { info: target, color: list[targetIndex].previousColor }
    }
    else {
      listCopy[targetIndex] = { info: target, previousColor: list[targetIndex].color, color: 'done' }
    }
    setList(listCopy)
  }

  const editTask = (target) => {
    deleteTask(target)
    setCurrentTask(target.trim())
  }

  const deleteTask = (target) => {
    setList(currList => currList.filter(item => item.info !== target))
  }

  const styleProp = (target) => {
    let style = { border: '2px solid', width: '18px', height: '18px' };
    return filteredItems.includes(target) ? style : null
  }

  const clearList = (command) => {
    if (command === 'done') {
      setList(currList => currList.filter(el => el.color !== 'done'))
    } else {
      setList([])
    }
  }

  return (
    <Fragment >
      {error && <ErrorModal closeModal={() => setError('')}/>}
      <div className='interaction-wrapper'>
        <input type='text' placeholder="Add new task"
          onChange={handleChange}
          value={warningMessage ? 'Task already in list' : currentTask}
          style={warningMessage ? { border: '3px solid red', color: 'tomato', fontWeight: 'bold' } : null}
        />
        {buttons.hideAdd ? null : <button onClick={validateInput}>Add</button>}
        {buttons.hideSemaphore ? null : <Semaphore addTOList={addTOList} />}
      </div>
      {list.length >= 1 ? <FilterButtons filterItems={filterItems} style={styleProp} /> : null}
      <Card
        list={filteredItems.length === 0 ? list : toRenderList}
        markAsDone={markAsDone}
        editTask={editTask}
        deleteTask={deleteTask} />
      {list.length >= 1 ? <Buttons clearList={clearList} /> : <h2>Add some great stuff!</h2>}
    </Fragment>
  )

}

export default SetUp