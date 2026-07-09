import { useState, useEffect } from 'react';

import './ThemeSwitcher.css'

import LightModeIcon from '@/components/icons/LightModeIcon'
import DarkModeIcon from '@/components/icons/DarkModeIcon'


function ThemeSwitcher() {
    const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
        () => localStorage.getItem('darkmode') === 'active'
    );

    useEffect(() => {
        document.body.classList.toggle('darkmode', isDarkModeEnabled)
        localStorage.setItem('darkmode', isDarkModeEnabled ? 'active' : null)
    }, [isDarkModeEnabled])

    return(
        <button
            className="theme-switch"
            aria-label="Témaváltás (sötét/világos)"
            onClick={() => setIsDarkModeEnabled(prev => !prev)}>
            <div className="my-icon">
                { isDarkModeEnabled ? <LightModeIcon /> : <DarkModeIcon /> }
            </div>
        </button>
    )
}

export default ThemeSwitcher;