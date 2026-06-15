import PropTypes from 'prop-types'

function ContactItem ({ defaultIconSrc, hoverIconSrc, contactText, contactHref }) {
    return (
        <div className="contact">
            <img 
                className="black-icon" 
                src={defaultIconSrc} alt="" aria-hidden="true"/>
            <img 
                className="blue-icon" 
                src={hoverIconSrc} alt="" aria-hidden="true"/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </div>
    )
}

ContactItem.propTypes = {
    defaultIconSrc: PropTypes.string.isRequired,
    hoverIconSrc: PropTypes.string.isRequired,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired
}

export default ContactItem