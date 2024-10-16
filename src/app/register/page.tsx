'use client'
import { Poppins } from 'next/font/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';
import axios from 'axios';
import { FiUser } from 'react-icons/fi';
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Page() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            name: name,
            email: email,
            password: password
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/users/signup', userData);
            router.push('/login');
        } catch (error) {
            console.error('ERRO: ', error);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen bg-mago-sabao bg-cover ${poppins.className}`}>
            <main className="p-8 rounded-lg w-full max-w-md mt-40 ml-36 mb-auto">
                <div className="flex justify-center text-center mb-3">
                    <h1 className="text-7xl font-bold mb-2 whitespace-nowrap">Bem-vindo</h1>
                </div>
                <div className='text-center mb-12'>
                    <p>Realize seu cadastro abaixo e comece sua aventura</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <FiUser className="text-black" />
                        </span>
                        <Input
                            type="text"
                            placeholder="Nome"
                            className="p-6 rounded-xl w-full bg-white text-black"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='relative'>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <HiOutlineMail className='text-black' />
                        </span>
                        <Input
                            type="email"
                            placeholder="E-mail"
                            className="p-6 rounded-xl w-full bg-white text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='relative'>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <RiLockPasswordLine className='text-black' />
                        </span>
                        <Input
                            type="password"
                            placeholder="Senha"
                            className="p-6 rounded-xl w-full bg-white text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant={"tabuleiro"}
                        className="p-6 rounded-xl w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                        ) : (
                            "CADASTRAR"
                        )}
                    </Button>
                </form>
                <div className='flex items-center my-8'>
                    <Separator className="flex-grow w-1/3 bg-zinc-600" />
                    <p className="mx-2 text-center">ou</p>
                    <Separator className="flex-grow w-1/3 bg-zinc-600" />
                </div>
                <div className='flex justify-center'>
                    <p className="text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-blue-400 hover:underline">
                            Faça login!
                        </Link>
                    </p>
                </div>
            </main>
            <footer className="py-4 text-center text-sm text-zinc-600 mt-auto">
                <p>Tabuleiro</p>
                <p>Desenvolvido por Arthur Sauer Germano</p>
                <p>
                    <Link href="https://www.artstation.com/sabaum" className="hover:underline" target="_blank" rel="noopener noreferrer">
                        Artes feitas por João Vitor Sobreira
                    </Link>
                </p>
            </footer>
        </div>
    );
}
