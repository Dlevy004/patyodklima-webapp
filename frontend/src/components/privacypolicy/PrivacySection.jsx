import PropTypes from 'prop-types'
import { CircleCheck } from 'lucide-react'


function PrivacySection({number, title, desc, items = []}) {
    return (
        <section className='information'>
            <h2 className='subtitle'>
                <span>{number} </span>
                {title}{' '}
            </h2>
            <p>{desc}</p>
            <ul>
                {items.map((item) => (
                    <li key={item}>
                        <CircleCheck color='#228fce' aria-hidden='true'/>
                        {item}
                    </li>
                ))}
            </ul>
            <hr />
        </section>
    )
}

PrivacySection.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.node)
}

export default PrivacySection