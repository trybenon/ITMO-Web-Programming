document.addEventListener('DOMContentLoaded', () => {
    redrawGraph();

    const canvas = document.getElementById('graphCanvas');
    if (canvas) {
        canvas.addEventListener('click', handleCanvasClick);
    }

    const rInput = document.getElementById('valForm:r_input');
    if (rInput) {
        rInput.addEventListener('input', redrawGraph);
        rInput.addEventListener('keyup', redrawGraph);

        const spinnerContainer = rInput.parentElement;
        if (spinnerContainer) {
            spinnerContainer.addEventListener('click', () => {
                setTimeout(redrawGraph, 100);
            });
        }
    }
});

let CANVAS_WIDTH = 450;
let CANVAS_HEIGHT = 450;
let CENTER_X = CANVAS_WIDTH / 2;
let CENTER_Y = CANVAS_HEIGHT / 2;
let SCALE = CANVAS_WIDTH / 3;



function redrawGraph() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let rVal = getRValue();
    let drawR = (rVal && !isNaN(rVal) && rVal > 0) ? rVal : null;

    let rLabel = drawR ? drawR : "R";
    let halfRLabel = drawR ? (drawR / 2) : "R/2";

    ctx.fillStyle = '#014c09';
    ctx.globalAlpha = 0.5;


    ctx.beginPath();
    ctx.fillRect(CENTER_X, CENTER_Y - SCALE / 2, SCALE, SCALE / 2);

    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.arc(CENTER_X, CENTER_Y, SCALE, Math.PI, 1.5 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X + SCALE / 2, CENTER_Y);
    ctx.lineTo(CENTER_X, CENTER_Y + SCALE / 2);
    ctx.closePath();
    ctx.fill();

    drawAxes(ctx, rLabel, halfRLabel);

    if (drawR) {
        drawAllPoints(ctx, drawR);
    }
}

function drawAxes(ctx, rLabel, halfRLabel) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";

    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_WIDTH, CENTER_Y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_HEIGHT);
    ctx.stroke();

    ctx.fillText("Y", CENTER_X + 10, 15);
    ctx.fillText("X", CANVAS_WIDTH - 15, CENTER_Y - 10);

    drawTick(ctx, CENTER_X + SCALE, CENTER_Y, rLabel);
    drawTick(ctx, CENTER_X + SCALE / 2, CENTER_Y, halfRLabel);
    drawTick(ctx, CENTER_X - SCALE, CENTER_Y, "-" + rLabel);
    drawTick(ctx, CENTER_X - SCALE / 2, CENTER_Y, "-" + halfRLabel);

    drawTick(ctx, CENTER_X, CENTER_Y - SCALE, rLabel);
    drawTick(ctx, CENTER_X, CENTER_Y - SCALE / 2, halfRLabel);
    drawTick(ctx, CENTER_X, CENTER_Y + SCALE, "-" + rLabel);
    drawTick(ctx, CENTER_X, CENTER_Y + SCALE / 2, "-" + halfRLabel);
}

function drawTick(ctx, x, y, label) {
    const TICK_SIZE = 5;
    ctx.beginPath();
    if (y === CENTER_Y) {
        ctx.moveTo(x, y - TICK_SIZE);
        ctx.lineTo(x, y + TICK_SIZE);
        ctx.fillText(label, x - 10, y + 20);
    } else {
        ctx.moveTo(x - TICK_SIZE, y);
        ctx.lineTo(x + TICK_SIZE, y);
        ctx.fillText(label, x + 10, y + 5);
    }
    ctx.stroke();
}

function handleCanvasClick(event) {
    const rVal = getRValue();


    if (!validateR(rVal)) {
        console.warn("R не выбран. Отправляем запрос для генерации ошибки JSF.");


        const hiddenR = document.getElementById('valForm:hiddenR');
        const hiddenX = document.getElementById('valForm:hiddenX');
        const hiddenY = document.getElementById('valForm:hiddenY');


        if (hiddenR) hiddenR.value = "";
        if (hiddenX) hiddenX.value = "0";
        if (hiddenY) hiddenY.value = "0";


        if (window.sendClickParams) {
            sendClickParams();
        }
        return;
    }


    const canvas = document.getElementById('graphCanvas');
    const rect = canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    let mathX = (clickX - CENTER_X) / SCALE * rVal;
    let mathY = (CENTER_Y - clickY) / SCALE * rVal;

    mathX = mathX.toFixed(4);
    mathY = mathY.toFixed(4);

    console.log(`Клик: ${mathX}, ${mathY}, R=${rVal}`);

    sendCoordinates(mathX, mathY, rVal);
}

function getRValue() {
    const rInput = document.getElementById('valForm:r_input');

    if (!rInput) {
        const standardInput = document.getElementById('valForm:r');
        if (standardInput && standardInput.value) {
            return parseFloat(standardInput.value.replace(',', '.'));
        }
        return null;
    }

    if (rInput.value) {
        let val = parseFloat(rInput.value.replace(',', '.'));
        return val;
    }
    return null;
}

function validateR(r) {
    return (r !== null && !isNaN(r) && r >= 1 && r <= 4);
}

function sendCoordinates(x, y, r) {
    const hiddenX = document.getElementById('valForm:hiddenX');
    const hiddenY = document.getElementById('valForm:hiddenY');
    const hiddenR = document.getElementById('valForm:hiddenR');

    if (hiddenX && hiddenY && hiddenR) {
        hiddenX.value = x;
        hiddenY.value = y;
        hiddenR.value = r;

        if (window.sendClickParams) {
            sendClickParams();
        } else {
            console.error("RemoteCommand 'sendClickParams' не найдена!");
        }
    } else {
        console.error("Не найдены скрытые поля (valForm:hiddenX ...)");
    }
}

function drawAllPoints(ctx, currentR) {
    const hiddenInput = document.getElementById('valForm:pointsData');
    if (!hiddenInput || !hiddenInput.textContent || hiddenInput.textContent == '[]') return;

    try {
        const pointsArray = JSON.parse(hiddenInput.textContent);
        console.log(pointsArray)

        pointsArray.forEach(point => {
            const xPixel = CENTER_X + (point.x / currentR * SCALE);
            const yPixel = CENTER_Y - (point.y / currentR * SCALE);

            ctx.beginPath();
            ctx.arc(xPixel, yPixel, 4, 0, 2 * Math.PI);
            let grayColor = "#404240"
            if (currentR != point.r){
                ctx.fillStyle = grayColor;
            }else {
                ctx.fillStyle = point.success ? "#00ff00" : "#910000";
                ctx.fill();
            }
            ctx.strokeStyle = "black";
            ctx.stroke();
        });
    } catch (e) {
        console.error("Ошибка при чтении JSON точек: ", e);
    }
}
