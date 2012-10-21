window.addOnLoad(initMouseControl)

//Inicializa o controle por mouse da barra do jogador
function initMouseControl() {
	c.onmousemove = handleMouseEvent
}

//Move a barra de acordo com a posição do mouse no canvas
function handleMouseEvent(e) {
	if (!paddleRight) return
	paddleRight.y = e.layerY
}