import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle'
import TableHeader from '../../components/admin/common/TableHeader'
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem'
import useFetch from '../../hooks/useFetch'
import DataStateFeedback from '../../components/admin/common/DataStateFeedback'
import ModalBackdrop from '../../components/admin/common/ModalBackdrop'
import { useState } from 'react'

function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients = [], isLoading, error } = useFetch('http://localhost:3000/api/clients');

    const isEmpty = !isLoading && !error && clients?.length === 0;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    }

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

                            onDelete={() => handleDeleteClick(client)}
                        />
                    ))}
                </DataStateFeedback>
            </div>

            <ModalBackdrop
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <p>Testing text</p>
            </ModalBackdrop>

            <ScrollUp />
        </>
    )
}

export default Clients