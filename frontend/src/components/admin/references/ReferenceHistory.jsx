import { useRef } from 'react';

import HistoryList from '@/components/admin/common/HistoryList';
import UploadedReference from './UploadedReference';
import useSaveData from '@/hooks/useSaveData';
import useModal from '@/hooks/useModal';
import ModalBackdrop from '@/components/admin/common/ModalBackdrop';
import EditReferenceModal from './EditReferenceModal';
import { getAuthHeaders } from '@/utils/api';

const API_URL = `${import.meta.env.VITE_API_URL}/api/references`


function ReferenceHistory() {
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

    const handleDownload = (referenceId, title) =>
        downloadFile(`${API_URL}/${referenceId}/download`, `${title}.png`);

    return (
        <>
            <HistoryList
                title="Jelenlegi referenciák"
                apiUrl={API_URL}
                emptyMessage="Nincsenek feltöltött referenciák."
                deleteLabels={{ titleData: 'Referenciakép', descriptionData: 'referenciát' }}
                onRefetchReady={(fn) => { refetchRef.current = fn; }}
            >
                {(reference, { key, refetch, onDelete }) => (
                    <UploadedReference
                        key={key}
                        title={reference.description}
                        imageUrl={reference.image_url}
                        isVisible={reference.is_visible}
                        onDelete={onDelete}
                        onEdit={() => editModal.open(reference)}
                        onToggleVisibility={() => handleToggleVisibility(reference, refetch)}
                        onDownload={() => handleDownload(reference.id, reference.description)}
                    />
                )}
            </HistoryList>

            <ModalBackdrop isOpen={editModal.isOpen} onClose={editModal.close}>
                <EditReferenceModal
                    onClose={editModal.close}
                    onSave={handleSaveClick}
                    referenceData={editModal.selectedItem}
                />
            </ModalBackdrop>
        </>
    );
}

export default ReferenceHistory;