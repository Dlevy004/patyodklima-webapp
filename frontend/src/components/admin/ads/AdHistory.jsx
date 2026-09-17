import HistoryList from '@/components/admin/common/HistoryList';
import GeneratedAdCard from './GeneratedAdCard';
import useFileDownload from '@/hooks/useFileDownload';

const ADS_API_URL = `${import.meta.env.VITE_API_URL}/api/ads`;


function AdHistory({ refreshKey }) {
    const { downloadFile } = useFileDownload();

    const handleDownload = (adId, title) =>
        downloadFile(`${ADS_API_URL}/${adId}/download`, `${title}.png`);

    return (
        <HistoryList
            key={refreshKey}
            title='Előzmények'
            apiUrl={ADS_API_URL}
            emptyMessage='Még nincs elkészült hirdetés.'
            deleteLabels={{ titleData: 'Hirdetés', descriptionData: 'hirdetést' }}
        >
            {(ad, { key, onDelete }) => (
                <GeneratedAdCard key={key} ad={ad} onDelete={onDelete} onDownload={handleDownload} />
            )}
        </HistoryList>
    );
}

export default AdHistory;