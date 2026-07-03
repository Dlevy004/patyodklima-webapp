import { useState } from 'react';

function useSaveData() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveData = async (url, method, payload) => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error occurred while saving data.');
            }

            return true;
        }
        catch (error) {
            setError(error.message);
            return false;
        }
        finally {
            setIsSaving(false);
        }
    }

    return { saveData, isSaving, error }
}

export default useSaveData;