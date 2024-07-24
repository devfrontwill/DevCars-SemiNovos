import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_signup.png';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../../services/firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
    name: z.string().min(6, "O preenchimento deste campo é obrigatório! "),
    email: z.string().email("Insira um email válido !").min(6, "O preenchimento deste campo é obrigatório ! "),
    password: z.string().min(8, "A senha deve ter no minimo 8 caracteres ! ")
})

type FormData = z.infer<typeof schema>

export default function Register() {
    const navigate = useNavigate();
    const { handleInfoUser } = useContext(AuthContext)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    useEffect(() => {
        async function handleLogout(){
            await signOut(auth)
        }

        handleLogout();
    }, [])


    async function onSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            handleInfoUser({
                name: data.name,
                email: data.email,
                uid: user.user.uid
            })
            toast.success("Cadastrado com sucesso. | Bem vindo ao DevMotors")          
            navigate("/dashboard", { replace: true })
        })
        .catch((err) => {
            console.log("Erro ao cadastrar");
            console.log(err);
        })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img
                        className="w-11/12 rounded-md mt-3"
                        src={logo}
                        alt="Logo do site"
                    />
                </Link>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white max-w-xl w-full rounded-lg p-4">
                    <div className="mb-3">
                        <Input
                            type="text"
                            placeholder="Digite seu nome completo..."
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>
                    <div className="mb-3">
                        <Input
                            type="email"
                            placeholder="Digite seu email..."
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className="mb-3" >
                        <Input
                            type="password"
                            placeholder="Digite sua senha..."
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                    <button className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">
                        Cadastrar
                    </button>
                </form>

                <Link to="/login">
                    <p className="-mt-4 mb-6">Já possui uma conta? Faça o login ! </p>
                </Link>

            </div>
        </Container>
    )
}

