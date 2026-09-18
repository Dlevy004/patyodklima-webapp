import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SideNavbar from './SideNavbar';

const { mockCloseMobileMenu } = vi.hoisted(() => ({
    mockCloseMobileMenu: vi.fn(),
}));

vi.mock('./SideNavbar.css', () => ({}));

vi.mock('../../../assets/images/logo.avif', () => ({ default: 'horizontal-logo.avif' }));
vi.mock('../../../assets/images/tr-logo-icon.avif', () => ({ default: 'vertical-logo.avif' }));

vi.mock('lucide-react', () => ({
    House: () => <span />,
    FileUser: () => <span />,
    BookMarked: () => <span />,
    CircleX: () => <span />,
    PencilRuler: () => <span />,
    Images: () => <span />,
    AirVent: () => <span />,
    ChevronUp: () => <span data-testid='chevron' />,
}));

vi.mock('./NavButton', () => ({
    default: ({ IconComponent, title, url, onClick }) => (
        <a href={url} onClick={onClick} data-testid='nav-button'>
            <IconComponent />
            {title}
        </a>
    ),
}));

vi.mock('./NavSection', () => ({
    default: ({ title, ButtonComponents }) => (
        <section>
            <h2>{title}</h2>
            {ButtonComponents}
        </section>
    ),
}));

vi.mock('../../common/MobileMenu', () => ({
    default: ({ isOpen, onClose, className, children }) => (
        <div data-testid='mobile-menu' data-open={String(isOpen)} className={className}>
            <button onClick={onClose}>close-mobile</button>
            {children}
        </div>
    ),
}));

describe('SideNavbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders the expanded sidebar by default', () => {
        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        expect(screen.getByRole('navigation', { name: 'Adminisztrációs menü' })).toHaveClass('sidenav-container');
        expect(screen.getByAltText('Pátyod Klíma logo')).toHaveAttribute('src', 'horizontal-logo.avif');
        expect(screen.getByRole('button', { name: 'Menü összecsukása' })).toBeInTheDocument();
    });

    it('renders the collapsed sidebar when localStorage contains true', () => {
        localStorage.setItem('isSidebarCollapsed', 'true');

        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        expect(screen.getByRole('navigation', { name: 'Adminisztrációs menü' })).toHaveClass('sidenav-collapsed');
        expect(screen.getByAltText('Pátyod Klíma logo')).toHaveAttribute('src', 'vertical-logo.avif');
        expect(screen.getByRole('button', { name: 'Menü kinyitása' })).toBeInTheDocument();
    });

    it('toggles the sidebar collapsed state', () => {
        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        const toggle = screen.getByRole('button', { name: 'Menü összecsukása' });

        fireEvent.click(toggle);
        expect(screen.getByRole('button', { name: 'Menü kinyitása' })).toBeInTheDocument();
        expect(localStorage.getItem('isSidebarCollapsed')).toBe('true');

        fireEvent.click(screen.getByRole('button', { name: 'Menü kinyitása' }));
        expect(screen.getByRole('button', { name: 'Menü összecsukása' })).toBeInTheDocument();
        expect(localStorage.getItem('isSidebarCollapsed')).toBe('false');
    });

    it('renders all admin navigation links', () => {
        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        expect(screen.getAllByText('Főoldal')).toHaveLength(2);
        expect(screen.getAllByText('Ügyfélnapló')).toHaveLength(2);
        expect(screen.getAllByText('Munkanapló')).toHaveLength(2);
        expect(screen.getAllByText('Látványterv')).toHaveLength(2);
        expect(screen.getAllByText('Referencia')).toHaveLength(2);
        expect(screen.getAllByText('Hirdetések')).toHaveLength(2);
        expect(screen.getAllByText('Adminisztráció')).toHaveLength(2);
        expect(screen.getAllByText('Értékesítés')).toHaveLength(2);
        expect(screen.getAllByText('Marketing')).toHaveLength(2);
    });

    it('calls closeMobileMenu when a navigation link is clicked', () => {
        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        fireEvent.click(screen.getAllByTestId('nav-button')[0]);

        expect(mockCloseMobileMenu).toHaveBeenCalled();
    });

    it('closes the mobile menu when onClose is triggered', () => {
        render(<SideNavbar isMobileMenuOpen={true} closeMobileMenu={mockCloseMobileMenu} />);

        fireEvent.click(screen.getByRole('button', { name: 'close-mobile' }));

        expect(mockCloseMobileMenu).toHaveBeenCalled();
    });

    it('passes the mobile menu open state', () => {
        const { rerender } = render(
            <SideNavbar isMobileMenuOpen={true} closeMobileMenu={mockCloseMobileMenu} />
        );

        expect(screen.getByTestId('mobile-menu')).toHaveAttribute('data-open', 'true');

        rerender(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        expect(screen.getByTestId('mobile-menu')).toHaveAttribute('data-open', 'false');
    });

    it('uses the correct mobile menu class', () => {
        render(<SideNavbar isMobileMenuOpen={false} closeMobileMenu={mockCloseMobileMenu} />);

        expect(screen.getByTestId('mobile-menu')).toHaveClass('admin-mobile-menu');
        expect(screen.getByRole('navigation', { name: 'Adminisztrációs mobil menü' })).toBeInTheDocument();
    });
});