import PropTypes from 'prop-types'


function BackToTopIcon({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px" width="24px"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className={className}
        >
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/>
        </svg>
    )
}

BackToTopIcon.propTypes = {
    className: PropTypes.string.isRequired
}

export default BackToTopIcon