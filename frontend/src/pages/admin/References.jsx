import './References.css'

import ScrollUp from '@/components/common/ScrollUp'
import usePageTitle from '@/hooks/usePageTitle';
import DragAndDrop from '@/components/admin/references/DragAndDrop';
import InputField from '@/components/admin/common/InputField';


function References() {
    usePageTitle('Referenciák');

    return (
        <>
            <div className='references-container'>
                <DragAndDrop onFileSelect={(file) => console.log('Selected file:', file)} />
                <div className='image-description-container'>
                    <InputField
                        label='Leírás hozzáadása'
                        type='text'
                        required={true}
                        onChange={(e) => handleInputChange('description', e)}
                    />
                    <button className='submit-btn' type='submit' aria-label='Feltöltés'>Feltöltés</button>
                </div>
            </div>

            <ScrollUp />
        </>
    )
}

export default References