import { useRef, useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import './VisualDesign.css'

import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import DragAndDrop from '@/components/admin/common/DragAndDrop';
import MaskCanvas from '@/components/admin/visual-design/MaskCanvas';
import Slider from '../../components/admin/common/Slider';
import ActionBtn from '../../components/admin/common/ActionBtn';
import { getAuthHeaders } from '@/utils/api';

const API_URL = `${import.meta.env.VITE_API_URL}/api/visual-designs`;

function VisualDesign() {
    usePageTitle('Látványterv');

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [placementType, setPlacementType] = useState('indoor');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const maskCanvasRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setGeneratedImageUrl(null);
        setError(null);
        setIsDrawingMode(false);

        toast.success('A kép feltöltése sikeres.');
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleDelete = () => {
        setFile(null);
        setPreviewUrl(null);
        setGeneratedImageUrl(null);
        setError(null);
        setIsDrawingMode(false);

        toast.success('A kép törlése sikeres.');
    };

    const handleUndo = () => {
        maskCanvasRef.current?.reset();
    };

    const handleDownload = async () => {
        const urlToDownload = generatedImageUrl || previewUrl;
        if (!urlToDownload) return;

        try {
            const response = await fetch(urlToDownload);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = generatedImageUrl ? 'latvanyterv.png' : 'eredeti-kep.png';
            a.click();

            window.URL.revokeObjectURL(blobUrl);
            toast.success('A kép letöltése sikeres.');
        } catch (err) {
            console.error('Letöltési hiba:', err);
            toast.error('Hiba történt a letöltés során.');
        }
    };

    const handleToggleDrawing = () => {
        if (!previewUrl || generatedImageUrl) return;
        setIsDrawingMode((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Előbb tölts fel egy képet!');
            return;
        }

        if (!maskCanvasRef.current?.hasSelection()) {
            toast.error('Jelöld be a klíma helyét a képen!');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('placementType', placementType);
        formData.append('prompt', placementType === 'indoor'
            ? 'white split air conditioner unit on the wall'
            : 'air conditioner outdoor compressor unit'
        );

        try {
            const response = await fetch('http://localhost:5000/api/visual-design/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hiba történt a generálás során.');
            }

            const data = await response.json();
            setGeneratedImageUrl(data.generated_image_url);
            setIsDrawingMode(false);
            toast.success('A látványterv elkészült!');
        } catch (err) {
            console.error('Generálási hiba:', err);
            setError(err.message);
            toast.error("Hiba történt a generálás során.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='visual-design-page'>
                <form className='visuals-container' onSubmit={handleSubmit} noValidate>
                    <div className='vd-drag-drop'>
                        <DragAndDrop className='drag-drop' onFileSelect={handleFileSelect} previewUrl={previewUrl} />
                        <div className='vd-action-buttons'>
                            <ActionBtn type='undo' onClick={{}} />
                            <ActionBtn type='download' onClick={{}} />
                            <ActionBtn type='delete' onClick={handleDelete} />
                        </div>
                    </div>

                    <div className="vd-buttons">
                        <div className='vd-modifiers'>
                            <ActionBtn type='draw' onClick={{}} />
                            <Slider
                                condition={{}}
                                button1ClassName='vd-slider-btn1'
                                button1Title='Beltéri'
                                onButton1Click={{}}
                                button2ClassName='vd-slider-btn2'
                                button2Title='Kültéri'
                                onButton2Click={{}}
                            />
                        </div>
                        <button className='vd-generate-btn' type='submit'>Generálás</button>
                    </div>
                </form>
            </div>

            <ScrollUp />
        </>
    )
}

export default VisualDesign