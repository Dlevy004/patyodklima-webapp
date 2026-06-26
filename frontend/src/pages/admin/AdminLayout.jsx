import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { TitleContext, TitleProvider } from '../../components/TitleContext'
import SideNavbar from '../../components/admin/common/SideNavbar'
import TopBar from '../../components/admin/common/TopBar'
import ScrollUp from '../../components/common/ScrollUp'

function AdminLayoutInner() {
    const { title } = useContext(TitleContext);

    return (
        <div className="admin-layout-container">
            <TopBar title={title}/>
            <SideNavbar />
            <div className="admin-content">
                <Outlet />
                <ScrollUp />
            </div>
        </div>
    )
}

function AdminLayout() {
    return (
        <TitleProvider>
            <AdminLayoutInner />
        </TitleProvider>
    )
}

export default AdminLayout