import React, {Fragment} from 'react';
import Button from '../UI/Button/button';
import './Buttons.css';

const buttons = props => <Fragment>
                            <Button 
                            className='clear-all' 
                            click={() => props.clearList('all')}
                            >Clear All</Button>
                            <Button
                            className='clear-done' 
                            click={() => props.clearList('done')}
                            >Clear Done</Button>
                         </Fragment>

export default buttons