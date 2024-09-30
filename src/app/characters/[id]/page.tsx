'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';
import { useParams } from 'next/navigation';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

export default function CharacterDetails() {
    const { id } = useParams();
    const [character, setCharacter] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true
            })
                .then(response => {
                    setCharacter(response.data.character);
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
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1>Detalhes do Personagem</h1>
                    <p>Nome: {character.name}</p>
                    <p>Classe: {character.class}</p>
                    <p>Vida: {character.current_health} / {character.max_health}</p>
                </div>

            </div>
        </div>
    );
}
