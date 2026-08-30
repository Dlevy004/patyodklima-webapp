import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import InputField from './InputField';


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
});