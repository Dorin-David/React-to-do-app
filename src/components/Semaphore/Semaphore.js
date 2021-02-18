import React from 'react'

const semaphore = props => (<div className='semaphore'>
                                <div id='green' onClick={() => props.addTOList('green')}></div>
                                <div id='yellow' onClick={() => props.addTOList('yellow')}></div>
                                <div id='red' onClick={() => props.addTOList('red')}></div>
                            </div>)

export default semaphore