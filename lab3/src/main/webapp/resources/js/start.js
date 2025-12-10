const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;


const TIMEOUT = 11000;

ctx.translate(radius, radius);
radius = radius * 0.90;

drawClock();
setInterval(drawClock, TIMEOUT);

function drawClock() {
    // Чистим холст
    ctx.clearRect(-radius/0.9, -radius/0.9, canvas.width, canvas.height);

    drawFace(ctx, radius);
    drawBranding(ctx, radius);
    drawTicks(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    drawCenterNut(ctx, radius);
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);


    const dialGrad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
    dialGrad.addColorStop(0, '#f4f1ea');
    dialGrad.addColorStop(1, '#e3ddcf');
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // Безель
    const rimGrad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    rimGrad.addColorStop(0, '#888');   // Внутренняя тень
    rimGrad.addColorStop(0.5, '#eee'); // Блик металла
    rimGrad.addColorStop(1, '#666');   // Внешний край

    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();

    // обводка внутри
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.94, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.01;
    ctx.stroke();
}

function drawBranding(ctx, radius) {
    drawStar(ctx, 0, -radius * 0.35, 5, radius * 0.15, radius * 0.06, '#cc0000');

    // Надпись СССР
    ctx.font = "bold " + (radius * 0.1) + "px 'Courier New', serif";
    ctx.fillStyle = '#cc0000';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("СССР", 0, -radius * 0.15);

    // Нижние надписи
    ctx.font = "bold " + (radius * 0.04) + "px sans-serif";
    ctx.fillStyle = '#333';
    ctx.fillText("ЗАКАЗ МО СССР", 0, radius * 0.55);

    // Логотип "Камней"
    ctx.font = "italic " + (radius * 0.05) + "px serif";
    ctx.fillText("17 КАМНЕЙ", 0, radius * 0.45);
}

function drawTicks(ctx, radius) {
    let ang;
    for(let num = 0; num < 60; num++){
        ang = (num * Math.PI) / 30;
        ctx.beginPath();
        ctx.rotate(ang);

        // Жирные черные риски
        if (num % 5 === 0) {
            ctx.rect(-radius*0.02, -radius*0.9, radius*0.04, radius*0.12);
            ctx.fillStyle = '#000';
            ctx.fill();
        } else {
            ctx.rect(-radius*0.005, -radius*0.9, radius*0.01, radius*0.05);
            ctx.fillStyle = '#555';
            ctx.fill();
        }
        ctx.rotate(-ang);
    }
}

function drawNumbers(ctx, radius) {
    let ang;
    let num;

    ctx.font = "bold " + (radius * 0.18) + "px 'Georgia', 'Times New Roman', serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = '#1a1a1a';

    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.72);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.72);
        ctx.rotate(-ang);
    }
}
function drawTime(ctx, radius) {
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();


    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
        (minute * Math.PI / (6 * 60)) +
        (second * Math.PI / (360 * 60));
    drawSwordHand(ctx, hour, radius * 0.5, radius * 0.06, 'black');

    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawSwordHand(ctx, minute, radius * 0.8, radius * 0.05, 'black');


    second = (second * Math.PI / 30);
    drawSecondHand(ctx, second, radius * 0.9);
}

// минутная и часовая
function drawSwordHand(ctx, pos, length, width, color) {
    ctx.save();
    ctx.beginPath();
    ctx.rotate(pos);


    ctx.moveTo(0, 0);
    ctx.lineTo(-width/2, -length * 0.2);
    ctx.lineTo(0, -length);
    ctx.lineTo(width/2, -length * 0.2);
    ctx.lineTo(0, 0);

    ctx.fillStyle = color;
    ctx.fill();

    // люминофор
    ctx.beginPath();
    ctx.moveTo(0, -length * 0.25);
    ctx.lineTo(0, -length * 0.70);
    ctx.lineWidth = width * 0.3;
    ctx.strokeStyle = '#ccffcc';
    ctx.stroke();

    ctx.restore();
}

// секундная стрелка
function drawSecondHand(ctx, pos, length) {
    ctx.save();
    ctx.rotate(pos);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#cc0000';

    // стрелка
    ctx.moveTo(0, length * 0.2); // Противовес
    ctx.lineTo(0, -length);
    ctx.stroke();

    // кружок
    ctx.beginPath();
    ctx.arc(0, -length * 0.65, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#cc0000';
    ctx.fill();

    ctx.restore();
}

// болтик
function drawCenterNut(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.04, 0, 2 * Math.PI);
    ctx.fillStyle = '#silver';
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// звезда
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}