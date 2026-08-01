import PropTypes from 'prop-types'
import { motion } from 'motion/react'


function ContactItem ({ IconComponent, contactText, contactHref, variants }) {
    return (
        <motion.li className="contact" variants={variants}>
            <IconComponent className="contact-icon"  aria-hidden='true'/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </motion.li>
    )
}

ContactItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired,
    variants: PropTypes.object
}

export default ContactItem