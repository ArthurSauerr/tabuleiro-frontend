/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Navbar = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        'https://tabuleiro-backend.onrender.com/users/check-auth',
        { withCredentials: true }
      );
      console.log('Response:', response.data);
      setAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error('ERRO: ', error);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://tabuleiro-backend.onrender.com/users/logout'
      );
      router.push('/login')
      setAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

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
          <Link href="/" className="text-sm font-bold hover:underline">Home</Link>
        </li>
        <li>
          <Link href="/characters" className="text-sm font-bold hover:underline">Fichas</Link>
        </li>
        {/* <li>
          <Link href="/dice" className="text-sm font-bold hover:underline">Rolagens</Link>
        </li> */}
      </ul>
      <div className="pr-10">
        {authenticated ? (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <p className="text-tabuleiro2 text-sm font-bold hover:underline cursor-pointer">Perfil</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 bg-zinc-900 border-none">
              <DropdownMenuLabel className="font-bold text-[15px] text-tabuleiro2 cursor-default">Minha conta</DropdownMenuLabel>
              <DropdownMenuItem className='focus:bg-tabuleiro/15'>
                <p className="text-sm font-md text-tabuleiro2 cursor-pointer">Perfil</p>
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-tabuleiro/15'>
                <p onClick={() => router.push('/characters')} className="text-sm font-md text-tabuleiro2 cursor-pointer">Fichas</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='bg-tabuleiro' />
              <DropdownMenuItem className='focus:bg-tabuleiro/15'>
              <p onClick={handleLogout} className="text-sm font-md text-tabuleiro2 cursor-pointer">
                Logout
              </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" className="text-sm font-bold text-tabuleiro2 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
