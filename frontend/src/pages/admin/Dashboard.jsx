import ScrollUp from '@/components/common/ScrollUp'

import './Dashboard.css'

import usePageTitle from '@/hooks/usePageTitle';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import StatCard from '@/components/admin/dashboard/StatCard';
import MonthlyRevenueChart from '@/components/admin/dashboard/MonthlyRevenueChart';
import RevenueByCategoryChart from '@/components/admin/dashboard/RevenueByCategoryChart';
import TopAcUnitsChart from '@/components/admin/dashboard/TopAcUnitsChart';
import TopCitiesChart from '@/components/admin/dashboard/TopCitiesChart';
import JobsStatusChart from '@/components/admin/dashboard/JobsStatusChart';


function Dashboard() {
    usePageTitle('Főoldal');

    return (
        <main>
            <RecentActivity/>

            <div className='dashboard-wrapper'>
                <StatCard/>
                <MonthlyRevenueChart/>

                <div className='dashboard-charts-row'>
                    <RevenueByCategoryChart />
                    <TopAcUnitsChart />
                </div>

                <div className='dashboard-charts-row'>
                    <TopCitiesChart />
                    <JobsStatusChart />
                </div>
            </div>

            <ScrollUp/>
        </main>
    )
}

export default Dashboard