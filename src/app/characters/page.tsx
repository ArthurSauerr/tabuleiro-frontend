'use client'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AxiosResponse, AxiosError } from 'axios'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function Characters() {
    const router = useRouter();
    const [characters, setCharacters] = useState([]);
    const [hasCharacters, setHasCharacters] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carregamento

    const checkCharacters = async () => {
        setLoading(true); // Ativa o estado de carregamento
        await axios.get('https://tabuleiro-backend.onrender.com/characters/list-of-characters',
            { withCredentials: true }
        )
            .then((response: AxiosResponse) => {
                const charactersList = response.data.characters;
                setCharacters(charactersList);
                setHasCharacters(charactersList.length > 0);
            })
            .catch((reason: AxiosError) => {
                if (reason.response!.status === 404) {
                    setHasCharacters(false);
                } else {
                    console.error('ERRO AO LISTAR PERSONAGENS: ', reason.cause);
                }
            })
            .finally(() => {
                setLoading(false); // Desativa o estado de carregamento após a requisição
            });
    };

    const handleAccessClick = (characterId: string) => {
        router.push(`/characters/${characterId}`);
    };

    useEffect(() => {
        checkCharacters();
    }, []);

    if (loading) {
        return (
            <div className={`${poppins.className}`}>
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <div className="w-16 h-16 border-4 border-tabuleiro2 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${poppins.className}`}>
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <div>
                    {hasCharacters ? (
                        <div>
                            <h1 className="text-center text-tabuleiro2 font-bold mb-4 text-xl">Seus Personagens</h1>
                            <ul className="flex space-x-4 justify-center">
                                {characters.map((character, index) => (
                                    <div
                                        key={index}
                                        className="relative group border border-2 border-tabuleiro2 p-4 rounded-lg shadow-md bg-tabuleiro2/15 w-44 h-40 transition-transform duration-300 ease-in-out hover:scale-105"
                                    >
                                        <li className="text-white font-medium text-center group-hover:opacity-0 transition-opacity duration-150 ease-in-out">
                                            <p className='font-bold'>{character.name}</p>
                                            <p className='mb-6 font-light'>{character.class}</p>
                                            <p className='font-light'>Vida: {Math.round(character.current_health)} / {Math.round(character.max_health)}</p>
                                            <p className='font-light'>ID: {character.id}</p>
                                        </li>
                                        <div className="absolute inset-0 flex justify-center items-center hidden group-hover:flex transition-opacity duration-150 ease-in-out">
                                            <Button onClick={() => handleAccessClick(character.id)} className="bg-tabuleiro text-white font-md py-2 px-4 rounded hover:bg-tabuleiro2">Acessar</Button>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => router.push('/create-character')} className="flex border-dashed border-2 border-tabuleiro2 w-44 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/15 duration-150 cursor-pointer">
                                    <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                </div>
                            </ul>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className='text-tabuleiro2 font-bold mb-2 text-xl'>Ops!</h1>
                            <p className='text-tabuleiro2 font-bold'>Parece que você não tem nenhum personagem cadastrado.</p>
                            <p className='text-tabuleiro2 font-bold'>Comece criando um!</p>
                            <div className="flex justify-center mt-10">
                                <Button onClick={() => router.push('/create-character')} className="p-6 w-1/2 rounded-xl" variant={'tabuleiro'}>
                                    CRIAR PERSONAGEM
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
