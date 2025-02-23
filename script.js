const dragContainer = document.getElementById('drag-container');
const dragItems = document.querySelectorAll('.drag-item');
const dropZones = document.querySelectorAll('.drop-zone');
const message = document.getElementById('message');
const retryButton = document.getElementById('retry-button');
const nextButton = document.getElementById('next-button');

// Función para mezclar los elementos de manera aleatoria
function shuffleElements() {
    const elements = Array.from(dragContainer.children);
    elements.sort(() => Math.random() - 0.5);
    elements.forEach(element => dragContainer.appendChild(element));
}

// Inicializar el juego mezclando los elementos
shuffleElements();

// Eventos para arrastrar y soltar
dragItems.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', dragOver);
    zone.addEventListener('drop', drop);
});

// Evento para el botón de reintentar
retryButton.addEventListener('click', () => {
    dragItems.forEach(item => {
        item.style.display = 'block';
    });
    dropZones.forEach(zone => {
        zone.classList.remove('correct', 'incorrect');
    });
    message.textContent = '';
    nextButton.style.display = 'none';
    shuffleElements();
});

// Evento para el botón "Siguiente"
nextButton.addEventListener('click', () => {
    window.location.href = "juego2.html"; // Redirige a juego2.html
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const dropZone = e.target;

    // Verificar si la relación es correcta
    if (draggedId === dropZone.dataset.match) {
        dropZone.classList.add('correct');
        document.querySelector(`[data-id="${draggedId}"]`).style.display = 'none';
        message.textContent = '¡Correcto!';
        message.style.color = 'green';
    } else {
        dropZone.classList.add('incorrect');
        message.textContent = 'Incorrecto. Intenta de nuevo.';
        message.style.color = 'red';
    }

    // Verificar si todas las relaciones son correctas
    const allCorrect = Array.from(dragItems).every(item => item.style.display === 'none');
    if (allCorrect) {
        message.textContent = '¡Felicidades! Todas las relaciones son correctas.';
        message.style.color = 'green';
        nextButton.style.display = 'inline-block';
    }

    // Limpiar los mensajes después de un tiempo
    setTimeout(() => {
        dropZone.classList.remove('incorrect');
        message.textContent = '';
    }, 2000);

    
}
