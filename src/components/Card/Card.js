import {AiFillDelete} from 'react-icons/ai';
import {RiEditBoxFill} from 'react-icons/ri';
import {IoMdDoneAll} from 'react-icons/io';
import './Card.css'

let Card = props => props.list.map(element => 
       <div className={`card ${element.color}`}>
          <p className='task-info'>{element.info}</p> 
          <div className='btn-wrapper'>
          <IoMdDoneAll onClick={() => props.markAsDone(element.info)} className='task-manager task-done' title='mark as done'/>
          <RiEditBoxFill onClick={() => props.editTask(element.info)} className='task-manager edit-task' title='edit task'/>
          <AiFillDelete onClick={() => props.deleteTask(element.info)} className='task-manager delete-task' title='delete task'/>
          </div>
       </div>
    )

export default Card
