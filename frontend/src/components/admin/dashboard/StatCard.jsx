import useFetch from '../../../hooks/useFetch'

import './StatCard.css'

const API_URL = import.meta.env.VITE_API_URL;
const OVERVIEW_URL = `${API_URL}/api/dashboard/overview`;

const formatNumber = (value) => (value ?? 0).toLocaleString('hu-HU');
const formatCurrency = (value) => `${formatNumber(value)} Ft`;

const CARD_DEFINITIONS = [
    { title: 'Összes ügyfél', key: 'totalClients', format: formatNumber, color: 'stat-blue' },
    { title: 'Összes bevétel', key: 'totalRevenue', format: formatCurrency, color: 'stat-red' },
    { title: 'Összes telepítés', key: 'totalInstallations', format: formatNumber, color: 'stat-yellow' },
    { title: 'Összes látványterv', key: 'totalVisualDesigns', format: formatNumber, color: 'stat-green' },
    { title: 'Átlagos bevétel', key: 'averageMonthlyRevenue', format: formatCurrency, color: 'stat-magenta' },
    { title: 'E havi kiszállások', key: 'monthlyDispatches', format: formatNumber, color: 'stat-lightblue' },
];

const renderCards = (data) => CARD_DEFINITIONS.map((card) => (
    <div key={card.key} className={`stat-card ${card.color}`}>
        <span className='stat-title'>{card.title}</span>
        <span className='stat-number'>
            {data ? card.format(data[card.key]) : '…'}
        </span>
    </div>
));


export default function StatCard() {
    const { data } = useFetch(OVERVIEW_URL);

    return (
        <div className="stat-card-wrapper">
            <div className='stat-card-track'>
                <div className='stat-card-group'>{renderCards(data)}</div>
                <div className='stat-card-group' aria-hidden='true'>{renderCards(data)}</div>
            </div>
        </div>
    )
};