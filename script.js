let cobra = [{ x: 10, y: 10 }];
let comida = gerarComida();
let direcao = "DIREITA";
let velocidade = 150;
let pontos = 0;
let intervaloJogo;

function iniciar() {
  criarTabuleiro();
  document.addEventListener("keydown", mudarDirecao);
  intervalo = setInterval(moverCobra, velocidade);
}

function criarTabuleiro() {
  const tabuleiro = document.getElementById("gameBoard");
  tabuleiro.innerHTML = "";

  //Cobrinha
  cobra.forEach((segmento) => {
    const elemento = document.createElement("div");
    elemento.style.gridRowStart = segmento.y;
    elemento.style.gridColumnStart = segmento.x;
    elemento.classList.add("snake");
    tabuleiro.appendChild(elemento);
  });

  //Comida
  const comidaElemento = document.createElement("div");
  comidaElemento.style.gridRowStart = comida.y;
  comidaElemento.style.gridColumnStart = comida.x;
  comidaElemento.classList.add("food");
  tabuleiro.appendChild(comidaElemento);
}

function gerarComida() {
  let novaComida;
  while (!novaComida || posicaoOcupada(novaComida)) {
    novaComida = {
      x: Math.floor(Math.random() * 20) + 1,
      y: Math.floor(Math.random() * 20) + 1,
    };
  }
  return novaComida;
}

function posicaoOcupada(posicao) {
  return cobra.some(
    (segmento) => segmento.x === posicao.x && segmento.y === posicao.y
  );
}

function mudarDirecao(event) {
  const tecla = event.key;

  if (tecla === "ArrowUp" && direcao !== "BAIXO") {
    direcao = "CIMA";
  } else if (tecla === "ArrowDown" && direcao !== "CIMA") {
    direcao = "BAIXO";
  } else if (tecla === "ArrowLeft" && direcao !== "DIREITA") {
    direcao = "ESQUERDA";
  } else if (tecla === "ArrowRight" && direcao !== "ESQUERDA") {
    direcao = "DIREITA";
  }
}

function moverCobra() {
  const cabeca = { ...cobra[0] };

  switch (direcao) {
    case "CIMA":
      cabeca.y--;
      break;
    case "BAIXO":
      cabeca.y++;
      break;
    case "ESQUERDA":
      cabeca.x--;
      break;
    case "DIREITA":
      cabeca.x++;
      break;
  }

  if (verificarColisao(cabeca)) {
    clearInterval(intervalo);
    alert("Perdeu! :( Você fez " + pontos + " pontos.");
    return;
  }

  cobra.unshift(cabeca);

  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos += 10;
    document.getElementById("score").textContent = pontos;
    comida = gerarComida();
  } else {
    cobra.pop();
  }

  criarTabuleiro();
}

function verificarColisao(cabeca) {
  if (cabeca.x < 1 || cabeca.x > 20 || cabeca.y < 1 || cabeca.y > 20) {
    return true;
  }
  for (let i = 1; i < cobra.length; i++) {
    if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
      return true;
    }
  }
}

iniciar();
