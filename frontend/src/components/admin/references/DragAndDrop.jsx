import { Plus } from 'lucide-react'

import './DragAndDrop.css'


function DragAndDrop({ onFileSelect}) {
    return (
        <label className="drag-and-drop-container">
            <input
                type="file"
                onChange={(e) => onFileSelect(e.target.files[0])}
                className="drag-and-drop-input"
            />
            <Plus size={80} aria-hidden='true'/>
            <span className="drag-and-drop-label">
                Húzd ide a képet vagy kattints ide a feltöltéshez
            </span>
        </label>
    )
}

export default DragAndDrop;