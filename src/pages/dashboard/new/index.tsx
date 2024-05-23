import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/painelHeader";

import { FiUpload } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../../contexts/AuthContext'
import { v4 as uuidV4 } from 'uuid'

import { storage } from '../../../services/firebaseConnection'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'


const schema = z.object({
    name: z.string().min(3, "O preenchimento deste campo é obrigatório ! "),
    model: z.string().min(3, "O preenchimento deste campo é obrigatório ! "),
    year: z.string().min(4, "O preenchimento deste campo é obrigatório ! ")
        .refine((value) => /^(?=.*[/]).{4,9}$/.test(value), "Ex: 2024/24 ou 2024/2024"),
    km: z.string().min(3, "O preenchimento deste campo é obrigatório ! "),
    price: z.string().min(3, "O preenchimento deste campo é obrigatório ! "),
    city: z.string().min(3, "O preenchimento deste campo é obrigatório ! "),
    whatsapp: z.string().min(1, "O preenchimento deste campo é obrigatório ! ")
        .refine((value) => /^(\d{11,12})$/.test(value), {
            message: "O número de telefone digitado é inválido."
        }),
    description: z.string().min(0, "O preenchimento deste campo é obrigatório ! "),
})

type FormData = z.infer<typeof schema>;


export default function New() {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem no formato JPEG ou PNG !")
                return;
            }
        }
    }


    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;

        }
        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((downloadUrl) => {
                        console.log("URL DE ACESSO DA FOTO ", downloadUrl);
                    })
            })

    }

    function onSubmit(data: FormData) {
        console.log(data);
    }


    return (
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>

                    <div className="cursor-pointer">
                        <input
                            className="opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                            onChange={handleFile} />
                    </div>
                </button>
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className="w-full"
                    onClick={handleSubmit(onSubmit)}
                >
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do veículo: </p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Jeep Renegade Semi Novo"
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do veículo: </p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 2.0 Flex Turbo Automático"
                        />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano: </p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2023"
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Kilometragem: </p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 171.333"
                            />
                        </div>

                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone/Whatsapp: </p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: 02198765432"
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade: </p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: Rio de Janeiro - RJ"
                            />
                        </div>

                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium">Preço: </p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 75.000"
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 w-full rounded-md h-24 px-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite aqui a descrição do veículo..."
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description?.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                        Cadastrar
                    </button>

                </form>
            </div>
        </Container>
    )
}
