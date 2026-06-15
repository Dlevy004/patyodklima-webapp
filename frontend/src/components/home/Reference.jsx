import ReferenceCard from "./ReferenceCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './Reference.css'

import ref4 from '@/assets/images/reference4.avif';
import ref1 from '@/assets/images/reference1.avif';
import ref11 from '@/assets/images/reference1-1.avif';
import ref2 from '@/assets/images/reference2.avif';
import aux from '@/assets/images/556650737_122141655062915768_857871931182055680_n.avif';
import ande from '@/assets/images/585059918_122150208692915768_3381541991961443822_n.avif';
import ande2 from '@/assets/images/585495273_122150208740915768_5983887693530440261_n.avif';
import ce from '@/assets/images/585175757_122150209760915768_8231168429410044420_n.avif';

function Reference() {
    const referencesData = [
        {
            id : 1,
            imgSrc : ref4,
            altText : 'Ande klíma készülék telepítése',
            cardTitle : 'ANDE Klíma telepítése Pátyod'
        },
        {
            id : 2,
            imgSrc : ref1,
            altText : 'Pátyod, vegyesbolt klimatizálása',
            cardTitle : 'Vegyesbolt klimatizálása, AUX beltéri készülék'
        },
        {
            id : 3,
            imgSrc : ref11,
            altText : 'Pátyod, vegyesbolt klimatizálása',
            cardTitle : 'Vegyesbolt klimatizálása, AUX kültéri készülék'
        },
        {
            id : 4,
            imgSrc : ref2,
            altText : 'Tisztítás',
            cardTitle : 'Tisztítás'
        },
        {
            id : 5,
            imgSrc : aux,
            altText : 'Hálószoba hűtése és fűtése AUX készülékkel',
            cardTitle : 'Hálószoba hűtése és fűtése AUX készülékkel'
        },
        {
            id : 6,
            imgSrc : ande,
            altText : 'ANDE beltéri készülék',
            cardTitle : 'Családi ház klimatizálása, ANDE készülékkel'
        },
        {
            id : 7,
            imgSrc : ande2,
            altText : 'ANDE kültéri készülék',
            cardTitle : 'Családi ház klimatizálása, ANDE készülékkel'
        },
        {
            id : 8,
            imgSrc : ce,
            altText : 'CEKLIMA kültéri készülék',
            cardTitle : 'Hálószoba hűtése és fűtése CEKLIMA készülékkel'
        }
    ]

    return (
        <section id="reference">
            <h2 className="sub-title">Referencia</h2>
            <div className="reference-container">
                <div className="ref-bg"></div>
                <div className="container">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        loop={true}
                        spaceBetween={40}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        navigation={true}
                          breakpoints= {{
                            0: { slidesPerView: 1},
                            551: { slidesPerView: 2 },
                            1025: { slidesPerView: 3 }
                        }}
                        className="card-wrapper"
                    >
                        { referencesData.map((data) => (
                            <SwiperSlide key={data.id}>
                                <ReferenceCard
                                    imgSrc={data.imgSrc}
                                    altText={data.altText}
                                    cardTitle={data.cardTitle}
                                    className="card-link card-image reference-hover card-title"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Reference