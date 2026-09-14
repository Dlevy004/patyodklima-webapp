import toast from 'react-hot-toast'

import HistoryList from '@/components/admin/common/HistoryList';
import GeneratedDesignCard from './GeneratedDesignCard';
import { getAuthHeaders } from '../../../utils/api'

const DESIGNS_API_URL = `${import.meta.env.VITE_API_URL}/api/visual-designs`;


function VisualDesignHistory() {
    const { downloadFile } = useFileDownload();

    const handleDownload = (generatedImgId, title) =>
        downloadFile(`${DESIGNS_API_URL}/${generatedImgId}/download`, `${title}.png`);

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