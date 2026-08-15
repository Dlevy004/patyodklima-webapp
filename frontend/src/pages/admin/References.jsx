import './References.css'

import ScrollUp from '@/components/common/ScrollUp'
import usePageTitle from '@/hooks/usePageTitle';
import { useReferenceUpload } from '@/hooks/useReferenceUpload';
import DragAndDrop from '@/components/admin/references/DragAndDrop';
import ReferenceHistory from '@/components/admin/references/ReferenceHistory';
import InputField from '@/components/admin/common/InputField';


function References() {
    usePageTitle('Referenciák');

    const {
        previewUrl,
        description,
        errors,
        isUploading,
        handleFileSelect,
        handleDescriptionChange,
        handleSubmit
    } = useReferenceUpload();

    return (
        <>
        <div className='references-page'>
            <form className='references-container' onSubmit={handleSubmit} noValidate>
                <DragAndDrop onFileSelect={handleFileSelect} previewUrl={previewUrl} />

                <div className='image-description-container'>
                    <InputField
                        label='Leírás hozzáadása'
                        type='textarea'
                        required={true}
                        onChange={handleDescriptionChange}
                        value={description}
                        error={errors.description}
                    />

                    {errors.file && <span className="error-text" role='alert'>{errors.file}</span>}
                    <button className='submit-btn' type='submit' disabled={isUploading}>Feltöltés</button>
                </div>
            </form>

            <ReferenceHistory />
        </div>

            <ScrollUp />
        </>
    )
}

export default References