import React, { Component, Fragment } from 'react';
import Card from '../Card/Card';
import Filter from '../Filter/Filter';
import Semaphore from '../Semaphore/Semaphore';
import Buttons from '../Buttons/Buttons';
import './SetUp.css'

class SetUp extends Component {
  state = {
    list: [],
    filteredItems: [],
    toRenderList: [],
    currentTask: '',
    hideAdd: false,
    hideSemaphore: true,
    warningMessage: false

  }

  toggleButtons = () => {
    this.setState(state => ({
      hideAdd: !state.hideAdd,
      hideSemaphore: !state.hideSemaphore
    }))
  }

  validateInput = () => {
    if (this.state.list.find(el => el.info === this.state.currentTask.trim())) {
      this.setState({ warningMessage: true })
      setTimeout(() => this.setState({ warningMessage: false }), 1500)
      return
    }
    this.toggleButtons()
  }

  addTOList = (color) => {
    let currentTask = this.state.currentTask.trim();
    if (this.state.list.find(element => element.info === currentTask) || currentTask === '') { this.toggleButtons(); return this.setState({ currentTask: '' }) }
    this.setState(state => ({
      list: [...state.list, { info: currentTask, color: color }],
      currentTask: '',
      toRenderList: [state.list, { info: currentTask, color: color }]
    }))
    this.toggleButtons()
  }

  handleChange = (e) => {
    this.setState({
      currentTask: e.target.value
    })
  }

  filterItems = (target) => {
    let currentFilteredItems = [...this.state.filteredItems];
    if (currentFilteredItems.includes(target)) {
      currentFilteredItems = currentFilteredItems.filter(el => el !== target)
    } else {
      currentFilteredItems = [...currentFilteredItems, target]
    }

    this.setState(state => ({
      filteredItems: currentFilteredItems,
      toRenderList: [...state.list].filter(el => currentFilteredItems.includes(el.color))
    }))
  }

  markAsDone = (target) => {
    let targetIndex = this.state.list.findIndex(element => element.info === target)
    let listCopy = [...this.state.list];

    if (listCopy[targetIndex].color === 'done') {
      listCopy[targetIndex] = { info: target, color: this.state.list[targetIndex].previousColor }
    }
    else {
      listCopy[targetIndex] = { info: target, previousColor: this.state.list[targetIndex].color, color: 'done' }
    }

    this.setState({
      list: listCopy
    })
  }

  editTask = (target) => {
    this.deleteTask(target)
    this.setState({
      currentTask: target.trim()
    })
  }

  deleteTask = (target) => {
    this.setState(state => ({
      list: [...state.list].filter(item => item.info !== target)
    }))
  }

  styleProp = (target) => {
    let style = { border: '2px solid', width: '18px', height: '18px' };
    return this.state.filteredItems.includes(target) ? style : null
  }

  clearList = (command) => {
    if (command === 'done') {
      this.setState(state => ({ list: [...state.list].filter(el => el.color !== 'done') }))
    } else {
      this.setState({ list: [] })
    }
  }

  render() {
    return (
      <Fragment >
        <div className='interaction-wrapper'>
          <input type='text' placeholder="Add new task"
            onChange={this.handleChange}
            value={this.state.warningMessage ? 'Task already in list' : this.state.currentTask}
            style={this.state.warningMessage ? { border: '3px solid red', color: 'tomato', fontWeight: 'bold' } : null}
          />
          {this.state.hideAdd ? null : <button onClick={this.validateInput}>Add</button>}
          {this.state.hideSemaphore ? null : <Semaphore addTOList={this.addTOList} />}
        </div>
        {this.state.list.length >= 1 ? <Filter filterItems={this.filterItems} style={this.styleProp} /> : null}
        <Card list={this.state.filteredItems.length === 0 ? this.state.list : this.state.toRenderList}
          markAsDone={this.markAsDone} editTask={this.editTask} deleteTask={this.deleteTask} />
        {this.state.list.length >= 1 ? <Buttons clearList={this.clearList} /> : <h2>Add some great stuff!</h2>}
      </Fragment>
    )
  }
}

export default SetUp