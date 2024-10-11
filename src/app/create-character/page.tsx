/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function CreateCharacter() {
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [nacionality, setNacionality] = useState('');
    const [char_class, setChar_class] = useState('');
    const [char_subclass, setChar_subclass] = useState('');
    const [max_health, setMax_health] = useState('');
    const [max_stamina, setMax_stamina] = useState('');
    const [max_mana, setMax_mana] = useState('');
    const [max_sanity, setMax_sanity] = useState('');
    const [money, setMoney] = useState(0);
    const [current_health, setCurrent_health] = useState('');
    const [current_stamina, setCurrent_stamina] = useState('');
    const [current_mana, setCurrent_mana] = useState('');
    const [current_sanity, setCurrent_sanity] = useState('');

    const canProceed = name !== '' && age !== '' && char_class !== '';

    const handleStartClick = () => {
        setStarted(true);
    }

    const handleProceedClick = () => {
        setProceed(true);
    }

    const saveCharacter = async () => {
        const currentHealth = max_health ? Number(max_health) : undefined;
        const currentStamina = max_stamina ? Number(max_stamina) : undefined;
        const currentMana = max_mana ? Number(max_mana) : undefined;
        const currentSanity = max_sanity ? Number(max_sanity) : undefined;
    
        const characterData = {
            name: name,
            age: age,
            nacionality: nacionality,
            char_class: char_class,
            char_subclass: char_subclass,
            max_health: max_health ? Number(max_health) : undefined,
            max_stamina: max_stamina ? Number(max_stamina) : undefined,
            max_mana: max_mana ? Number(max_mana) : undefined,
            max_sanity: max_sanity ? Number(max_sanity) : undefined,
            money: money,
            current_health: currentHealth,
            current_stamina: currentStamina,
            current_mana: currentMana,
            current_sanity: currentSanity
        };
    
        try {
            const response: AxiosResponse = await axios.post('https://tabuleiro-backend.onrender.com/characters/create', characterData, {
                withCredentials: true
            });
            console.log('Personagem criado com sucesso', response);
            router.push('/characters');
        } catch (error: AxiosError | unknown) {
            console.error('Erro ao criar personagem: ', error);
        }
    };

    return (
        <div className={`${poppins.className}`}>
            <Navbar />
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    {!started ? (
                        <>
                            <h1 className='text-tabuleiro2 font-bold text-xl'>Bem-vindo à criação de personagem!</h1>
                            <h2 className='text-tabuleiro2 font-bold mb-4 text-xl'>Nós te guiaremos por esse processo, tornando mais dinâmico.</h2>
                            <p className='text-tabuleiro2 font-md'>Lembre-se que todos os valores podem ser alterados depois, não se preocupe!</p>
                            <div className="flex justify-center mt-10">
                                <Button onClick={handleStartClick} className="p-6 w-1/2 rounded-xl" variant={'tabuleiro'}>
                                    COMEÇAR
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {!proceed ? (
                                <div>
                                    <h1 className='text-tabuleiro2 font-bold text-xl'>Insira as informações do seu personagem</h1>
                                    <h2 className='text-tabuleiro2 font-md text-md mb-4'>Campos marcados com (*) são obrigatórios!</h2>
                                    <div className='space-y-4'>
                                        <Input
                                            type="text"
                                            placeholder="Nome *"
                                            className="p-6 rounded-xl w-full bg-white text-black"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Idade *"
                                            className="p-6 rounded-xl w-full bg-white text-black"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Nacionalidade"
                                            className="p-6 rounded-xl w-full bg-white text-black"
                                            value={nacionality}
                                            onChange={(e) => setNacionality(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Classe *"
                                            className="p-6 rounded-xl w-full bg-white text-black"
                                            value={char_class}
                                            onChange={(e) => setChar_class(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Sub-Classe"
                                            className="p-6 rounded-xl w-full bg-white text-black"
                                            value={char_subclass}
                                            onChange={(e) => setChar_subclass(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-center mt-10">
                                        <Button
                                            onClick={handleProceedClick}
                                            className="p-6 w-full rounded-xl"
                                            variant={'tabuleiro'}
                                            disabled={!canProceed}
                                        >
                                            PRÓXIMO
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className='text-tabuleiro2 font-bold text-xl'>Insira mais alguns detalhes sobre seu personagem</h1>
                                    <p className='text-tabuleiro2 font-md'>Preencha os campos com os valores que seu sistema de RPG usa.</p>
                                    <p className='text-tabuleiro2 font-md mb-4'>Isso deve ser calculado previamente, consulte seu livro de regras, ou peça ajuda a algum membro!</p>
                                    <p className='text-tabuleiro2 font-md mb-4'>Caso você não precise utilizar algum desses valores, deixe em branco!</p>
                                    <div className='space-y-4 flex flex-col items-center'>
                                        <Input
                                            type="number"
                                            placeholder="Vida"
                                            className="p-6 rounded-xl w-1/3 bg-white text-black"
                                            value={max_health}
                                            onChange={(e) => setMax_health(e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Stamina"
                                            className="p-6 rounded-xl w-1/3 bg-white text-black"
                                            value={max_stamina}
                                            onChange={(e) => setMax_stamina(e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Mana"
                                            className="p-6 rounded-xl w-1/3 bg-white text-black"
                                            value={max_mana}
                                            onChange={(e) => setMax_mana(e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Sanidade"
                                            className="p-6 rounded-xl w-1/3 bg-white text-black"
                                            value={max_sanity}
                                            onChange={(e) => setMax_sanity(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-center mt-10">
                                        <Button
                                            onClick={saveCharacter}
                                            className="p-6 w-1/3 rounded-xl"
                                            variant={'tabuleiro'}>
                                            SALVAR
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
