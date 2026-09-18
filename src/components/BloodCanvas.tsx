import React, { useEffect, useRef } from "react";

interface BloodDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  opacity: number;
  color: string;
}

export const BloodCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create dripping drops
    const drops: BloodDrop[] = [];
    const dropCount = Math.floor(width / 70);

    const bloodColors = [
      "rgba(138, 3, 3, 0.75)",
      "rgba(185, 28, 28, 0.8)",
      "rgba(90, 0, 0, 0.85)",
      "rgba(220, 38, 38, 0.65)",
    ];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * -100,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 1.5 + 0.8,
        width: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        color: bloodColors[Math.floor(Math.random() * bloodColors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw top bleeding edge across the very top border
      const gradient = ctx.createLinearGradient(0, 0, 0, 18);
      gradient.addColorStop(0, "rgba(138, 3, 3, 0.85)");
      gradient.addColorStop(0.5, "rgba(70, 4, 4, 0.5)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, 18);

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.strokeStyle = d.color;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";

        // Draw dripping streak with teardrop head
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        // Teardrop bulb at the tip
        ctx.beginPath();
        ctx.fillStyle = d.color;
        ctx.arc(d.x, d.y + d.length, d.width * 1.4, 0, Math.PI * 2);
        ctx.fill();

        d.y += d.speed;

        // Reset if past screen
        if (d.y > height + 50) {
          d.y = -Math.random() * 80;
          d.x = Math.random() * width;
          d.speed = Math.random() * 1.6 + 0.8;
          d.length = Math.random() * 25 + 15;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-60"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
