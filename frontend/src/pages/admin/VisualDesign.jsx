import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function VisualDesign() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Látványterv') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>VisualDesign</h1>
            <p>Welcome to the visualDesign page!</p>
            <ScrollUp />
        </main>
    )
}

export default VisualDesign