import PropTypes from "prop-types"

function HamburgerMenuIcon({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px" width="24px"
            viewBox="0 -960 960 960"
            fill="#ffffff"
            className={className}
        >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
    )
}

HamburgerMenuIcon.propTypes = {
    className: PropTypes.string.isRequired
}

export default HamburgerMenuIcon