import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


function FooterItem({ IconComponent, itemText, linkHref }) {
    const isInternal = linkHref.startsWith('/');

    return (
        <div className="footer-p">
            <IconComponent aria-hidden='true'/>
            {isInternal ? (
                <Link to={linkHref}>
                    {itemText}
                </Link>
            ) : (
                <a href={linkHref} target="_blank" rel="noopener noreferrer">
                    {itemText}
                </a>
            )}
        </div>
    )
}

FooterItem.propTypes = {
    IconComponent: PropTypes.elementType.isRequired,
    itemText: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired
}

export default FooterItem;