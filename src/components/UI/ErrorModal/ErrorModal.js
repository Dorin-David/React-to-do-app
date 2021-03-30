import React from 'react';
import Button from '../Button/button';
import './ErrorModal.css';

const ErrorModal = React.memo(props => {
  return (
    <React.Fragment>
      <div className="backdrop" onClick={props.onClose} />
      <div className="error-modal">
        <h2>An Error Occurred!</h2>
        <p>Something went wrong! <br />Please try again later</p>
        <div className="error-modal__actions">
            <Button 
            className='warning-modal-button'
            click={props.closeModal}
            >Got it!</Button>
        </div>
      </div>
    </React.Fragment>
  );
});

export default ErrorModal;


