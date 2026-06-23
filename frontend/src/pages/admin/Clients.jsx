import SideNavbar from '../../components/admin/SideNavbar'
import ScrollUp from '../../components/common/ScrollUp'

function Clients() {
    return (
        <>
            <SideNavbar />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Clients</h1>
                <p>Welcome to the clients page!</p>
                <ScrollUp />
            </main>
        </>
    )
}

export default Clients