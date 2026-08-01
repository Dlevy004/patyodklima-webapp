import PropTypes from 'prop-types'


function ContactItem ({ IconComponent, contactText, contactHref }) {
    return (
        <li className="contact">
            <IconComponent className="contact-icon" aria-hidden='true'/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </li>
    )
}

ContactItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired
}

export default ContactItem