import React from 'react'
import Card from '../Card/Card'
import Filter from '../Filter/Filter'
import './SetUp.css'

class SetUp extends React.Component {
    state = {
      list: [],
      currentTask: '',
      hideAdd: false,
      hideSemaphore: true,
      filteredItems: [],
      toRenderList: []
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
         currentTask: '',
         toRenderList: [this.state.list, {info: currentTask, color: color}]
       })
       this.toggleButtons()
    }

    handleChange = (e) => {
      this.setState({
        currentTask: e.target.value
      })
    }

    filterItems = (target) => {
      let currentFilteredItems = [...this.state.filteredItems];
      if(currentFilteredItems.includes(target)){
        currentFilteredItems = currentFilteredItems.filter(el => el !== target)
      } else {
        currentFilteredItems = [...currentFilteredItems, target]
      }

      this.setState({
        filteredItems: currentFilteredItems,
        toRenderList: [...this.state.list].filter(el => currentFilteredItems.includes(el.color))
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

    editTask = (target) => {
      this.deleteTask(target)
      this.setState({
        currentTask: target
      })
    }

    deleteTask = (target) => {
      this.setState({
        list: [...this.state.list].filter(item => item.info !== target)
      })
    }

    styleProp = (target) => {
      let style = {border: '2px solid', width: '18px', height: '18px'};
       return this.state.filteredItems.includes(target) ? style : null
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
         {this.state.list.length >= 1 ? <Filter filterItems={this.filterItems} style={this.styleProp}/> : null}
         <Card 
         list={this.state.filteredItems.length === 0 ? this.state.list : this.state.toRenderList}
         markAsDone={this.markAsDone}
         editTask={this.editTask}
         deleteTask={this.deleteTask}
         />
         <button className='clear-all' onClick={this.clearAll}>Clear Items</button>
      </div>
    )
    }
}

export default SetUp