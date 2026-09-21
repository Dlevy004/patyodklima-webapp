import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

import useFetch from '@/hooks/useFetch';

import './ChartStyles.css';

const API_URL = import.meta.env.VITE_API_URL;
const STATUS_COLORS = {
    completed: '#34a853',
    pending: '#fbbc05'
};


function JobsStatusChart() {
    const { data, error, isLoading } = useFetch(`${API_URL}/api/dashboard/jobs-status`);

    if (isLoading) {
        return (
            <div className='jobs-status-card'>
                <h3>Munkák állapota</h3>
                <p>Betöltés…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='jobs-status-card'>
                <h3>Munkák állapota</h3>
                <p role='alert'>Hiba történt az adatok betöltése közben.</p>
            </div>
        );
    }

    const chartData = data ?? [];

    return (
        <div className='jobs-status-card'>
            <h3>Munkák állapota</h3>

            <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey='count'
                        nameKey='label'
                        innerRadius={0}
                        outerRadius={90}
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                        ))}
                    </Pie>

                    <Tooltip formatter={(value) => `${value} db`} />

                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default JobsStatusChart;