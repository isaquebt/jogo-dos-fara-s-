// ======================================================
// DESAFIO DOS FARAÓS
// Exploração, perguntas, guardas e armadilhas
// ======================================================

const W = 900;
const H = 600;

let tela = "menu";
let jogador;
let inimigos = [];
let itens = [];
let inventario = [];
let armadilhas = [];

let pontos = 0;
let vidas = 3;

let teclas = {};
let mensagem = "";
let mensagemAte = 0;
let invulneravelAte = 0;
let tempoVelocidade = 0;

let dentroPiramide = false;
let perguntasConcluidas = false;
let desafiosConcluidos = false;
let armadilhasConcluidas = false;

let perguntaAtual = 0;
let desafioAtual = 0;

let tempoInicioArmadilhas = 0;
let acertosArmadilhas = 0;
let tempoUltimoObstaculo = 0;

let tesouroDesbloqueado = false;

// ------------------------------------------------------
// BANCO DE PERGUNTAS
// ------------------------------------------------------

const perguntas = [
  {
    p: "Qual rio foi essencial para a agricultura egípcia?",
    o: ["Rio Nilo", "Rio Amazonas", "Rio Tigre"],
    c: 0
  },
  {
    p: "Como era chamado o governante do Egito Antigo?",
    o: ["Cônsul", "Faraó", "Cavaleiro"],
    c: 1
  },
  {
    p: "Para que serviam os hieróglifos?",
    o: ["Para escrever", "Para plantar", "Para navegar"],
    c: 0
  },
  {
    p: "Qual era uma função das pirâmides reais?",
    o: ["Mercados", "Túmulos", "Escolas modernas"],
    c: 1
  },
  {
    p: "Por que alguns egípcios eram mumificados?",
    o: [
      "Para preservar o corpo",
      "Para construir barcos",
      "Para produzir papiro"
    ],
    c: 0
  }
];

const desafios = [
  {
    p: "Qual número vem depois de 2, 4, 6, 8?",
    o: ["9", "10", "12"],
    c: 1
  },
  {
    p: "De qual material vegetal era feito o papiro?",
    o: ["Uma planta", "Ferro", "Argila"],
    c: 0
  },
  {
    p: "O Sol é...",
    o: ["Um planeta", "Uma estrela", "Um satélite"],
    c: 1
  }
];

// ------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------

function setup() {
  const canvas = createCanvas(W, H);
  canvas.parent("canvas-container");
  textFont("Arial");

  iniciarJogo(false);
  tela = "menu";
}

function draw() {
  if (tela === "menu") {
    desenharMenu();
  } else if (tela === "instrucoes") {
    desenharInstrucoes();
  } else if (tela === "jogo") {
    atualizarJogo();
    desenharExterior();
  } else if (tela === "piramide") {
    atualizarJogo();
    desenharInterior();
  } else if (tela === "pergunta") {
    desenharPergunta(perguntas[perguntaAtual], false);
  } else if (tela === "desafio") {
    desenharPergunta(desafios[desafioAtual], true);
  } else if (tela === "armadilha") {
    atualizarArmadilhas();
    desenharArmadilhas();
  } else if (tela === "inventario") {
    if (dentroPiramide) desenharInterior();
    else desenharExterior();

    desenharInventario();
  } else if (tela === "vitoria") {
    desenharFim(true);
  } else if (tela === "derrota") {
    desenharFim(false);
  }

  desenharMensagem();
}

// ------------------------------------------------------
// MENU
// ------------------------------------------------------

function desenharMenu() {
  background("#f5d987");
  desenharDunas();
  desenharPiramide(65, 205, 240, 235);
  desenharPiramide(590, 155, 270, 285);

  fill("#4b2e18");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(39);
  text("DESAFIO DOS FARAÓS", 450, 90);

  textStyle(NORMAL);
  textSize(17);
  text("Explore, sobreviva e descubra os segredos do Egito!", 450, 140);

  botao("JOGAR", 300, 235, 300, 62);
  botao("INSTRUÇÕES", 300, 315, 300, 62);

  fill("#4b2e18");
  textSize(14);
  text("Uma aventura de exploração e conhecimento", 450, 425);
}

