import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const closeButton = props => (
    <AiOutlineClose
        title='close'
        onClick={props.onClose}
        className={props.className}
    />)

export default closeButton