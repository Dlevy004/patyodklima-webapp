import HistoryList from '@/components/admin/common/HistoryList';
import GeneratedAdCard from './GeneratedMarketingCard';
import useFileDownload from '@/hooks/useFileDownload';

const MARKETING_API_URL = `${import.meta.env.VITE_API_URL}/api/marketings`;


function AdHistory({ refreshKey }) {
    const { downloadFile } = useFileDownload();

    const handleDownload = (marketingId, title) => {
        const filename = title?.trim() || `hirdetes-${marketingId}`;
        return downloadFile(`${MARKETING_API_URL}/${marketingId}/download`, `${filename}.png`);
    };

    return (
        <HistoryList
            key={refreshKey}
            title='Előzmények'
            apiUrl={MARKETING_API_URL}
            emptyMessage='Még nincs elkészült hirdetés.'
            deleteLabels={{ titleData: 'Hirdetés', descriptionData: 'hirdetést' }}
        >
            {(marketing, { key, onDelete }) => (
                <GeneratedAdCard key={key} marketing={marketing} onDelete={onDelete} onDownload={handleDownload} />
            )}
        </HistoryList>
    );
}

export default AdHistory;