import ScrollUp from '../../components/common/ScrollUp'
import { TitleContext } from '../../components/TitleContext'
import { useEffect, useContext } from 'react'

function Dashboard() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Főoldal') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard!</p>
            <ScrollUp />
        </main>
    )
}

export default Dashboard