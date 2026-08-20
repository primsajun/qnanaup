import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Each drop is an object containing its head Y position and a random speed
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops.push({
        y: Math.random() * -100,
        speed: Math.random() * 0.5 + 0.5 // random speed between 0.5 and 1.0
      });
    }

    const draw = () => {
      // Clear the entire canvas completely so it stays transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px Inter, monospace';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Draw a "trail" of 10 characters for each column
        for (let j = 0; j < 15; j++) {
          const charY = drop.y - j;
          
          if (charY > 0 && charY * fontSize < canvas.height) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            
            // The head of the trail is darkest, fading out as j increases
            const opacity = 1 - (j / 15);
            ctx.fillStyle = `rgba(33, 30, 90, ${opacity})`; // Deep Indigo matching logo
            
            ctx.fillText(char, i * fontSize, charY * fontSize);
          }
        }

        // Reset drop if it goes way past the screen
        if ((drop.y - 15) * fontSize > canvas.height && Math.random() > 0.98) {
          drop.y = 0;
        }
        
        // Move drop down
        drop.y += drop.speed;
      }
    };

    // Run animation at ~30fps
    const intervalId = setInterval(draw, 33);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-screen h-screen -z-10 opacity-40 pointer-events-none"
    />
  );
}
