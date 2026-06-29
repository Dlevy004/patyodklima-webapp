import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import TableHeader from '../../components/admin/common/TableHeader';
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem';
import useFetch from '../../hooks/useFetch';

function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients, isLoading, error } = useFetch('http://localhost:3000/api/clients');

    return (
        <>
            <TableHeader />
            <div className='table-content'>
                {isLoading && <p className='info-text'>Ügyfelek betöltése folyamatban...</p>}
                {error && <p className='info-text error-text'>Hiba: {error}</p>}

                {!isLoading && !error && clients.length === 0
                && <p className='info-text'>Még nincsenek rögzített ügyfelek az adatbázisban.</p>}

                {!isLoading && !error && clients.map((client) => (
                    <ClientItem
                        key={client.id}
                        name={client.full_name}
                        city={client.city}
                        phone={client.phone}
                    />
                ))}
            </div>
            <ScrollUp />
        </>
    )
}

export default Clients