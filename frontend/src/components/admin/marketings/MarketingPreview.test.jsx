import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdPreview from './MarketingPreview';

vi.mock('./AdPreview.css', () => ({}));

vi.mock('@/components/admin/common/ActionBtn', () => ({
    default: ({ type, onClick }) => <button onClick={onClick}>{type}</button>,
}));

const defaultProps = {
    template: { background_image_url: 'background.jpg' },
    acUnit: { transparent_image_url: 'unit.png', model_name: 'Daikin Sensira' },
    headline: 'Nyári akció',
    acUnitName: 'Daikin Sensira',
    details: 'Wi-Fi\nA+++',
    price: 299000,
    showLogo: true,
    showPhone: true,
    logoUrl: 'logo.png',
    phoneImageUrl: 'phone.png',
    onUndo: vi.fn(),
    onDownload: vi.fn(),
    onDelete: vi.fn(),
    isSaving: false,
};

describe('AdPreview', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders the empty state without a template', () => {
        render(<AdPreview {...defaultProps} template={null} />);

        expect(screen.getByText('Kérlek válassz egy sablont!')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'undo' })).not.toBeInTheDocument();
    });

    it('renders the marketing preview with all elements', () => {
        render(<AdPreview {...defaultProps} />);

        expect(screen.getByAltText('Pátyod Klíma logó')).toBeInTheDocument();
        expect(screen.getByAltText('Telefonszám: 06 30 629 0793')).toBeInTheDocument();
        expect(screen.getByAltText('Daikin Sensira')).toBeInTheDocument();
        expect(screen.getByText('Nyári akció')).toBeInTheDocument();
        expect(screen.getByText('Daikin Sensira')).toBeInTheDocument();
        expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
        expect(screen.getByText('A+++')).toBeInTheDocument();
        expect(screen.getByText(/Bruttó:/)).toBeInTheDocument();
    });

    it('renders the default AC unit alt text when model name is missing', () => {
        render(<AdPreview {...defaultProps} acUnit={{ transparent_image_url: 'unit.png', model_name: '' }} />);

        expect(screen.getByAltText('Klíma készülék')).toBeInTheDocument();
    });

    it('does not render optional elements when they are disabled or missing', () => {
        render(<AdPreview {...defaultProps} showLogo={false} showPhone={false} acUnit={null} headline='' acUnitName='' details='' price='' />);

        expect(screen.queryByAltText('Pátyod Klíma logó')).not.toBeInTheDocument();
        expect(screen.queryByAltText('Telefonszám')).not.toBeInTheDocument();
        expect(screen.queryByAltText('Klíma készülék')).not.toBeInTheDocument();
        expect(screen.queryByText('Nyári akció')).not.toBeInTheDocument();
        expect(screen.queryByText('Wi-Fi')).not.toBeInTheDocument();
        expect(screen.queryByText(/Bruttó:/)).not.toBeInTheDocument();
    });

    it('does not render logo when logo url is missing', () => {
        render(<AdPreview {...defaultProps} logoUrl='' />);

        expect(screen.queryByAltText('Pátyod Klíma logó')).not.toBeInTheDocument();
    });

    it('does not render phone image when phone url is missing', () => {
        render(<AdPreview {...defaultProps} phoneImageUrl='' />);

        expect(screen.queryByAltText('Telefonszám')).not.toBeInTheDocument();
    });

    it('renders detail lines as list items', () => {
        render(<AdPreview {...defaultProps} details={'- Wi-Fi\n• A+++\n* Csendes működés'} />);

        expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
        expect(screen.getByText('A+++')).toBeInTheDocument();
        expect(screen.getByText('Csendes működés')).toBeInTheDocument();
    });

    it('renders the correct layer styles', () => {
        render(<AdPreview {...defaultProps} />);

        expect(screen.getByAltText('Pátyod Klíma logó')).toHaveStyle({
            left: '18%',
            top: '6%',
            width: '22%',
            height: '12%',
        });

        expect(screen.getByAltText('Daikin Sensira')).toHaveStyle({
            left: '48%',
            top: '20%',
            width: '48%',
            height: '70%',
            transform: 'scale(1.1)',
        });

        const headline = screen.getByText('Nyári akció');

        expect(headline).toHaveStyle({
            left: '5%',
            top: '24%',
            maxWidth: '45%',
        });

        expect(headline.style.color).toBe('rgb(196, 30, 30)');
    });

    it('calls the action callbacks', () => {
        render(<AdPreview {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'undo' }));
        fireEvent.click(screen.getByRole('button', { name: 'download' }));
        fireEvent.click(screen.getByRole('button', { name: 'delete' }));

        expect(defaultProps.onUndo).toHaveBeenCalled();
        expect(defaultProps.onDownload).toHaveBeenCalled();
        expect(defaultProps.onDelete).toHaveBeenCalled();
    });

    it('renders the loading overlay while saving', () => {
        const { container } = render(<AdPreview {...defaultProps} isSaving />);

        expect(container.querySelector('.marketing-preview-loading')).toBeInTheDocument();
    });
});