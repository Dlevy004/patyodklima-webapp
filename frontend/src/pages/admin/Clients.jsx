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
import useDeleteData from '../../hooks/useDeleteData'

function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients = [], isLoading, error } = useFetch('http://localhost:3000/api/clients');

    const isEmpty = !isLoading && !error && clients?.length === 0;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const { deleteData } = useDeleteData();
    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;

        const success = await deleteData(`http://localhost:3000/api/clients/${clientToDelete.id}`);

        if (success) {
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            globalThis.location.reload();
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
                    emptyMessage={'Nincsenek rögzített ügyfelek az adatbázisban.'}
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