import PropTypes from 'prop-types';

import HistoryCard from '@/components/admin/common/HistoryCard';
import ActionBtn from '@/components/admin/common/ActionBtn';


function GeneratedMarketingCard({ marketing, onDelete, onDownload }) {
    const title = marketing.headline || marketing.ac_unit_name || 'Hirdetés';

    return (
        <HistoryCard
            imageUrl={marketing.generated_image_url}
            alt={title}
            modifierClassName='is-landscape'
        >
            <ActionBtn
                type='download'
                onClick={() => onDownload(marketing.id, title)}
            />
            <ActionBtn type='delete' onClick={onDelete} />
        </HistoryCard>
    );
}

GeneratedMarketingCard.propTypes = {
    marketing: PropTypes.shape({
        id: PropTypes.string.isRequired,
        generated_image_url: PropTypes.string,
        headline: PropTypes.string,
        ac_unit_name: PropTypes.string,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default GeneratedMarketingCard;