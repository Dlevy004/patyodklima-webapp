import { useRef } from 'react';

import toast from 'react-hot-toast';

import HistoryList from '@/components/admin/common/HistoryList';
import UploadedReference from './UploadedReference';
import useSaveData from '@/hooks/useSaveData';
import useModal from '@/hooks/useModal';
import ModalBackdrop from '@/components/admin/common/ModalBackdrop';
import EditReferenceModal from './EditReferenceModal';
import { getAuthHeaders } from '@/utils/api';

const API_URL = `${import.meta.env.VITE_API_URL}/api/references`


function ReferenceHistory({ refreshTrigger }) {
    const editModal = useModal();
    const { saveData } = useSaveData();
    const refetchRef = useRef(() => {});

    const handleToggleVisibility = async (reference, refetch) => {
        const success = await saveData(`${API_URL}/${reference.id}`, 'PUT', {
            image_url: reference.image_url,
            description: reference.description,
            is_visible: !reference.is_visible
        });
        if (success) refetch();
    };

    const handleSaveClick = async (reference) => {
        const success = await saveData(`${API_URL}/${editModal.selectedItem.id}`, 'PUT', reference);
        if (success) {
            editModal.close();
            refetchRef.current();
        }
    };

    const handleDownload = async (referenceId, title) => {
        try {
            const response = await fetch(`${API_URL}/${referenceId}/download`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Szerverhiba történt a letöltés során.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.png`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Letöltési hiba:', error.message);
            toast.error(`Nem sikerült letölteni a képet.`)
        }
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