import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import './logoutButton.css';

const logoutButton = props => (
    <FiLogOut 
    className='log-out-button'
    title='logout'
    onClick={props.onLogOut}
    >LOG OUT</FiLogOut>
)

export default logoutButton
