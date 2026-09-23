import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdCreatorSidebar from './MarketingCreatorSidebar';

const { mockToastError } = vi.hoisted(() => ({
    mockToastError: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    default: { error: mockToastError },
}));

vi.mock('lucide-react', () => ({
    ChevronUp: () => <span data-testid='chevron' />,
}));

vi.mock('./AdCreatorSidebar.css', () => ({}));

vi.mock('@/components/admin/common/InputField', () => ({
    default: ({ label, value, onChange, error, placeholder, type }) => {
        const Component = type === 'textarea' ? 'textarea' : 'input';

        return (
            <div>
                <label>
                    {label}
                    <Component aria-label={label} value={value} onChange={onChange} placeholder={placeholder} type={type !== 'textarea' ? type : undefined} />
                </label>
                {error && <span>{error}</span>}
            </div>
        );
    },
}));

vi.mock('@/components/admin/common/Slider', () => ({
    default: ({ title, onButton1Click, onButton2Click, button1Title, button2Title }) => (
        <div>
            <span>{title}</span>
            <button onClick={onButton1Click}>{button1Title}</button>
            <button onClick={onButton2Click}>{button2Title}</button>
        </div>
    ),
}));

const defaultProps = {
    step: 'templates',
    onStepChange: vi.fn(),
    templates: [
        { id: '1', category: 'summer_offer', name: 'Summer template', background_image_url: 'summer.jpg' },
        { id: '2', category: 'unknown', name: 'Custom template', background_image_url: 'custom.jpg' },
    ],
    acUnits: [
        { id: '1', brand: 'Daikin', model_name: 'Sensira', transparent_image_url: 'sensira.png' },
        { id: '2', brand: 'Gree', model_name: 'Amber', transparent_image_url: '' },
    ],
    selectedTemplateId: null,
    selectedAcUnitId: null,
    formData: {
        headline: 'Nyári ajánlat',
        acUnitName: 'Daikin Sensira',
        details: 'Wi-Fi',
        price: 299000,
        showLogo: true,
        showPhone: true,
    },
    formErrors: {},
    onSelectTemplate: vi.fn(),
    onSelectAcUnit: vi.fn(),
    onFormChange: vi.fn(),
    onFinish: vi.fn(),
    isSaving: false,
};

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({ matches: false }),
    });
});

