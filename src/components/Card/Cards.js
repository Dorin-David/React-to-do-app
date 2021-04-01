import React from 'react';
import Card from './Card';


const cards = props => props.list.map(element => 
    <Card
      key={element.info}
      color={element.color}
      info={element.info}
      markAsDone={props.markAsDone}
      editTask={props.editTask}
      deleteTask={props.deleteTask}
    />)

export default cards