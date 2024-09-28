'use client'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function create_character() {
    const router = useRouter();

    return (
        <div className={`${poppins.className}`}>
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <p>TELA DE CRIAÇAO</p>
            </div>
        </div>
    )
}
