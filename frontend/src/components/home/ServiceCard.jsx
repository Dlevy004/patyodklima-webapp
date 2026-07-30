import { useState } from 'react'

import PropTypes from 'prop-types'
import { ArrowBigUp } from 'lucide-react'
import { motion } from "motion/react"


function ServiceCard({ imgSrc, title, IconComponent, desc, altText, variants }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div className="card" variants={variants}>
            <div onClick={() => setIsFlipped(!isFlipped)} className={`card__inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="card__face card__face--front">
                    <img src={imgSrc} alt={altText} loading="lazy"/>
                    <div className="overlay">
                        <h3>{title}</h3>
                        <button className="btn-more">
                            Bővebben{' '}
                            <ArrowBigUp />
                        </button>
                    </div>
                </div>
                <div className="card__face card__face--back">
                    <div className="card__content">
                        <div className="card__header">
                            <IconComponent className="back-icon"/>
                            <h3>{title}</h3>
                        </div>
                        <div className="card__body">
                            <p>{desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

ServiceCard.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType.isRequired,
    desc: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    variants: PropTypes.object
}

export default ServiceCard