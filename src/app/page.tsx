'use client'
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/ui/navbar';
import Image from 'next/image';
import { PiSwordFill } from "react-icons/pi";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export default function Home() {
  const router = useRouter();

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className={`relative grid grid-cols-2 min-h-screen ${poppins.className}`}>
        <div className="absolute inset-0 bg-home bg-cover opacity-40 z-0"></div>

        <div className="bg-darkPurple flex items-start justify-center clip-right-diagonal relative z-10 pt-36">
          <div className='flex flex-col'>
            <h1 className="text-7xl font-bold mb-28 flex items-center">
              tabuleir
              <span className='ml-2'>
                <Image
                  src="/assets/Octahedron.svg"
                  width={55}
                  height={55}
                  alt="Tabuleiro Icon"
                  className="transform rotate-[-30deg]"
                />
              </span>
            </h1>
            <h2 className="text-5xl font-bold mb-6 max-w-2xl leading-tight">
              Escolha seu caminho, forme sua <span className='text-tabuleiro2'>lenda!</span>
            </h2>
            <p className='text-lg max-w-xl leading-relaxed opacity-50 font-[300]'>
              Crie fichas personalizáveis para qualquer sistema de RPG, abandone papéis e pergaminhos! Sua jornada começa agora, pronto para jogar?
            </p>
            <Button onClick={() => router.push('/characters')} variant={"tabuleiro"} className="mt-6 p-6 rounded-3xl w-1/4 font-bold">
              <span className='ml-2'>Começar </span>
              <span className='bg-white rounded-full p-2 ml-10'><PiSwordFill className='text-tabuleiro2 text-2xl'/></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
