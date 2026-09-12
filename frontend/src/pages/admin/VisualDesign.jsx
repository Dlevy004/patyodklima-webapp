import ScrollUp from '../../components/common/ScrollUp'

import usePageTitle from '../../hooks/usePageTitle';
import DragAndDrop from '@/components/admin/common/DragAndDrop';
import Slider from '../../components/admin/common/Slider';
import ActionBtn from '../../components/admin/common/ActionBtn';


function VisualDesign() {
    usePageTitle('Látványterv');

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>VisualDesign</h1>
            <p>Welcome to the visualDesign page!</p>
            <ScrollUp />
        </main>
    )
}

export default VisualDesign