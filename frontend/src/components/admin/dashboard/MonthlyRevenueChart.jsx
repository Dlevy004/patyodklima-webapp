import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import useFetch from '@/hooks/useFetch';

import './MonthlyRevenueChart.css';

const API_URL = import.meta.env.VITE_API_URL;

const MONTH_LABELS = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
];

const CATEGORY_COLORS = {
    installation: '#34a853',
    maintenance: '#fbbc05',
    survey: '#4285f4',
    cleaning: '#e91e8c',
    other: '#9aa0a6'
};

const CATEGORY_LABELS = {
    installation: 'Telepítés',
    maintenance: 'Karbantartás',
    survey: 'Felmérés',
    cleaning: 'Takarítás',
    other: 'Egyéb'
};

const formatCurrency = (value) => `${value.toLocaleString('hu-HU')} Ft`;


function MonthlyRevenueChart() {
    const [year] = useState(new Date().getFullYear());
    const { data } = useFetch(`${API_URL}/api/dashboard/monthly-revenue?year=${year}`);

    const chartData = (data ?? []).map((row) => ({
        ...row,
        label: MONTH_LABELS[row.month - 1]
    }));

    return (
        <div className='monthly-revenue-card'>
            <h3>Havi bevétel - {year}</h3>

            <ResponsiveContainer width='100%' height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='label' />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend
                        formatter={(key) => CATEGORY_LABELS[key]}
                    />
                    {Object.keys(CATEGORY_COLORS).map((category) => (
                        <Bar
                            key={category}
                            dataKey={category}
                            stackId='revenue'
                            fill={CATEGORY_COLORS[category]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyRevenueChart;