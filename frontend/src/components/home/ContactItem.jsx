import PropTypes from 'prop-types'
import { motion } from 'motion/react'


function ContactItem ({ IconComponent, isColorChange = false, contactText, contactHref, variants }) {
    return (
        <motion.div className="contact" variants={variants}>
            <IconComponent className="contact-icon" isColorChange = {isColorChange}/>
            <a href={contactHref} target="_blank" rel="noopener noreferrer">{contactText}</a>
        </motion.div>
    )
}

ContactItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    isColorChange: PropTypes.bool,
    contactText: PropTypes.string.isRequired,
    contactHref: PropTypes.string.isRequired,
    variants: PropTypes.object
}

export default ContactItem