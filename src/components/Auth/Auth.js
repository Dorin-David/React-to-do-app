import React, { useState } from 'react';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/button'
import CloseButton from '../UI/closeButton/closeButton';
import { handleErrorMessage, validateFormValue } from '../../authUtils';
import './Auth.css'


// const Auth = props => {

// }

class Auth extends React.Component {

    state = {
        controls: {
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
                    isAlphaNumeric: false
                },
                valid: false,
                triggered: false
            },
        },
    }


    handleInputChange = (event, id) => {
        let copyForm = {
            ...this.state.controls
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

        this.setState({
            controls: copyForm,
            isFormValid,
            errorMessage: null
        })
    }

    submitHandler = event => {
        event.preventDefault()
        const email = this.state.controls.email.value;
        const password = this.state.controls.password.value;
        this.props.authenticateUser(email, password, this.state.isSignedUp);
    }

    render() {
        const formElements = [];
        for (let key in this.state.controls) {
            formElements.push({ key, data: this.state.controls[key] })
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
                    handleChange={(event) => this.handleInputChange(event, form.key)}
                />
            )
        })
        return (
            <div className='backdrop'>
                <div className='user-window'>
                    <CloseButton 
                    className='close-form-btn' 
                    title="close" 
                    onClose={this.props.closeModal}
                    />
                    <h2 className="warning-header">Log in to not loose you data!</h2>
                    <form onSubmit={this.submitHandler}>
                        {generateForms}
                        {/* {errorMessage} */}
                        <div className='btn-wrapper'>
                            <Button
                                // btnType={this.state.isFormValid ? 'Success' : 'Disabled'}
                                className='button button-log-in'
                                disabled={!this.state.isFormValid}>LOG IN</Button>
                            <Button
                                className='button button-register'
                                // btnType={this.state.isFormValid ? 'Success' : 'Disabled'}
                                disabled={!this.state.isFormValid}>REGISTER</Button>
                        </div>
                    </form>
                    <Button
                                className='button button-dismiss-warning'
                                click={this.props.closeModal}>I'm ok</Button>
                </div>
            </div>
        )
    }


}


export default Auth