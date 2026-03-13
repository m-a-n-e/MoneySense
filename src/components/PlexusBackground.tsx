import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function PlexusBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: {
          enable: true,
          mode: "grab", // Efeito de "conexão" com o mouse
        },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 4 },
        grab: {
          distance: 200,
          links: { opacity: 0.5 }
        },
      },
    },
    particles: {
      color: { value: "#4f46e5" }, // Indigo 600
      links: {
        color: "#4f46e5",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: { default: "bounce" as const },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 100,
      },
      opacity: { value: 0.4 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options as any}
      className="absolute inset-0 z-0"
    />
  );
}
