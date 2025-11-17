// ===== ПЕРЕМЕННЫЕ И ИНИЦИАЛИЗАЦИЯ =====
let selectedX = null;
let selectedR = null;
let currentPage = 1;
const rowsPerPage = 10;
let allResults = [];

// Загрузка при старте
document.addEventListener('DOMContentLoaded', () => {
    getSessionHistory();
    document.getElementById('coordinateSVG').addEventListener('click', handleGraphClick);
});

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// Клик по графику
function handleGraphClick(event) {
    if (selectedR === null) {
        showError(document.getElementById('rForm'), "Для интерактивного выбора точки выберите R");
        return;
    }

    const svgCoords = getSVGCoordinates(event);
    const mathCoords = convertPixelToMath(svgCoords.x, svgCoords.y, 300, 300);
    sendPointToServer(mathCoords.x, mathCoords.y);
}

// Выбор значения X
document.getElementById('xForm').addEventListener('click', function(event){
    if (event.target.type === 'button' && event.target.name === 'x'){
        if (selectedX && event.target === selectedX.element){
            selectedX.element.style.backgroundColor = '#2e7d32';
            selectedX = null;
            return;
        }

        if (selectedX && selectedX.element) {
            selectedX.element.style.backgroundColor = '#2e7d32';
            selectedX.element.style.color = 'white';
        }

        event.target.style.backgroundColor = '#103711';
        event.target.style.color = 'white';
        selectedX = {
            value: event.target.value,
            element: event.target
        };
    }
});

// Выбор значения R
document.getElementById('rForm').addEventListener('click', function(event){
    if (event.target.type === 'button' && event.target.name === 'r'){

        if(selectedR && selectedR.element === event.target){
            selectedR.element.style.backgroundColor = '#2e7d32';
            selectedR = null;
            return;
        }

        if (selectedR && selectedR.element) {
            selectedR.element.style.backgroundColor = '#2e7d32';
            selectedR.element.style.color = 'white';
        }
        event.target.style.backgroundColor = '#103711';
        event.target.style.color = 'white';
        selectedR = {
            value: event.target.value,
            element: event.target
        };
    }
});

// Отправка формы
document.getElementById('valForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let x = selectedX?.element;
    let y = document.getElementById('y');
    let r = selectedR?.element;

    if (!validate(x, y, r)) return;
    sendPointToServer(x.value, y.value);
});

// Очистка таблицы
document.getElementById('clearTableButton').addEventListener("click", clearSessionHistory);

// ===== РАБОТА С СЕРВЕРОМ =====

// Загрузка истории результатов
function getSessionHistory(){
    fetch("getResults")
        .then(res => res.json())
        .then(results => {
            allResults = results;
            currentPage = 1;

            clearGraphPoints();
            clearResultTable();

            results.forEach(r => {
                addPointToGraph(r.x, r.y, r.success, r.r);
            });

            displayCurrentPage();
            updatePaginationControls();
        })
        .catch(err => console.error('Ошибка загрузки истории:', err));
}

// Очистка истории на сервере
function clearSessionHistory(){
    fetch("clearResults")
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            return resp.text();
        })
        .then(text => {
            console.log(text);
            allResults = [];
            currentPage = 1;
            clearResultTable();
            clearGraphPoints();
            updatePaginationControls();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Отправка точки на сервер
function sendPointToServer(x, y){
    const r = selectedR.value;

    fetch(`controller?x=${x}&y=${y}&r=${r}`, {
        method: 'GET'
    })
        .then(response =>{
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                addPointToGraph(data.x, data.y, data.success, data.r);

                allResults.unshift(data);
                currentPage = 1;
                displayCurrentPage();
                updatePaginationControls();

                console.log(`Точка (${x}, ${y}) - ${data.success ? 'попадание' : 'промах'}`);
            } catch (e){
                console.error("JSON parse error: ", e);
                showError(document.getElementById('valForm'), "Ошибка обработки ответа сервера");
            }
        })
        .catch(error => {
            console.error("Fetch error: ", error);
            showError(document.getElementById('valForm'), "Ошибка соединения с сервером");
        });
}

// ===== РАБОТА С ГРАФИКОМ =====

// Получение координат в системе SVG
function getSVGCoordinates(event) {
    const svg = document.getElementById("coordinateSVG");
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM().inverse();
    const svgPoint = point.matrixTransform(ctm);
    return { x: svgPoint.x, y: svgPoint.y };
}

// Конвертация пикселей в координаты
function convertPixelToMath(svgX, svgY, svgWidth, svgHeight) {
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const scale = 50 / selectedR.value;

    const mathX = (svgX - centerX) / scale;
    const mathY = (centerY - svgY) / scale;

    return {
        x: Math.round((mathX / 2) * 100) / 100,
        y: Math.round((mathY / 2) * 100) / 100
    };
}

// Конвертация координат в пиксели
function convertMathToPixel(mathX, mathY, rValue) {
    const centerX = 150;
    const centerY = 150;
    const scale = 50 / rValue;

    return {
        x: centerX + (mathX * 2) * scale,
        y: centerY - (mathY * 2) * scale
    };
}

// Добавление точки на график
function addPointToGraph(x, y, success, rValue) {
    const svg = document.getElementById('coordinateSVG');
    const pointCoords = convertMathToPixel(x, y, rValue);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pointCoords.x);
    circle.setAttribute("cy", pointCoords.y);
    circle.setAttribute("r", 3);
    circle.setAttribute("fill", success ? "green" : "red");
    circle.setAttribute("stroke", "black");
    svg.appendChild(circle);
}

