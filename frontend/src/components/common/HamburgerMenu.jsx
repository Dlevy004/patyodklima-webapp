import PropTypes from 'prop-types'

import './HamburgerMenu.css'

import HamburgerMenuIcon from '@/components/icons/HamburgerMenuIcon'


function HamburgerMenu({ onClick }) {
    return(
        <button
            className="hamburger"
            aria-label="Menü megnyitása"
            onClick = {onClick}
        >
            <HamburgerMenuIcon className="hamburger-icon"/>
        </button>
    )
}

HamburgerMenu.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default HamburgerMenu