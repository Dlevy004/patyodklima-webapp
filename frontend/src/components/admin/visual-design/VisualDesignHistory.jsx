import toast from 'react-hot-toast'

import HistoryList from '@/components/admin/common/HistoryList';
import GeneratedDesignCard from './GeneratedDesignCard';
import { getAuthHeaders } from '../../../utils/api'

const DESIGNS_API_URL = `${import.meta.env.VITE_API_URL}/api/visual-designs`;


function VisualDesignHistory() {
    const handleDownload = async (generatedImgId, title) => {
        try {
            const response = await fetch(`${DESIGNS_API_URL}/${generatedImgId}/download`, {
                headers: getAuthHeaders()
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
            toast.error('Nem sikerült letölteni a képet.');
        }
    };

    return (
        <HistoryList
            title="Előzmények"
            apiUrl={DESIGNS_API_URL}
            emptyMessage="Még nincs elkészült látványterv."
            deleteLabels={{ titleData: 'Látványterv', descriptionData: 'látványtervet' }}
        >
            {(design, { key, onDelete }) => (
                <GeneratedDesignCard key={key} design={design} onDelete={onDelete} onDownload={handleDownload} />
            )}
        </HistoryList>
    );
}

export default VisualDesignHistory;