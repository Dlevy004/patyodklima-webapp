import SideNavbar from '../../components/admin/SideNavbar'
import ScrollUp from '../../components/common/ScrollUp'

function Ads() {
    return (
        <>
            <SideNavbar />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>Ads</h1>
                <p>Welcome to the ads page!</p>
                <ScrollUp />
            </main>
        </>
    )
}

export default Ads