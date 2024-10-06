'use client'
import { useEffect, useState } from 'react';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import Navbar from '@/components/navbar';
import { useParams } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function CharacterDetails() {
    const { id } = useParams();
    const [data, setCharacterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const totalWeight = data?.inventory?.reduce((acc, item) => acc + Number(item.weight), 0);

    const [diceResults, setDiceResults] = useState<number[]>([]);
    const [diceSumResults, setDiceSumResults] = useState<number[]>([]);
    const [diceMaxValue, setDiceMaxValue] = useState(0);
    const [diceMinValue, setDiceMinValue] = useState(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogCreateSpellOpen, setIsDialogCreateSpellOpen] = useState(false);
    const [isDialogCreateAbilityOpen, setIsDialogCreateAbilityOpen] = useState(false);
    const [isDialogCreateAttributeOpen, setIsDialogCreateAttributeOpen] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(null);
    const [costType, setCostType] = useState("");
    const [diceNumber, setDiceNumber] = useState(null);
    const [diceQtd, setDiceQtd] = useState(null);

    const [value, setValue] = useState(null);


    useEffect(() => {
        const fetchCharacterData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                        withCredentials: true,
                    });
                    setCharacterData(response.data);
                    console.log(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar detalhes do personagem: ', error);
                    setLoading(false);
                }
            }
        };

        fetchCharacterData();
    }, [id]);

    const rollDice = async (diceNumber: number, atr_value: number) => {
        const diceData = {
            diceNumber: diceNumber,
            diceQtd: atr_value,
        };

        try {
            const response: AxiosResponse = await axios.post('https://tabuleiro-backend.onrender.com/dice/roll', diceData, {
                withCredentials: true,
            });

            const results = response.data.result;
            if (results && Array.isArray(results)) {
                setDiceResults(results)
                setDiceSumResults(results.reduce((acc, curr) => acc + curr, 0));
                setDiceMaxValue(Math.max(...results));
                setDiceMinValue(Math.min(...results));
                setIsDialogOpen(true);
            } else {
                console.error('Formato de resposta inesperado: ', response.data);
            }
        } catch (error: AxiosError | any) {
            console.error('Erro ao rolar os dados: ', error);
        }
    };

    const createSpell = async () => {
        const spellData = {
            name: name,
            description: description,
            cost: cost,
            cost_type: costType,
            diceNumber: diceNumber,
            diceQtd: diceQtd,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/spells/create', spellData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateSpellOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar ataque: ', error);
        }
    };

    const createAbility = async () => {
        const abilityData = {
            name: name,
            description: description,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/ability/create', abilityData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateAbilityOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar ataque: ', error);
        }
    };

    const createAttribute = async () => {
        const attributeData = {
            name: name,
            diceNumber: diceNumber,
            value: value,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/attributes/create', attributeData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateAttributeOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar ataque: ', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-tabuleiro2 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const getCostBackgroundClass = (costType) => {
        switch (costType) {
            case 'Mana':
                return 'bg-manaBar outline outline-2 outline-[#718CAC]';
            case 'Vida':
                return 'bg-healthBar outline outline-2 outline-[#DF6565]';
            case 'Stamina':
                return 'bg-staminaBar outline outline-2 outline-[#92AF7B]';
            case 'Sanidade':
                return 'bg-sanityBar outline outline-2 outline-[#8775AE]';
            default:
                return 'bg-gray-500 outline outline-2 outline-gray-400';
        }
    };

    return (
        <div className={`${poppins.className}`}>

            {/* Modal resultado da rolagem de dados */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <AlertDialogContent className={`${poppins.className}`} >
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Resultado da Rolagem</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            {diceResults.length > 0 ? (
                                <div className='space-y-2'>
                                    <div className='grid grid-cols-2 gap-2 gap-x-4 font-bold'>
                                        <p className='text-right'>Dados: </p>
                                        <span className='font-bold text-tabuleiro2 text-left'>{diceResults.join(', ')}</span>
                                        <p className='text-right'>Soma: </p>
                                        <span className='font-bold text-tabuleiro2 text-left'>{diceSumResults}</span>
                                        <p className='text-right'>Maior valor: </p>
                                        <span className='font-bold text-tabuleiro2 text-left'>{diceMaxValue}</span>
                                        <p className='text-right'>Menor valor: </p>
                                        <span className='font-bold text-tabuleiro2 text-left'>{diceMinValue}</span>
                                    </div>
                                </div>
                            ) : (
                                <span>Nenhum resultado disponível.</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro' onClick={() => setIsDialogOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar ataque/magia */}
            <AlertDialog open={isDialogCreateSpellOpen} onOpenChange={setIsDialogCreateSpellOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Novo ataque</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={14} value={name} onChange={(e) => setName(e.target.value)} />

                                    <div className='flex items-center gap-2 w-1/2'>
                                        <select className='flex-1 p-2 bg-tabuleiro text-white rounded-md' value={costType} onChange={(e) => setCostType(e.target.value)}>
                                            <option value="" disabled>Status a ser gasto</option>
                                            <option value="Vida">Vida</option>
                                            <option value="Stamina">Stamina</option>
                                            <option value="Mana">Mana</option>
                                            <option value="Sanidade">Sanidade</option>
                                        </select>
                                        <Input type="number" placeholder="Custo" className='w-1/3 text-center border-tabuleiro border-2' value={cost} onChange={(e) => setCost(Number(e.target.value))} />
                                    </div>

                                    <div className='flex justify-center items-center'>
                                        <Input type="number" placeholder="Qtd" className='w-1/5 text-center border-tabuleiro border-2' value={diceQtd} onChange={(e) => setDiceQtd(Number(e.target.value))} />
                                        <p className='text-xl mr-7 ml-7 text-tabuleiro2 font-bold'>d</p>
                                        <Input type="number" placeholder="Dado" className='w-1/5 text-center border-tabuleiro border-2' value={diceNumber} onChange={(e) => setDiceNumber(Number(e.target.value))} />
                                    </div>

                                    <Textarea className='w-1/2 border-tabuleiro border-2' placeholder="Solta uma enorme bola de fogo, causando 3d12 de dano na área." value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateSpellOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createSpell()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar habilidade */}
            <AlertDialog open={isDialogCreateAbilityOpen} onOpenChange={setIsDialogCreateAbilityOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Nova habilidade</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={14} value={name} onChange={(e) => setName(e.target.value)} />
                                    <Textarea className='w-1/2 border-tabuleiro border-2' placeholder="Solta uma enorme bola de fogo, causando 3d12 de dano na área." value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateAbilityOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createAbility()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar atributo */}
            <AlertDialog open={isDialogCreateAttributeOpen} onOpenChange={setIsDialogCreateAttributeOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Novo atributo</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={14} value={name} onChange={(e) => setName(e.target.value)} />
                                    <Input type="number" placeholder="Valor" className='w-1/2 text-center border-tabuleiro border-2' value={value} onChange={(e) => setValue(Number(e.target.value))} />
                                    <div className='flex justify-center items-center'>
                                        <p className='text-xl font-bold text-tabuleiro2'>{value}</p>
                                        <p className='text-xl mr-4 ml-3 text-tabuleiro2 font-bold'>d</p>
                                        <Input type="number" placeholder="Dado" className=' text-center border-tabuleiro border-2' value={diceNumber} onChange={(e) => setDiceNumber(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateAbilityOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createAttribute()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                                        className="relative flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-20 w-24 hover:bg-tabuleiro2/15"
                                        onClick={() => rollDice(attribute.dicenumber, attribute.value)}
                                    >
                                        <span className="text-2xl font-bold pb-1">
                                            {attribute.value}
                                        </span>

                                        <div className='absolute bottom-1 bg-tabuleiro2 w-full -mb-2 rounded-b-lg text-center'>
                                            <span className="font-bold text-sm ">{attribute.name}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum atributo disponível</li>
                            )}
                            <div onClick={() => setIsDialogCreateAttributeOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-full h-20 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                            </div>
                        </ul>
                    </ScrollArea>
                </div>

                <div className="flex flex-col p-4 gap-8 pt-28 pl-32">
                    <div className="flex flex-col ml-10">
                        <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Ataques & Magias</h1>
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
                                                            <p className="text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 outline outline-2 outline-[#DF6565] rounded-md shadow-md shadow-black/50">
                                                                {spells.diceqtd}d{spells.dicenumber}
                                                            </p>
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <p className="text-md font-bold p-1 ">{spells.cost_type}</p>
                                                            <p className={`text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 rounded-md shadow-md shadow-black/50 mb-6 ${getCostBackgroundClass(spells.cost_type)}`}> {spells.cost} </p>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => rollDice(spells.dicenumber, spells.diceqtd)} variant={'attackCard'} className='w-2/3'>Usar</Button>
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum ataque disponível</li>
                                        )}
                                        <div onClick={() => setIsDialogCreateSpellOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
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
                                        <div onClick={() => setIsDialogCreateAbilityOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
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
            <div className="flex flex-col ml-48 mr-48">
                <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Inventário</h1>
                <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                    <p className=" text-center text-md font-bold text-tabuleiro2">Peso dos itens: {totalWeight}</p>
                    <div className='bg-tabuleiro/15 p-4 pb-4 rounded-xl'>
                        <ul className="grid grid-cols-7 gap-6">
                            {data?.inventory && data.inventory.length > 0 ? (
                                data.inventory.map((inventory, index) => (
                                    <li
                                        key={index}
                                        className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44"
                                    >
                                        <div className='absolute top-0 bg-tabuleiro2 w-full rounded-t-lg text-center z-20'>
                                            <p className="font-bold text-md pt-1">{inventory.item}</p>
                                        </div>
                                        <div className='flex flex-col gap-5'>
                                            <div className='flex justify-between pt-14'>
                                                <p className="text-md font-bold mr-9 p-1">Dano</p>
                                                <p className="text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 outline outline-2 outline-[#DF6565] rounded-md shadow-md shadow-black/50">{inventory.diceqtd}d{inventory.dicenumber}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p className="text-md font-bold mr-9 p-1">Quantia</p>
                                                <p className="text-md font-bold text-right p-1">{inventory.quantity}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                <p className="text-md font-bold p-1 mb-8">Peso</p>
                                                <p className="text-md font-bold text-right p-1">{Math.round(inventory.weight)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum item disponível</li>
                            )}
                            <div className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

}
