import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useEventListener from '@/plugins/useEventListener';
import SearchModal from '@/components/dashboard/search/SearchModal';
import Tooltip from '@/components/elements/tooltip/Tooltip';

interface SearchContainerProps {
    visible: boolean;
    onClose: () => void;
}

export default ({ visible, onClose }: SearchContainerProps) => {
    useEventListener('keydown', (e: KeyboardEvent) => {
        if (!visible) return;
        if (e.key === 'Escape') onClose(); // Close modal on Escape key
    });

    return (
        <>
            {visible && <SearchModal appear visible={visible} onDismissed={onClose} />}
            <Tooltip placement={'bottom'} content={'Search'}>
                <div className={'navigation-link'} onClick={onClose}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </Tooltip>
        </>
    );
};
