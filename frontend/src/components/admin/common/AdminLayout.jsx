import { Outlet } from 'react-router-dom'
import SideNavbar from './SideNavbar'
import TopBar from './TopBar'
import ScrollUp from '../../common/ScrollUp'

function AdminLayout() {
    return (
        <div className="admin-layout-container">
            <TopBar title='Főoldal'/>
            <SideNavbar />
            <div className="admin-content">
                <Outlet />
                <ScrollUp />
            </div>
        </div>
    )
}

export default AdminLayout