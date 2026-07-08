import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';

function Dashboard() {
    usePageTitle('Főoldal');

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard!</p>
            <ScrollUp />
        </main>
    )
}

export default Dashboard