function desenharInstrucoes() {
  background("#f4dfaa");

  fill("#4b2e18");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(32);
  text("COMO JOGAR", 450, 60);
  textStyle(NORMAL);

  const linhas = [
    "WASD ou setas: movimentar",
    "E: interagir com itens, estela, portal e tesouro",
    "I: abrir o inventário",
    "Ankh: recupera uma vida",
    "Papiro: dá uma dica e concede pontos",
    "Escaravelho: aumenta sua velocidade por alguns segundos",
    "Vaso: distrai os guardas dentro da pirâmide",
    "Coroa: concede pontos extras",
    "Nas armadilhas, mova-se para escapar dos obstáculos!",
    "Complete todas as etapas para encontrar o tesouro."
  ];

  textAlign(LEFT, CENTER);
  textSize(16);

  for (let i = 0; i < linhas.length; i++) {
    text("• " + linhas[i], 75, 112 + i * 37);
  }

  botao("VOLTAR", 330, 500, 240, 52);
}

function botao(rotulo, x, y, w, h) {
  noStroke();
  fill("#70431f");
  rect(x, y, w, h, 12);

  fill("#fff0bd");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(21);
  text(rotulo, x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

// ------------------------------------------------------
// CENÁRIO
// ------------------------------------------------------

function desenharDunas() {
  background("#f5d987");

  noStroke();
  fill("#ffeb9b");
  ellipse(775, 75, 62, 62);

  fill("#e8bf6b");
  ellipse(150, 300, 420, 180);
  ellipse(720, 300, 500, 190);

  fill("#d7a64f");
  rect(0, 345, W, 255);
}

function desenharRio() {
  noStroke();
  fill("#65b9c9");

  beginShape();
  vertex(0, 385);
  vertex(90, 375);
  vertex(145, 420);
  vertex(220, 600);
  vertex(0, 600);
  endShape(CLOSE);

  fill("#a4dce2");
  beginShape();
  vertex(0, 425);
  vertex(70, 410);
  vertex(120, 450);
  vertex(180, 600);
  vertex(0, 600);
  endShape(CLOSE);
}

function desenharPiramide(x, y, w, h) {
  noStroke();

  fill("#bd853c");
  triangle(x, y + h, x + w / 2, y, x + w, y + h);

  fill("#e8bd69");
  triangle(x, y + h, x + w / 2, y, x + w * 0.53, y + h);

  stroke("#a87431");
  strokeWeight(2);

  for (let i = 1; i <= 6; i++) {
    const yy = y + h * i / 7;
    const margem = w * i / 14;
    line(x + margem, yy, x + w - margem, yy);
  }

  noStroke();
}

function desenharPalmeira(x, y) {
  stroke("#70451f");
  strokeWeight(7);
  line(x, y, x + 4, y + 65);

  strokeWeight(4);

  for (let i = 0; i < 7; i++) {
    const a = -PI + i * PI / 6;
    line(x + 4, y, x + 4 + cos(a) * 36, y + sin(a) * 23);
  }

  noStroke();
}

function desenharExterior() {
  desenharDunas();
  desenharRio();

  // Caminho até a pirâmide
  fill("#edc77f");
  noStroke();
  beginShape();
  vertex(360, 600);
  vertex(465, 600);
  vertex(750, 350);
  vertex(680, 350);
  endShape(CLOSE);

  desenharPalmeira(105, 315);
  desenharPalmeira(320, 325);
  desenharPalmeira(830, 315);

  desenharPiramide(610, 105, 250, 250);

  // Entrada
  fill("#392318");
  rect(710, 285, 50, 70, 5);

  fill("#fff0bd");
  textAlign(CENTER, CENTER);
  textSize(13);
  text("ENTRADA", 735, 375);

  // Estela
  fill("#8a5b2b");
  rect(390, 275, 80, 75, 5);

  fill("#f4d58b");
  rect(398, 283, 64, 59, 3);

  fill("#4b2e18");
  textSize(25);
  text("☥", 430, 309);

  textSize(10);
  text("ESTELA", 430, 334);

  desenharItens();
  desenharInimigos();
  desenharJogador();
  desenharHUD();

  fill("#4b2e18");
  textAlign(LEFT);
  textSize(13);
  text("WASD/setas: andar | E: interagir | I: inventário", 15, 580);

  if (perguntasConcluidas) {
    fill("#275b36");
    textAlign(RIGHT);
    textSize(14);
    text("✓ Perguntas concluídas", 880, 65);
  }
}

// ------------------------------------------------------
// PERSONAGEM, ITENS E HUD
// ------------------------------------------------------

function desenharJogador() {
  push();
  translate(jogador.x, jogador.y);

  if (millis() < invulneravelAte && frameCount % 8 < 4) {
    tint(255, 100);
  }

  noStroke();
  fill("#59361f");
  ellipse(0, 0, 30, 30);

  fill("#f0c58a");
  ellipse(0, -7, 18, 18);

  fill("#fff0c2");
  rect(-10, 3, 20, 13, 4);

  fill("#4b2e18");
  rect(-9, 14, 6, 7);
  rect(3, 14, 6, 7);

  pop();
}

function desenharItens() {
  for (const it of itens) {
    if (it.pego) continue;

    push();
    translate(it.x, it.y);

    noStroke();
    fill(it.cor);
    ellipse(0, 0, 31, 31);

    fill("#fff5cf");
    textAlign(CENTER, CENTER);
    textSize(19);
    text(it.simbolo, 0, -1);

    pop();
  }
}

function desenharInimigos() {
  for (const e of inimigos) {
    if (!e.ativo) continue;

    push();
    translate(e.x, e.y);

    noStroke();
    fill(millis() < e.distracaoAte ? "#d8a943" : "#812c25");
    ellipse(0, 0, 34, 34);

    fill("#f8e8c2");
    rect(-11, -8, 22, 12, 3);

    fill("#4b2117");
    ellipse(-5, -2, 4, 5);
    ellipse(5, -2, 4, 5);

    fill("#3b1b13");
    rect(-8, 7, 16, 4, 2);

    pop();
  }
}

function desenharHUD() {
  noStroke();
  fill(60, 36, 20, 225);
  rect(12, 12, 245, 76, 10);

  fill("#fff0bd");
  textAlign(LEFT);
  textSize(16);
  text("⭐ Pontos: " + pontos, 25, 39);
  text("❤️ Vidas: " + "♥ ".repeat(vidas), 25, 65);

  if (millis() < tempoVelocidade) {
    textAlign(RIGHT);
    text("VELOCIDADE EXTRA", 880, 30);
  }
}

// ------------------------------------------------------
// GUARDAS E MOVIMENTO
// ------------------------------------------------------

function criarGuardas(interior) {
  if (interior) {
    return [
      {
        x: 170, y: 160, velocidade: 1.9,
        ativo: true, distracaoAte: 0
      },
      {
        x: 730, y: 280, velocidade: 2.1,
        ativo: true, distracaoAte: 0
      },
      {
        x: 450, y: 390, velocidade: 1.95,
        ativo: true, distracaoAte: 0
      }
    ];
  }

  return [
    {
      x: 170, y: 270, velocidade: 1.45,
      ativo: true, distracaoAte: 0
    },
    {
      x: 470, y: 430, velocidade: 1.55,
      ativo: true, distracaoAte: 0
    },
    {
      x: 800, y: 400, velocidade: 1.4,
      ativo: true, distracaoAte: 0
    }
  ];
}

function moverJogador() {
  let dx = 0;
  let dy = 0;

  if (teclas["w"] || teclas["ArrowUp"]) dy--;
  if (teclas["s"] || teclas["ArrowDown"]) dy++;
  if (teclas["a"] || teclas["ArrowLeft"]) dx--;
  if (teclas["d"] || teclas["ArrowRight"]) dx++;

  const tamanho = Math.hypot(dx, dy);

  if (tamanho > 0) {
    dx /= tamanho;
    dy /= tamanho;

    const v = millis() < tempoVelocidade ? 5.8 : jogador.velocidade;
    jogador.x += dx * v;
    jogador.y += dy * v;
  }

  jogador.x = constrain(jogador.x, dentroPiramide ? 85 : 25, dentroPiramide ? 815 : W - 25);
  jogador.y = constrain(jogador.y, dentroPiramide ? 90 : 105, H - 35);
}

function atualizarJogo() {
  moverJogador();

  for (const e of inimigos) {
    if (!e.ativo) continue;

    if (millis() < e.distracaoAte) {
      e.x += random(-1.5, 1.5);
      e.y += random(-1.5, 1.5);
      continue;
    }

    const d = dist(e.x, e.y, jogador.x, jogador.y);
    const alcance = dentroPiramide ? 750 : 460;

    if (d < alcance && d > 1) {
      const dx = (jogador.x - e.x) / d;
      const dy = (jogador.y - e.y) / d;
      const velocidade = e.velocidade + (d < 130 ? 0.3 : 0);

      e.x += dx * velocidade;
      e.y += dy * velocidade;
    }

    if (d < 29 && millis() > invulneravelAte) {
      vidas--;
      invulneravelAte = millis() + 1200;

      const dx = jogador.x - e.x;
      const dy = jogador.y - e.y;
      const norma = max(1, Math.hypot(dx, dy));

      jogador.x = constrain(jogador.x + dx / norma * 55, 30, W - 30);
      jogador.y = constrain(jogador.y + dy / norma * 55, 100, H - 35);

      mostrarMensagem("Um guarda te atingiu! Você perdeu uma vida.");

      if (vidas <= 0) {
        tela = "derrota";
        return;
      }
    }
  }
}

// ------------------------------------------------------
// PORTAS E PROGRESSÃO
// ------------------------------------------------------

function entrarPiramide() {
  dentroPiramide = true;
  tela = "piramide";

  jogador.x = 450;
  jogador.y = 500;

  inimigos = criarGuardas(true);

  mostrarMensagem("A pirâmide está cheia de perigos. Encontre o portal!");
}

function sairPiramide() {
  dentroPiramide = false;
  tela = "jogo";

  jogador.x = 735;
  jogador.y = 390;

  inimigos = criarGuardas(false);
}

function desenharInterior() {
  background("#3a271b");

  noStroke();
  fill("#765133");
  rect(35, 45, 830, 515, 12);

  fill("#51351f");
  rect(65, 75, 770, 455, 8);

  stroke("#9c7549");
  strokeWeight(2);

  for (let y = 105; y < 525; y += 55) {
    line(70, y, 830, y);
  }

  for (let x = 100; x < 830; x += 90) {
    line(x, 75, x, 530);
  }

  noStroke();

  // Corredor
  fill("#a47a45");
  rect(340, 75, 220, 455);

  fill("#c9a366");
  rect(365, 75, 170, 455);

  // Pilares e tochas
  for (const x of [115, 785]) {
    fill("#b88c4e");
    rect(x - 18, 145, 36, 270, 5);

    fill("#e1bd7a");
    rect(x - 9, 155, 18, 250, 3);

    desenharTocha(x, 125);
  }

  // Portal dos desafios
  fill("#4b2e18");
  rect(365, 110, 170, 82, 8);

  fill("#ffe4a0");
  textAlign(CENTER, CENTER);
  textSize(17);
  text("PORTAL DOS", 450, 139);
  text("DESAFIOS", 450, 162);

  fill("#e9bd63");
  ellipse(450, 220, 75, 45);

  fill("#4b2e18");
  textSize(27);
  text("☥", 450, 220);

  fill("#fff0bd");
  textSize(13);

  if (desafiosConcluidos && armadilhasConcluidas) {
    text("Tesouro liberado!", 450, 260);

    fill("#d5a52f");
    rect(400, 310, 100, 65, 8);

    fill("#fff0bd");
    textSize(25);
    text("♛", 450, 341);
  } else {
    text("Aproxime-se e aperte E", 450, 260);
  }

  // Saída
  fill("#21160e");
  rect(400, 495, 100, 60);

  fill("#fff0bd");
  textSize(13);
  text("SAÍDA", 450, 478);

  desenharInimigos();
  desenharJogador();
  desenharHUD();

  fill("#fff0bd");
  textAlign(LEFT);
  textSize(13);
  text("E: interagir | I: inventário | Evite os guardas!", 15, 580);
}

function desenharTocha(x, y) {
  fill("#75401d");
  rect(x - 5, y, 10, 27);

  fill("#f5a623");
  ellipse(x, y - 6, 20, 26);

  fill("#fff0a3");
  ellipse(x, y - 7, 8, 13);
}

// ------------------------------------------------------
// INTERAÇÕES DO MUNDO
// ------------------------------------------------------

function interagir() {
  if (tela === "jogo") {
    const item = itens.find(it =>
      !it.pego && dist(jogador.x, jogador.y, it.x, it.y) < 42
    );

    if (item) {
      item.pego = true;
      inventario.push(item.tipo);
      pontos += 10;
      mostrarMensagem(item.nome + " coletado! +10 pontos.");
      return;
    }

    if (!perguntasConcluidas &&
        dist(jogador.x, jogador.y, 430, 315) < 55) {
      perguntaAtual = 0;
      tela = "pergunta";
      return;
    }

    if (dist(jogador.x, jogador.y, 735, 320) < 85) {
      if (!perguntasConcluidas) {
        mostrarMensagem("Responda primeiro às perguntas da estela!");
        return;
      }

      entrarPiramide();
      return;
    }

    mostrarMensagem("Aproxime-se de um item, da estela ou da entrada.");
  } else if (tela === "piramide") {
    if (jogador.y > 455 && jogador.x > 380 && jogador.x < 520) {
      sairPiramide();
      return;
    }

    if (desafiosConcluidos && armadilhasConcluidas &&
        dist(jogador.x, jogador.y, 450, 340) < 75) {
      tela = "vitoria";
      return;
    }

    if (jogador.x > 340 && jogador.x < 560 &&
        jogador.y > 175 && jogador.y < 290) {
      if (!desafiosConcluidos) {
        desafioAtual = 0;
        tela = "desafio";
      } else if (!armadilhasConcluidas) {
        iniciarArmadilhas();
      } else {
        mostrarMensagem("O tesouro está esperando no centro da sala!");
      }
      return;
    }

    mostrarMensagem("Procure o portal central ou a saída na parte inferior.");
  }
}

// ------------------------------------------------------
// PERGUNTAS ALINHADAS
// ------------------------------------------------------

function desenharPergunta(q, ehDesafio) {
  background(ehDesafio ? "#4a3020" : "#e9c875");

  if (!ehDesafio) {
    desenharPiramide(0, 280, 210, 250);
    desenharPiramide(690, 280, 210, 250);
  } else {
    // Interior da pirâmide atrás do painel
    fill("#765133");
    rect(0, 0, W, H);

    fill("#51351f");
    rect(40, 35, 820, 530, 12);
  }

  // Painel central fixo
  const px = 140;
  const py = 85;
  const pw = 620;
  const ph = 430;

  fill("#fff0c2");
  stroke("#8b5a28");
  strokeWeight(3);
  rect(px, py, pw, ph, 16);
  noStroke();

  fill("#4b2e18");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(ehDesafio ? 26 : 28);
  text(ehDesafio ? "DESAFIO DA PIRÂMIDE" : "PERGUNTA DO EGITO", W / 2, py + 43);
  textStyle(NORMAL);

  // Pergunta: altura e largura fixas, centralizadas.
  fill("#4b2e18");
  textSize(20);
  text(
    q.p,
    px + 35,
    py + 85,
    pw - 70,
    75
  );

  // Respostas de tamanho igual
  const bw = 490;
  const bh = 48;
  const bx = (W - bw) / 2;
  const inicioY = py + 190;
  const espacamento = 63;

  for (let i = 0; i < q.o.length; i++) {
    const by = inicioY + i * espacamento;

    fill("#d9aa54");
    stroke("#8b5a28");
    strokeWeight(2);
    rect(bx, by, bw, bh, 9);
    noStroke();

    fill("#4b2e18");
    textAlign(CENTER, CENTER);
    textSize(17);
    text(
      (i + 1) + ". " + q.o[i],
      bx + 12,
      by + 3,
      bw - 24,
      bh - 6
    );
  }

  fill("#4b2e18");
  textSize(13);
  text("Clique em uma opção ou use as teclas 1, 2 e 3.", W / 2, py + 407);
}

function responder(n) {
  const ehDesafio = tela === "desafio";
  const q = ehDesafio ? desafios[desafioAtual] : perguntas[perguntaAtual];

  if (n === q.c) {
    pontos += ehDesafio ? 30 : 20;
    mostrarMensagem("Resposta correta! +" + (ehDesafio ? 30 : 20) + " pontos.");
  } else {
    vidas--;
    mostrarMensagem("Resposta errada! Você perdeu uma vida.");

    if (vidas <= 0) {
      tela = "derrota";
      return;
    }
  }

  if (ehDesafio) {
    desafioAtual++;

    if (desafioAtual >= desafios.length) {
      desafiosConcluidos = true;
      tela = "piramide";

      mostrarMensagem("Desafios de conhecimento completos! Agora vem a armadilha.");
    } else {
      tela = "desafio";
    }
  } else {
    perguntaAtual++;

    if (perguntaAtual >= perguntas.length) {
      perguntasConcluidas = true;
      tela = "jogo";

      mostrarMensagem("Perguntas concluídas! Agora entre na pirâmide.");
    } else {
      tela = "pergunta";
    }
  }
}

// ------------------------------------------------------
// FASE DE ARMADILHAS
// ------------------------------------------------------

function iniciarArmadilhas() {
  tela = "armadilha";

  jogador.x = W / 2;
  jogador.y = H - 90;

  armadilhas = [];
  acertosArmadilhas = 0;
  tempoInicioArmadilhas = millis();
  tempoUltimoObstaculo = millis();

  mostrarMensagem("Desvie das pedras! Sobreviva por 20 segundos.");
}

function atualizarArmadilhas() {
  // Movimentação do jogador na arena
  moverJogador();

  // Gera pedras em intervalos regulares
  if (millis() - tempoUltimoObstaculo > 650) {
    tempoUltimoObstaculo = millis();

    armadilhas.push({
      x: random(100, 800),
      y: 70,
      raio: random(17, 27),
      velocidade: random(2.8, 4.8)
    });
  }

  for (let i = armadilhas.length - 1; i >= 0; i--) {
    const a = armadilhas[i];
    a.y += a.velocidade;

    if (dist(a.x, a.y, jogador.x, jogador.y) < a.raio + 13) {
      armadilhas.splice(i, 1);

      if (millis() > invulneravelAte) {
        vidas--;
        invulneravelAte = millis() + 900;

        mostrarMensagem("Uma pedra te atingiu!");

        if (vidas <= 0) {
          tela = "derrota";
          return;
        }
      }

      continue;
    }

    if (a.y > H + a.raio) {
      armadilhas.splice(i, 1);
      acertosArmadilhas++;
      pontos += 2;
    }
  }

  // Sobreviva por 20 segundos para concluir a etapa
  if (millis() - tempoInicioArmadilhas >= 20000) {
    armadilhasConcluidas = true;
    tela = "piramide";
    armadilhas = [];

    mostrarMensagem("Você sobreviveu às armadilhas! O tesouro está liberado.");
  }
}

function desenharArmadilhas() {
  background("#39261b");

  // Parede e piso
  noStroke();
  fill("#6c482d");
  rect(35, 35, 830, 530, 12);

  fill("#4a3020");
  rect(65, 65, 770, 470, 8);

  // Marcas no piso
  stroke("#775638");
  strokeWeight(2);

  for (let x = 100; x < 830; x += 75) {
    line(x, 70, x, 530);
  }

  noStroke();

  // Entrada e saída
  fill("#d5b16c");
  rect(370, 55, 160, 35, 6);

  fill("#4b2e18");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("ARMADILHAS", 450, 72);

  // Pedras
  for (const a of armadilhas) {
    fill("#a69a86");
    ellipse(a.x, a.y, a.raio * 2, a.raio * 2);

    fill("#766b5b");
    ellipse(a.x - 5, a.y - 4, a.raio * 0.7, a.raio * 0.7);
  }

  desenharJogador();

  const restante = max(
    0,
    ceil(20 - (millis() - tempoInicioArmadilhas) / 1000)
  );

  fill("#fff0bd");
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Sobreviva: " + restante + " segundos", 450, 115);

  fill("#fff0bd");
  textSize(14);
  text("Mova-se para desviar das pedras que caem!", 450, 555);

  desenharHUD();
}

// ------------------------------------------------------
// INVENTÁRIO E ITENS ÚTEIS
// ------------------------------------------------------

function usarItem(tipo) {
  const i = inventario.indexOf(tipo);

  if (i === -1) {
    mostrarMensagem("Você não possui esse item.");
    return;
  }

  if (tipo === "ankh") {
    if (vidas >= 3) {
      mostrarMensagem("Você já está com as vidas completas.");
      return;
    }

    vidas++;
    inventario.splice(i, 1);
    mostrarMensagem("O Ankh recuperou uma vida!");
  } else if (tipo === "papiro") {
    pontos += 15;
    inventario.splice(i, 1);
    mostrarMensagem("Dica: o Nilo era essencial para a agricultura. +15 pontos!");
  } else if (tipo === "escaravelho") {
    tempoVelocidade = millis() + 8000;
    inventario.splice(i, 1);
    mostrarMensagem("Velocidade aumentada por 8 segundos!");
  } else if (tipo === "vaso") {
    if (!dentroPiramide) {
      mostrarMensagem("O vaso só funciona dentro da pirâmide.");
      return;
    }

    for (const e of inimigos) {
      e.distracaoAte = millis() + 5000;
    }

    inventario.splice(i, 1);
    mostrarMensagem("Os guardas foram distraídos por 5 segundos!");
  } else if (tipo === "coroa") {
    pontos += 50;
    inventario.splice(i, 1);
    mostrarMensagem("A coroa valeu 50 pontos!");
  }

  tela = dentroPiramide ? "piramide" : "jogo";
}

function desenharInventario() {
  fill(30, 20, 12, 235);
  rect(150, 90, 600, 420, 16);

  fill("#ffe8a5");
  textAlign(CENTER, CENTER);
  textSize(28);
  text("INVENTÁRIO", 450, 130);

  textSize(14);
  text("Clique em um item para usar. Aperte I para fechar.", 450, 160);

  const lista = [
    ["ankh", "☥ Ankh", "Recupera uma vida"],
    ["papiro", "▤ Papiro", "Dica e 15 pontos"],
    ["escaravelho", "✦ Escaravelho", "Velocidade por 8 s"],
    ["vaso", "◉ Vaso", "Distrai guardas na pirâmide"],
    ["coroa", "♛ Coroa", "Concede 50 pontos"]
  ];

  for (let i = 0; i < lista.length; i++) {
    const y = 200 + i * 54;
    const tem = inventario.includes(lista[i][0]);

    fill(tem ? "#e4bd70" : "#6c5135");
    rect(205, y - 20, 490, 42, 8);

    fill(tem ? "#4b2e18" : "#c8b79a");
    textAlign(LEFT);
    textSize(16);

    text(
      lista[i][1] + " — " + (tem ? lista[i][2] : "não encontrado"),
      220, y
    );

    if (tem) {
      textAlign(RIGHT);
      text("USAR", 680, y);
    }
  }
}

// ------------------------------------------------------
// VITÓRIA E DERROTA
// ------------------------------------------------------

function desenharFim(vitoria) {
  background(vitoria ? "#e8ce7c" : "#6b3a27");

  fill(vitoria ? "#4b2e18" : "#fff0c2");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(38);
  text(vitoria ? "TESOURO CONQUISTADO!" : "FIM DE JOGO", 450, 170);

  textStyle(NORMAL);
  textSize(21);

  text(
    vitoria
      ? "Você superou as perguntas, os guardas e as armadilhas!"
      : "Os perigos do Egito venceram desta vez.",
    450, 235
  );

  textSize(27);
  text("Pontuação: " + pontos, 450, 300);

  botao("JOGAR NOVAMENTE", 290, 360, 320, 58);
  botao("MENU PRINCIPAL", 320, 435, 260, 55);
}

// ------------------------------------------------------
// MENSAGENS
// ------------------------------------------------------

function mostrarMensagem(msg) {
  mensagem = msg;
  mensagemAte = millis() + 2800;
}

function desenharMensagem() {
  if (!mensagem || millis() > mensagemAte) return;

  fill(45, 27, 13, 235);
  noStroke();
  rect(100, H - 60, 700, 40, 8);

  fill("#fff0c2");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(mensagem, 115, H - 40, 670, 30);
}

// ------------------------------------------------------
// NOVO JOGO
// ------------------------------------------------------

function iniciarJogo(comecar = true) {
  pontos = 0;
  vidas = 3;

  inventario = [];
  dentroPiramide = false;

  perguntasConcluidas = false;
  desafiosConcluidos = false;
  armadilhasConcluidas = false;
  tesouroDesbloqueado = false;

  perguntaAtual = 0;
  desafioAtual = 0;

  invulneravelAte = 0;
  tempoVelocidade = 0;

  mensagem = "";
  teclas = {};
  armadilhas = [];

  jogador = {
    x: 450,
    y: 500,
    velocidade: 3.4
  };

  itens = [
    {
      x: 180, y: 420, tipo: "ankh",
      nome: "Ankh", simbolo: "☥",
      cor: "#3e9a70", pego: false
    },
    {
      x: 335, y: 470, tipo: "papiro",
      nome: "Papiro", simbolo: "▤",
      cor: "#f6e2a0", pego: false
    },
    {
      x: 535, y: 410, tipo: "escaravelho",
      nome: "Escaravelho", simbolo: "✦",
      cor: "#337c91", pego: false
    },
    {
      x: 610, y: 470, tipo: "vaso",
      nome: "Vaso", simbolo: "◉",
      cor: "#b95c36", pego: false
    },
    {
      x: 815, y: 420, tipo: "coroa",
      nome: "Coroa", simbolo: "♛",
      cor: "#d6a321", pego: false
    }
  ];

  inimigos = criarGuardas(false);

  if (comecar) {
    tela = "jogo";
  }
}

// ------------------------------------------------------
// TECLADO
// ------------------------------------------------------

function keyPressed() {
  const k = key.toLowerCase();
  teclas[k] = true;

  if (keyCode === UP_ARROW) teclas["ArrowUp"] = true;
  if (keyCode === DOWN_ARROW) teclas["ArrowDown"] = true;
  if (keyCode === LEFT_ARROW) teclas["ArrowLeft"] = true;
  if (keyCode === RIGHT_ARROW) teclas["ArrowRight"] = true;

  if (k === "e" && (tela === "jogo" || tela === "piramide")) {
    interagir();
  }

  if (k === "i") {
    if (tela === "inventario") {
      tela = dentroPiramide ? "piramide" : "jogo";
    } else if (tela === "jogo" || tela === "piramide") {
      tela = "inventario";
    }
  }

  if (keyCode === ESCAPE) {
    if (tela === "inventario") {
      tela = dentroPiramide ? "piramide" : "jogo";
    } else if (tela === "instrucoes") {
      tela = "menu";
    }
  }

  if (tela === "inventario" && ["1", "2", "3", "4", "5"].includes(key)) {
    usarItem(["ankh", "papiro", "escaravelho", "vaso", "coroa"][Number(key) - 1]);
  }

  if ((tela === "pergunta" || tela === "desafio") &&
      ["1", "2", "3"].includes(key)) {
    responder(Number(key) - 1);
  }

  return false;
}

function keyReleased() {
  teclas[key.toLowerCase()] = false;

  if (keyCode === UP_ARROW) teclas["ArrowUp"] = false;
  if (keyCode === DOWN_ARROW) teclas["ArrowDown"] = false;
  if (keyCode === LEFT_ARROW) teclas["ArrowLeft"] = false;
  if (keyCode === RIGHT_ARROW) teclas["ArrowRight"] = false;
}

// ------------------------------------------------------
// CLIQUES DO MOUSE
// ------------------------------------------------------

function mousePressed() {
  if (tela === "menu") {
    if (mouseX >= 300 && mouseX <= 600 &&
        mouseY >= 235 && mouseY <= 297) {
      iniciarJogo(true);
    } else if (mouseX >= 300 && mouseX <= 600 &&
               mouseY >= 315 && mouseY <= 377) {
      tela = "instrucoes";
    }
  } else if (tela === "instrucoes") {
    if (mouseX >= 330 && mouseX <= 570 &&
        mouseY >= 500 && mouseY <= 552) {
      tela = "menu";
    }
  } else if (tela === "pergunta" || tela === "desafio") {
    const bw = 490;
    const bh = 48;
    const bx = (W - bw) / 2;
    const inicioY = 85 + 190;

    for (let i = 0; i < 3; i++) {
      const by = inicioY + i * 63;

      if (mouseX >= bx && mouseX <= bx + bw &&
          mouseY >= by && mouseY <= by + bh) {
        responder(i);
        break;
      }
    }
  } else if (tela === "inventario") {
    for (let i = 0; i < 5; i++) {
      const y = 200 + i * 54;

      if (mouseX >= 205 && mouseX <= 695 &&
          mouseY >= y - 20 && mouseY <= y + 22) {
        usarItem(["ankh", "papiro", "escaravelho", "vaso", "coroa"][i]);
        break;
      }
    }
  } else if (tela === "vitoria" || tela === "derrota") {
    if (mouseX >= 290 && mouseX <= 610 &&
        mouseY >= 360 && mouseY <= 418) {
      iniciarJogo(true);
    } else if (mouseX >= 320 && mouseX <= 580 &&
               mouseY >= 435 && mouseY <= 490) {
      iniciarJogo(false);
      tela = "menu";
    }
  }
}
