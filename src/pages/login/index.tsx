import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z.string().email("Insira um email válido").min(6, "O preenchimento deste campo é obrigatório! "),
    password: z.string().min(6, "O preenchimento deste campo é obrigatório! ")
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 max-w-sm w-full">
                    <img 
                        className="w-full"
                        src={logo}
                        alt="Logo do site"
                    />
                </Link>

                <form className="bg-white max-w-xl w-full rouded-lg">
                    <Input 
                        type="email"
                        placeholder="Digite seu email..."
                        name="email"
                        error={errors.email?.message}
                        register={register}
                    />
                </form>

            </div>
        </Container>
    )
}

