import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';

function VisualDesign() {
    usePageTitle('Látványterv');

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>VisualDesign</h1>
            <p>Welcome to the visualDesign page!</p>
            <ScrollUp />
        </main>
    )
}

export default VisualDesign