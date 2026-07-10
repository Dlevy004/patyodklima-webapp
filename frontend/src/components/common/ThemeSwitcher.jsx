import { useState, useEffect } from 'react';

import { Sun, Moon } from 'lucide-react'

import './ThemeSwitcher.css'


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
                { isDarkModeEnabled ? <Sun data-testid='light-icon' /> : <Moon data-testid='dark-icon' /> }
            </div>
        </button>
    )
}

export default ThemeSwitcher;