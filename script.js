let cobra = [{ x: 10, y: 10 }];
let comida = null;
let comidaEspecial = null;
let direcao = "DIREITA";
let proximaDirecao = "DIREITA";
let velocidade = 150;
let pontos = 0;
let record = localStorage.getItem("record") || 0;
let intervaloJogo;
let pausado = false;
let estadoFimDeJogo = false;
let timerComidaEspecial = null;
let toqueXinicial = 0;
let toqueYinicial = 0;

const iniciarBtn = document.getElementById("iniciarBtn");
const pausarBtn = document.getElementById("pausarBtn");
const reiniciarBtn = document.getElementById("reiniciarBtn");
const gameOver = document.getElementById("gameOver");
const pontosElement = document.getElementById("score");
const recordElement = document.getElementById("highScore");
const pontosFinaisElement = document.getElementById("finalScore");

function iniciar() {
  recordElement.textContent = record;
  iniciarBtn.addEventListener("click", iniciarJogo);
  pausarBtn.addEventListener("click", alternarPausa);
  reiniciarBtn.addEventListener("click", reiniciarJogo);
  document.addEventListener("keydown", mudarDirecao);

  const tabuleiro = document.getElementById("gameBoard");
  tabuleiro.addEventListener("touchstart", lidarComToqueInicial, {
    passive: false,
  });
  tabuleiro.addEventListener("touchend", lidarComToqueFinal, {
    passive: false,
  });
  tabuleiro.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
}

function iniciarJogo() {
  if (intervaloJogo) clearInterval(intervaloJogo);

  cobra = [{ x: 10, y: 10 }];
  direcao = "DIREITA";
  proximaDirecao = "DIREITA";
  pontos = 0;
  pontosElement.textContent = pontos;
  comida = gerarComida();
  estadoFimDeJogo = false;
  pausado = false;
  gameOver.style.display = "none";

  if (comidaEspecial) {
    clearTimeout(timerComidaEspecial);
    comidaEspecial = null;
  }

  iniciarBtn.disabled = true;
  pausarBtn.disabled = false;
  intervaloJogo = setInterval(loopJogo, velocidade);
}

function loopJogo() {
  if (pausado || estadoFimDeJogo) return;
  direcao = proximaDirecao;
  moverCobra();
  criarTabuleiro();
}

function criarTabuleiro() {
  const tabuleiro = document.getElementById("gameBoard");
  tabuleiro.innerHTML = "";

  cobra.forEach((segmento, index) => {
    const elemento = document.createElement("div");
    elemento.style.gridRowStart = segmento.y;
    elemento.style.gridColumnStart = segmento.x;
    elemento.classList.add(index === 0 ? "snake-head" : "snake");
    tabuleiro.appendChild(elemento);
  });

  if (comida) {
    const comidaElemento = document.createElement("div");
    comidaElemento.style.gridRowStart = comida.y;
    comidaElemento.style.gridColumnStart = comida.x;
    comidaElemento.classList.add("food");
    tabuleiro.appendChild(comidaElemento);
  }

  if (comidaEspecial) {
    const comidaEspecialElemento = document.createElement("div");
    comidaEspecialElemento.style.gridRowStart = comidaEspecial.y;
    comidaEspecialElemento.style.gridColumnStart = comidaEspecial.x;
    comidaEspecialElemento.classList.add("special-food");
    tabuleiro.appendChild(comidaEspecialElemento);
  }
}

function gerarComida() {
  let novaComida;
  while (!novaComida || posicaoOcupada(novaComida)) {
    novaComida = {
      x: Math.floor(Math.random() * 20) + 1,
      y: Math.floor(Math.random() * 20) + 1,
    };
  }
  if (Math.random() < 0.2 && !comidaEspecial) {
    gerarComidaEspecial();
  }
  return novaComida;
}

