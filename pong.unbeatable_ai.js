window.addOnLoad(initAI)

var isAIPlayerOn = true

//Inicializa a intelig�ncia artificial
function initAI() {
	console.log('Barra esquerda se tornou imbat�vel agora. IA no comando do bagulho _\\,,/')
}

//Executa movimento da barra
function onAITurn(ball, paddle) {
	paddle.y = ball.y
}