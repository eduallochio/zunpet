"use client";

import { useReducedMotion } from "motion/react";
import { Stethoscope, PlaneTakeoff, Bell, Wallet, Camera, Trophy, UtensilsCrossed, Heart, Search, BarChart2, Moon, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Stethoscope,   label: "Carteira de Saúde" },
  { icon: PlaneTakeoff,  label: "Passaporte de Viagem" },
  { icon: Bell,          label: "Lembretes Inteligentes" },
  { icon: Wallet,        label: "Controle de Gastos" },
  { icon: Camera,        label: "Álbum de Fotos" },
  { icon: Trophy,        label: "Conquistas" },
  { icon: UtensilsCrossed, label: "Gestão de Ração" },
  { icon: Heart,         label: "Memorial do Pet" },
  { icon: Search,        label: "Busca Global" },
  { icon: BarChart2,     label: "Estatísticas" },
  { icon: Moon,          label: "Modo Escuro" },
  { icon: WifiOff,       label: "Funciona Offline" },
];

export function Marquee() {
  const reduced = useReducedMotion();
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden py-4" aria-hidden>
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, oklch(0.10 0 0), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, oklch(0.10 0 0), transparent)" }}
      />

      <div
        className="flex gap-4 w-max"
        style={reduced ? {} : { animation: "marquee 30s linear infinite" }}
      >
        {doubled.map(({ icon: Icon, label }, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0"
            style={{
              background: "oklch(0.15 0.01 174)",
              border: "1px solid oklch(0.62 0.18 174 / 0.2)",
              color: "oklch(0.78 0.10 174)",
            }}
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
