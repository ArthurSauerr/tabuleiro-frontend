'use client'
import { Poppins } from 'next/font/google';
import Navbar from '@/components/navbar';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function Page() {

    return (
        <div className={`${poppins.className}`}>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="max-w-3xl">
                    {/* Seção do Desenvolvedor */}
                    <div className="mb-8">
                        <h2 className="text-center text-lg font-bold text-tabuleiro2 mb-2">Desenvolvedor</h2>
                        <p className="text-center text-md text-tabuleiro2">Arthur Sauer Germano</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            {/* Links de redes sociais */}
                            <a href="https://www.linkedin.com/in/arthur-sauer-germano-215465257" target="_blank" className="text-tabuleiro2 hover:text-tabuleiro hover:underline">
                                LinkedIn
                            </a>
                            <a href="https://github.com/arthursauerr" target="_blank" className="text-tabuleiro2 hover:text-tabuleiro hover:underline">
                                GitHub
                            </a>
                        </div>
                    </div>

                    {/* Seção do Artista */}
                    <div className="mb-8">
                        <h2 className="text-center text-lg font-bold text-tabuleiro2 mb-2">Artista</h2>
                        <p className="text-center text-md text-tabuleiro2">João Vitor Sobreira</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            {/* Adicionar redes sociais do artista */}
                            <a href="https://sabaum.artstation.com/" target="_blank" className="text-tabuleiro2 hover:text-tabuleiro hover:underline">
                                Artstation
                            </a>
                            <a href="https://www.instagram.com/jaumsobreira/" target="_blank" className="text-tabuleiro2 hover:text-tabuleiro hover:underline">
                                Instagram
                            </a>
                        </div>
                    </div>

                    {/* Seção de Design */}
                    <div className="mb-8">
                        <h2 className="text-center text-lg font-bold text-tabuleiro2 mb-2">Ajuda no Design</h2>
                        <p className="text-center text-md text-tabuleiro2">Math</p>
                    </div>

                    {/* Seção de Consultoria */}
                    <div className="mb-8">
                        <h2 className="text-center text-lg font-bold text-tabuleiro2 mb-2">Consultoria de RPG</h2>
                        <p className="text-center text-md text-tabuleiro2">Thiagovsk</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
