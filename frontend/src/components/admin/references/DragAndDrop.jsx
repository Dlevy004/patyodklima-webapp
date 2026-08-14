import { Plus } from 'lucide-react'

import './DragAndDrop.css'


function DragAndDrop({ onFileSelect, previewUrl }) {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <label
            className="drag-and-drop-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={(e) => onFileSelect(e.target.files[0])}
                className="drag-and-drop-input"
            />
                {previewUrl ? (
                    <img src={previewUrl} alt="A feltöltött referenciakép előnézete" className="drag-and-drop-preview" />
                ) : (
                    <>
                        <Plus className='drag-and-drop-plus' aria-hidden='true'/>
                        <span className="drag-and-drop-label">
                            Húzd ide a képet vagy kattints ide a feltöltéshez
                        </span>
                    </>
                )}
        </label>
    )
}

export default DragAndDrop;