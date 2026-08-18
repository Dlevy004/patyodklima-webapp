import { Navigate, Outlet, useLocation } from 'react-router-dom';

import './ProtectedRoute.css'

import { useAuth } from '../../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';


function ProtectedRoute() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="auth-loading-screen">
                <p>Betöltés...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return (
        <>
            {user?.mustChangePassword && <ChangePasswordModal />}
            <Outlet />
        </>
    );
}

export default ProtectedRoute;