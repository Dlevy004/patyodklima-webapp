import { createContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';


export const TitleContext = createContext();

export function TitleProvider({ children }) {
    const [title, setTitle] = useState('Pátyod Klíma');

    useEffect(() => {
        document.title = `Pátyod Klíma | ${title}`;
    }, [title]);

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}

TitleProvider.propTypes = {
    children: PropTypes.node.isRequired
}