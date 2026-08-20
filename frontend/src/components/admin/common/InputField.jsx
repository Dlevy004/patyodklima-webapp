import { useId } from 'react';

import PropTypes from 'prop-types';

import './InputField.css'


function InputField({ label, type, value, onChange, placeholder, pattern, required, error }) {
    const inputClassName = error ? 'input-error' : '';
    const inputId = useId();
    const errorId = `${inputId}-error`;

    return (
        <div className='input-field'>
            {label && <label htmlFor={inputId}>{label}</label>}
            {type === 'textarea' ? (
                <textarea
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={inputClassName}
                    aria-invalid={!!error}
                />
            ) : (
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    pattern={pattern}
                    required={required}
                    className={inputClassName}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                />
            )}
            {error && <span id={errorId} className='error-text'>{error}</span>}
        </div>
    )
}

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.string
}

export default InputField;