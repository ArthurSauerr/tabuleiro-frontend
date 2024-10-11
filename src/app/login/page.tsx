'use client'
import { Poppins } from 'next/font/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';
import axios from 'axios';
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Submitting form...');

        const userData = {
            email: email,
            password: password
        };

        console.log('User Data: ', userData);

        try {
            const response = await axios.post(
                'https://tabuleiro-backend.onrender.com/users/signin',
                userData,
                { withCredentials: true }
            );            
            console.log('Response:', response.data);
            router.push('/');
        } catch (error) {
            console.error('ERRO: ', error);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen bg-mago-sabao bg-cover ${poppins.className}`}>
            <main className="p-8 rounded-lg w-full max-w-md mt-40 ml-36 mb-auto">
                <div className="flex justify-center text-center mb-3">
                    <h1 className="text-7xl font-bold mb-2 whitespace-nowrap">Login</h1>
                </div>
                <div className='text-center mb-12'>
                    <p>Acesse sua conta e retome suas aventuras</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
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

                    <Button type="submit" variant={"tabuleiro"} className="p-6 rounded-xl w-full">ENTRAR</Button>
                </form>
                <div className='flex items-center my-8'>
                    <Separator className="flex-grow w-1/3 bg-zinc-600" />
                    <p className="mx-2 text-center">ou</p>
                    <Separator className="flex-grow w-1/3 bg-zinc-600" />
                </div>
                <div className='flex justify-center'>
                    <p className="text-sm">
                        Não tem conta?{' '}
                        <Link href="/register" className="text-blue-400 hover:underline">
                            Faça seu cadastro!
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
