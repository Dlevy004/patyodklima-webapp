import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle'
import TableHeader from '../../components/admin/common/TableHeader'
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem'
import useFetch from '../../hooks/useFetch'
import DataStateFeedback from '../../components/admin/common/DataStateFeedback'
import ModalBackdrop from '../../components/admin/common/ModalBackdrop'
import { useState } from 'react'
import DeleteDataModal from '../../components/admin/common/DeleteDataModal'

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

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/clients/${clientToDelete.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete data from the server.')
            }

            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            globalThis.location.reload();
        }
        catch (error) {
            console.error("Error while delete data: ", {error})
        }
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
                <DeleteDataModal
                    titleData={'Ügyfél'}
                    descriptionData={'ügyfelet'}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleConfirmDelete}
                />
            </ModalBackdrop>

            <ScrollUp />
        </>
    )
}

export default Clients