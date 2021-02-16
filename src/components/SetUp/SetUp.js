import React from 'react'
import Card from '../Card/Card'
import './SetUp.css'

class SetUp extends React.Component {
    state = {
      list: [],
      currentTask: '',
      hideAdd: false,
      hideSemaphore: true
    }
  
    toggleButtons = () => {
      this.setState({
        hideAdd: !this.state.hideAdd,
        hideSemaphore: !this.state.hideSemaphore
      })
    }

    addTOList = (color) => {
      let currentTask = this.state.currentTask;
       if(this.state.list.find(element => element.info === currentTask) || currentTask === '')  {this.toggleButtons();  return this.setState({currentTask: ''})}
       this.setState({
         list: [...this.state.list, {info: currentTask, color: color}],
         currentTask: ''
       })
       this.toggleButtons()
    }

    handleChange = (e) => {
      this.setState({
        currentTask: e.target.value
      })
    }

    deleteTask = (target) => {
      this.setState({
        list: [...this.state.list].filter(item => item.info !== target)
      })
    }

    editTask = (target) => {
      this.deleteTask(target)
      this.setState({
        currentTask: target
      })
    }

    markAsDone = (target) => {
      let targetIndex = this.state.list.findIndex(element => element.info === target)
      let listCopy = [...this.state.list];

        if(listCopy[targetIndex].color === 'done') {
          listCopy[targetIndex] = {info: target, color: this.state.list[targetIndex].previousColor}}
        else {
          listCopy[targetIndex] = {info: target, previousColor: this.state.list[targetIndex].color, color: 'done'}}

      this.setState({
        list: listCopy
      }) 
    }

    clearAll = () => {
      this.setState({list: []})
    }
    
    render(){
      return (
        <div >
        <div className='interaction-wrapper'> 
           <input type='text' maxlength="40" placeholder="New Task (max 25 characters)" onChange={this.handleChange} value={this.state.currentTask}></input>
           {this.state.hideAdd ? null : <button onClick={this.toggleButtons}>Add</button>}
           {this.state.hideSemaphore ? null :
           <div className='semaphore'>
           <div id='green' onClick={() => this.addTOList('green')}></div>
           <div id='yellow' onClick={() => this.addTOList('yellow')}></div>
           <div id='red' onClick={() => this.addTOList('red')}></div>
         </div>}
        </div>
         <Card 
         list={this.state.list}
         deleteTask={this.deleteTask}
         editTask={this.editTask}
         markAsDone={this.markAsDone}
         />
         <button className='clear-all' onClick={this.clearAll}>Clear Items</button>
      </div>
    )
    }
}

export default SetUp