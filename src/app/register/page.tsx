import { Poppins } from 'next/font/google';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Page() {
    return (
        <div className={`flex items-center min-h-screen bg-mago-sabao bg-cover ${poppins.className}`}>
            <main className="p-8 rounded-lg w-full max-w-md ml-36 mb-12">
                <div className="flex justify-center text-center mb-3">
                    <h1 className="text-7xl font-bold mb-2 whitespace-nowrap">Bem-vindo</h1>
                </div>
                <div className='text-center mb-12'>
                    <p>Realize seu cadastro abaixo e comece sua aventura</p>
                </div>

                <div className="space-y-6">
                    <Input type="name" placeholder="Nome" className="p-6 rounded-xl w-full bg-white text-black" />
                    <Input type="email" placeholder="E-mail" className="p-6 rounded-xl w-full bg-white text-black" />
                    <Input type="password" placeholder="Senha" className="p-6 rounded-xl w-full bg-white text-black" />
                    <Button variant={"tabuleiro"} className="p-6 rounded-xl w-full">CADASTRAR</Button>

                    <div className='flex items-center my-8'>
                        <Separator className="flex-grow w-1/3 bg-zinc-600" />
                        <p className="mx-2 text-center">ou</p>
                        <Separator className="flex-grow w-1/3 bg-zinc-600" />
                    </div>
                    <div className='flex justify-center'>
                        <p className="text-sm">Já tem uma conta? Faça login!</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
