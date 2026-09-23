import PropTypes from 'prop-types';

import HistoryCard from '@/components/admin/common/HistoryCard';
import ActionBtn from '@/components/admin/common/ActionBtn';


function GeneratedAdCard({ ad, onDelete, onDownload }) {
    const title = ad.headline || ad.ac_unit_name || 'Hirdetés';

    return (
        <HistoryCard
            imageUrl={ad.generated_image_url}
            alt={title}
            modifierClassName='is-landscape'
        >
            <ActionBtn
                type='download'
                onClick={() => onDownload(ad.id, title)}
            />
            <ActionBtn type='delete' onClick={onDelete} />
        </HistoryCard>
    );
}

GeneratedAdCard.propTypes = {
    ad: PropTypes.shape({
        id: PropTypes.string.isRequired,
        generated_image_url: PropTypes.string,
        headline: PropTypes.string,
        ac_unit_name: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default GeneratedAdCard;