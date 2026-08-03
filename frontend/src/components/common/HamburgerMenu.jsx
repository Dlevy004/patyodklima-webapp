import PropTypes from 'prop-types'
import { Menu } from 'lucide-react'

import './HamburgerMenu.css'


function HamburgerMenu({ onClick }) {
    return(
        <button
            className="hamburger"
            aria-label="Menü megnyitása"
            onClick = {onClick}
        >
            <Menu className="hamburger-icon" strokeWidth={2.5} aria-hidden='true'/>
        </button>
    )
}

HamburgerMenu.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default HamburgerMenu