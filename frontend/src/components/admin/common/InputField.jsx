import PropTypes from 'prop-types';

import './InputField.css'


function InputField({ label, type, value, onChange, placeholder, pattern, required, error }) {
    const inputClassName = error ? 'input-error' : '';

    return (
        <div className='input-field'>
            {label && <label>{label}</label>}
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    pattern={pattern}
                    required={required}
                />
            )}
            {error && <span className='error-text'>{error}</span>}
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