import PropTypes from "prop-types"

import './Milestone.css'

import CountUp from "@/animations/CountUp"


function Milestone({toNumber, title, decimals, suffix}) {
    return (
        <div className="milestone-wrapper">
            <div className="milestone-number">
                <CountUp
                    from={0}
                    to={toNumber}
                    direction='up'
                    separator=' '
                    decimals={decimals}
                    delay={1}
                />
                {suffix && <span>{suffix}</span>}
            </div>
            <p className="milestone-title">{title}</p>
        </div>
    )
}

Milestone.propTypes = {
    toNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
}

export default Milestone