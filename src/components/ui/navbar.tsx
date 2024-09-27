import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Link from 'next/link'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Navbar = () => {
  return (
    <nav className={`bg-zinc-900 p-4 h-14 flex items-center justify-between fixed top-0 left-0 w-full ${poppins.className} z-50`}>
      <ul className="flex pl-10 h-full items-center space-x-6 text-tabuleiro2">
        <li>
          <div className="transition-transform duration-400 cursor-pointer pr-10 hover:rotate-[-10deg] hover:scale-110">
            <Link href="/">   
            <Image
              src="/assets/Octahedron.svg"
              width={35}
              height={35}
              alt="Tabuleiro Icon"
            />
            </Link>
          </div>
        </li>
        <li>
          <a href="/" className="text-sm font-bold hover:underline">Home</a>
        </li>
        <li>
          <a href="/characters" className="text-sm font-bold hover:underline">Fichas</a>
        </li>
        <li>
        <a href="/dice" className="text-sm font-bold hover:underline">Rolagens</a>
        </li>
      </ul>
      <p className="text-sm font-bold pr-10 text-tabuleiro2">Perfil</p>
    </nav>
  );
};

export default Navbar;
