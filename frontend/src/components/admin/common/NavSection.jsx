import { useId } from 'react'

import PropTypes from "prop-types"

import './NavSection.css'


function NavSection({ title, ButtonComponents = [] }) {
    const titleId = useId();

    return (
        <div className='nav-section'>
            <p id={titleId} className='nav-section-title'>{title}</p>
            <ul aria-labelledby={titleId} className='nav-section-buttons'>
                {ButtonComponents.map((button, index) => (
                    <li key={index} className='nav-section-button'>
                        {button}
                    </li>
                ))}
            </ul>
        </div>
    )
}

NavSection.propTypes = {
    title: PropTypes.string.isRequired,
    ButtonComponents: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default NavSection