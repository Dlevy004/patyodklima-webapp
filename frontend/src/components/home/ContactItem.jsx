import PropTypes from 'prop-types'


function ContactItem ({ IconComponent, isColorChange = false, contactText, contactHref }) {
    return (
        <li className="contact">
            <IconComponent className="contact-icon" isColorChange = {isColorChange} aria-hidden='true'/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </li>
    )
}

ContactItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    isColorChange: PropTypes.bool,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired
}

export default ContactItem