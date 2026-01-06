import { useState } from 'react'
import upIcon from '../assets/icons/up.svg'
import upBlueIcon from '../assets/icons/up-blue.svg'

function ServiceCard({ imgSrc, title, bgIcon, desc, altText }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card">
            <div onClick={() => setIsFlipped(!isFlipped)} className={`card__inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card__face card__face--front">
                    <img src={imgSrc} alt={altText} loading="lazy"/>
                    <div className="overlay">
                        <h3>{title}</h3>
                        <button className="btn-more">
                            Bővebben
                            <img src={upIcon} alt="" aria-hidden="true"/>
                            <img src={upBlueIcon} alt="" aria-hidden="true"/>
                        </button>
                    </div>
                </div>
                <div className="card__face card__face--back">
                    <div className="card__content">
                        <div className="card__header">
                            <img src={bgIcon} alt="" className="back-icon"/>
                            <h3>{title}</h3>
                        </div>
                        <div className="card__body">
                            <p>{desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard