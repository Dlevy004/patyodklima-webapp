import ServiceCard from './ServiceCard.jsx'
import './Services.css'
import assignmentImg from '../assets/images/felmeres.avif'
import assignmentIcon from '../assets/icons/assignment.svg'
import installationImg from '../assets/images/telepites.avif'
import installationIcon from '../assets/icons/handyman.svg'
import maintenanceImg from '../assets/images/karbantartas.avif'
import maintenanceIcon from '../assets/icons/cleaning.svg'

function Services() {
    return (
        <section id="services">
            <h2 className="sub-title">Szolgáltatásaink</h2>
            <div className="cards">
                <ServiceCard 
                    imgSrc = {assignmentImg}
                    title = "Díjmentes felmérés"
                    bgIcon = {assignmentIcon}
                    desc = "Az előzetes egyeztetést követően személyesen mérjük fel a helyszínt, hogy pontos ajánlatot adhassunk."
                    altText = "Díjmentes felmérés"
                />
                <ServiceCard
                    imgSrc = {installationImg}
                    title = "Teljeskörű telepítés"
                    bgIcon = {installationIcon}
                    desc = "Vállaljuk klímaberendezések szakszerű telepítését. A készüléket precízen, az Ön igényeihez igazodva helyezzük üzembe, hogy hosszú távon megbízhatóan működjön."
                    altText = "Teljeskörű telepítés"
                />
                <ServiceCard
                    imgSrc = {maintenanceImg}
                    title = "Karbantartás"
                    bgIcon = {maintenanceIcon}
                    desc = "Szakemberünk gondoskodik klímája rendszeres karbantartásáról és tisztításáról &mdash; így nemcsak hatékonyabban működik, hanem a levegő is tisztább marad."
                    altText = "Karbantartás"
                />
            </div>
        </section>
    )
}

export default Services