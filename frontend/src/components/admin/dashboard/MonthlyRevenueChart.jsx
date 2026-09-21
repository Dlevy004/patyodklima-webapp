import { useState } from 'react';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import useFetch from '@/hooks/useFetch';
import useIsMobile from '@/hooks/useIsMobile';

import './ChartStyles.css';

const API_URL = import.meta.env.VITE_API_URL;
const MONTH_LABELS = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
];
const MONTH_ABBREVIATIONS = {
    'Január': 'Jan', 'Február': 'Feb', 'Március': 'Már', 'Április': 'Ápr',
    'Május': 'Máj', 'Június': 'Jún', 'Július': 'Júl', 'Augusztus': 'Aug',
    'Szeptember': 'Szept', 'Október': 'Okt', 'November': 'Nov', 'December': 'Dec'
};
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
    const isMobile = useIsMobile();

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
                    <XAxis
                        dataKey='label'
                        interval={1}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 50 : 30}
                        tickFormatter={(value) => isMobile ? (MONTH_ABBREVIATIONS[value] || value) : value}
                        tick={{ fill: 'var(--text-color1)', fontSize: isMobile ? 11 : 12 }}
                    />

                    <YAxis
                        tickFormatter={(value) => `${value / 1000}E`}
                        tick={{ fill: 'var(--text-color1)' }}
                    />

                    <Tooltip
                        formatter={(value, name) => [formatCurrency(value), CATEGORY_LABELS[name] || name]}
                        labelFormatter={(label) => label}
                        labelStyle={{ fontWeight: 500, color: 'black' }}
                    />

                    <Legend
                        formatter={(key) => CATEGORY_LABELS[key]}
                        wrapperStyle={{ paddingTop: '1.5rem' }}
                        iconSize={15}
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