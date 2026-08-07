"use client";

import DepthCarousel from "./DepthCarousel";

const SCREENSHOTS = [
  { src: "/screenshots/login.png",             label: "Login"              },
  { src: "/screenshots/meus-pets.png",         label: "Meus Pets"          },
  { src: "/screenshots/perfil-pet.png",        label: "Perfil do Pet"      },
  { src: "/screenshots/passaporte.png",        label: "Passaporte"         },
  { src: "/screenshots/novo-pet.png",          label: "Novo Pet"           },
  { src: "/screenshots/agenda.png",            label: "Agenda"             },
  { src: "/screenshots/novo-lembrete.png",     label: "Lembretes"          },
  { src: "/screenshots/notificacoes.png",      label: "Notificações"       },
  { src: "/screenshots/estatisticas.png",      label: "Estatísticas"       },
  { src: "/screenshots/conquistas.png",        label: "Conquistas"         },
  { src: "/screenshots/servicos-proximos.png", label: "Serviços Próximos"  },
  { src: "/screenshots/perfil.png",            label: "Perfil"             },
];

const items = SCREENSHOTS.map(s => ({
  image: s.src,
  alt: `Zupet — ${s.label}`,
  label: s.label,
}));

export default function ScreenshotCarousel() {
  return (
    <div style={{ height: 520, position: "relative" }}>
      <DepthCarousel
        items={items}
        cardWidth={220}
        cardHeight={440}
        radius={28}
        tint="#05060a"
        depth={200}
        spread={85}
        tilt={20}
        tiltDirection="right"
        perspective={1400}
        visibleCards={4}
        falloff={0.22}
        blur={5}
        autoplay={true}
        autoplayDelay={3000}
        loop={true}
        duration={650}
        ease="power3.out"
        showControls={true}
        showIndicators={true}
      />
    </div>
  );
}
