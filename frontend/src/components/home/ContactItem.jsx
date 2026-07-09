import PropTypes from 'prop-types'


function ContactItem ({ IconComponent, isColorChange = false, contactText, contactHref }) {
    return (
        <div className="contact">
            <IconComponent className="contact-icon" isColorChange = {isColorChange}/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </div>
    )
}

ContactItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    isColorChange: PropTypes.bool,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired
}

export default ContactItem