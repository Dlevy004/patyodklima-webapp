import SideNavbar from '../../components/admin/SideNavbar'
import ScrollUp from '../../components/common/ScrollUp'

function References() {
    return (
        <>
            <SideNavbar />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <h1>References</h1>
                <p>Welcome to the references page!</p>
                <ScrollUp />
            </main>
        </>
    )
}

export default References