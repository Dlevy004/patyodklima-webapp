import { useState } from 'react';

import { Helmet } from 'react-helmet-async';

import './FAQSection.css';

import FAQItem from './FaqItem';
import supportPhoto from '@/assets/images/faq-support.avif';

const FAQ_ITEMS = [
    {
        question: 'Mennyibe kerül a helyszíni felmérés?',
        answer: 'A helyszíni felmérés és a személyre szabott árajánlat elkészítése minden esetben díjmentes.'
    },
    {
        question: 'Mit tartalmaz az ajánlat, és mi számít alapszerelésnek?',
        answer: 'Alapszerelés esetén az ajánlat tartalmazza a készülék árát, a teljes munkadíjat és az anyagköltséget is, 3 méter rézcső hosszig. Ha a telepítés ennél hosszabb csővezetéket igényel, ezt már a felmérés során jelezzük.'
    },
    {
        question: 'Milyen rejtett költségekkel kell számolnom?',
        answer: 'A felmérés és a végleges árajánlat elfogadása után semmilyen rejtett költség nem merül fel. Ha menet közben mégis többletmunka válna szükségessé, annak költsége minket terhel, nem Önt.'
    },
    {
        question: 'Kérhetem a telepítést hétvégére vagy ünnepnapra?',
        answer: 'Igen, ha hétköznap Önnek nem megoldható az időpont, hétvégén vagy ünnepnapon is vállalunk telepítést.'
    },
    {
        question: 'A magam által vásárolt készüléket is telepítik?',
        answer: 'Igen, szívesen telepítjük az Ön által vásárolt készüléket is. Ebben az esetben a készülék garanciáját Önnek kell intéznie az eladóval, amelyhez mi biztosítjuk a szakvéleményt. Külföldön vásárolt készülékek esetén csak a mi 12 hónapos szerelői garanciánk vonatkozik.'
    },
    {
        question: 'Kapok számlát a telepítés után?',
        answer: 'Igen, minden telepítés után számlát, telepítési tanúsítványt és garancialevelet is adunk.'
    },
    {
        question: 'Meddig tart a garancia?',
        answer: 'A klímaberendezésekre márkától függően általában 2-7 év gyártói garancia érvényes. A szerelésre a törvény szerint 12 hónap szerelői garanciát vállalunk, ezt pedig igyekszünk a készülék garanciájához igazítani.'
    },
    {
        question: 'Milyen gyakran kell tisztíttatni a készüléket?',
        answer: 'A garancia megőrzéséhez évi 1-2 alkalommal érdemes tisztíttatni a készüléket. Ha a környezet miatt (pl. erős porterhelés) gyorsabban szennyeződik, érdemes ennél sűrűbben is elvégeztetni.'
    },
];

const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
        }
    }))
};


function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    return (
        <section id='faq' className='faq-section'>
            <Helmet>
                <script type='application/ld+json'>
                    {JSON.stringify(faqStructuredData)}
                </script>
            </Helmet>

            <div className='faq-header'>
                <h2>Gyakran ismételt kérdések</h2>
                <p>Minden, amit a klímaszerelésről és a garanciáról tudni érdemes.</p>
            </div>

            <div className='faq-list'>
                {FAQ_ITEMS.map((item, index) => (
                    <FAQItem
                        key={item.question}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </div>

            <div className='faq-contact-card'>
                <img
                    src={supportPhoto}
                    alt='Pátyod Klíma csapata'
                    className='faq-contact-img'
                    loading='lazy'
                />
                <h3>További kérdésed van?</h3>
                <p>Nem találod a választ, amit keresel? Írj nekünk bizalommal!</p>

                <a href='#contact' className='faq-contact-btn'>
                    Kapcsolatfelvétel
                </a>
            </div>
        </section>
    );
}

export default FAQSection;