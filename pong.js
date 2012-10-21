window.addOnLoad(init)

var fps = 60, gameLoop

var c, ctx
var w = 350, h = 150

var ball
var paddleLeft
var paddleRight
var scoreBoard

var RAD = { 0: 0, 60: Math.PI/3, 90: Math.PI/2, 120: Math.PI*2/3, 180: Math.PI, 240: Math.PI*4/3, 270: Math.PI*3/2, 300: Math.PI*5/3, 360: Math.PI*2 }

//Inicializa o jogo
function init() {
	if (!c) c = document.getElementById('canvas')
	if (!ctx) ctx = c.getContext('2d')
	
	if (!scoreBoard) scoreBoard = { player1: 0, player2: 0 }
	
	if (!ball) ball = { x: w/2, y: h/2, r: 5, speed: 4, dir: 0 }
	if (!paddleLeft) paddleLeft = { x: 0, y: h/2, w: 5, h: 20, speed: 0, oldY: 0  }
	if (!paddleRight) paddleRight = { x: w, y: h/2, w: 5, h: 20, speed: 0, oldY: 0 }
	
	waitStartGameAction()
}

//Inicia um novo jogo
function waitStartGameAction(winner) {
	if (gameLoop) clearInterval(gameLoop)
	
	ctx.setAlpha(0.5)
	redraw()
	ctx.setAlpha(1)
	drawNewGameMessage(winner)
		
	c.onmousedown = function (e) {
		startNewGame()
		c.onmousedown = null
	}
	
	function startNewGame() {
		ball = { x: w/2, y: h/2, r: 5, speed: 4, dir: 0 }
		paddleLeft = { x: 0, y: h/2, w: 5, h: 20, speed: 0, oldY: 0  }
		paddleRight = { x: w, y: h/2, w: 5, h: 20, speed: 0, oldY: 0 }

		randomizeBallDir()
		
		redraw()
		
		gameLoop = setInterval(function () {
			moveBall(ball)
			if (isAIPlayerOn) onAITurn(ball, paddleLeft)
			checkCollision()
			redraw()
			checkEndGame()
		}, 1000 / fps)
	}
}

//Define aleatóriamente uma direção para a bola
function randomizeBallDir() {
	ball.dir = Math.random()*RAD[360]
	
	normalizeBallDir()
}

//Normaliza a direção para valores entre -60 e 60 ou entre 120 e -120
function normalizeBallDir() {
	var negative = ball.dir < 0 ? 1 : 0
	ball.dir = Math.abs(ball.dir)%RAD[360]
	
	if (ball.dir > RAD[60] && ball.dir <= RAD[90]) ball.dir = RAD[60]
	else if (ball.dir > RAD[90] && ball.dir < RAD[120]) ball.dir = RAD[120]
	else if (ball.dir > RAD[240] && ball.dir <= RAD[270]) ball.dir = RAD[240]
	else if (ball.dir > RAD[270] && ball.dir < RAD[300]) ball.dir = RAD[300]
	
	if (negative) ball.dir = -ball.dir
}

//Normaliza a velocidade para valores entre -10 e 10
function normalizeBallSpeed() {
	var negative = ball.speed < 0
	
	ball.speed = Math.abs(ball.speed)
	if (ball.speed > 10) ball.speed = 10
	
	if (negative) ball.speed = -ball.speed
}

//Atualiza a posição da bola de acordo com sua direção e velocidade
function moveBall(ball) {
	ball.x += ball.speed * Math.cos(ball.dir)
	ball.y -= ball.speed * Math.sin(ball.dir)
}

//Atualiza a posição da barra de acordo com a direção escolhida pelo jogador
function movePaddle(paddle, dir, speed) {
	switch (dir) {
	case 'up': paddle.y -= speed; break
	case 'down': paddle.y += speed; break
	}
	
	//Normaliza a posição da barra
	if (paddle.y < paddle.h) paddle.y = paddle.h
	else if (paddle.y > h-paddle.h) paddle.y = h-paddle.h
}

//Verifica se o jogo terminou e decide o vencedor
function checkEndGame() {
	if (ball.x < ball.r) endGame('player2')
	else if (ball.x > w-ball.r) endGame('player1')
	
	function endGame(winner) {
		scoreBoard[winner]++
		
		waitStartGameAction(winner)
	}
}

