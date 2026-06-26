import ScrollUp from '../../components/common/ScrollUp'
import { useContext, useEffect } from 'react'
import { TitleContext } from '../../components/TitleContext'

function Jobs() {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => { setTitle('Munkanapló') }, [setTitle]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Jobs</h1>
            <p>Welcome to the jobs page!</p>
            <ScrollUp />
        </main>
    )
}

export default Jobs