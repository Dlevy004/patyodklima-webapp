import PropTypes from 'prop-types'

function Wave({ fill = 'var(--bg-color-ternary)' }) {
    return (
        <div className="footer-wave">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" aria-hidden="true">
                <path
                    fill={fill}
                    fillOpacity="1"
                    d="M0,160L80,170.7C160,181,320,203,480,202.7C640,203,800,181,960,170.7C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z">
                </path>
            </svg>
        </div>
    )
}

Wave.propTypes = {
    fill: PropTypes.string
}

export default Wave