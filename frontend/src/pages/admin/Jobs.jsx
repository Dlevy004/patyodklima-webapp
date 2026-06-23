import SideNavbar from '../../components/admin/SideNavbar'
import ScrollUp from '../../components/common/ScrollUp'

function Jobs() {
    return (
        <>
            <SideNavbar />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Jobs</h1>
                <p>Welcome to the jobs page!</p>
                <ScrollUp />
            </main>
        </>
    )
}

export default Jobs