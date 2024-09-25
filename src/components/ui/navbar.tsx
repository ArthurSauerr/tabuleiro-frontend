import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Navbar = () => {
  return (
    <nav className={`bg-zinc-900 p-4 h-14 flex items-center justify-between ${poppins.className}`}>
      <ul className="flex pl-10 h-full items-center space-x-6 text-tabuleiro2">
        <li>
          <div className="hover:scale-110 transition-transform duration-400 cursor-pointer pr-10">
            <Image
              src="/assets/Octahedron.svg"
              width={35}
              height={35}
              alt="Tabuleiro Icon"
            />
          </div>
        </li>
        <li>
          <p className="text-sm font-bold">Home</p>
        </li>
        <li>
          <p className="text-sm font-bold">Fichas</p>
        </li>
        <li>
          <p className="text-sm font-bold">Rolagens</p>
        </li>
      </ul>
      <p className="text-sm font-bold pr-10 text-tabuleiro2">Perfil</p>
    </nav>
  );
};

export default Navbar;
