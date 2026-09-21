import { Link } from 'react-router-dom';

import './NotFound.css'

import usePageTitle from '@/hooks/usePageTitle';


export default function NotFound() {
    usePageTitle('Az oldal nem található');
    /*seo component*/

    return (
        <div className='notfound-wrapper'>
            <div className='notfound-img-wrapper'>
                <img src='/images/404.png' alt='404 logó' className='notfound-logo'/>
                <img src='/images/404worker.png' alt='404 ember logó' className='notfound-worker' />
            </div>

            <div className='notfound-text'>
                <h2>A keresett oldal nem található.</h2>
                <p>Sajnos az oldal, amit keres, törölve lett, megváltozott a címe, vagy ideiglenesen nem elérhető.</p>
            </div>

            <Link to="/" className='back-to-website-btn' target='_blank'>
                Vissza a főoldalra
            </Link>
        </div>
    );
}