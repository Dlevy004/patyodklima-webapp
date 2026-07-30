import { motion } from 'motion/react'

import './PrivacyContent.css'

import PrivacyImg from '@/assets/images/20250715_130101.avif'
import PrivacyDoc from '@/assets/patyodklima-adatkezelesi-tajekoztato.pdf'
import PrivacySection from './PrivacySection'
import Wave from '@/components/common/Wave'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};


function PrivacyContent() {
   return(
        <section id='content'>
            <img src={PrivacyImg} alt="Kültéri egység karbantartása"/>
            <div className='background' />

            <div className='text'>
                <h1 className='title'>Adatkezelési tájékoztató</h1>
                <p>
                    Fontos számunkra személyes adatainak védelme. Az alábbiakban röviden összefoglaljuk, 
                    milyen adatokat gyűjtünk, miért és hogyan kezeljük azokat.
                </p>
                <hr />
                <motion.div
                    className='informations'
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <PrivacySection
                        number="I."
                        title="Az általunk kezelt adatok"
                        desc="Kapcsolatfelvétel során az alábbi adatokat kezeljük:"
                        items={['Név, e-mail cím, telefonszám', 'Megkeresés tartalma, időpontja']}
                    />
                    <PrivacySection
                        number="II."
                        title="Miért kezeljük az adatokat?"
                        desc="Adatait kizárólag az alábbi célokra használjuk:"
                        items={[
                            'Ajánlatkérések, megkeresések megválaszolására', 
                            'Klímaszerelési és karbantartási szolgáltatások nyújtására', 
                            'Törvényi kötelezettségek teljesítésére']}
                    />
                    <PrivacySection 
                        number="III."
                        title="Sütik (Cookie-k) használata"
                        desc="Weboldalunk az alábbi sütiket alkalmazza:"
                        items={[
                            'Munkamenet sütik a zökkenőmentes böngészéshez', 
                            'Szükséges sütik a cookie-döntés megjegyzéséhez (30 napig)', 
                            'Google Analytics sütik a látogatottság méréséhez']}
                    />
                    <PrivacySection 
                        number="IV."
                        title="Az adatok tárolása"
                        desc="Adatait biztonságosan tároljuk:"
                        items={[
                            'Tárhelyszolgáltató: DiMa.hu Kft., Debrecen',
                            'E-mailben kapott adatokat 3 év után töröljük',
                            'Visszavonni hozzájárulását bármikor']}
                    />
                    <PrivacySection
                        number="V."
                        title="Az Ön jogai"
                        desc="Önnek joga van:"
                        items={[
                            'Hozzáférni a róla tárolt adatokhoz', 
                            'Kérni adatai helyesbítését vagy törlését', 
                            'Visszavonni hozzájárulását bármikor', 
                            'Panaszt tenni a NAIH-nál (naih.hu)']}
                    />
                    <PrivacySection
                        number="VI."
                        title="Kapcsolat"
                        desc="Adatkezeléssel kapcsolatos kérdés esetén keressen minket:"
                        items={[
                            <a key='email' href='mailto:klima.patyod@gmail.com' target='_blank'>klima.patyod@gmail.com</a>,
                            <a key='phone' href='tel:06306290793' target='_blank'>06 30 629 0793</a>]}
                    />
                </motion.div>
                <motion.a
                    target='_blank'
                    rel='noopener noreferrer'
                    href={PrivacyDoc}
                    className='download-btn'

                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    Teljes adatkezelési tájékoztató letöltése (PDF)
                </motion.a>
            </div>

            <Wave />
        </section>
    )
}

export default PrivacyContent