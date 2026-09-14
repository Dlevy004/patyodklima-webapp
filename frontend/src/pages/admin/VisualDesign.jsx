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
import VisualDesignHistory from '../../components/admin/visual-design/VisualDesignHistory';

const API_URL = `${import.meta.env.VITE_API_URL}/api/visual-designs`;

function VisualDesign() {
    usePageTitle('Látványterv');

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [placementType, setPlacementType] = useState('indoor');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const maskCanvasRef = useRef(null);
    const activeRequestRef = useRef(0);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        activeRequestRef.current += 1;

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
        activeRequestRef.current += 1;

        setFile(null);
        setPreviewUrl(null);
        setGeneratedImageUrl(null);
        setError(null);
        setIsDrawingMode(false);

        toast.success('A kép törlése sikeres.');
    };

    const handleUndo = () => {
        if (generatedImageUrl) {
            setGeneratedImageUrl(null);
            return;
        }
        maskCanvasRef.current?.reset();
    };

    const handleDownload = async () => {
        const urlToDownload = generatedImageUrl || previewUrl;
        if (!urlToDownload) return;

        try {
            const response = await fetch(urlToDownload);
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
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

        const requestId = ++activeRequestRef.current;

        setIsLoading(true);
        setError(null);

        try {
            const maskBlob = await maskCanvasRef.current.getMaskBlob();
            if (!maskBlob) throw new Error('Nem sikerült elkészíteni a kijelölést.');

            const formData = new FormData();
            formData.append('image', file);
            formData.append('mask', maskBlob, 'mask.png');
            formData.append('placementType', placementType);

            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Hiba történt a generálás során.');
            }

            const data = await response.json();

            if (activeRequestRef.current !== requestId) return;

            setGeneratedImageUrl(data.generated_image_url);
            setIsDrawingMode(false);
            setRefreshTrigger((prev) => prev + 1);
            toast.success('A látványterv elkészült!');
        } catch (err) {
            if (activeRequestRef.current !== requestId) return;

            console.error('Generálási hiba:', err);
            setError(err.message);
            toast.error("Hiba történt a generálás során.");
        } finally {
            if (activeRequestRef.current === requestId) {
                setIsLoading(false);
            }
        }
    };

    const displayedImage = generatedImageUrl || previewUrl;

    return (
        <>
            <div className='visual-design-page'>
                <form className='visuals-container' onSubmit={handleSubmit} noValidate>
                    <div className='vd-drag-drop'>
                        <DragAndDrop
                            className='drag-drop'
                            onFileSelect={handleFileSelect}
                            previewUrl={displayedImage}
                        />

                        {previewUrl && !generatedImageUrl && (
                            <MaskCanvas
                                ref={maskCanvasRef}
                                imageUrl={previewUrl}
                                isDrawingMode={isDrawingMode}
                            />
                        )}

                        {previewUrl && (
                            <div className='vd-action-buttons'>
                                <ActionBtn type='undo' onClick={handleUndo} />
                                <ActionBtn type='download' onClick={handleDownload} />
                                <ActionBtn type='delete' onClick={handleDelete} />
                            </div>
                        )}

                        {isLoading && (
                            <div className='vd-loading-overlay'>
                                <span className='vd-spinner' aria-hidden="true"></span>
                            </div>
                        )}

                    </div>
                    {error && <span className='error-text' role='alert'>{error}</span>}

                    <div className="vd-buttons">
                        <div className='vd-modifiers'>
                            <ActionBtn
                                type='draw'
                                onClick={handleToggleDrawing}
                                className={isDrawingMode ? 'is-active' : ''}
                            />
                            <Slider
                                condition={placementType === 'outdoor' ? 'slide-right' : ''}
                                button1ClassName={`vd-slider-btn1 ${placementType === 'indoor' ? 'active' : ''}`.trim()}
                                button1Title='Beltéri'
                                onButton1Click={() => setPlacementType('indoor')}
                                button2ClassName={`vd-slider-btn2 ${placementType === 'outdoor' ? 'active' : ''}`.trim()}
                                button2Title='Kültéri'
                                onButton2Click={() => setPlacementType('outdoor')}
                            />
                        </div>
                        <button className='vd-generate-btn' type='submit' disabled={isLoading}>
                            {isLoading ? 'Generálás…' : 'Generálás'}
                        </button>
                    </div>
                </form>

                <VisualDesignHistory key={refreshTrigger}/>
            </div>

            <ScrollUp />
        </>
    )
}

export default VisualDesign