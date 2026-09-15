const STORAGE_KEY = 'darkmode';


export function getStoredDarkMode() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'active';
    } catch {
        return false;
    }
}

export function setStoredDarkMode(isDarkModeEnabled) {
    try {
        if (isDarkModeEnabled) {
            localStorage.setItem(STORAGE_KEY, 'active');
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // storage is not available
    }
}