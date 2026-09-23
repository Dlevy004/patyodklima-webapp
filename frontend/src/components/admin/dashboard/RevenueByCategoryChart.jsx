import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

import useFetch from '@/hooks/useFetch';

import './ChartStyles.css';

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORY_COLORS = {
    installation: '#34a853',
    maintenance: '#fbbc05',
    survey: '#4285f4',
    cleaning: '#e91e8c',
    other: '#9aa0a6'
};
const formatCurrency = (value) => `${value.toLocaleString('hu-HU')} Ft`;


function RevenueByCategoryChart() {
    const { data, error, isLoading } = useFetch(`${API_URL}/api/dashboard/revenue-by-category`);
    const chartData = data ?? [];

    if (isLoading) {
        return (
            <div className='revenue-category-card'>
                <h3>Kategóriánkénti bevétel</h3>
                <p>Betöltés…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='revenue-category-card'>
                <h3>Kategóriánkénti bevétel</h3>
                <p role='alert'>Hiba történt az adatok betöltése közben.</p>
            </div>
        );
    }

    return (
        <div className='revenue-category-card'>
            <h3>Kategóriánkénti bevétel</h3>

            <ResponsiveContainer width='100%' height={320}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey='total'
                        nameKey='label'
                        innerRadius={0}
                        outerRadius={100}
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#9aa0a6'} />
                        ))}
                    </Pie>

                    <Tooltip formatter={(value) => formatCurrency(value)} />

                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RevenueByCategoryChart;