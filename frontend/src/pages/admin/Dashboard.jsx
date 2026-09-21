import ScrollUp from '@/components/common/ScrollUp'

import './Dashboard.css'

import usePageTitle from '@/hooks/usePageTitle';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import StatCard from '@/components/admin/dashboard/StatCard';
import MonthlyRevenueChart from '@/components/admin/dashboard/MonthlyRevenueChart';


function Dashboard() {
    usePageTitle('Főoldal');

    return (
        <>
            <RecentActivity/>
            <StatCard/>
            <MonthlyRevenueChart/>

            <ScrollUp/>
        </>
    )
}

export default Dashboard