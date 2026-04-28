import React, { useEffect, useRef } from 'react';

const SnowmanClock = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Параметры снежинок
        const snowflakes = [];
        const numFlakes = 50;
        
        for (let i = 0; i < numFlakes; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5
            });
        }

        const render = () => {
            const radius = canvas.height / 2;
            
            // Сброс трансформации и очистка
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Центрируем
            ctx.translate(radius, radius);
            const r = radius * 0.9;

            drawFace(ctx, r);
            
            // Ограничиваем рисование снега и снеговика кругом часов
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, 2 * Math.PI);
            ctx.clip();

            // Фон внутри часов (ночное небо)
            const bgGrad = ctx.createLinearGradient(0, -r, 0, r);
            bgGrad.addColorStop(0, '#0f2027');
            bgGrad.addColorStop(0.5, '#203a43');
            bgGrad.addColorStop(1, '#2c5364');
            ctx.fillStyle = bgGrad;
            ctx.fill();

            drawSnowman(ctx, r);
            drawSnow(ctx, r, snowflakes);
            
            ctx.restore(); // Убираем ограничение (clip)

            drawTicks(ctx, r);
            drawNumbers(ctx, r);
            drawTime(ctx, r);
            drawCenterNut(ctx, r);

            animationFrameId = requestAnimationFrame(render);
        };

        const drawFace = (ctx, radius) => {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            
            // Ободок часов (Золотисто-рождественский)
            const rimGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
            rimGrad.addColorStop(0, '#d4af37'); // Gold
            rimGrad.addColorStop(0.5, '#f7ef8a');
            rimGrad.addColorStop(1, '#d4af37');
            ctx.strokeStyle = rimGrad;
            ctx.lineWidth = radius * 0.08;
            ctx.stroke();
            
            // Тень внутрь
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        };

        const drawSnowman = (ctx, r) => {
            // Рисуем снеговика в нижней части
            const sy = r * 0.4; // смещение вниз
            
            // Тело (нижний шар)
            ctx.beginPath();
            ctx.arc(0, sy, r * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Тело (средний шар)
            ctx.beginPath();
            ctx.arc(0, sy - r * 0.35, r * 0.18, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Голова
            ctx.beginPath();
            ctx.arc(0, sy - r * 0.62, r * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            // Глаза
            ctx.fillStyle = 'black';
            ctx.beginPath(); ctx.arc(-r*0.04, sy - r*0.65, r*0.015, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(r*0.04, sy - r*0.65, r*0.015, 0, Math.PI*2); ctx.fill();

            // Нос-морковка
            ctx.beginPath();
            ctx.moveTo(0, sy - r * 0.62);
            ctx.lineTo(r * 0.08, sy - r * 0.6);
            ctx.lineTo(0, sy - r * 0.58);
            ctx.fillStyle = 'orange';
            ctx.fill();

            // Шарф
            ctx.beginPath();
            ctx.rect(-r*0.12, sy - r*0.52, r*0.24, r*0.05);
            ctx.fillStyle = '#cc0000'; // Красный шарф
            ctx.fill();
            // Конец шарфа
            ctx.beginPath();
            ctx.moveTo(r*0.08, sy - r*0.48);
            ctx.lineTo(r*0.12, sy - r*0.3);
            ctx.lineTo(r*0.02, sy - r*0.3);
            ctx.fill();
        };

        const drawSnow = (ctx, r, flakes) => {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            flakes.forEach(f => {
                // Отрисовка относительно центра (0,0)
                // Координаты снега в массиве от 0 до canvas.width, нужно перевести в локальные (-r до r)
                const localX = f.x - canvas.width/2;
                const localY = f.y - canvas.height/2;

                ctx.beginPath();
                ctx.arc(localX, localY, f.radius, 0, Math.PI * 2);
                ctx.fill();

                // Обновление позиции
                f.y += f.speed;
                // Если улетел вниз - возвращаем наверх
                if (f.y > canvas.height) {
                    f.y = 0;
                    f.x = Math.random() * canvas.width;
                }
            });
        };

        const drawTicks = (ctx, radius) => {
            ctx.shadowBlur = 0; // Убираем тень для четкости
            for(let i = 0; i < 60; i++){
                let ang = (i * Math.PI) / 30;
                ctx.rotate(ang);
                ctx.beginPath();
                if (i % 5 === 0) {
                    // Крупные риски - как леденцы
                    ctx.roundRect(-radius*0.02, -radius*0.88, radius*0.04, radius*0.12, 5);
                    ctx.fillStyle = '#fff';
                } else {
                    ctx.roundRect(-radius*0.005, -radius*0.88, radius*0.01, radius*0.05, 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.6)';
                }
                ctx.fill();
                ctx.rotate(-ang);
            }
        };

        const drawNumbers = (ctx, radius) => {
            ctx.font = `bold ${radius * 0.18}px 'Arial'`;
            ctx.fillStyle = '#ffffff';
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            for (let n = 1; n < 13; n++) {
                let ang = n * Math.PI / 6;
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.72);
                ctx.rotate(-ang);
                ctx.fillText(n.toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.72);
                ctx.rotate(-ang);
            }
        };

        const drawTime = (ctx, radius) => {
            const now = new Date();
            let h = now.getHours() % 12;
            let m = now.getMinutes();
            let s = now.getSeconds();
            let ms = now.getMilliseconds();
            
            // Плавное движение секунд
            let smoothS = s + ms / 1000;

            h = (h * Math.PI / 6) + (m * Math.PI / 360);
            m = (m * Math.PI / 30) + (smoothS * Math.PI / 1800);
            let sAngle = (smoothS * Math.PI / 30);

            // Часовая
            drawHand(ctx, h, radius * 0.5, radius * 0.07, '#fff');
            // Минутная
            drawHand(ctx, m, radius * 0.75, radius * 0.05, '#fff');
            
            // Секундная (красная тонкая)
            ctx.save();
            ctx.rotate(sAngle);
            ctx.beginPath();
            ctx.moveTo(0, radius * 0.15); 
            ctx.lineTo(0, -radius * 0.85);
            ctx.strokeStyle = '#ff3333';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        };

        const drawHand = (ctx, pos, length, width, color) => {
            ctx.save();
            ctx.rotate(pos);
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(-width/2, -length * 0.1);
            ctx.lineTo(0, -length);
            ctx.lineTo(width/2, -length * 0.1);
            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.restore();
        };

        const drawCenterNut = (ctx, radius) => {
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.03, 0, 2 * Math.PI);
            ctx.fillStyle = '#d4af37';
            ctx.fill();
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return <canvas ref={canvasRef} width="400" height="400" className="clock-canvas" />;
};

export default SnowmanClock;