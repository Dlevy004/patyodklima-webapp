import { useState } from 'react'

import './Clients.css'

import ScrollUp from '../../components/common/ScrollUp'

import TableHeader from '../../components/admin/common/TableHeader'
import ModalBackdrop from '../../components/admin/common/ModalBackdrop'
import DataStateFeedback from '../../components/admin/common/DataStateFeedback'
import DeleteDataModal from '../../components/admin/common/DeleteDataModal'

import ClientItem from '../../components/admin/clients/ClientItem'
import AddEditClientModal from '../../components/admin/clients/AddEditClientModal'

import useFetch from '../../hooks/useFetch'
import useDeleteData from '../../hooks/useDeleteData'
import usePageTitle from '../../hooks/usePageTitle'
import useSaveData from '../../hooks/useSaveData'


function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients = [], isLoading, error, refetch } = useFetch('http://localhost:3000/api/clients');

    const isEmpty = !isLoading && !error && clients?.length === 0;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const { deleteData } = useDeleteData();
    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    }

    const [isClientDatasModalOpen, setIsClientDatasModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);

    const handleModalVisibility = (client) => {
        setClientToEdit(client);
        setIsClientDatasModalOpen(false);
    }

    const handleAddClick = () => {
        setClientToEdit(null);
        setIsClientDatasModalOpen(true);
    }

    const handleEditClick = (client) => {
        setClientToEdit(client);
        setIsClientDatasModalOpen(true);
    }

    const handleConfirmDelete = async () => {
        if (!clientToDelete) return;

        const success = await deleteData(`http://localhost:3000/api/clients/${clientToDelete.id}`);

        if (success) {
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
            refetch();
        }
    }

    const { saveData, isSaving } = useSaveData();

    const handleSaveClient = async (formData) => {
        const isEditing = Boolean(clientToEdit);

        const url = isEditing
            ? `http://localhost:3000/api/clients/${clientToEdit.id}`
            : `http://localhost:3000/api/clients`;

        const method = isEditing ? 'PUT' : 'POST';

        const success = await saveData(url, method, formData);

        if (success) {
            setIsClientDatasModalOpen(false);
            setClientToEdit(null);
            refetch();
        }
    }

    return (
        <>
            <TableHeader onAddClick={handleAddClick}/>

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
                            onEdit={() => handleEditClick(client)}
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

            <ModalBackdrop
                isOpen={isClientDatasModalOpen}
                onClose={() => setIsClientDatasModalOpen(false)}
            >
                <AddEditClientModal
                    onClose={() => setIsClientDatasModalOpen(false)}
                    onSave={handleSaveClient}
                    clientData={clientToEdit}
                />
            </ModalBackdrop>

            <ScrollUp />
        </>
    )
}

export default Clients