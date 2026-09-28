import { useId, useRef, useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { CirclePlus } from 'lucide-react';

import './FAQItem.css';


function FAQItem({ question, answer, isOpen, onToggle }) {
    const panelId = useId();
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('0px');

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight('0px');
        }
    }, [isOpen]);

    const handleToggle = () => {
        onToggle();
    };

    return (
        <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <button
                type='button'
                className='faq-question'
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
            >
                <span>{question}</span>
                <CirclePlus className='faq-icon' aria-hidden='true' />
            </button>

            <div
                id={panelId}
                ref={contentRef}
                className='faq-answer-wrapper'
                aria-hidden={!isOpen}
                style={{ maxHeight }}
            >
                <p className='faq-answer'>{answer}</p>
            </div>
        </div>
    );
}

FAQItem.propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default FAQItem;