import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function Clients() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Ügyfélnapló') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Clients</h1>
            <p>Welcome to the clients page!</p>
            <ScrollUp />
        </main>
    )
}

export default Clients