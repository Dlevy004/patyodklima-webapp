import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';

function References() {
    usePageTitle('Referenciák');

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>References</h1>
            <p>Welcome to the references page!</p>
            <ScrollUp />
        </main>
    )
}

export default References