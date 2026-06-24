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

export default HamburgerMenu