import ScrollUp from '@/components/common/ScrollUp'

import usePageTitle from '@/hooks/usePageTitle';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';


function Dashboard() {
    usePageTitle('Főoldal');

    return (
        <>
            <RecentActivity/>

            <ScrollUp/>
        </>
    )
}

export default Dashboard