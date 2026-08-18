import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import ProtectedRoute from './ProtectedRoute';

vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('./ChangePasswordModal', () => ({
    default: () => <div data-testid="change-password-modal" />,
}));

import { useAuth } from '../../../context/AuthContext';

describe('ProtectedRoute', () => {
    it('should redirect unauthenticated users to login', () => {
        useAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/admin/clients']}>
                <Routes>
                    <Route path="/admin/login" element={<div>Login page</div>} />
                    <Route path="/admin" element={<ProtectedRoute />}>
                        <Route path="clients" element={<div>Clients page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login page')).toBeInTheDocument();
    });

    it('should render protected content for authenticated users', () => {
        useAuth.mockReturnValue({
            user: { mustChangePassword: false },
            isAuthenticated: true,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/admin/clients']}>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute />}>
                        <Route path="clients" element={<div>Clients page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Clients page')).toBeInTheDocument();
    });

    it('should show change password modal when required', () => {
        useAuth.mockReturnValue({
            user: { mustChangePassword: true },
            isAuthenticated: true,
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute />}>
                        <Route index element={<div>Dashboard</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
});
