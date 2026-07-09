import PropTypes from "prop-types";


function DataStateFeedback({ isLoading, error, isEmpty, emptyMessage, children }) {
    if (isLoading) {
        return <p className='info-text'>Betöltés folyamatban...</p>
    }

    if (error) {
        return <p className='info-text error-text'>Hiba: {error}</p>
    }

    if (isEmpty) {
        return <p className='info-text'>{emptyMessage}</p>
    }

    return <>{children}</>;
}

DataStateFeedback.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    isEmpty: PropTypes.bool.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    children: PropTypes.node
}

export default DataStateFeedback;