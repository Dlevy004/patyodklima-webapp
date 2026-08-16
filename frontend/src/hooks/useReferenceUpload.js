import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';


export default function useReferenceUpload() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setErrors((prev) => ({ ...prev, file: null }));
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);

        if (errors.description) {
            setErrors((prev) => ({ ...prev, description: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!file) newErrors.file = 'Kérlek, válassz ki egy képet a feltöltéshez!';
        if (!description.trim()) newErrors.description = 'A leírás megadása kötelező!';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('description', description);
        formData.append('is_visible', 'true');

        try {
            const response = await fetch('http://localhost:3000/api/references', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const textResponse = await response.text();
                let errorMessage = `Server error (Status: ${response.status})`;

                try {
                    const jsonResponse = JSON.parse(textResponse);
                    if (jsonResponse.message) errorMessage = jsonResponse.message;
                } catch (err) {
                    console.error(err.errorMessage);
                }

                throw new Error(errorMessage);
            }

            toast.success('Referenciakép sikeresen feltöltve!');

            setFile(null);
            setPreviewUrl(null);
            setDescription('');

        } catch (error) {
                toast.error('Error during upload: ', error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        previewUrl,
        description,
        errors,
        isUploading,
        handleFileSelect,
        handleDescriptionChange,
        handleSubmit
    };
}