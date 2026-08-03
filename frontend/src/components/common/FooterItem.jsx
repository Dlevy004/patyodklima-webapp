import PropTypes from 'prop-types'


function FooterItem({ IconComponent, itemText, linkHref }) {
    return (
        <div className="footer-p">
            <IconComponent aria-hidden='true'/>
            <a href={linkHref} target="_blank" rel="noopener noreferrer">
                {itemText}
            </a>
        </div>
    )
}

FooterItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    itemText: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired
}

export default FooterItem;