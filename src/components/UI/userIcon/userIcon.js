import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './userIcon.css';

const userIcon = props => (
        <FaUserCircle
         className='user-button'
         title='user'
         onClick={props.click}
        />
)

export default userIcon