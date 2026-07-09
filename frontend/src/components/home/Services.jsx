import './Services.css'

import ServiceCard from './ServiceCard.jsx'

import assignmentImg from '@/assets/images/felmeres.avif'
import installationImg from '@/assets/images/telepites.avif'
import maintenanceImg from '@/assets/images/karbantartas.avif'

import AssignmentIcon from '@/components/icons/AssignmentIcon'
import HandymanIcon from '@/components/icons/HandymanIcon'
import CleaningIcon from '@/components/icons/CleaningIcon'


function Services() {
    const serviceCards = [
        {
            imgSrc: assignmentImg,
            title: "Díjmentes felmérés",
            IconComponent: AssignmentIcon,
            desc: "Az előzetes egyeztetést követően személyesen mérjük fel a helyszínt, hogy pontos ajánlatot adhassunk.",
            altText: "Díjmentes felmérés"
        },
        {
            imgSrc: installationImg,
            title: "Teljeskörű telepítés",
            IconComponent: HandymanIcon,
            desc: "Vállaljuk klímaberendezések szakszerű telepítését. A készüléket precízen, az Ön igényeihez igazodva helyezzük üzembe, hogy hosszú távon megbízhatóan működjön.",
            altText: "Teljeskörű telepítés"
        },
        {
            imgSrc: maintenanceImg,
            title: "Karbantartás",
            IconComponent: CleaningIcon,
            desc: "Szakemberünk gondoskodik klímája rendszeres karbantartásáról és tisztításáról &mdash; így nemcsak hatékonyabban működik, hanem a levegő is tisztább marad.",
            altText: "Karbantartás"
        }
    ];

    return (
        <section id="services">
            <h2 className="sub-title">Szolgáltatásaink</h2>
            <div className="cards">
                {
                    serviceCards.map((card, key) => (
                        <ServiceCard
                            key = {key}
                            imgSrc = {card.imgSrc}
                            title = {card.title}
                            IconComponent = {card.IconComponent}
                            desc = {card.desc}
                            altText = {card.altText}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default Services