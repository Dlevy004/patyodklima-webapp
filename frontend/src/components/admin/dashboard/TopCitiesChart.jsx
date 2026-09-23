import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import useFetch from '@/hooks/useFetch';

import './ChartStyles.css';

const API_URL = import.meta.env.VITE_API_URL;


function TopCitiesChart() {
    const { data, error, isLoading } = useFetch(`${API_URL}/api/dashboard/top-cities`);
    const chartData = data ?? [];

    if (isLoading) {
        return (
            <div className='top-cities-card'>
                <h3>Legnépszerűbb települések</h3>
                <p>Betöltés…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='top-cities-card'>
                <h3>Legnépszerűbb települések</h3>
                <p role='alert'>Hiba történt az adatok betöltése közben.</p>
            </div>
        );
    }

    return (
        <div className='top-cities-card'>
            <h3>Legnépszerűbb települések</h3>

            <ResponsiveContainer width='100%' height={320}>
                <BarChart
                    data={chartData}
                    layout='vertical'
                >
                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                    <XAxis
                        type='number'
                        allowDecimals={false}
                        tick={{ fill: 'var(--text-color1)' }}
                    />
                    <YAxis
                        type='category'
                        dataKey='name'
                        tick={{ fill: 'var(--text-color1)' }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value} db`, 'Darabszám']}
                        labelStyle={{ fontWeight: 500, color: 'black' }}
                    />
                    <Bar dataKey='count' fill='#4285f4' radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopCitiesChart;