import React from 'react';
import './Semaphore.css'

const semaphore = props => (<div className='semaphore'>
                                <div id='green' onClick={() => props.addTOList('green')} title="I should"></div>
                                <div id='yellow' onClick={() => props.addTOList('yellow')} title="Maybe..."></div>
                                <div id='red' onClick={() => props.addTOList('red')} title="But..."></div>
                            </div>)

export default semaphore