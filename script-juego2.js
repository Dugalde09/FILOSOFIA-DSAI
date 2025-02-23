// Variables globales
let selectedCircle = null;
let line = null;
let isDrawing = false;

// Seleccionar un círculo
const circles = document.querySelectorAll('.circle');
const boxesContainer = document.querySelector('.boxes-container');
const repeatButton = document.getElementById('repeat-button');
const message = document.getElementById('message');

// Datos de los cuadros de respuesta
const boxesData = [
    { match: 'escucha', text: 'Escucha lo que el paciente dice y expresa. "Ve a los ojos o a la cara, asiente con la cabeza, resume los puntos clave, di lo que sí quiso decir el paciente con otras palabras."' },
    { match: 'pregunta', text: 'Pregunta ¿Qué es importante para el paciente de acuerdo al momento clave? Preguntar con curiosidad y humildad. Mostrar escucha activa y absoluto respeto. No juzgar, manifestar confianza, indagar su punto de vista.' },
    { match: 'interpreta', text: 'Interpreta lo que veo, lo que escucho, lo que le pregunto al paciente. Evita estereotipos, preguntar al paciente si estoy entendiendo lo que quiero decir.' },
    { match: 'explica', text: 'Explica lo que requiere saber, lo que está sucediendo, o lo que necesita decidir. Escoger el mejor entorno, pedir permiso, identificar hasta dónde explicar, no usar lenguaje técnico, mostrar comprensión de la situación.' },
    { match: 'sonrie', text: 'Sonríe honestamente, mostrando comprensión y amabilidad. Reírse un poco, lentamente, y sin ruido.' },
    { match: 've', text: 'Ve atentamente. Observa al paciente con atención, muestra interés genuino y empatía.' }
];

// Función para generar los cuadros de respuesta de manera aleatoria
function generateRandomBoxes() {
    const shuffledBoxes = boxesData.sort(() => Math.random() - 0.5);
    boxesContainer.innerHTML = '';
    shuffledBoxes.forEach(boxData => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.dataset.match = boxData.match;
        box.textContent = boxData.text;
        boxesContainer.appendChild(box);
    });
}

// Generar los cuadros de respuesta al cargar la página
generateRandomBoxes();

// Función para obtener la posición exacta de un elemento
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2
    };
}

// Función para comenzar a dibujar la línea
function startDrawing(e) {
    if (e.target.classList.contains('disabled')) return; // Bloquear círculos ya usados
    e.preventDefault();
    isDrawing = true;
    selectedCircle = e.target;

    // Crear la línea
    line = document.createElement('div');
    line.classList.add('line');
    line.style.backgroundColor = selectedCircle.style.backgroundColor; // Color de la línea igual al círculo
    document.body.appendChild(line);

    // Posición inicial de la línea
    const circlePos = getElementPosition(selectedCircle);
    line.style.left = `${circlePos.x}px`;
    line.style.top = `${circlePos.y}px`;

    // Actualizar la línea mientras se mueve el mouse o el dedo
    document.addEventListener('mousemove', drawLine);
    document.addEventListener('touchmove', drawLine);
}

// Función para dibujar la línea
function drawLine(e) {
    if (!isDrawing) return;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const circlePos = getElementPosition(selectedCircle);
    const deltaX = clientX - circlePos.x;
    const deltaY = clientY - circlePos.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
}

// Función para detener el dibujo de la línea
function stopDrawing(e) {
    if (!isDrawing) return;

    isDrawing = false;
    document.removeEventListener('mousemove', drawLine);
    document.removeEventListener('touchmove', drawLine);

    const box = e.target.closest('.box');
    if (!box) return;

    const circleId = selectedCircle.dataset.id;
    const boxMatch = box.dataset.match;

    // Calcular la posición final de la línea
    const boxPos = getElementPosition(box);
    const circlePos = getElementPosition(selectedCircle);
    const deltaX = boxPos.x - circlePos.x;
    const deltaY = boxPos.y - circlePos.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Ajustar la línea para que se pegue al borde del cuadro
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;

    // Verificar si la relación es correcta
    if (circleId === boxMatch) {
        box.style.borderColor = selectedCircle.style.backgroundColor;
        message.textContent = '¡Correcto!';
        message.style.color = 'green';
    } else {
        box.style.borderColor = 'red';
        message.textContent = '';
    }

    // Bloquear el círculo para que no se pueda volver a usar
    selectedCircle.classList.add('disabled');
    selectedCircle.removeEventListener('mousedown', startDrawing);
    selectedCircle.removeEventListener('touchstart', startDrawing);
}

// Función para restablecer las selecciones
function resetSelections() {
    // Restablecer las líneas
    document.querySelectorAll('.line').forEach(line => line.remove());

    // Restablecer los bordes de los cuadros
    document.querySelectorAll('.box').forEach(box => {
        box.style.borderColor = '#ccc';
    });

    // Restablecer los círculos
    circles.forEach(circle => {
        circle.classList.remove('disabled');
        circle.addEventListener('mousedown', startDrawing);
        circle.addEventListener('touchstart', startDrawing);
    });

    // Restablecer el mensaje
    message.textContent = '';

    // Mezclar los cuadros de respuesta nuevamente
    generateRandomBoxes();
}

// Evento para el botón "Repetir"
repeatButton.addEventListener('click', resetSelections);

// Eventos para iniciar el dibujo de líneas
circles.forEach(circle => {
    circle.addEventListener('mousedown', startDrawing);
    circle.addEventListener('touchstart', startDrawing);
});

// Eventos para detener el dibujo de líneas
boxesContainer.addEventListener('mouseup', stopDrawing);
boxesContainer.addEventListener('touchend', stopDrawing);
