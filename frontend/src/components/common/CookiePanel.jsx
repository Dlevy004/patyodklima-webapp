import { useState } from "react"

import { Cookie } from 'lucide-react'

import './CookiePanel.css'


function CookiePanel() {
    const [isVisible, setIsVisible] = useState(() => {
        const hasConsent = document.cookie.split(';').some(cookie => cookie.trim().startsWith('cookie_consent'));

        return !hasConsent;
    });

    const handleAccept = () => {
        document.cookie = "cookie_consent=Patyod-Klima; max-age=" + 60 * 60 * 24 * 30;

        setIsVisible(false);

        const gaScript = document.getElementById('gtag-script');
        if (gaScript && !gaScript.src) {
            gaScript.src = gaScript.dataset.src;
            gaScript.onload = () => {
                if (globalThis.gtag) {
                    globalThis.gtag('js', new Date());
                    globalThis.gtag('config', 'G-8ME9DQ3SZK');
                }
            }
        }
    };

    const handleReject = () => {
        setIsVisible(false);
    };

    return (
        <dialog className={`cookie-panel ${isVisible ? 'show' : ''}`} aria-labelledby="CookieTitle" open={isVisible}>
            <header>
                <Cookie className={"cookie-icon"}/>
                <h2 id="CookieTitle">Cookie tájékoztató</h2>
            </header>

            <div className="data">
                <p>
                    Az oldal a jobb felhasználói élmény érdekében sütiket használ.
                    További tudnivalók:&nbsp;{' '}
                        <a rel="noopener noreferrer"
                            href={'/privacypolicy'}
                            target="_blank">Adatkezelési tájékoztató</a>
                </p>
            </div>

            <div className="cookie-btns">
                <button className="button" id="acceptBtn" onClick={handleAccept}>Elfogad</button>
                <button className="button" id="rejectBtn" onClick={handleReject}>Elutasít</button>
            </div>
        </dialog>
    )
}

export default CookiePanel