import { useId } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import './InputField.css';


function InputField({ label, type, value, onChange, placeholder, pattern, required, error, options }) {
    const inputClassName = error ? 'input-error' : '';
    const inputId = useId();
    const errorId = `${inputId}-error`;

    const selectStyles = {
        container: (base) => ({
            ...base,
            width: '100%',
        }),
        control: (base, state) => ({
            ...base,
            borderRadius: '11px',
            padding: '0.15rem 0.3rem',
            boxShadow: error
                ? 'inset 0px 0px 5px 0px rgba(255, 77, 77, 0.2)'
                : 'inset 0px 0px 10px 0px rgba(0,0,0,0.2)',
            border: error ? '2px solid #ff4d4d' : 'none',
            outline: 'none',
            minHeight: '42px',
            cursor: 'pointer',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 6px',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--text-color1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--text-color1)',
            opacity: 0.6,
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        menu: (base) => ({
            ...base,
            overflow: 'hidden',
            borderRadius: '11px',
            zIndex: 20,
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: '220px',
        }),
        option: (base, state) => ({
            ...base,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            backgroundColor: state.isSelected
                ? 'var(--bg-color-ternary)'
                : state.isFocused
                    ? 'rgba(0,0,0,0.05)'
                    : 'transparent',
            color: state.isSelected ? '#fff' : 'var(--text-color1)',
        }),
    };

    let inputElement = null;

    switch (type) {
        case 'textarea':
            inputElement = (
                <textarea
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={inputClassName}
                    aria-invalid={!!error}
                />
            );
            break;
        case 'select': {
            const selectedOption = options?.find((opt) => opt.value === value) || null;

            inputElement = (
                <Select
                    inputId={inputId}
                    value={selectedOption}
                    onChange={(selected) => {
                        onChange({ target: { value: selected ? selected.value : '' } });
                    }}
                    options={options}
                    placeholder={placeholder || 'Válassz...'}
                    styles={selectStyles}
                    isClearable={false}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                />
            );
            break;
        }
        default:
            inputElement = (
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
            );
            break;
    }

    return (
        <div className='input-field'>
            {label && <label htmlFor={inputId}>{label}</label>}

            {inputElement}

            {error && <span id={errorId} className='error-text'>{error}</span>}
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired
    }))
}

export default InputField;