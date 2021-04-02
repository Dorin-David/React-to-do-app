import { AiFillDelete } from 'react-icons/ai';
import { RiEditBoxFill } from 'react-icons/ri';
import { IoMdDoneAll } from 'react-icons/io';
import './Card.css'

const Card = props => (
   <div className={`card ${props.color}`}>
      <p className='task-info'>{props.info}</p>
      <div className='edit-btn-wrapper'>
         <IoMdDoneAll onClick={() => props.markAsDone(props.info, props.id)} className='task-manager task-done' title='mark as done' />
         <RiEditBoxFill onClick={() => props.editTask(props.info, props.id)} className='task-manager edit-task' title='edit task' />
         <AiFillDelete onClick={() => props.deleteTask(props.info, props.id)} className='task-manager delete-task' title='delete task' />

      </div>
   </div>
)



export default Card
