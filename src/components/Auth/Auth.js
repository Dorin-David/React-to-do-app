import React, { useState } from 'react';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/button'
import CloseButton from '../UI/closeButton/closeButton';
// import Spinner from '../UI/Spinner/Spinner';

import './Auth.css'
import useAuth from '../../hooks/authHelper';

const Auth = props => {

    const [controls, setControls] = useState({
        email: {
            elementType: 'email',
            elementConfig: {
                type: 'text',
                placeholder: 'E-mail'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            triggered: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6,
            },
            valid: false,
            triggered: false
        },
    })
    const [isFormValid, setFormValidity] = useState(false);

    const handleInputChange = (event, id) => {

        let copyForm = {
            ...controls
        }
        let updatedValue = {
            ...copyForm[id]
        }
        updatedValue.value = event.target.value;
        updatedValue.valid = validateFormValue(updatedValue.value, updatedValue.validation)
        updatedValue.triggered = true;
        copyForm[id] = updatedValue;

        let isFormValid = true;

        for (let key in copyForm) {
            isFormValid = copyForm[key].valid && isFormValid
        }

        setControls(copyForm)
        setFormValidity(isFormValid)
        //do we need the below?
        // setErrorMessage(null)
    }

    const validateFormValue = (value, rules) => {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.isEmail){
            isValid = /\w{3,}@\w+\.\w{2,}/.test(value) && isValid
        }
        return isValid
    }

    const submitHandler = (event, command) => {
        event.preventDefault()
        const email = controls.email.value;
        const password = controls.password.value;
        props.submitAuth(email, password, command)
    }

    const formElements = [];
    for (let key in controls) {
        formElements.push({ key, data: controls[key] })
    }
    let generateForms = formElements.map(form => {
        return (
            <Input
                key={form.key}
                elementType={form.data.elementType}
                elementConfig={form.data.elementConfig}
                value={form.data.value}
                invalid={!form.data.valid}
                shouldValidate={form.data.validation}
                triggered={form.data.triggered}
                handleChange={(event) => handleInputChange(event, form.key)}
            />
        )
    })
    return (
        <div className='backdrop'>
            <div className='user-window'>
                <CloseButton
                    className='close-form-btn'
                    title="close"
                    onClose={props.closeModal}
                />
                <h2 className="warning-header">Log in to not loose you data!</h2>
                <form>
                    {generateForms}
                    <div className='btn-wrapper'>
                        <Button
                            className={'button button-log-in' + (!isFormValid ? ' disabled' : '')}
                            click={event => submitHandler(event, null)}
                            disabled={!isFormValid}
                            >LOG IN</Button>
                        <Button
                            className={'button button-register'+ (!isFormValid ? ' disabled' : '') }
                            click={event => submitHandler(event, 'register')}
                            disabled={!isFormValid}>REGISTER</Button>
                    </div>
                </form>
                <Button
                    className='button button-dismiss-warning'
                    click={props.closeModal}>I'm ok</Button>
            </div>
        </div>
    )
}

export default Auth