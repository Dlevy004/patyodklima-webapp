import { useState } from "react";

import toast from 'react-hot-toast'


function useDeleteData() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (url) => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete data from the server.')
            }

            toast.success('Az ügyfél sikeresen törölve!')
            return true;
        }
        catch (error) {
            setError(error.message);
            toast.error('Hiba történt a törlés során!')
            return false;
        }
        finally {
            setIsDeleting(false);
        }
    }

    return { deleteData, isDeleting, error }
}

export default useDeleteData