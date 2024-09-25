'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/ui/navbar';

export default function Home() {
  const router = useRouter();

  return (
    <div >
      <Navbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>
          <Button onClick={() => router.push('/register')}>Cadastro</Button>
        </h1>
      </div>
    </div>
  );
}
