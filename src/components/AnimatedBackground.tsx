import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles: Particle[] = [];
    const electricityLines: ElectricityLine[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.5
          ? 'hsl(160, 85%, 38%)'
          : 'hsl(200, 80%, 42%)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.002;

        // Wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class ElectricityLine {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      life: number;
      maxLife: number;

      constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.alpha = 1;
        this.life = 0;
        this.maxLife = 30;
      }

      update() {
        this.life++;
        this.alpha = 1 - this.life / this.maxLife;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = `hsla(160, 85%, 38%, ${this.alpha * 0.8})`;
        ctx.lineWidth = 2 * this.alpha;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
      }
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    let frameCount = 0;

    const animate = () => {
      ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'hsl(210, 40%, 8%)'
        : 'hsl(210, 50%, 98%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Add new particles
      if (Math.random() < 0.3) {
        particles.push(new Particle());
      }

      // Update and draw electricity lines
      for (let i = electricityLines.length - 1; i >= 0; i--) {
        electricityLines[i].update();
        electricityLines[i].draw(ctx);

        if (electricityLines[i].life >= electricityLines[i].maxLife) {
          electricityLines.splice(i, 1);
        }
      }

      // Create electricity arcs periodically
      frameCount++;
      if (frameCount % 15 === 0 && Math.random() < 0.4) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = startX + (Math.random() - 0.5) * 300;
        const endY = startY + (Math.random() - 0.5) * 300;

        // Create branching electricity
        electricityLines.push(new ElectricityLine(startX, startY, endX, endY));

        // Add branches
        if (Math.random() < 0.5) {
          const branchX = startX + (endX - startX) * 0.5;
          const branchY = startY + (endY - startY) * 0.5;
          const branchEndX = branchX + (Math.random() - 0.5) * 200;
          const branchEndY = branchY + (Math.random() - 0.5) * 200;
          electricityLines.push(new ElectricityLine(branchX, branchY, branchEndX, branchEndY));
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ display: 'block' }}
    />
  );
}
