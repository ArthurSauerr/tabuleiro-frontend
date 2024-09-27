'use client'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/ui/navbar';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
  });

export default function characters() {

    return(
        <div>
            <Navbar/>
            
        </div>
    )
}