// Очистка точек на графике
function clearGraphPoints() {
    const svg = document.getElementById('coordinateSVG');
    const points = svg.querySelectorAll('circle');
    points.forEach(point => point.remove());
}

// ===== РАБОТА С ТАБЛИЦЕЙ РЕЗУЛЬТАТОВ =====

// Создание таблицы результатов
function createResultTable() {
    const table = document.createElement("table");
    table.id = "resultTable";

    let header = table.insertRow();
    ["Результат", "X", "Y", "R", "Текущее время", "Время работы"].forEach(title => {
        let th = document.createElement("th");
        th.textContent = title;
        header.appendChild(th);
    });

    document.body.appendChild(table);
    return table;
}

// Очистка таблицы
function clearResultTable() {
    const table = document.getElementById("resultTable");
    if (table) {
        const rowCount = table.rows.length;
        for (let i = rowCount - 1; i > 0; i--) {
            table.deleteRow(i);
        }
    } else {
        createResultTable();
    }
}

// Добавление строки в таблицу
function addToResultTable(data){
    let table = document.getElementById("resultTable");
    if (!table) {
        table = createResultTable();
    }

    let row = table.insertRow();

    row.insertCell().textContent = data.success ? "Попадание" : "Промах";
    row.insertCell().textContent = data.x;
    row.insertCell().textContent = data.y;
    row.insertCell().textContent = data.r;
    row.insertCell().textContent = data.current_time;
    row.insertCell().textContent = data.execution_time + " мс";
}

// ===== ПАГИНАЦИЯ =====

// Отображение текущей страницы
function displayCurrentPage() {
    clearResultTable();

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageResults = allResults.slice(startIndex, endIndex);

    pageResults.forEach(addToResultTable);
}

// Обновление элементов управления пагинацией
function updatePaginationControls() {
    const oldControls = document.getElementById('paginationControls');
    if (oldControls) oldControls.remove();

    const totalPages = Math.ceil(allResults.length / rowsPerPage);
    if (totalPages <= 1) return;

    const controls = document.createElement('div');
    controls.id = 'paginationControls';
    controls.style.textAlign = 'center';
    controls.style.margin = '20px 0';

    // Кнопка "Назад"
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Назад';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);

    // Информация о странице
    const pageInfo = document.createElement('span');
    pageInfo.textContent = ` Страница ${currentPage} из ${totalPages} `;
    pageInfo.style.margin = '0 15px';

    // Кнопка "Вперед"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Вперед →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);

    controls.appendChild(prevButton);
    controls.appendChild(pageInfo);
    controls.appendChild(nextButton);

    const table = document.getElementById("resultTable");
    table.parentNode.insertBefore(controls, table.nextSibling);
}

// Смена страницы
function changePage(page) {
    currentPage = page;
    displayCurrentPage();
    updatePaginationControls();
}

// ===== ВАЛИДАЦИЯ И УТИЛИТЫ =====

// Валидация формы
function validate(x, y, r) {
    let isValid = true;

    if (!x) {
        showError(document.getElementById('xForm'), "Необходимо выбрать значение X");
        isValid = false;
    }

    if (!y.value.trim()) {
        showError(y, "Необходимо ввести значение Y");
        isValid = false;
    } else if (!/^-?\d+(\.\d+)?$/.test(y.value.trim())) {
        showError(y, "Y должно быть числом");
        isValid = false;
    } else {
        const yNum = parseFloat(y.value);
        if (yNum < -3 || yNum > 3 || isNaN(yNum)) {
            showError(y, "Y должно быть в диапазоне от -3 до 3");
            isValid = false;
        }
    }

    if (!r) {
        showError(document.getElementById('rForm'), "Необходимо выбрать значение R");
        isValid = false;
    }

    return isValid;
}

// Показать сообщение об ошибке
function showError(element, message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '13px';
    errorElement.style.textAlign = 'center';
    element.parentNode.insertBefore(errorElement, element.nextSibling);
    setTimeout(() => errorElement.remove(), 3000);
}