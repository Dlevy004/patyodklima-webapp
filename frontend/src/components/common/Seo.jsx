import PropTypes from "prop-types"
import { Helmet } from 'react-helmet-async'


export default function Seo({ title, description, url = '', image = '' }) {
    const domain = "https://patyodklima.hu";
    const currentUrl = `${domain}${url}`;
    const ogImage = image ? image : `${domain}/assets/images/heroImg.jpg`;

    return(
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            <link rel="canonical" href={currentUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
        </Helmet>
    );
}

Seo.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
}