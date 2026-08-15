import { useId } from 'react';

import './ReferenceHistory.css'

import DataStateFeedback from '../common/DataStateFeedback';
import UploadedReference from './UploadedReference';
import useFetch from '@/hooks/useFetch';

const API_URL = 'http://localhost:3000/api/references';
const IMG_BASE_URL = 'https://cgrciqcvvvudoywggogj.supabase.co/storage/v1/object/public/References/';
const uploadedReferences = [
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    },
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    },
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    },
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    },
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    },
    {
        title: 'Referencia próbakép',
        imageUrl: '1786704966248-nessAj.webp'
    }
];


function ReferenceHistory() {
    const { data: references = [], isLoading, error, refetch } = useFetch(API_URL);
    const uniqueId = useId();

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
                        uploadedReferences.map((reference) => (
                            <UploadedReference
                                key={uniqueId}
                                title={reference.title}
                                imageUrl={`${IMG_BASE_URL}${reference.imageUrl}`}
                            />
                        ))
                    }
                </DataStateFeedback>
            </ul>
        </div>
    )
}

export default ReferenceHistory;