//Trata colisões, caso haja alguma
function checkCollision() {
	calcPaddleSpeed()

	//Colisão com a parede inferior ou superior
	if (ball.y <= ball.r) {
		//Normaliza a posição da bola
		ball.y = ball.r
		ball.dir = -ball.dir
	}
	else if (ball.y >= h - ball.r) {
		//Normaliza a posição da bola
		ball.y = h-ball.r
		ball.dir = -ball.dir
	}
	
	//Colisão com a barra esquerda
	if (ball.x <= ball.r+paddleLeft.w 
			&& Math.abs(paddleLeft.y-ball.y) <= Math.abs(paddleLeft.h-ball.r)) {
		//Normaliza a posição da bola
		ball.x = ball.r+paddleLeft.w
		
		collidePaddle(paddleLeft)
	}
	//Colisão com a barra direita
	else if (ball.x > w-ball.r-paddleRight.w
			&& Math.abs(paddleRight.y-ball.y) <= Math.abs(paddleRight.h-ball.r)) {
		//Normaliza a posição da bola
		ball.x = w-ball.r-paddleRight.w
		
		collidePaddle(paddleRight)
	}
	
	//Atualiza o cálculo da velocidade das barras
	function calcPaddleSpeed() {
		//Barra esquerda
		paddleLeft.speed = paddleLeft.oldY-paddleLeft.y //inversed axis coordinates
		paddleLeft.oldY = paddleLeft.y
		
		//Barra direita
		paddleRight.speed = paddleRight.oldY-paddleRight.y //inversed axis coordinates
		paddleRight.oldY = paddleRight.y
	}
	
	//Simula a colisão da bola com a barra especificada
	function collidePaddle(paddle) {
		var vx = -ball.speed * Math.cos(ball.dir)
		var vy = ball.speed * Math.sin(ball.dir) + paddle.speed
		//Calcula o ângulo do vetor velocidade resultante, corrigindo a defasagem de 180 graus da função Math.atan
		ball.dir = Math.atan(vy/vx) + (vx < 0 ? RAD[180] : RAD[0])
		//Calcula o módulo do vetor velocidade resultante
		ball.speed = Math.sqrt(Math.pow(vx,2) + Math.pow(vy,2))
		
		normalizeBallDir()
		normalizeBallSpeed()
	}
}

//Atualiza o gráfico do jogo
function redraw() {
	ctx.clearRect(0, 0, w, h)
	
	drawScoreBoard()
	drawPlayField()
	
	drawPaddles()
	drawBall()
}

//Desenha o placar
function drawScoreBoard() {
	ctx.save()
	
	ctx.textAlign = 'center'
	ctx.font = 'Arial'
	ctx.fillStyle = 'gray'
	
	//Placar do jogador 1
	var score1 = 'Score: ' + scoreBoard.player1
	ctx.fillText(score1, w/6, 10)
	
	//Placar do jogador 2
	var score2 = 'Score: ' + scoreBoard.player2
	ctx.fillText(score2, w*5/6, 10)
	
	ctx.restore()
}

//Desenha o campo do jogo
function drawPlayField() {
	ctx.save()
	
	ctx.strokeStyle = '#000000'
	ctx.fillStyle = '#000000'
	
	//Desenha a linha central
	ctx.beginPath()
	ctx.dashedLine(w/2,0,w/2,h)
	ctx.stroke()
	
	ctx.restore()
}

//Desenha as barras da esquerda e da direita
function drawPaddles() {
	ctx.save()
	
	ctx.strokeStyle = '#000000'
	ctx.fillStyle = '#00FF00'
	
	//Desenha a barra da esquerda
	ctx.strokeRect(paddleLeft.x, paddleLeft.y-paddleLeft.h, paddleLeft.w, paddleLeft.h*2) 
	ctx.fillRect(paddleLeft.x, paddleLeft.y-paddleLeft.h, paddleLeft.w, paddleLeft.h*2) 
	
	//Desenha a barra da direita
	ctx.strokeRect(paddleRight.x-paddleRight.w, paddleRight.y-paddleRight.h, paddleRight.w, paddleRight.h*2) 
	ctx.fillRect(paddleRight.x-paddleRight.w, paddleRight.y-paddleRight.h, paddleRight.w, paddleRight.h*2)
	
	ctx.restore()
}

//Desenha a bola
function drawBall() {
	ctx.save()
	
	ctx.strokeStyle = '#000000'
	ctx.fillStyle = '#FF0000'
	
	//Desenha o círculo
	ctx.beginPath()
	ctx.arc(ball.x, ball.y, ball.r, 0, RAD[360], false)
	ctx.closePath()
	ctx.stroke()
	ctx.fill()
	
	ctx.restore()
}

//Exibe informativo de novo jogo e o vencedor do jogo passado
function drawNewGameMessage(winner) {
	ctx.save()
	
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font = '12pt Arial Black'
	ctx.fillStyle = 'green'
	
	//Exibe vencedor do jogo passado
	if (winner) {
		ctx.save()
		
		ctx.font = '10pt Arial' 
		switch (winner) {
		case 'player1': ctx.fillStyle = 'red'; break
		case 'player2': ctx.fillStyle = 'blue'; break
		}
		
		var winnerMsg = winner + ' venceu a partida!'
		ctx.fillText(winnerMsg, w/2, h/3)
		
		ctx.restore()
	}
	
	//Instruções para novo jogo
	var newGameMsg = 'Clique para iniciar um novo jogo!'
	ctx.fillText(newGameMsg, w/2, 2*h/3)
	
	ctx.restore()
}