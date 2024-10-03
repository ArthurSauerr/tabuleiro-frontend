'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';
import { useParams } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function CharacterDetails() {
    const { id } = useParams();
    const [data, setCharacterData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true
            })
                .then(response => {
                    setCharacterData(response.data);
                    console.log(response.data)
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Erro ao buscar detalhes do personagem: ', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-tabuleiro2 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`${poppins.className}`}>
            <Navbar />
            <div className="flex items-center h-screen p-4">
                <div className="flex flex-col ml-10 pb-12">
                    <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">{data.character.name}</h1>
                    <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                        <div className='bg-tabuleiro/15 p-6 rounded-xl'>
                            <div className='grid grid-cols-2 gap-x-4'>
                                <p className='font-bold'>Idade</p>
                                <p className='font-bold text-right'>Classe</p>
                                <p className='font-md mb-4'>{data.character.age} anos</p>
                                <p className='font-md mb-4 text-right'>{data.character.class}</p>

                                <p className='font-bold'>País</p>
                                <p className='font-bold text-right'>Sub-classe</p>
                                <p className='font-md'>{data.character.nacionality}</p>
                                <p className='font-md text-right'>{data.character.sub_class}</p>
                            </div>
                            {/* Progresso de Vida */}
                            <div className="flex justify-between mt-4">
                                <p className="font-bold mb-1">Vida</p>
                                <p className='font-md'>
                                    {Math.round(data.character.current_health)} / {Math.round(data.character.max_health)}
                                </p>
                            </div>
                            <Progress
                                value={data.character.current_health / data.character.max_health * 100}
                                variant="health"
                                indicatorVariant="health"
                            />

                            {/* Progresso de Stamina */}
                            <div className="flex justify-between mt-6">
                                <p className="font-bold mb-1">Stamina</p>
                                <p className='font-md'>
                                    {Math.round(data.character.current_stamina)} / {Math.round(data.character.max_stamina)}
                                </p>
                            </div>
                            <Progress
                                value={data.character.current_stamina / data.character.max_stamina * 100}
                                variant="stamina"
                                indicatorVariant="stamina"
                            />

                            {/* Progresso de Mana */}
                            <div className="flex justify-between mt-6">
                                <p className="font-bold mb-1">Mana</p>
                                <p className='font-md'>
                                    {Math.round(data.character.current_mana)} / {Math.round(data.character.max_mana)}
                                </p>
                            </div>
                            <Progress
                                value={data.character.current_mana / data.character.max_mana * 100}
                                variant="mana"
                                indicatorVariant="mana"
                            />

                            {/* Progresso de Sanidade */}
                            <div className="flex justify-between mt-6">
                                <p className="font-bold mb-1">Sanidade</p>
                                <p className='font-md'>
                                    {Math.round(data.character.current_sanity)} / {Math.round(data.character.max_sanity)}
                                </p>
                            </div>
                            <Progress
                                value={data.character.current_sanity / data.character.max_sanity * 100}
                                variant="sanity"
                                indicatorVariant="sanity"
                            />
                            <div className="flex justify-between mt-6">
                                <p className="font-bold mb-1">Dinheiro</p>
                                <p className='font-md'>
                                    {Math.round(data.character.money)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-tabuleiro2/35 p-4 pr-0 border-solid border-tabuleiro border-2 rounded-r-3xl '>
                    <ScrollArea className='h-[480px] rounded-md pr-4'>
                        <ul className="grid grid-cols-1 gap-3">
                            {data?.attributes && data.attributes.length > 0 ? (
                                data.attributes.map((attribute, index) => (
                                    <li
                                        key={index}
                                        className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-20 w-24"
                                    >
                                        <span className="text-2xl font-bold pb-1">{attribute.value}</span>
                                        <div className='absolute bottom-1 bg-tabuleiro2 w-full -mb-2 rounded-b-lg text-center'>
                                            <span className="font-bold text-sm ">{attribute.name}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum atributo disponível</li>
                            )}
                            <div className="flex border-dashed border-2 border-tabuleiro2 w-full h-20 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                            </div>
                        </ul>
                    </ScrollArea>
                </div>


                <div className="flex flex-col p-4 gap-8 pt-28 pl-32">
                    <div className="flex flex-col ml-10">
                        <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Ataques</h1>
                        <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                            <div className='bg-tabuleiro/15 p-4 pb-0 rounded-xl'>
                                <ScrollArea className=" w-[1000px] overflow-x-auto pb-5">
                                    <ul className="flex gap-6">
                                        {data?.spells && data.spells.length > 0 ? (
                                            data.spells.map((spells, index) => (
                                                <li
                                                    key={index}
                                                    className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44"
                                                >
                                                    <div className="absolute -top-2 -right-2 z-20 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2">
                                                        <IoSearchSharp className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div className='absolute top-0 bg-tabuleiro2 w-full h-1/5 rounded-t-lg text-center z-10'>
                                                        <p className="font-bold text-md pt-3">{spells.name}</p>
                                                    </div>
                                                    <div className='flex flex-col gap-5'>
                                                        <div className='flex justify-between pt-14'>
                                                            <p className="text-md font-bold mr-9 p-1">Dano</p>
                                                            <p className="text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 outline outline-2 outline-[#DF6565] rounded-md shadow-md shadow-black/50">{spells.diceqtd}d{spells.dicenumber}</p>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <p className="text-md font-bold p-1 mb-8">{spells.cost_type}</p>
                                                            <p className="text-md font-bold text-right p-1">{spells.cost}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant={'attackCard'} className='w-2/3'>Usar</Button>
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum ataque disponível</li>
                                        )}
                                        <div className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                            <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                        </div>
                                    </ul>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col ml-10">
                        <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Habilidades</h1>
                        <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                            <div className='bg-tabuleiro/15 p-4 pb-0 rounded-xl'>
                                <ScrollArea className="w-[1000px] overflow-x-auto pb-5">
                                    <ul className="flex gap-6">
                                        {data?.abilities && data.abilities.length > 0 ? (
                                            data.abilities.map((abilities, index) => (
                                                <li
                                                    key={index}
                                                    className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44"
                                                >
                                                    <div className='absolute top-0 bg-tabuleiro2 w-full rounded-t-lg text-center z-20'>
                                                        <p className="font-bold text-md pt-1">{abilities.name}</p>
                                                    </div>
                                                    <ScrollArea 
                                                        className='overflow-y-auto text-xs p-2 pt-6  break-words max-h-[220px] z-10'
                                                    >
                                                        <p>{abilities.description}</p>
                                                    </ScrollArea>
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum ataque disponível</li>
                                        )}
                                        <div className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                            <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                        </div>
                                    </ul>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );

}
