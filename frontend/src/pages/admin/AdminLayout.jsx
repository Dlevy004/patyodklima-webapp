import { useState, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import './AdminLayout.css'

import { TitleContext, TitleProvider } from '../../context/TitleContext'
import SideNavbar from '../../components/admin/common/SideNavbar'
import TopBar from '../../components/admin/common/TopBar'
import ScrollUp from '../../components/common/ScrollUp'


function AdminLayoutInner() {
    const { title } = useContext(TitleContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="admin-layout-container">
            <Helmet>
                <title>Admin | Pátyod Klíma</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <TopBar title={title} onMenuClick={() => setIsMobileMenuOpen(true)}/>
            <SideNavbar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />

            <div className="admin-content">
                <Outlet />
                <ScrollUp />
            </div>
        </div>
    )
}

function AdminLayout() {
    useEffect(() => {
        void import('virtual:pwa-register')
            .then(({ registerSW }) => {
                registerSW({ immediate: true });
            })
            .catch((error) => {
                console.error('Failed to register PWA service worker:', error);
            });
    }, []);

    return (
        <TitleProvider>
            <AdminLayoutInner />
        </TitleProvider>
    )
}

export default AdminLayout