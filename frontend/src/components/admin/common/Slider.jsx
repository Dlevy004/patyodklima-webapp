import { useId } from 'react'

import PropTypes from "prop-types";

import './Slider.css'


function Slider({ title, condition, button1ClassName, onButton1Click, button1Title, button2ClassName, onButton2Click, button2Title }) {
    const titleId = useId();

    return (
        <div className='slider' aria-labelledby={titleId}>
            <p id={titleId}>{title}</p>
            <div className="slider-container">
                <div className={`slider-bg ${condition}`} aria-hidden="true"></div>
                <button
                    className={button1ClassName}
                    onClick={onButton1Click}
                >
                    {button1Title}
                </button>
                <button
                    className={button2ClassName}
                    onClick={onButton2Click}
                >
                    {button2Title}
                </button>
            </div>
        </div>
    )
}

Slider.propTypes = {
    title: PropTypes.string.isRequired,
    condition: PropTypes.string,
    button1ClassName: PropTypes.string,
    onButton1Click: PropTypes.func,
    button1Title: PropTypes.string,
    button2ClassName: PropTypes.string,
    onButton2Click: PropTypes.func,
    button2Title: PropTypes.string
}

export default Slider