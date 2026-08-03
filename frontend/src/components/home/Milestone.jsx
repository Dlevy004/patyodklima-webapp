import PropTypes from "prop-types"

import './Milestone.css'


function Milestone({number, title}) {
    return (
        <div className="milestone-wrapper">
            <p className="milestone-number">{number}</p>
            <p className="milestone-title">{title}</p>
        </div>
    )
}

Milestone.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default Milestone