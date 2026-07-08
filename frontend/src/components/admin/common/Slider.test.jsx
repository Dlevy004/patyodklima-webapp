import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Slider from './Slider';


describe('Slider', () => {
    const mockOnButton1Click = vi.fn();
    const mockOnButton2Click = vi.fn();

    const defaultProps = {
        title: 'Ügyfél típusa',
        condition: '',
        button1ClassName: 'active',
        onButton1Click: mockOnButton1Click,
        button1Title: 'Magánszemély',
        button2ClassName: '',
        onButton2Click: mockOnButton2Click,
        button2Title: 'Cég'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the title and button texts correctly', () => {
        render(<Slider {...defaultProps} />);

        expect(screen.getByText('Ügyfél típusa')).toBeInTheDocument();
        expect(screen.getByText('Magánszemély')).toBeInTheDocument();
        expect(screen.getByText('Cég')).toBeInTheDocument();
    });

    it('should apply the correct class to the slider background based on condition', () => {
        const { container } = render(<Slider {...defaultProps} condition="slide-right" />);

        const sliderBg = container.querySelector('.slider-bg');
        expect(sliderBg).toHaveClass('slide-right');
    });

    it('should apply the active class to the active button only', () => {
        const { container } = render(
            <Slider
                {...defaultProps}
                button1ClassName=""
                button2ClassName="active"
            />
        );

        const buttons = container.querySelectorAll('button');
        expect(buttons[0]).not.toHaveClass('active');
        expect(buttons[1]).toHaveClass('active');
    });

    it('should call onButton1Click when the first button is clicked', () => {
        render(<Slider {...defaultProps} />);

        fireEvent.click(screen.getByText('Magánszemély'));

        expect(mockOnButton1Click).toHaveBeenCalledTimes(1);
        expect(mockOnButton2Click).not.toHaveBeenCalled();
    });

    it('should call onButton2Click when the second button is clicked', () => {
        render(<Slider {...defaultProps} />);

        fireEvent.click(screen.getByText('Cég'));

        expect(mockOnButton2Click).toHaveBeenCalledTimes(1);
        expect(mockOnButton1Click).not.toHaveBeenCalled();
    });
});