import React from 'react';
import './Semaphore.css'

const semaphore = props => (<div className='semaphore'>
                                <div id='green' onClick={() => props.addToList('green')} title="I should"></div>
                                <div id='yellow' onClick={() => props.addToList('yellow')} title="Maybe..."></div>
                                <div id='red' onClick={() => props.addToList('red')} title="But..."></div>
                            </div>)

export default semaphore