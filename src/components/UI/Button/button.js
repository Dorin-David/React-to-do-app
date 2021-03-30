import React from 'react';

const button = props => (
    <button
        className={props.className}
        onClick={props.click}
        disabled={props.disabled}
    >{props.children}</button>
)


export default button