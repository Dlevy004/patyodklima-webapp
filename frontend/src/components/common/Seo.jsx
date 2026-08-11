import PropTypes from "prop-types"
import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description }) {
    return(
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
        </Helmet>
    );
}

Seo.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}