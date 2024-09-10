const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); //A renderização é em 2d, fornecendo métodos e propriedades próprias de um espaço 2d

const rectWidth = 50;
const rectHeight = 20;
const ballSize = 15;

let rectX = (canvas.width - rectWidth) / 2; // Mantém o espaço do canva fixo, diminuindo sempre a largura do retângulo
let rectY = canvas.height - rectHeight - 10; // Mantém Y fixo
let rectSpeed = 5;

let balls = []; // array vazio
let ballSpeed = 2;
let score = 0;

let isDragging = false; // Variável para saber se o quadrado está sendo arrastado
let offsetX; // Armazenar o deslocamento do clique

// Função para desenhar o retângulo
function drawRect() {
    ctx.fillStyle = 'black';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
}

// Função para desenhar as bolas
function drawBalls() {
    ctx.fillStyle = 'purple';
    for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Atualiza a posição das bolas
function updateBalls() {
    for (const ball of balls) {
        ball.y += ballSpeed;
    }

    // Remove as bolas que caem fora do canvas
    balls = balls.filter(ball => ball.y < canvas.height);

    // Verifica colisão e remove a bola
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (ball.y + ballSize > rectY &&
            ball.x > rectX &&
            ball.x < rectX + rectWidth) {
            score++;
            balls.splice(i, 1); // Remove a bola em colisão
            //i: É o índice do array onde a remoção deve começar.
            // 1: É o número de elementos a serem removidos a partir do índice i.
        }
    }
}

// Função para gerar uma nova bola aleatoriamente
function spawnBall() {
    if (Math.random() < 0.02) { // Ajusta a taxa de geração
        balls.push({
            x: Math.random() * canvas.width,
            y: 0
        });
    }
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '40px "Jersey 15"'; // Usando a fonte Jersey 15

    const text = `Score: ${score}`;
    const textWidth = ctx.measureText(text).width; // Medir a largura do texto

    // Estimativa da altura do texto (20px, como definido no ctx.font)
    const textHeight = 20; // Isso é uma estimativa, já que o canvas não fornece altura exata do texto

    // Calcula o centro em X e Y
    const centerX = (canvas.width - textWidth) / 2; // Centraliza horizontalmente
    const centerY = (canvas.height + textHeight) / 2; // Centraliza verticalmente

    ctx.fillText(text, centerX, centerY); // Desenha o texto no centro
}



// Função principal de atualização
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect();
    drawBalls();
    updateBalls();
    spawnBall();
    drawScore();
}

// Função para detectar se o mouse clicou no quadrado azul
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.offsetX;
    //A palavra-chave const declara uma variável mouseX que é inicializada com o valor de event.offsetX.
    // const indica que a variável não deve ser reatribuída após a inicialização, o que é adequado se você não precisar modificar o valor de mouseX após sua definição.
    const mouseY = event.offsetY;
    
    // Verifica se o clique foi dentro do quadrado azul
    if (mouseX >= rectX && mouseX <= rectX + rectWidth && mouseY >= rectY && mouseY <= rectY + rectHeight) {
        isDragging = true;
        canvas.style.cursor = 'grabbing'; // Troca o cursor quando o quadrado for arrastado
        // Calcula o deslocamento entre o clique e o canto superior esquerdo do quadrado
        offsetX = mouseX - rectX;
    }
});

// Função para mover o quadrado azul apenas horizontalmente com o mouse
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    if (isDragging) {
        // Atualiza apenas a posição X do quadrado conforme o movimento do mouse
        rectX = event.offsetX - offsetX;

        // Limita o movimento do quadrado dentro dos limites horizontais do canvas
        if (rectX < 0) rectX = 0;
        if (rectX + rectWidth > canvas.width) rectX = canvas.width - rectWidth;
    } else {
        // Verifica se o mouse está sobre o quadrado para trocar o cursor
        if (mouseX >= rectX && mouseX <= rectX + rectWidth && mouseY >= rectY && mouseY <= rectY + rectHeight) {
            canvas.style.cursor = 'pointer'; // Muda o cursor para pointer quando o mouse está sobre o quadrado
        } else {
            canvas.style.cursor = 'default'; // Retorna ao cursor padrão quando o mouse não está sobre o quadrado
        }
    }
});

// Função para parar de mover o quadrado quando o mouse for solto
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'default'; // Volta o cursor ao padrão quando o arrasto para
});

// Usa requestAnimationFrame para atualizações suaves
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
