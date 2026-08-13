import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import './References.css'

import ScrollUp from '@/components/common/ScrollUp'
import usePageTitle from '@/hooks/usePageTitle';
import DragAndDrop from '@/components/admin/references/DragAndDrop';
import InputField from '@/components/admin/common/InputField';


function References() {
    usePageTitle('Referenciák');

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

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
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
                let errorMessage = `Szerver hiba (Státusz: ${response.status})`;

                try {
                    const jsonResponse = JSON.parse(textResponse);
                    if (jsonResponse.message) errorMessage = jsonResponse.message;
                } catch (e) {
                    console.error("Nem JSON hiba érkezett a szervertől:", textResponse);
                }

                throw new Error(errorMessage);
            }

            toast.success('Referenciakép sikeresen feltöltve!');

            setFile(null);
            setPreviewUrl(null);
            setDescription('');

        } catch (error) {
            console.error('Feltöltési hiba:', error);
            if (error.message === 'Failed to fetch') {
                toast.error('Nem lehet csatlakozni a szerverhez (Backend fut?)');
            } else {
                toast.error(error.message);
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <form className='references-container' onSubmit={handleSubmit} noValidate>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DragAndDrop onFileSelect={handleFileSelect} previewUrl={previewUrl} />
                    {errors.file && <span className="error-text" style={{ color: 'var(--error-color, red)' }}>{errors.file}</span>}
                </div>
                <div className='image-description-container'>
                    <InputField
                        label='Leírás hozzáadása'
                        type='textarea'
                        required={true}
                        onChange={handleDescriptionChange}
                        value={description}
                        error={errors.description}
                    />
                    <button className='submit-btn' type='submit' aria-label='Feltöltés' disabled={isUploading}>Feltöltés</button>
                </div>
            </form>

            <ScrollUp />
        </>
    )
}

export default References