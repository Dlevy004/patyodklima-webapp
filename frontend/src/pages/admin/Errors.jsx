import SideNavbar from '../../components/admin/SideNavbar'
import ScrollUp from '../../components/common/ScrollUp'

function Errors() {
    return (
        <>
            <SideNavbar />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Errors</h1>
                <p>Welcome to the errors page!</p>
                <ScrollUp />
            </main>
        </>
    )
}

export default Errors