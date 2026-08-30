import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import InputField from './InputField';

const { capturedReactSelectProps } = vi.hoisted(() => ({
    capturedReactSelectProps: { current: {} }
}));

vi.mock('react-select', () => ({
    default: (props) => {
        capturedReactSelectProps.current = props;

        return (
            <select
                id={props.inputId}
                data-testid="mock-react-select"
                value={props.value ? props.value.value : ''}
                onChange={(e) => {
                    const selectedOption = props.options.find(opt => String(opt.value) === String(e.target.value));
                    props.onChange(selectedOption || null);
                }}
            >
                <option value="" disabled>{props.placeholder}</option>
                {props.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    }
}));


describe('InputField', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should add input-error class and render span element when error is exist', () => {
        const mockClientData = {
            label: 'Test Label', type: 'text',
            value: 'Test Value', onChange: mockOnChange,
            placeholder: 'Test Placeholder', pattern: '[0-9]{4}',
            required: true, error: 'Test Error'
        }

        render(<InputField {...mockClientData} />)

        const inputElement = document.querySelector('.input-error');
        const spanElement = document.querySelector('.error-text');

        expect(inputElement).toBeInTheDocument();
        expect(spanElement).toBeInTheDocument();
        expect(spanElement).toHaveTextContent('Test Error');
        expect(screen.queryByText('Test Error')).toBeInTheDocument();
    });

    it('shouldn\'t add any class or render element when error is not exist', () => {
        const mockClientData = {
            label: 'Test Label', type: 'text',
            value: 'Test Value', onChange: mockOnChange,
            placeholder: 'Test Placeholder', pattern: '[0-9]{4}',
            required: true, error: null
        }

        render(<InputField {...mockClientData} />)

        const inputElement = document.querySelector('.input-error');
        const spanElement = document.querySelector('.error-text');

        expect(inputElement).not.toBeInTheDocument();
        expect(spanElement).not.toBeInTheDocument();
        expect(screen.queryByText('Test Error')).not.toBeInTheDocument();
    });

    it('should render label element if it is provided', () => {
        const mockClientData = {
            label: 'Test Label', type: 'text',
            value: 'Test Value', onChange: mockOnChange,
            placeholder: 'Test Placeholder', pattern: '[0-9]{4}',
            required: true, error: null
        }

        render(<InputField {...mockClientData}/>)

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should render textarea if type is textarea', () => {
        const mockClientData = {
            label: 'Test Label', type: 'textarea',
            value: 'Test Value', onChange: mockOnChange
        }

        render(<InputField {...mockClientData} />)

        const textareaElement = document.querySelector('textarea');

        expect(textareaElement).toBeInTheDocument();
    });

    it('should render input field if type is input', () => {
        const mockClientData = {
            label: 'Test Label', type: 'text',
            value: 'Test Value', onChange: mockOnChange
        }

        render(<InputField {...mockClientData} />)

        const inputElement = document.querySelector('input');

        expect(inputElement).toBeInTheDocument();
    });

    it('should render a dropdown if type is select', () => {
        const mockClientData = {
            label: 'Test Label', type: 'select',
            value: 'Test Value', onChange: mockOnChange
        }

        render(<InputField {...mockClientData} />)

        const inputElement = document.querySelector('select');

        expect(inputElement).toBeInTheDocument();
    });

    it('should assign the correct value attribute to each option element based on the options array', () => {
        const mockOptions = [
            { value: 'val-1', label: 'Első opció' },
            { value: 'val-2', label: 'Második opció' }
        ];

        render(
            <InputField
                type="select"
                value=""
                onChange={mockOnChange}
                options={mockOptions}
            />
        );

        const firstOption = screen.getByText('Első opció');
        const secondOption = screen.getByText('Második opció');

        expect(firstOption).toHaveAttribute('value', 'val-1');
        expect(secondOption).toHaveAttribute('value', 'val-2');
    });

    it('should call onChange function when user types into the field', () => {
        render(<InputField label="Név" type="text" value="" onChange={mockOnChange} />);

        const input = screen.getByLabelText('Név');

        fireEvent.change(input, { target: { value: 'A' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should configure react-select styles correctly based on error and state branches', () => {
        const mockOnChange = vi.fn();
        const baseStyle = { baseProp: 'test' };

        const { unmount } = render(<InputField type="select" onChange={mockOnChange} />);

        let styles = capturedReactSelectProps.current.styles;

        expect(styles.container(baseStyle).width).toBe('100%');
        expect(styles.valueContainer(baseStyle).padding).toBe('0 6px');
        expect(styles.singleValue(baseStyle).overflow).toBe('hidden');
        expect(styles.placeholder(baseStyle).opacity).toBe(0.6);
        expect(styles.indicatorSeparator().display).toBe('none');
        expect(styles.menu(baseStyle).zIndex).toBe(20);
        expect(styles.menuList(baseStyle).maxHeight).toBe('220px');

        let controlStyle = styles.control(baseStyle, {});
        expect(controlStyle.border).toBe('none');
        expect(controlStyle.boxShadow).toContain('rgba(0,0,0,0.2)');

        let optionStyleSelected = styles.option(baseStyle, { isSelected: true, isFocused: false });
        expect(optionStyleSelected.backgroundColor).toBe('var(--bg-color-ternary)');
        expect(optionStyleSelected.color).toBe('#fff');

        let optionStyleFocused = styles.option(baseStyle, { isSelected: false, isFocused: true });
        expect(optionStyleFocused.backgroundColor).toBe('rgba(0,0,0,0.05)');
        expect(optionStyleFocused.color).toBe('var(--text-color1)');

        let optionStyleDefault = styles.option(baseStyle, { isSelected: false, isFocused: false });
        expect(optionStyleDefault.backgroundColor).toBe('transparent');

        unmount();

        render(<InputField type="select" error="Valami hiba!" onChange={mockOnChange} />);

        styles = capturedReactSelectProps.current.styles;

        controlStyle = styles.control(baseStyle, {});
        expect(controlStyle.border).toBe('2px solid #ff4d4d');
        expect(controlStyle.boxShadow).toContain('rgba(255, 77, 77, 0.2)');
    });

    it('should call onChange with mapped target value when an option is selected in react-select', () => {
        const mockOnChange = vi.fn();
        const mockOptions = [
            { value: 'opt1', label: 'Első opció' }
        ];

        render(<InputField type="select" onChange={mockOnChange} options={mockOptions} />);

        const selectElement = screen.getByTestId('mock-react-select');

        fireEvent.change(selectElement, { target: { value: 'opt1' } });

        expect(mockOnChange).toHaveBeenCalledWith({ target: { value: 'opt1' } });
    });

    it('should call onChange with empty string if selected option is cleared/null in react-select', () => {
        const mockOnChange = vi.fn();
        const mockOptions = [
            { value: 'opt1', label: 'Első opció' }
        ];

        render(<InputField type="select" onChange={mockOnChange} options={mockOptions} />);

        const selectElement = screen.getByTestId('mock-react-select');

        fireEvent.change(selectElement, { target: { value: 'non-existent' } });

        expect(mockOnChange).toHaveBeenCalledWith({ target: { value: '' } });
    });
});