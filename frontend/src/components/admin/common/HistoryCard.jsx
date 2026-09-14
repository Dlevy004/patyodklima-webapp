import PropTypes from 'prop-types';

import './HistoryCard.css';


function HistoryCard({ imageUrl, alt, modifierClassName = '', children }) {
    return (
        <li className={`history-card ${modifierClassName}`.trim()}>
            <img className="history-card-img" src={imageUrl} alt={alt} loading="lazy" />
            <div className="history-card-actions">
                {children}
            </div>
        </li>
    );
}

HistoryCard.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    modifierClassName: PropTypes.string,
    children: PropTypes.node
};

export default HistoryCard;