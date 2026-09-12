import { useState } from 'react';

import './VisualDesign.css'

import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import DragAndDrop from '@/components/admin/common/DragAndDrop';
import Slider from '../../components/admin/common/Slider';
import ActionBtn from '../../components/admin/common/ActionBtn';


function VisualDesign() {
    usePageTitle('Látványterv');

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