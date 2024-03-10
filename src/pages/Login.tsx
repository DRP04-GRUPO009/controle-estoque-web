import * as Yup from "yup"
import { useAuth } from "../context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type LoginFormInputs = {
    username: string;
    password: string;
}

const validation = Yup.object().shape({
    username: Yup.string().required('Nome de usuário é obrigatório'),
    password: Yup.string().required('Senha é obrigatória')
});

export default function Login() { 
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({ resolver: yupResolver(validation) });

    const handleLogin = async (form: LoginFormInputs): Promise<void> => {
        await login(form.username, form.password);
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await isLoggedIn();
            if (loggedIn) {
                navigate('/');
            }
        };

        checkLoggedIn();
    }, [isLoggedIn, navigate, login]);

    return (
        <>
            <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 text-white">
                <div className="w-full rounded-lg md:mb-20 sm:max-w-md xl:p-0 bg-[#1C2434]">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-center">
                    Controle de Estoque
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>
                    <div>
                        <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium"
                        >
                        Nome de usuário
                        </label>
                        <input
                        type="text"
                        id="username"
                        className="border sm:text-sm rounded-lg block w-full p-2.5 text-black"
                        placeholder="Nome de usuário"
                        {...register("username")}
                        />
                        {errors.username ? <p className="text-[#F87171]">{errors.username.message}</p> : ""}
                    </div>
                    <div>
                        <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium"
                        >
                        Senha
                        </label>
                        <input
                        type="password"
                        id="password"
                        className="border sm:text-sm rounded-lg block w-full p-2.5 text-black"
                        placeholder="**********"
                        {...register("password")}
                        />
                        {errors.password ? <p className="text-[#F87171]">{errors.password.message}</p> : ""}
                    </div>
                    <button
                        type="submit"
                        className="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white bg-[#3C50E0]"
                    >
                        Entrar
                    </button>
                    </form>
                </div>
                </div>
            </div>
            </section>
        </>
    );
}
