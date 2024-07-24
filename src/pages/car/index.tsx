import { useState, useEffect } from "react";
import { Container } from '../../components/container';
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

interface CarProps {
    id: string;
    uid: string;
    name: string;
    model: string;
    city: string;
    year: string;
    km: string;
    description: string;
    createdAt: string;
    price: string;
    owner: string;
    whatsapp: string;
    images: ImagesCarProps[]
}

interface ImagesCarProps {
    uid: string;
    name: string;
    url: string;
}


export default function CarDetail() {
    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2);
    const navigate = useNavigate();


    useEffect(() => {
        async function loadCar() {
            if (!id) { return }

            const docRef = doc(db, "cars", id);
            getDoc(docRef).then((snapshot): any => {

                if (!snapshot.data()) {
                    navigate("/");
                }

                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    year: snapshot.data()?.year,
                    city: snapshot.data()?.city,
                    model: snapshot.data()?.model,
                    uid: snapshot.data()?.uid,
                    description: snapshot.data()?.description,
                    createdAt: snapshot.data()?.createdAt,
                    whatsapp: snapshot.data()?.whatsapp,
                    price: snapshot.data()?.price,
                    km: snapshot.data()?.km,
                    owner: snapshot.data()?.owner,
                    images: snapshot.data()?.images

                })

            })
        }

        loadCar();

    }, [id])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }

        handleResize();

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])


    return (
        <Container>

            {car && (
                <Swiper                    
                    slidesPerView={sliderPerView}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: true,
                    }}
                    navigation
                    modules={[Autoplay, Pagination, Navigation]}              
                >
                    {car?.images.map(image => (
                        <SwiperSlide key={image.name}>
                            <img
                                src={image.url}
                                className="w-full h-96 object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )

            }

            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black"> {car?.name} </h1>
                        <h1 className="font-bold text-3xl text-black">R$ {car?.price} </h1>
                    </div>
                    <p> {car?.model} </p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong> {car?.city} </strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong> {car?.year} </strong>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>KM</p>
                                <strong> {car?.km} </strong>
                            </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">
                        {car?.description}
                    </p>

                    <strong>Telefone / Whatsapp:</strong>
                    <p> {car?.whatsapp} </p>

                    <a
                        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá visualizei o anúncio: ** ${car?.name} ** no DevCars Semi Novos e fiquei interessado, ainda está disponível ?`}
                        target="_blank"
                        className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
                    >
                        Conversar com vendedor
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>
                </main>
            )
            }
        </Container >
    )
}
