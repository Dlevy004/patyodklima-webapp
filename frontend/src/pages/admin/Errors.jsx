import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function Errors() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Bejelentések') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Errors</h1>
            <p>Welcome to the errors page!</p>
            <ScrollUp />
        </main>
    )
}

export default Errors