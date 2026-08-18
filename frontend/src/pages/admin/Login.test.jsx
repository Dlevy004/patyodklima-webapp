import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useAuth } from '@/context/AuthContext';
import Login from './Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();


vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        login: mockLogin,
        isAuthenticated: false,
        isLoading: false,
    })),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-mock">Lottie Animation</div>,
    Lottie: () => <div data-testid="lottie-mock">Lottie Animation</div>,
    useLottie: () => ({ View: <div data-testid="lottie-mock">Lottie Animation</div> })
}));

describe('Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
    });

    it('should render login form elements', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Bejelentkezés' })).toBeInTheDocument();
        expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
        expect(screen.getByLabelText('Jelszó')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: /Emlékezz rám/i })).toBeInTheDocument();
        expect(screen.getByText('Pátyod Klíma © 2026 | Minden jog fenntartva!')).toBeInTheDocument();
    });

    it('should submit credentials through auth context', async () => {
        mockLogin.mockResolvedValue({ id: '1', role: 'admin' });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('E-mail'), {
            target: { value: 'admin@patyodklima.hu' },
        });
        fireEvent.change(screen.getByLabelText('Jelszó'), {
            target: { value: 'secret123' },
        });
        fireEvent.click(screen.getByRole('checkbox', { name: /Emlékezz rám/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Bejelentkezés' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'admin@patyodklima.hu',
                password: 'secret123',
                rememberMe: true,
            });
            expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
        });
    });

    it('should show error message when login fails', async () => {
        mockLogin.mockRejectedValue(new Error('Invalid email or password.'));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('E-mail'), {
            target: { value: 'wrong@patyodklima.hu' },
        });
        fireEvent.change(screen.getByLabelText('Jelszó'), {
            target: { value: 'wrong' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Bejelentkezés' }));

        expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    });

it('should redirect if user is already authenticated', () => {
        useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: true,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.queryByText('Emlékezz rám')).not.toBeInTheDocument();

        useAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
        });
    });
});