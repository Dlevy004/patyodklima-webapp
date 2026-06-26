import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function Ads() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Hirdetések') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Ads</h1>
            <p>Welcome to the ads page!</p>
            <ScrollUp />
        </main>
    )
}

export default Ads