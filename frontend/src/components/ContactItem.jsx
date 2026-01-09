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

export default ContactItem