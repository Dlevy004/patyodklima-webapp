import { useState, useEffect } from 'react'
import './ScrollUp.css'
import BackToTopIcon from '../icons/BackToTopIcon';

function ScrollUp() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <button 
            id="scroll-up" 
            aria-label="Ugrás az oldal tetejére"
            onClick={scrollToTop}
            style={{
                display: isVisible ? 'flex' : 'none'
            }}
        >
            <BackToTopIcon />
        </button>
    )
}

export default ScrollUp