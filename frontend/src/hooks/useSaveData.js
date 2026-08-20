import { useState } from 'react';

import toast from "react-hot-toast";

import { getAuthHeaders } from '../utils/api';


function useSaveData() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveData = async (url, method, payload) => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders({
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error occurred while saving data.');
            }

            toast.success(
                method === 'PUT' || method === 'PATCH'
                ? 'Sikeresen frissítve!'
                : 'Sikeresen létrehozva!'
            )
            return true;
        }
        catch (error) {
            setError(error.message);
            toast.error('Hiba történt a mentés során!')
            return false;
        }
        finally {
            setIsSaving(false);
        }
    }

    return { saveData, isSaving, error }
}

export default useSaveData;