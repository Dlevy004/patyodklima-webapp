import useFetch from '../../../hooks/useFetch';

import './RecentActivity.css'

const API_URL = import.meta.env.VITE_API_URL;
const RECENT_ACTIVITY_URL = `${API_URL}/api/dashboard/recent-activity?days=1`;


function RecentActivity () {
    const { data, error, isLoading } = useFetch(RECENT_ACTIVITY_URL);
    const today = data?.[0];

    if (isLoading) {
        return (
            <div className='recent-activity-wrapper'>
                <p>Betöltés…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='recent-activity-wrapper'>
                <p role='alert'>Hiba történt az adatok betöltése közben.</p>
            </div>
        );
    }

    const message = today
        ? `Legutóbbi aktivitás: ${today.newJobs} új munka, ${today.newClients} új ügyfél, `
          + `${today.completedJobs} lezárt munka, ${today.newVisualDesigns} új látványterv, `
          + `${today.newMarketings} új hirdetés`
        : 'Legutóbbi aktivitás betöltése…';

    return (
        <section className="recent-activity-wrapper">
            <p>{message}</p>
        </section>
    )
};

export default RecentActivity;