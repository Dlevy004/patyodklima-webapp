import { useState } from "react";


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

            return true;
        }
        catch (error) {
            setError(error.message);

            return false;
        }
        finally {
            setIsDeleting(false);
        }
    }

    return { deleteData, isDeleting, error }
}

export default useDeleteData