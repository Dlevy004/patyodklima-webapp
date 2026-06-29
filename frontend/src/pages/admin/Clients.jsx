import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle'
import TableHeader from '../../components/admin/common/TableHeader'
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem'
import useFetch from '../../hooks/useFetch'
import DataStateFeedback from '../../components/admin/common/DataStateFeedback'

function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients = [], isLoading, error } = useFetch('http://localhost:3000/api/clients');

    const isEmpty = !isLoading && !error && clients?.length === 0;

    return (
        <>
            <TableHeader />
            <div className='table-content'>
                <DataStateFeedback
                    isLoading={isLoading}
                    error={error}
                    isEmpty={isEmpty}
                    emptyMessage={'Még nincsenek rögzített ügyfelek az adatbázisban.'}
                >
                    {clients?.map((client) => (
                        <ClientItem
                            key={client.id}
                            name={client.full_name}
                            city={client.city}
                            phone={client.phone}
                        />
                    ))}
                </DataStateFeedback>
            </div>
            <ScrollUp />
        </>
    )
}

export default Clients