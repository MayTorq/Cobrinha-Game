let cobra = [{ x: 10, y: 10 }];
let comida = gerarComida();
let direcao = "DIREITA";
let velocidade = 150;
let pontos = 0;
let intervaloJogo;

function iniciar() {
  criarTabuleiro();
  //document.addEventListener("keydown", mudarDirecao);
  //intervaloJogo = setInterval(moverCobra, velocidade);
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

iniciar();
