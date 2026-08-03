import PropTypes from 'prop-types'
import { motion } from 'motion/react'
import { CircleCheck } from 'lucide-react'


function PrivacySection({number, title, desc, items = [], variants }) {
    return (
        <motion.section className='information' variants={variants}>
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
        </motion.section>
    )
}

PrivacySection.propTypes = {
    number: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.node),
    variants: PropTypes.object
}

export default PrivacySection