function gerarComidaEspecial() {
  let novaComidaEspecial;
  while (!novaComidaEspecial || posicaoOcupada(novaComidaEspecial)) {
    novaComidaEspecial = {
      x: Math.floor(Math.random() * 20) + 1,
      y: Math.floor(Math.random() * 20) + 1,
    };
  }
  comidaEspecial = novaComidaEspecial;
  timerComidaEspecial = setTimeout(() => {
    comidaEspecial = null;
  }, 5000);
}

function posicaoOcupada(posicao) {
  return cobra.some((s) => s.x === posicao.x && s.y === posicao.y);
}

function mudarDirecao(event) {
  const tecla = event.key;
  if (tecla === "ArrowUp" && direcao !== "BAIXO") proximaDirecao = "CIMA";
  else if (tecla === "ArrowDown" && direcao !== "CIMA")
    proximaDirecao = "BAIXO";
  else if (tecla === "ArrowLeft" && direcao !== "DIREITA")
    proximaDirecao = "ESQUERDA";
  else if (tecla === "ArrowRight" && direcao !== "ESQUERDA")
    proximaDirecao = "DIREITA";
}

function lidarComToqueInicial(event) {
  toqueXInicial = event.touches[0].clientX;
  toqueYInicial = event.touches[0].clientY;
}

function lidarComToqueFinal(event) {
  if (!toqueXInicial || !toqueYInicial) return;

  let toqueXFinal = event.changedTouches[0].clientX;
  let toqueYFinal = event.changedTouches[0].clientY;

  let diffX = toqueXFinal - toqueXInicial;
  let diffY = toqueYFinal - toqueYInicial;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (Math.abs(diffX) > 30) {
      if (diffX > 0 && direcao !== "ESQUERDA") proximaDirecao = "DIREITA";
      else if (diffX < 0 && direcao !== "DIREITA") proximaDirecao = "ESQUERDA";
    }
  } else {
    if (Math.abs(diffY) > 30) {
      if (diffY > 0 && direcao !== "CIMA") proximaDirecao = "BAIXO";
      else if (diffY < 0 && direcao !== "BAIXO") proximaDirecao = "CIMA";
    }
  }

  toqueXInicial = 0;
  toqueYInicial = 0;
}

function moverCobra() {
  const cabeca = { ...cobra[0] };

  if (direcao === "CIMA") cabeca.y--;
  if (direcao === "BAIXO") cabeca.y++;
  if (direcao === "ESQUERDA") cabeca.x--;
  if (direcao === "DIREITA") cabeca.x++;

  if (verificarColisao(cabeca)) {
    finalizarJogo();
    return;
  }

  cobra.unshift(cabeca);

  if (comida && cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos += 10;
    pontosElement.textContent = pontos;
    comida = gerarComida();
  } else if (
    comidaEspecial &&
    cabeca.x === comidaEspecial.x &&
    cabeca.y === comidaEspecial.y
  ) {
    pontos += 30;
    pontosElement.textContent = pontos;
    comidaEspecial = null;
    clearTimeout(timerComidaEspecial);
  } else {
    cobra.pop();
  }
}

function verificarColisao(cabeca) {
  const bateuParede =
    cabeca.x < 1 || cabeca.x > 20 || cabeca.y < 1 || cabeca.y > 20;
  const bateuCorpo = cobra.some(
    (seg, index) => index !== 0 && seg.x === cabeca.x && seg.y === cabeca.y
  );
  return bateuParede || bateuCorpo;
}

function finalizarJogo() {
  estadoFimDeJogo = true;
  clearInterval(intervaloJogo);

  if (pontos > record) {
    record = pontos;
    localStorage.setItem("record", record);
    recordElement.textContent = record;
  }

  pontosFinaisElement.textContent = pontos;
  gameOver.style.display = "block";
  iniciarBtn.disabled = false;
  pausarBtn.disabled = true;
}

function alternarPausa() {
  pausado = !pausado;
  pausarBtn.textContent = pausado ? "Continuar" : "Pausar";
}

function reiniciarJogo() {
  iniciarJogo();
}

iniciar();
