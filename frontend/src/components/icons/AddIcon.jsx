import PropTypes from 'prop-types'


function AddIcon({ className = '' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px" width="24px"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className={className}
        >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
    )
}

AddIcon.propTypes = {
    className: PropTypes.string.isRequired
}

export default AddIcon