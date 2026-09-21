import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import useFetch from '@/hooks/useFetch';

import './ChartStyles.css';

const API_URL = import.meta.env.VITE_API_URL;


function TopAcUnitsChart() {
    const { data } = useFetch(`${API_URL}/api/dashboard/top-ac-units`);
    const chartData = data ?? [];

    return (
        <div className='top-ac-units-card'>
            <h3>Legnépszerűbb készülékek</h3>

            <ResponsiveContainer width='100%' height={320}>
                <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
                        width={90}
                        tick={{ fill: 'var(--text-color1)' }}
                    />
                    <Tooltip formatter={(value) => [`${value} db`, 'Darabszám']} />
                    <Bar dataKey='count' fill='#4285f4' radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TopAcUnitsChart;