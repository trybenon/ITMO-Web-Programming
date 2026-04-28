import React, { useEffect, useRef } from 'react';

const InteractiveGraph = ({ r, points = [], onCanvasClick }) => {
    const canvasRef = useRef(null);

    const CANVAS_SIZE = 450;
    const CENTER = CANVAS_SIZE / 2;
    const SCALE = CANVAS_SIZE / 3;

    const drawTick = (ctx, x, y, label) => {
        const TICK_SIZE = 5;
        ctx.beginPath();
        if (y === CENTER) {
            ctx.moveTo(x, y - TICK_SIZE);
            ctx.lineTo(x, y + TICK_SIZE);
            ctx.fillText(label, x - 10, y + 25);
        } else {
            ctx.moveTo(x - TICK_SIZE, y);
            ctx.lineTo(x + TICK_SIZE, y);
            ctx.fillText(label, x + 10, y + 5);
        }
        ctx.stroke();
    };

    const drawAxes = (ctx, rLabel, halfRLabel) => {
        // Белые оси для темного фона
        ctx.strokeStyle = "white"; 
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Roboto";

        // Оси
        ctx.beginPath();
        ctx.moveTo(0, CENTER);
        ctx.lineTo(CANVAS_SIZE, CENTER);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(CENTER, 0);
        ctx.lineTo(CENTER, CANVAS_SIZE);
        ctx.stroke();

        // Стрелочки и подписи
        ctx.fillText("Y", CENTER + 10, 20);
        ctx.fillText("X", CANVAS_SIZE - 20, CENTER - 15);

        // Риски
        drawTick(ctx, CENTER + SCALE, CENTER, rLabel);
        drawTick(ctx, CENTER + SCALE / 2, CENTER, halfRLabel);
        drawTick(ctx, CENTER - SCALE, CENTER, "-" + rLabel);
        drawTick(ctx, CENTER - SCALE / 2, CENTER, "-" + halfRLabel);

        drawTick(ctx, CENTER, CENTER - SCALE, rLabel);
        drawTick(ctx, CENTER, CENTER - SCALE / 2, halfRLabel);
        drawTick(ctx, CENTER, CENTER + SCALE, "-" + rLabel);
        drawTick(ctx, CENTER, CENTER + SCALE / 2, "-" + halfRLabel);
    };

    const redrawGraph = (ctx) => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (!r || isNaN(r) || r <= 0) {
            drawAxes(ctx, "R", "R/2");
            return;
        }

        // --- Фигуры: Ледяной/Снежный стиль ---
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; // Полупрозрачный белый
        
        // Прямоугольник (1-й квадрант)
        ctx.fillRect(CENTER, CENTER - SCALE / 2, SCALE, SCALE / 2);

        // Четверть круга (2-й квадрант)
        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.arc(CENTER, CENTER, SCALE, Math.PI, 1.5 * Math.PI);
        ctx.fill();

        // Треугольник (4-й квадрант)
        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.lineTo(CENTER + SCALE / 2, CENTER);
        ctx.lineTo(CENTER, CENTER + SCALE / 2);
        ctx.closePath();
        ctx.fill();

        drawAxes(ctx, r.toString(), (r / 2).toString());

        // --- Точки ---
        points.forEach((p) => {
            const xPixel = CENTER + (p.x / r) * SCALE;
            const yPixel = CENTER - (p.y / r) * SCALE;

            ctx.beginPath();
            ctx.arc(xPixel, yPixel, 5, 0, 2 * Math.PI);
            ctx.strokeStyle = "white"; // Обводка белая
            ctx.lineWidth = 1;

            if (p.r !== r) {
                ctx.fillStyle = "rgba(200, 200, 200, 0.5)"; // Серый призрак, если R другой
            } else {
                // Яркий зеленый для попадания, Яркий красный для промаха
                ctx.fillStyle = p.success ? "#76ff03" : "#ff1744";
            }

            ctx.fill();
            ctx.stroke();
        });
    };

    const handleClick = (e) => {
        if (!r || isNaN(r) || r <= 0) {
            alert("Выберите корректный R (1–4)");
            return;
        }
        
        const rect = canvasRef.current.getBoundingClientRect();
        
        // Учитываем масштабирование canvas через CSS (если оно есть)
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const xPix = (e.clientX - rect.left) * scaleX;
        const yPix = (e.clientY - rect.top) * scaleY;

        const mathX = +(((xPix - CENTER) / SCALE) * r).toFixed(4);
        const mathY = +(((CENTER - yPix) / SCALE) * r).toFixed(4);

        // Передаем координаты в родительский компонент, 
        // чтобы он сам делал fetch и dispatch
        if (onCanvasClick) {
            onCanvasClick(mathX, mathY);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        redrawGraph(ctx);
    }, [r, points]);

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            onClick={handleClick}
            className="interactive-graph-canvas"
        />
    );
};

export default InteractiveGraph;