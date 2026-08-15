import './ReferenceHistory.css'

import DataStateFeedback from '../common/DataStateFeedback';
import UploadedReference from './UploadedReference';
import useFetch from '@/hooks/useFetch';
import useDeleteData from '@/hooks/useDeleteData';
import useSaveData from '@/hooks/useSaveData';

const API_URL = 'http://localhost:3000/api/references';


function ReferenceHistory() {
    const { data: references = [], isLoading, error, refetch } = useFetch(API_URL);
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

    const handleDeleteClick = async (id) => {
        // TODO: Modal opening logic

        const success = await deleteData(`${API_URL}/${id}`);
        if (success) {
            refetch();
        }
    };

    const handleEditClick = (reference) => {
        // TODO: Modal opening logic
        console.log("Clicked the following reference:", reference);
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

                                onDelete={() => handleDeleteClick(reference.id)}
                                onEdit={() => handleEditClick(reference)}
                                onToggleVisibility={() => handleToggleVisibility(reference)}
                            />
                        ))
                    }
                </DataStateFeedback>
            </ul>
        </div>
    )
}

export default ReferenceHistory;