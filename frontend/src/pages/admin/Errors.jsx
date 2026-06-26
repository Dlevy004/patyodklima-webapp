import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';

function Errors() {
    usePageTitle('Bejelentések');

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Errors</h1>
            <p>Welcome to the errors page!</p>
            <ScrollUp />
        </main>
    )
}

export default Errors