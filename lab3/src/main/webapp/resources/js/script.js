document.addEventListener('DOMContentLoaded', () => {
    drawGraph(); // Рисуем график сразу при загрузке

    const canvas = document.getElementById('graphCanvas');

    // Обработчик клика по канвасу
    canvas.addEventListener('click', handleCanvasClick);

    // Слушатель изменений в поле R (чтобы перерисовывать график при вводе)
    // ID берется из формы valForm + id инпута r -> "valForm:r"
    const rInput = document.getElementById('valForm:r');
    if (rInput) {
        rInput.addEventListener('input', drawGraph);
    }
});

// === КОНСТАНТЫ ===
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const SCALE = 100; // 100 пикселей = 1 R (для визуализации)

// === ОТРИСОВКА ГРАФИКА ===
function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Очистка
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Получаем R для подписей осей
    let rVal = getRValue();
    // Если R не введено или некорректно, просто пишем "R" для красоты
    let rLabel = (rVal && !isNaN(rVal)) ? rVal : "R";
    let halfRLabel = (rVal && !isNaN(rVal)) ? (rVal / 2) : "R/2";

    // 3. Рисуем фигуры
    ctx.fillStyle = '#c10505'; // Цвет области

    // --- 1 Четверть: Прямоугольник (0,0) -> (R, R/2) ---
    // X: от 0 до SCALE (R)
    // Y: от 0 до -SCALE/2 (R/2 вверх)
    ctx.beginPath();
    ctx.fillRect(CENTER_X, CENTER_Y - SCALE/2, SCALE, SCALE/2);

    // --- 2 Четверть: Сектор круга (R) ---
    // Центр (0,0), Радиус R. Дуга от PI (180°) до 1.5PI (270°)
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.arc(CENTER_X, CENTER_Y, SCALE, Math.PI, 1.5 * Math.PI);
    ctx.fill();

    // --- 4 Четверть: Треугольник (0,0) -> (R/2, 0) -> (0, -R/2) ---
    // Координаты в пикселях:
    // (0,0) -> CENTER_X, CENTER_Y
    // (R/2, 0) -> CENTER_X + SCALE/2, CENTER_Y
    // (0, -R/2) -> CENTER_X, CENTER_Y + SCALE/2 (в канвасе Y вниз - это плюс)
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X + SCALE/2, CENTER_Y);
    ctx.lineTo(CENTER_X, CENTER_Y + SCALE/2);
    ctx.closePath();
    ctx.fill();

    // 4. Рисуем оси и метки
    drawAxes(ctx, rLabel, halfRLabel);
}

function drawAxes(ctx, rLabel, halfRLabel) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(CANVAS_WIDTH, CENTER_Y);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, CANVAS_HEIGHT);
    ctx.stroke();

    // Стрелочки
    ctx.fillText("y", CENTER_X + 10, 15);
    ctx.fillText("x", CANVAS_WIDTH - 15, CENTER_Y - 10);

    // Засечки по X
    drawTick(ctx, CENTER_X + SCALE, CENTER_Y, rLabel);       // R
    drawTick(ctx, CENTER_X + SCALE/2, CENTER_Y, halfRLabel); // R/2
    drawTick(ctx, CENTER_X - SCALE, CENTER_Y, "-" + rLabel); // -R
    drawTick(ctx, CENTER_X - SCALE/2, CENTER_Y, "-" + halfRLabel); // -R/2

    // Засечки по Y
    drawTick(ctx, CENTER_X, CENTER_Y - SCALE, rLabel);       // R
    drawTick(ctx, CENTER_X, CENTER_Y - SCALE/2, halfRLabel); // R/2
    drawTick(ctx, CENTER_X, CENTER_Y + SCALE, "-" + rLabel); // -R
    drawTick(ctx, CENTER_X, CENTER_Y + SCALE/2, "-" + halfRLabel); // -R/2
}

function drawTick(ctx, x, y, label) {
    const TICK_SIZE = 5;
    ctx.beginPath();
    if (y === CENTER_Y) { // Ось X
        ctx.moveTo(x, y - TICK_SIZE);
        ctx.lineTo(x, y + TICK_SIZE);
        ctx.fillText(label, x - 10, y + 20);
    } else { // Ось Y
        ctx.moveTo(x - TICK_SIZE, y);
        ctx.lineTo(x + TICK_SIZE, y);
        ctx.fillText(label, x + 10, y + 5);
    }
    ctx.stroke();
}

// === ОБРАБОТКА КЛИКА ===
function handleCanvasClick(event) {
    const rVal = getRValue();

    // Валидация R перед отправкой
    if (!validateR(rVal)) {
        alert("Сначала введите корректное значение R (например, от 2 до 5)!");
        return;
    }

    const canvas = document.getElementById('graphCanvas');
    const rect = canvas.getBoundingClientRect();

    // Координаты клика в пикселях
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Перевод в математические координаты
    // (click - center) / scale * R
    let mathX = (clickX - CENTER_X) / SCALE * rVal;
    let mathY = (CENTER_Y - clickY) / SCALE * rVal; // Y инвертирован

    // Округляем (опционально, Java Double все равно примет)
    mathX = mathX.toFixed(4);
    mathY = mathY.toFixed(4);

    console.log(`Клик: ${mathX}, ${mathY}, R=${rVal}`);

    // Рисуем точку обратной связи (красную)
    drawPoint(clickX, clickY);

    // Отправляем на сервер через скрытую форму
    sendCoordinates(mathX, mathY, rVal);
}

function drawPoint(x, y) {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

// === УТИЛИТЫ И ОТПРАВКА ===

// Получаем значение R из основного инпута формы
function getRValue() {
    // JSF ID: id формы + : + id элемента
    const rInput = document.getElementById('valForm:r');
    if (rInput && rInput.value) {
        // Меняем запятую на точку, если вдруг ввели с запятой
        let val = parseFloat(rInput.value.replace(',', '.'));
        return val;
    }
    return null;
}

// Простая проверка R
function validateR(r) {
    // Проверьте условие согласно вашему варианту (например, от 2 до 5)
    // В h:inputText placeholder написано "-2 до 2",
    // но в прошлом сообщении вы писали "2...5".
    // Оставлю проверку на просто существование числа.
    return (r !== null && !isNaN(r));
}

// Заполнение скрытой формы и клик по кнопке
function sendCoordinates(x, y, r) {
    // Находим элементы скрытой формы по их JSF ID
    const hiddenX = document.getElementById('hiddenForm:hiddenX');
    const hiddenY = document.getElementById('hiddenForm:hiddenY');
    const hiddenR = document.getElementById('hiddenForm:hiddenR');
    const sendBtn = document.getElementById('hiddenForm:sendBtn');

    if (hiddenX && hiddenY && hiddenR && sendBtn) {
        hiddenX.value = x;
        hiddenY.value = y;
        hiddenR.value = r;

        // Эмулируем нажатие кнопки
        sendBtn.click();
    } else {
        console.error("Не найдены элементы скрытой формы! Проверьте ID.");
    }
}