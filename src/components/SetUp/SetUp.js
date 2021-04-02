import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Cards from '../Card/Cards';
import FilterButtons from '../Filter/Filter';
import Semaphore from '../Semaphore/Semaphore';
import Buttons from '../Buttons/Buttons';
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import Spinner from '../UI/Spinner/Spinner';
import axios from '../../axios-list';
import './SetUp.css';

/*
  To do:
   1) logic for deleting an element
   2) logic for deleting all done elements
   3) logic for deleting ALL elements (confirm pop-up)
   
*/

const SetUp = props => {

  const [buttons, setButtons] = useState({ hideAdd: false, hideSemaphore: true });
  const [warningMessage, setWarningMessage] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [toRenderList, setToRenderList] = useState([]);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const { token, userId } = props;

  const loadList = useCallback(() => {
    // console.log('SetUp triggered, token:', token)
     setLoading(true)
    axios.get('/list.json', {
      params: {
        auth: token,
        orderBy: '"userId"',
        equalTo: `"${userId}"`,
      }
    }).then(res => {
      setLoading(false)
      let list = [];
      for (let key in res.data) {
        list.push({ ...res.data[key], itemId: key })
      }
      setList(list)
    }).catch(rej => {
      setLoading(false)
      setError(rej.message)
    })
  }, [token, userId])

  useEffect(() => {
    if (token) {
      loadList()
    } else {
      setList([])
    }
  }, [token, userId, loadList])

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

  const addToList = (color) => {
    let currTask = currentTask.trim();
    if (list.find(element => element.info === currTask) || currTask === '') {
      toggleButtons();
      return setCurrentTask('')
    }
    setToRenderList(currList => [...currList, { info: currTask, color: color }])
    setCurrentTask('');
    toggleButtons();

    if (token) {
      setLoading(true)
      const dispatchTask = {
        info: currTask,
        color: color,
        userId: userId
      }

      axios.post('/list.json?auth=' + token, dispatchTask)
        .then(res => {
          loadList()
        })
        .catch(rej => {
          setError(rej.message)
        })
    } else {
      setList(currList => [...currList, { info: currTask, color: color }]);
    }
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
    //the logic for marking the items as done should be handled when the user logs out
    // or, rather, when the token is changed
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
     //note below
    deleteTask(target)
    setCurrentTask(target.trim())
  }

  const deleteTask = (syncTarget, asyncTarget) => {
    if(asyncTarget){
      setLoading(true)
      axios.delete(`list/${asyncTarget}.json`).then( res => {
        loadList()
      }).catch(rej => {
        setError(rej.message)
      })
    } else {
      setList(currList => currList.filter(item => item.info !== syncTarget))
    }
    
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

  let userInterface = <Spinner />
  if (!loading) {
    userInterface = (
      <Fragment>
        {list.length >= 1 ? <FilterButtons filterItems={filterItems} style={styleProp} /> : null}
        <Cards
          list={filteredItems.length === 0 ? list : toRenderList}
          markAsDone={markAsDone}
          editTask={editTask}
          deleteTask={deleteTask} />
        {list.length >= 1 ? <Buttons clearList={clearList} /> : <h2>Add some great stuff!</h2>}
      </Fragment>
    )
  }


  return (
    <Fragment >
      {error && <ErrorModal closeModal={() => setError('')} />}
      <div className='interaction-wrapper'>
        <input type='text' placeholder="Add new task"
          onChange={handleChange}
          value={warningMessage ? 'Task already in list' : currentTask}
          style={warningMessage ? { border: '3px solid red', color: 'tomato', fontWeight: 'bold' } : null}
        />
        {buttons.hideAdd ? null : <button onClick={validateInput}>Add</button>}
        {buttons.hideSemaphore ? null : <Semaphore addToList={addToList} />}
      </div>
        {userInterface}
    </Fragment>
  )

}

export default SetUp