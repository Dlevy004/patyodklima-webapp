import PropTypes from 'prop-types'


function ReferenceCard ({ imgSrc, altText, cardTitle }) {
    return (
        <article className="card-item swiper-slide">
            <div className="card-link">
                <img
                    src={imgSrc}
                    alt={altText}
                    className="card-image"
                    loading="lazy"
                />
                <div className="reference-hover">
                    <h3 className="card-title">{cardTitle}</h3>
                </div>
            </div>
        </article>
    )
}

ReferenceCard.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    cardTitle: PropTypes.string.isRequired
}

export default ReferenceCard