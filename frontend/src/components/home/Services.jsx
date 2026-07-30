import { ClipboardList, Wrench, SprayCan } from 'lucide-react'
import { motion } from "motion/react"

import './Services.css'

import ServiceCard from './ServiceCard.jsx'
import assignmentImg from '@/assets/images/felmeres.avif'
import installationImg from '@/assets/images/telepites.avif'
import maintenanceImg from '@/assets/images/karbantartas.avif'
import { fadeInContainer, fadeInUp } from '@/animations/variants.js'

const containerVariants = fadeInContainer(0.2);
const cardVariants = fadeInUp(0.6);

function Services() {
    const serviceCards = [
        {
            imgSrc: assignmentImg,
            title: "Díjmentes felmérés",
            IconComponent: ClipboardList,
            desc: "Az előzetes egyeztetést követően személyesen mérjük fel a helyszínt, hogy pontos ajánlatot adhassunk.",
            altText: "Díjmentes felmérés"
        },
        {
            imgSrc: installationImg,
            title: "Teljeskörű telepítés",
            IconComponent: Wrench,
            desc: "Vállaljuk klímaberendezések szakszerű telepítését. A készüléket precízen, az Ön igényeihez igazodva helyezzük üzembe, hogy hosszú távon megbízhatóan működjön.",
            altText: "Teljeskörű telepítés"
        },
        {
            imgSrc: maintenanceImg,
            title: "Karbantartás",
            IconComponent: SprayCan,
            desc: "Szakemberünk gondoskodik klímája rendszeres karbantartásáról és tisztításáról &mdash; így nemcsak hatékonyabban működik, hanem a levegő is tisztább marad.",
            altText: "Karbantartás"
        }
    ];

    return (
        <section id="services">
            <h2 className="sub-title">Szolgáltatásaink</h2>
            <motion.div
                className="cards"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {
                    serviceCards.map((card) => (
                        <ServiceCard
                            key={card.title}
                            imgSrc={card.imgSrc}
                            title={card.title}
                            IconComponent={card.IconComponent}
                            desc={card.desc}
                            altText={card.altText}
                            variants={cardVariants}
                        />
                    ))
                }
            </motion.div>
        </section>
    )
}

export default Services