import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

let particlesInit: (() => Promise<void>) | null = null;

export function ParticleBackground() {
  const handleInit = useCallback(async (engine: Engine) => {
    if (particlesInit) {
      await particlesInit();
      return;
    }
    
    await initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
    particlesInit = async () => {
      await loadSlim(engine);
    };
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={handleInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#1a9c6e',
          },
          links: {
            color: '#1a9c6e',
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: {
              min: 0.3,
              max: 0.7,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
          twinkle: {
            lines: {
              enable: true,
              frequency: 0.05,
              opacity: 0.5,
            },
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 0.5,
            },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -100,
        pointerEvents: 'none',
      }}
    />
  );
}
