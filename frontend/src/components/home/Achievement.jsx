import PropTypes from "prop-types"

import './Achievement.css'


function Achievement({number, title}) {
    return (
        <div className="achie-wrapper">
            <div className="achie-number">
                <p>{number}</p>
            </div>
            <div className="achie-title">
                <p>{title}</p>
            </div>
        </div>
    )
}

Achievement.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default Achievement