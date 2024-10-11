"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define as variantes para a barra de progresso
const progressVariants = cva(
  "relative h-8 w-full overflow-hidden rounded-xl transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        health: "bg-zinc-900  outline outline-2 outline-[#B17A7A]",
        stamina: "bg-zinc-900  outline outline-2 outline-[#92AF7B]",
        mana: "bg-zinc-900  outline outline-2 outline-[#718CAC]",
        sanity: "bg-zinc-900  outline outline-2 outline-[#8775AE]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Define as variantes para o indicador da barra de progresso
const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all shadow-shadowInner",
  {
    variants: {
      variant: {
        tabuleiro: "bg-tabuleiro",
        health: "bg-healthBar",
        stamina: "bg-staminaBar",
        mana: "bg-manaBar",
        sanity: "bg-sanityBar",
      }, 
    }
  }
)

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & 
  VariantProps<typeof progressVariants> & 
  VariantProps<typeof indicatorVariants> & { indicatorVariant?: 'health' | 'stamina' | 'mana' | 'sanity' | 'tabuleiro' }
>(({ className, value, variant, indicatorVariant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(indicatorVariants({ variant: indicatorVariant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
