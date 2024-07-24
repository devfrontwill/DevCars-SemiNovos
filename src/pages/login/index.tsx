import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_signup.png';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '../../services/firebaseConnection';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const schema = z.object({
    email: z.string().email("Insira um email válido !").min(6, "O preenchimento deste campo é obrigatório! "),
    password: z.string().min(8, "O preenchimento deste campo é obrigatório! ")
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const navigate = useNavigate();

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


    function onSubmit(data: FormData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
            console.log(user);
            toast.success("Logado com sucesso ! ")
            navigate("/dashboard", { replace: true })
        })
        .catch((err) => {
            console.log("Erro ao tentar logar: ");
            console.log(err.code);
            toast.error("Erro ao fazer login ! ")
        })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img
                        className="w-11/12 rounded-md"
                        src={logo}
                        alt="Logo do site"
                    />
                </Link>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white max-w-xl w-full rounded-lg p-4">
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
                        Acessar
                    </button>
                </form>

                <Link to="/register">
                    Não possui uma conta? Cadastra-se !
                </Link>

            </div>
        </Container>
    )
}

