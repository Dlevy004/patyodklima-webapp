import PropTypes from 'prop-types';

import './InputField.css'


function InputField({ label, type, value, onChange, placeholder, pattern }) {
    return (
        <div className='input-field'>
            {label && <label>{label}</label>}
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    pattern={pattern}
                />
            )}
        </div>
    )
}

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string
}

export default InputField;