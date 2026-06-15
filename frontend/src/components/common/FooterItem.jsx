import PropTypes from 'prop-types'

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

FooterItem.propTypes = {
    iconSrc: PropTypes.string.isRequired,
    itemText: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired
}

export default FooterItem;