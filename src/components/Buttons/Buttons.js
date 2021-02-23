import React, {Fragment} from 'react';
import './Buttons.css'

const buttons = props => <Fragment>
                            <button className='clear-all' onClick={() => props.clearList('all')}>Clear All</button>
                            <button className='clear-done' onClick={() => props.clearList('done')}>Clear Done</button>
                         </Fragment>

export default buttons