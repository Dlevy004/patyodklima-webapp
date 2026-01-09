function FooterItem({ iconSrc, itemText, linkHref }) {
    return (
        <div className="footer-p">
            <img
                src={iconSrc}
                alt="" aria-hidden="true" loading="lazy"/>
            <a href={linkHref} target="_blank" rel="noopener noreferrer">
                {itemText}
            </a>
        </div>
    )
}

export default FooterItem;