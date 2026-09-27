import React, { useEffect, useRef } from 'react';

export function HoneycombCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // Mouse position state
        const mouse = {
            x: -1000,
            y: -1000,
            radius: 180, // Effect hover radius around mouse
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Honeycomb grid dimensions
        const hexRadius = 32; // Radius of each hexagon
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = 2 * hexRadius;
        const rowHeight = 1.5 * hexRadius;

        // Draw a single hexagon
        const drawHexagon = (cx, cy, radius, opacity, fillOpacity) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();

            // Glow Fill
            if (fillOpacity > 0.01) {
                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                gradient.addColorStop(0, `rgba(249, 115, 22, ${fillOpacity * 0.6})`);
                gradient.addColorStop(0.7, `rgba(245, 158, 11, ${fillOpacity * 0.25})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Stroke Outline
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = opacity > 0.7 ? 1.8 : (opacity > 0.4 ? 1.0 : 0.6);
            ctx.stroke();
        };

        // Cell heat map for persistent trail decay
        const heatMap = new Map();

        // Render animation loop
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const cols = Math.ceil(width / hexWidth) + 3;
            const rows = Math.ceil(height / rowHeight) + 3;

            // Decay existing heat map values
            for (const [key, val] of heatMap.entries()) {
                const newVal = val * 0.92; // decay rate
                if (newVal < 0.005) {
                    heatMap.delete(key);
                } else {
                    heatMap.set(key, newVal);
                }
            }

            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    let cx = col * hexWidth;
                    let cy = row * rowHeight;

                    // Offset every odd row for honeycomb pattern
                    if (Math.abs(row) % 2 === 1) {
                        cx += hexWidth / 2;
                    }

                    // Calculate distance to mouse cursor
                    const dx = cx - mouse.x;
                    const dy = cy - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const key = `${col},${row}`;
                    let heat = heatMap.get(key) || 0;

                    if (dist < mouse.radius) {
                        const factor = 1 - dist / mouse.radius;
                        const addedHeat = Math.pow(factor, 1.3);
                        if (addedHeat > heat) {
                            heatMap.set(key, addedHeat);
                            heat = addedHeat;
                        }
                    }

                    // Base opacity is 0.3 defaults, scales to 1.0 on hover
                    const baseOpacity = 0.3;
                    const opacity = Math.min(1.0, baseOpacity + heat * 0.7);
                    const fillOpacity = Math.min(0.5, heat * 0.5);

                    drawHexagon(cx, cy, hexRadius - 1, opacity, fillOpacity);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
        />
    );
}

export default HoneycombCanvas;
