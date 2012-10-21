window.addOnLoad(initAI)

var isAIPlayerOn = true

//Inicializa a inteligência artificial
function initAI() {
	console.log('Barra esquerda se tornou imbatível agora. IA no comando do bagulho _\\,,/')
}

//Executa movimento da barra
function onAITurn(ball, paddle) {
	paddle.y = ball.y
}