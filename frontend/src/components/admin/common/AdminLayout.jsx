import { Outlet } from 'react-router-dom'
import SideNavbar from './SideNavbar'
import ScrollUp from '../../common/ScrollUp'

function AdminLayout() {
    return (
        <div className="admin-layout-container">
            <SideNavbar />
            <div className="admin-content">
                <Outlet />
                <ScrollUp />
            </div>
        </div>
    )
}

export default AdminLayout