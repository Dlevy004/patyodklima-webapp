import './ReferenceHistory.css'

import DataStateFeedback from '../common/DataStateFeedback';
import UploadedReference from './UploadedReference';
import useFetch from '@/hooks/useFetch';
import useDeleteData from '@/hooks/useDeleteData';
import useSaveData from '@/hooks/useSaveData';
import useModal from '@/hooks/useModal';
import ModalBackdrop from '@/components/admin/common/ModalBackdrop';
import DeleteDataModal from '@/components/admin/common/DeleteDataModal';
import EditReferenceModal from './EditReferenceModal';
import { getAuthHeaders } from '@/utils/api';

const API_URL = `${import.meta.env.VITE_API_URL}/api/references`


function ReferenceHistory() {
    const { data: references = [], isLoading, error, refetch } = useFetch(API_URL);

    const deleteModal = useModal();
    const editModal = useModal();

    const { deleteData } = useDeleteData();
    const { saveData} = useSaveData();

    const handleToggleVisibility = async (reference) => {
        const url = `${API_URL}/${reference.id}`;

        const success = await saveData(url, 'PUT', {
            image_url: reference.image_url,
            description: reference.description,
            is_visible: !reference.is_visible
        });

        if (success) {
            refetch();
        }
    };

    const handleDeleteClick = async () => {
        const success = await deleteData(`${API_URL}/${deleteModal.selectedItem.id}`);

        if (success) {
            deleteModal.close();
            refetch();
        }
    };

    const handleSaveClick = async (reference) => {
        const url = `${API_URL}/${editModal.selectedItem.id}`;

        const success = await saveData(url, 'PUT', reference);

        if (success) {
            editModal.close();
            refetch();
        }
    };

    const handleDownload = async (referenceId, title) => {
        const response = await fetch(`${API_URL}/${referenceId}/download`, {
            headers: getAuthHeaders(),
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.png`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className='reference-history'>
            <h2 className='reference-history-title'>Jelenlegi referenciák</h2>
            <ul className='reference-history-container'>
                <DataStateFeedback
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!isLoading && !error && references?.length === 0}
                    emptyMessage={'Nincsenek feltöltött referenciák.'}
                >
                    {
                        references?.map((reference) => (
                            <UploadedReference
                                key={reference.id}
                                title={reference.description}
                                imageUrl={reference.image_url}
                                isVisible={reference.is_visible}

                                onDelete={() => deleteModal.open(reference)}
                                onEdit={() => editModal.open(reference)}
                                onToggleVisibility={() => handleToggleVisibility(reference)}
                                onDownload={() => handleDownload(reference.id, reference.description)}
                            />
                        ))
                    }
                </DataStateFeedback>
            </ul>

            <ModalBackdrop isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
                <DeleteDataModal
                    titleData={'Referenciakép'}
                    descriptionData={'referenciát'}
                    onClose={deleteModal.close}
                    onDelete={handleDeleteClick}
                />
            </ModalBackdrop>

            <ModalBackdrop isOpen={editModal.isOpen} onClose={editModal.close}>
                <EditReferenceModal
                    onClose={editModal.close}
                    onSave={handleSaveClick}
                    referenceData={editModal.selectedItem}
                />
            </ModalBackdrop>
        </div>
    )
}

export default ReferenceHistory;