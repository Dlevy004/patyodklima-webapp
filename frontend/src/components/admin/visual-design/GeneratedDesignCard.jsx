import PropTypes from 'prop-types';

import HistoryCard from '@/components/admin/common/HistoryCard';
import ActionBtn from '@/components/admin/common/ActionBtn';


function GeneratedDesignCard({ design, onDelete, onDownload }) {
    const isCompleted = design.status === 'completed';
    const placementLabel = design.placement_type === 'indoor' ? 'beltéri' : 'kültéri';

    return (
        <HistoryCard
            imageUrl={design.generated_image_url || design.original_image_url}
            alt={`Látványterv - ${placementLabel}`}
            modifierClassName={isCompleted ? '' : 'is-dimmed'}
        >
            <ActionBtn
                type='download'
                onClick={() => onDownload(design.id, `latvanyterv-${placementLabel}`)}
            />
            <ActionBtn type='delete' onClick={onDelete} />
        </HistoryCard>
    );
}

GeneratedDesignCard.propTypes = {
    design: PropTypes.shape({
        id: PropTypes.string.isRequired,
        generated_image_url: PropTypes.string,
        original_image_url: PropTypes.string,
        placement_type: PropTypes.string,
        status: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired
};

export default GeneratedDesignCard;