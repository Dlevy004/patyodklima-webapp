import ScrollUp from '@/components/common/ScrollUp'

import usePageTitle from '@/hooks/usePageTitle';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import StatCard from '@/components/admin/dashboard/StatCard';


function Dashboard() {
    usePageTitle('Főoldal');

    return (
        <>
            <RecentActivity/>
            <StatCard/>

            <ScrollUp/>
        </>
    )
}

export default Dashboard