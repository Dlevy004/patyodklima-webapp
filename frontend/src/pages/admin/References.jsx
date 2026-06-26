import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function References() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Referenciák') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>References</h1>
            <p>Welcome to the references page!</p>
            <ScrollUp />
        </main>
    )
}

export default References