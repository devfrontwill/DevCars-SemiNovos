import { useState, useEffect } from "react";
import { Container } from '../../components/container';
import { FaWhatsapp } from "react-icons/fa";
import { useParams } from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";


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

    useEffect(() => {
        async function loadCar() {
            if (!id) { return }

            const docRef = doc(db, "cars", id);
            getDoc(docRef).then((snapshot): any => {
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


    return (
        <Container>
            <h1>DevMotors Detalhes</h1>

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
