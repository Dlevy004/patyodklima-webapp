+import { useEffect } from 'react';

import PropTypes from 'prop-types';

import './HistoryList.css';

import DataStateFeedback from './DataStateFeedback';
import ModalBackdrop from './ModalBackdrop';
import DeleteDataModal from './DeleteDataModal';
import useModal from '@/hooks/useModal';
import useDeleteData from '@/hooks/useDeleteData';
import useHistoryData from '@/hooks/useHistoryData';


function HistoryList({
    title, apiUrl,
    emptyMessage, deleteLabels,
    getItemKey = (item) => item.id,
    onRefetchReady,
    children
}) {
    const { data: items, isLoading, error, refetch } = useHistoryData(apiUrl);
    const deleteModal = useModal();
    const { deleteData } = useDeleteData();

    useEffect(() => {
        onRefetchReady?.(refetch);
    }, [onRefetchReady, refetch]);

    const handleDeleteClick = async () => {
        const success = await deleteData(`${apiUrl}/${deleteModal.selectedItem.id}`);

        if (success) {
            deleteModal.close();
            refetch();
        }
    };

    return (
        <div className='history-list'>
            {title && <h2 className='history-list-title'>{title}</h2>}
            <ul className='history-list-container'>
                <DataStateFeedback
                    isLoading={isLoading}
                    error={error}
                    isEmpty={!isLoading && !error && items.length === 0}
                    emptyMessage={emptyMessage}
                >
                    {items.map((item) =>
                        children(item, {
                            key: getItemKey(item),
                            refetch,
                            onDelete: () => deleteModal.open(item)
                        })
                    )}
                </DataStateFeedback>
            </ul>

            <ModalBackdrop isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
                <DeleteDataModal
                    titleData={deleteLabels.titleData}
                    descriptionData={deleteLabels.descriptionData}
                    onClose={deleteModal.close}
                    onDelete={handleDeleteClick}
                />
            </ModalBackdrop>
        </div>
    );
}

HistoryList.propTypes = {
    title: PropTypes.string,
    apiUrl: PropTypes.string.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    deleteLabels: PropTypes.shape({
        titleData: PropTypes.string.isRequired,
        descriptionData: PropTypes.string.isRequired
    }).isRequired,
    getItemKey: PropTypes.func,
    onRefetchReady: PropTypes.func,
    children: PropTypes.func.isRequired
};

export default HistoryList;