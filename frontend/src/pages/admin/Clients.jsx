import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import TableHeader from '../../components/admin/common/TableHeader';
import './Clients.css'

function Clients() {
    usePageTitle('Ügyfélnapló');

    return (
        <>
            <TableHeader />
            <div className='table-content'>
            </div>
            <ScrollUp />
        </>
    )
}

export default Clients