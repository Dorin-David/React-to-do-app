import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './userIcon.css';

const userIcon = props => (
    // <div className='user-button-wrapper'>
        <FaUserCircle
         className='user-button'
         title='user'
        />
    // </div>
)

export default userIcon