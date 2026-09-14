import PropTypes from 'prop-types';

import HistoryCard from '@/components/admin/common/HistoryCard';
import ActionBtn from '../common/ActionBtn';


function UploadedReference({ title, imageUrl, isVisible = true, onDelete, onEdit, onToggleVisibility, onDownload }) {
    return (
        <HistoryCard
            imageUrl={imageUrl}
            alt={title}
            modifierClassName={isVisible ? '' : 'is-dimmed'}
        >
            {isVisible
                ? <ActionBtn type='visible' onClick={onToggleVisibility} />
                : <ActionBtn type='invisible' onClick={onToggleVisibility} />}

            <ActionBtn type='edit' onClick={onEdit} />
            <ActionBtn type='download' onClick={onDownload} />
            <ActionBtn type='delete' onClick={onDelete} />
        </HistoryCard>
    );
}

UploadedReference.propTypes = {
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    isVisible: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired
};

export default UploadedReference;