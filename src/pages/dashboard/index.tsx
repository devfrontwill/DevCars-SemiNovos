import { useState, useEffect, useContext } from "react";
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/painelHeader";
import { FiTrash2 } from 'react-icons/fi';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";


interface CarProps {
    id: string;
    name: string;
    year: string;
    price: string;
    city: string;
    km: string;
    uid: string;
    images: ImageCarProps;
}

interface ImageCarProps {
    name: string;
    uid: string;
    url: string;
}


export default function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        function loadCars(){
            if (!user?.uid) {
                return;
            }      

        const carsRef = collection(db, "cars");
        const queryRef = query(carsRef, where("uid", "==", user.uid))

        getDocs(queryRef)
            .then((snapshot) => {
                let listcars = [] as CarProps[];

                snapshot.forEach(doc => {
                    listcars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })

                setCars(listcars);
                console.log(listcars);
            })
        }

        loadCars();

    }, [user])

    return (
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" >

                <section className=" w-full bg-white rounded-lg relative">

                    <button
                        onClick={() => { }}
                        className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                        <FiTrash2 size={26} color="#000" />
                    </button>
                    <img
                        className="w-full rounded-lg mb-2 max-h-70"
                        src="https://firebasestorage.googleapis.com/v0/b/devmotors-ebd8a.appspot.com/o/images%2FNcJc0eZJrQfLBmeQNMAU7yq2VFX2%2F3679fafc-e047-4ecb-a1cd-1d31082f9813?alt=media&token=85bdbdc6-eb4b-4a59-adc4-1873e66296c5"
                    />
                    <p className="font-bold mt-1 px-2 mb-2">Nissan Versa Red</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700">
                            Ano 2016/2016 | 225.000km
                        </span>

                        <strong className="text-black font-bold mt-4">
                            R$ 150.000
                        </strong>
                    </div>

                    <div className="w-full h-px bg-slate-200 my-2"></div>

                    <div className="px-2 pb-2">
                        <span className="text-black">
                            Belo Horizonte - MG
                        </span>
                    </div>

                </section>

            </main>
        </Container>
    )
}