describe('AdCreatorSidebar', () => {
    it('renders the templates step', () => {
        render(<AdCreatorSidebar {...defaultProps} />);

        expect(screen.getByText('Nyári ajánlatok')).toBeInTheDocument();
        expect(screen.getByText('unknown')).toBeInTheDocument();
        expect(screen.getByAltText('Summer template')).toBeInTheDocument();
        expect(screen.getByText('Tovább')).toBeInTheDocument();
    });

    it('uses the selected class for the selected template', () => {
        render(<AdCreatorSidebar {...defaultProps} selectedTemplateId='1' />);

        expect(screen.getByRole('button', { name: 'Summer template' })).toHaveClass('is-selected');
    });

    it('calls onSelectTemplate when a template is clicked', () => {
        render(<AdCreatorSidebar {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'Summer template' }));

        expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('1');
    });

    it('renders the empty template message', () => {
        render(<AdCreatorSidebar {...defaultProps} templates={[]} />);

        expect(screen.getByText('Még nincsenek feltöltött sablonok.')).toBeInTheDocument();
    });

    it('shows an error when continuing without a template', () => {
        render(<AdCreatorSidebar {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(mockToastError).toHaveBeenCalledWith('Előbb válassz egy sablont!');
        expect(defaultProps.onStepChange).not.toHaveBeenCalled();
    });

    it('moves to devices when a template is selected', () => {
        render(<AdCreatorSidebar {...defaultProps} selectedTemplateId='1' />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('devices');
    });

    it('renders the devices step', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' />);

        expect(screen.getByText('Daikin')).toBeInTheDocument();
        expect(screen.getByText('Gree')).toBeInTheDocument();
        expect(screen.getByAltText('Sensira')).toBeInTheDocument();
        expect(screen.getByText('Amber')).toBeInTheDocument();
        expect(screen.getByText('Vissza')).toBeInTheDocument();
    });

    it('uses the selected class for the selected device', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' selectedAcUnitId='1' />);

        expect(screen.getByRole('button', { name: 'Sensira' })).toHaveClass('is-selected');
    });

    it('calls onSelectAcUnit when a device is clicked', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' />);

        fireEvent.click(screen.getByRole('button', { name: 'Sensira' }));

        expect(defaultProps.onSelectAcUnit).toHaveBeenCalledWith('1');
    });

    it('renders the device placeholder when image is missing', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' />);

        expect(screen.getByText('Amber')).toBeInTheDocument();
    });

    it('renders the empty device message', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' acUnits={[]} />);

        expect(screen.getByText('Még nincsenek feltöltött készülékek.')).toBeInTheDocument();
    });

    it('shows an error when continuing without a device', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' selectedTemplateId='1' />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(mockToastError).toHaveBeenCalledWith('Előbb válassz egy készüléket!');
    });

    it('moves to text when a device is selected', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' selectedAcUnitId='1' />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('text');
    });

    it('goes back from devices to templates', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' />);

        fireEvent.click(screen.getByRole('button', { name: 'Vissza' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('templates');
    });

    it('renders the text form', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        expect(screen.getByLabelText('Főcím')).toHaveValue('Nyári ajánlat');
        expect(screen.getByLabelText('Készülék típusa')).toHaveValue('Daikin Sensira');
        expect(screen.getByLabelText('Részletek')).toHaveValue('Wi-Fi');
        expect(screen.getByLabelText('Ár')).toHaveValue(299000);
        expect(screen.getByText('Kész')).toBeInTheDocument();
    });

    it('calls onFormChange when text fields change', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        fireEvent.change(screen.getByLabelText('Főcím'), { target: { value: 'Új cím' } });
        fireEvent.change(screen.getByLabelText('Készülék típusa'), { target: { value: 'Gree Amber' } });
        fireEvent.change(screen.getByLabelText('Részletek'), { target: { value: 'Új részlet' } });
        fireEvent.change(screen.getByLabelText('Ár'), { target: { value: '399000' } });

        expect(defaultProps.onFormChange).toHaveBeenCalledWith('headline', 'Új cím');
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('acUnitName', 'Gree Amber');
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('details', 'Új részlet');
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('price', '399000');
    });

    it('calls onFormChange when sliders are changed', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        const yesButtons = screen.getAllByRole('button', { name: 'Igen' });
        const noButtons = screen.getAllByRole('button', { name: 'Nem' });

        fireEvent.click(yesButtons[0]);
        fireEvent.click(noButtons[0]);
        fireEvent.click(yesButtons[1]);
        fireEvent.click(noButtons[1]);

        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showLogo', true);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showLogo', false);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showPhone', true);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showPhone', false);
    });

    it('displays form errors', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' formErrors={{
            headline: 'Required',
            acUnitName: 'Required',
            details: 'Required',
            price: 'Required',
        }} />);

        expect(screen.getAllByText('Required')).toHaveLength(4);
    });

    it('goes back from text to devices', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        fireEvent.click(screen.getByRole('button', { name: 'Vissza' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('devices');
    });

    it('goes back from devices to templates', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' />);

        fireEvent.click(screen.getByRole('button', { name: 'Vissza' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('templates');
    });

    it('calls onFinish from the text step', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        fireEvent.click(screen.getByRole('button', { name: 'Kész' }));

        expect(defaultProps.onFinish).toHaveBeenCalled();
    });

    it('disables the finish button while saving', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' isSaving />);

        const button = screen.getByRole('button', { name: 'Mentés…' });

        expect(button).toBeDisabled();
    });

    it('collapses and expands the sidebar', () => {
        render(<AdCreatorSidebar {...defaultProps} />);

        const toggle = screen.getByRole('button', { name: 'Panel összecsukása' });

        fireEvent.click(toggle);
        expect(screen.getByRole('button', { name: 'Panel kinyitása' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Panel kinyitása' }));
        expect(screen.getByRole('button', { name: 'Panel összecsukása' })).toBeInTheDocument();
    });

    it('starts collapsed on mobile', () => {
        window.matchMedia = vi.fn().mockReturnValue({ matches: true });

        render(<AdCreatorSidebar {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Panel kinyitása' })).toBeInTheDocument();
        expect(localStorage.getItem('isMarketingSidebarCollapsed')).toBe('true');
    });

    it('restores collapsed state from localStorage', () => {
        localStorage.setItem('isMarketingSidebarCollapsed', 'true');

        render(<AdCreatorSidebar {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Panel kinyitása' })).toBeInTheDocument();
    });

    it('stores the collapsed state in localStorage', () => {
        render(<AdCreatorSidebar {...defaultProps} />);

        fireEvent.click(screen.getByRole('button', { name: 'Panel összecsukása' }));

        expect(localStorage.getItem('isMarketingSidebarCollapsed')).toBe('true');
    });

    it('moves to text when continuing from devices', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' selectedAcUnitId='1' />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(defaultProps.onStepChange).toHaveBeenCalledWith('text');
    });

    it('does not move to text without a selected device', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' selectedAcUnitId={null} />);

        fireEvent.click(screen.getByRole('button', { name: 'Tovább' }));

        expect(mockToastError).toHaveBeenCalledWith('Előbb válassz egy készüléket!');
    });

    it('uses the brand when device model name is missing', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' acUnits={[
            { id: '1', brand: 'Daikin', model_name: '', transparent_image_url: 'unit.png' },
        ]} />);

        expect(screen.getByAltText('Daikin')).toBeInTheDocument();
    });

    it('uses the brand when model name and image are missing', () => {
        render(<AdCreatorSidebar {...defaultProps} step='devices' acUnits={[
            { id: '1', brand: 'Daikin', model_name: '', transparent_image_url: '' },
        ]} />);

        expect(screen.getByRole('button', { name: 'Daikin' })).toBeInTheDocument();
    });

    it('renders sliders correctly when logo and phone are disabled', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' formData={{
            ...defaultProps.formData,
            showLogo: false,
            showPhone: false,
        }} />);

        expect(screen.getByText('Logó')).toBeInTheDocument();
        expect(screen.getByText('Telefonszám')).toBeInTheDocument();
    });

    it('calls onFormChange when sliders are changed', () => {
        render(<AdCreatorSidebar {...defaultProps} step='text' />);

        const yesButtons = screen.getAllByRole('button', { name: 'Igen' });
        const noButtons = screen.getAllByRole('button', { name: 'Nem' });

        fireEvent.click(yesButtons[0]);
        fireEvent.click(noButtons[0]);
        fireEvent.click(yesButtons[1]);
        fireEvent.click(noButtons[1]);

        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showLogo', true);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showLogo', false);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showPhone', true);
        expect(defaultProps.onFormChange).toHaveBeenCalledWith('showPhone', false);
    });
});