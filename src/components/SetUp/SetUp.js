import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Cards from '../Card/Cards';
import FilterButtons from '../Filter/Filter';
import Semaphore from '../Semaphore/Semaphore';
import Buttons from '../Buttons/Buttons';
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import Spinner from '../UI/Spinner/Spinner';
import axios from '../../axios-list';
import './SetUp.css';

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
      setList(list.sort((a, b) => new Date(a.date) - new Date(b.date)))
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

  const addToList = (color, asyncUpdate) => {
    const currTask = currentTask.trim();
    if(!asyncUpdate){
      if (list.find(element => element.info === currTask) || currTask === '') {
        toggleButtons();
        return setCurrentTask('')
      }
    }
    
    if (token) {
      setLoading(true)
      const dispatchTask = {
        info: currTask,
        color: color,
        prevColor: color,
        userId: userId,
        date: new Date()
      } 
      if(color){
        toggleButtons()
      }
      axios.post('/list.json?auth=' + token, (asyncUpdate || dispatchTask))
        .then(res => {
          loadList()
        })
        .catch(rej => {
          setError(rej.message)
        })
    } else {
      setToRenderList(currList => [...currList, { info: currTask, color: color }])
      setList(currList => [...currList, { info: currTask, color: color }]);
      toggleButtons();
    }
  
    setCurrentTask('');
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

  const markAsDone = (syncTarget, asyncTarget) => {
    let targetIndex = list.findIndex(element => element.info === syncTarget)
    let listCopy = [...list];
    let targetItem = listCopy[targetIndex];

    if (targetItem.color === 'done') {
      targetItem = { ...targetItem, color: list[targetIndex].previousColor }
    } else {
      targetItem = { ...targetItem, previousColor: list[targetIndex].color, color: 'done' }
    }
    listCopy[targetIndex] = targetItem
    if (asyncTarget) {
      deleteTask(syncTarget, asyncTarget, targetItem)
    } else {
      setList(listCopy)
    }


  }

  const editTask = (syncTarget, asyncTarget) => {
    deleteTask(syncTarget, asyncTarget)
    setCurrentTask(syncTarget.trim())
  }

  const deleteTask = (syncTarget, asyncTarget, updatedObject) => {
    if (asyncTarget) {
      setLoading(true)
      axios.delete(`list/${asyncTarget}.json`).then(res => {
        if (updatedObject) {
         addToList(null, updatedObject)
        } else {
          loadList()
        }
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

  const test = () => {
    const pendingList = list.filter(el => el.color !== 'done')
    axios.delete(`list.json`).then(res => {
        let updatedList = {}

        for(let item of pendingList){
          updatedList[item.itemId]= item
        }
         console.log('delete is done')
         console.log(pendingList)
      // return axios.post('/list.json?auth=' + token, { ...pendingList }).then(res => {
      //   console.log('posting is done')
      //   loadList()
      // })
    })


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
        {list.length >= 1 ? <Buttons clearList={test} /> : <h2>Add some great stuff!</h2>}
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