import React from 'react';
import './Input.css';

const input = props => {
    let inputElement = null;
    const inputClasses = ['input'];
    if (props.invalid && props.shouldValidate && props.triggered) {
        inputClasses.push('input-invalid')
    }
    switch (props.elementType) {
        case ('input'):
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig} value={props.value} onChange={props.handleChange} />;
            break;
        case ('textarea'):
            inputElement = <textarea
                className={inputClasses.join(' ')}
                {...props.elementConfig} value={props.value} onChange={props.handleChange} />;
            break;
        case ('select'):
            inputElement = (<select
                className={inputClasses.join(' ')}
                value={props.value}
                onChange={props.handleChange}
            >
                {props.elementConfig.options.map(option => (
                    <option
                        value={option.value}
                        key={option.value}
                    >
                        {option.displayValue}
                    </option>
                ))}
            </select>)
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig} value={props.value} onChange={props.handleChange} />;
            break;
    }
    return (
        <label>
            {inputElement}
        </label>)
}

export default input