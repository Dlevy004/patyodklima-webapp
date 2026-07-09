import { useState } from 'react';


function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const open = (item = null) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setSelectedItem(null);
    };

    return { isOpen, selectedItem, open, close };
}

export default useModal;