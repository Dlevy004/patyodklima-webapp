import toast from 'react-hot-toast';

import { getAuthHeaders } from '@/utils/api';


export default function useFileDownload() {
    const downloadFile = async (url, filename, errorMessage = 'Nem sikerült letölteni a képet.') => {
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Szerverhiba történt a letöltés során.');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Letöltési hiba:', error.message);
            toast.error(errorMessage);
        }
    };

    return { downloadFile };
}