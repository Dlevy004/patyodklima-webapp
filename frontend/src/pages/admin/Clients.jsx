import toast from 'react-hot-toast'

import './Clients.css'

import ScrollUp from '@/components/common/ScrollUp'
import TableHeader from '@/components/admin/common/TableHeader'
import ModalBackdrop from '@/components/admin/common/ModalBackdrop'
import DataStateFeedback from '@/components/admin/common/DataStateFeedback'
import DeleteDataModal from '@/components/admin/common/DeleteDataModal'
import ClientItem from '@/components/admin/clients/ClientItem'
import AddEditClientModal from '@/components/admin/clients/AddEditClientModal'
import useFetch from '@/hooks/useFetch'
import useDeleteData from '@/hooks/useDeleteData'
import usePageTitle from '@/hooks/usePageTitle'
import useSaveData from '@/hooks/useSaveData'
import useModal from '@/hooks/useModal'

const API_URL = `${import.meta.env.VITE_API_URL}/api/clients`


function Clients() {
    usePageTitle('Ügyfélnapló');
    const { data: clients = [], isLoading, error, refetch } = useFetch(API_URL);
    const isEmpty = !isLoading && !error && clients?.length === 0;

    const deleteModal = useModal();
    const editModal = useModal();

    const { deleteData } = useDeleteData();
    const { saveData } = useSaveData();

    const handleConfirmDelete = async () => {
        if (!deleteModal.selectedItem) return;

        const success = await deleteData(`${API_URL}/${deleteModal.selectedItem.id}`);

        if (success) {
            deleteModal.close();
            refetch();
            toast.success('Ügyfél és a lezárt munkái sikeresen törölve!');
        } else {
            toast.error('Folyamatban lévő munka miatt az ügyfél nem törölhető!');
            deleteModal.close();
        }
    };

    const handleSaveClient = async (formData) => {
        const isEditing = Boolean(editModal.selectedItem);
        const url = isEditing ? `${API_URL}/${editModal.selectedItem.id}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        const success = await saveData(url, method, formData);

        if (success) {
            editModal.close();
            refetch();
        }
    };

    return (
        <>
            <TableHeader onAddClick={() => editModal.open()} />

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
                            onDelete={() => deleteModal.open(client)}
                            onEdit={() => editModal.open(client)}
                        />
                    ))}
                </DataStateFeedback>
            </div>

            <ModalBackdrop isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
                <DeleteDataModal
                    titleData={'Ügyfél'}
                    descriptionData={'ügyfelet'}
                    onClose={deleteModal.close}
                    onDelete={handleConfirmDelete}
                />
            </ModalBackdrop>

            <ModalBackdrop isOpen={editModal.isOpen} onClose={editModal.close}>
                <AddEditClientModal
                    onClose={editModal.close}
                    onSave={handleSaveClient}
                    clientData={editModal.selectedItem}
                />
            </ModalBackdrop>

            <ScrollUp />
        </>
    )
}

export default Clients