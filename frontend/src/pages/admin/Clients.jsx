import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import TableHeader from '../../components/admin/common/TableHeader';
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem';

function Clients() {
    usePageTitle('Ügyfélnapló');

    return (
        <>
            <TableHeader />
            <div className='table-content'>
                <ClientItem name='Kis PistaPistaPistaPista' city='Település nevePistaPistaPista' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
                <ClientItem name='Kis Pista' city='Település neve' phone='06 20 1234 567'/>
            </div>
            <ScrollUp />
        </>
    )
}

export default Clients