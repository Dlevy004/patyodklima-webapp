import PropTypes from "prop-types"

import './Achievement.css'


function Achievement({number, title}) {
    return (
        <div className="achie-wrapper">
            <p className="achie-number">{number}</p>
            <p className="achie-title">{title}</p>
        </div>
    )
}

Achievement.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default Achievement