import ScrollUp from '../../components/common/ScrollUp'
import usePageTitle from '../../hooks/usePageTitle';
import TableHeader from '../../components/admin/common/TableHeader';
import './Clients.css'
import ClientItem from '../../components/admin/clients/ClientItem';
import { useState, useEffect } from 'react';

function Clients() {
    usePageTitle('Ügyfélnapló');

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/clients');

                if (!response.ok) {
                    throw new Error('Failed to retrieve data from the server.');
                }

                const data = await response.json();
                setClients(data);
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <>
            <TableHeader />
            <div className='table-content'>
                {isLoading && <p className='info-text'>Ügyfelek betöltése folyamatban...</p>}
                {error && <p className='info-text error-text'>Hiba: {error}</p>}

                {!isLoading && !error && clients.length === 0
                && <p className='info-text'>Még nincsenek rögzített ügyfelek az adatbázisban.</p>}

                {!isLoading && !error && clients.map((client) => (
                    <ClientItem
                        key={client.id}
                        name={client.full_name}
                        city={client.city}
                        phone={client.phone}
                    />
                ))}
            </div>
            <ScrollUp />
        </>
    )
}

export default Clients