import PropTypes from 'prop-types'

function CloseMenuIcon({ className }) {
    return (
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="24px" width="24px"
        viewBox="0 -960 960 960" 
        fill="currentColor"
        className={className}
    >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>
    )
}

CloseMenuIcon.propTypes = {
    className: PropTypes.string.isRequired
}

export default CloseMenuIcon