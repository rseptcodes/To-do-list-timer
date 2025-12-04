// Objeto relacionado à troca de modos
const modosSwitch = {
  botaoTrocar: null,
  titulo: null,
  header: null,
  modoAtual: null,
  // cria o header
  criarHeader() {
  	this.header = document.createElement("div");
  	this.header.className = "header";
  	document.getElementById("moldura").appendChild(this.header);
    this.titulo = document.createElement("h1");
    this.titulo.className = "titulo";
    this.titulo.id = "titulo";
    this.header.appendChild(this.titulo);
    this.botaoTrocar = document.createElement("button");
    this.botaoTrocar.classList.add("botaoTrocar");
    this.botaoTrocar.innerHTML = `<i class="fa-solid fa-clock"></i>`;
    this.header.appendChild(this.botaoTrocar);
    
  // botao para trocar os modos
modosSwitch.botaoTrocar.addEventListener("click", async () => {
	await modoNotas.gerenciarOpacidadeNotasUI();
	await modoTimer.gerenciarOpacidadeTimerUI();
	if(modoNotas.listaNotas.classList.contains("oculto"))
      modosSwitch.mudarTitulo("Timer");
    else
      modosSwitch.mudarTitulo("Notas");
});

  },
  // função que muda o titulo
  mudarTitulo(texto) {
    if (this.titulo) this.titulo.innerText = texto;
  },
  // inicia o modo
  iniciarModo(modoAtual){
  	this.modoAtual = modoAtual;
  	if (modoNotas.listaNotas === null) modoNotas.criarUINotas();
  	if (modoTimer.visorP === null) modoTimer.criarUITimer();
  	if(this.modoAtual === "modoNotas"){
  		modoTimer.gerenciarOpacidadeTimerUI();
  		modosSwitch.mudarTitulo("Notas");
  	} else if (this.modoAtual === "modoTimer") {
  		modoNotas.gerenciarOpacidadeNotasUI();
  		modosSwitch.mudarTitulo("Timer");
  	}
  }
};
// objeto do modo de notas
const modoNotas = {
	criarUINotas(){
	this.botaoDeCriacao = document.createElement("button");
	this.botaoDeCriacao.className = "botaoDeCriacao";
    this.botaoDeCriacao.id = "botaoDeCriacao";
    this.botaoDeCriacao.innerHTML = '<i class="fa-solid fa-pen"></i>';
    document.getElementById("moldura").appendChild(this.botaoDeCriacao);
    if (modoNotas.botaoDeCriacao)modoNotas.botaoDeCriacao.addEventListener("click", () => {
  ativarOInput();
  botaoDeCriacaoEmFocus(this.botaoDeCriacao);
});
    this.listaNotas = document.createElement("div");
    this.listaNotas.className = "listaNotas";
    this.listaNotas.id = "listaNotas";
    document.getElementById("moldura").appendChild(this.listaNotas);
    renderizarNotasSalvas();
    this.atualizarMensagemVazio();
	},
	async gerenciarOpacidadeNotasUI() {
  const elementos = [
    this.botaoDeCriacao,
    this.listaNotas,
    this.mensagemVazio
  ];

  for (const el of elementos) {
  	if (!el) return;
    await gerenciarAnimacao(el);
  	el?.classList.toggle("oculto");
  }
},
	mensagemVazio: null,
	criarMensagemVazio(){
		if (this.mensagemVazio !== null) return;
		this.mensagemVazio = document.createElement("p");
		this.listaNotas.appendChild(this.mensagemVazio),
		this.mensagemVazio.className = "mensagemVazio";
	  this.mensagemVazio.id = "mensagemVazio";
	  this.mensagemVazio.innerText = "Não ha nada aqui.";
	},
	atualizarMensagemVazio(){
		if(this.notasArray.length === 0){
			this.criarMensagemVazio();
		} else {
			this.mensagemVazio?.remove();
			this.mensagemVazio = null;
		}
	},
	botaoDeCriacao: null,
	listaNotas: null,
	notasArray: [],
	ultimoIndexSalvo: null
};
// cria o header e inicia o modo quando a pagina carregar
window.addEventListener("DOMContentLoaded", () => {
	modosSwitch.criarHeader();
  modosSwitch.iniciarModo("modoNotas");
});
// objeto do modo timer
const modoTimer = {
  numeroTimer: null,
  VisorUI: null,
  visorP: null,
  botaoDiv: null,
  timestampDiv: null,

  criarUITimer() {
    const criarVisorTimer = () => {
      if (this.VisorUI !== null) return;
      this.VisorUI = document.createElement("div");
      this.VisorUI.className = "visorTimer";
      moldura.appendChild(this.VisorUI);
      this.visorP = document.createElement("p");
      this.visorP.className = "visorP";
      this.VisorUI.appendChild(this.visorP);
      this.botaoDiv = document.createElement("div");
      this.botaoDiv.className = "botaoDiv";
      moldura.appendChild(this.botaoDiv);
      this.timestampDiv = document.createElement("div");
      this.timestampDiv.className = "timestampDiv";
      moldura.appendChild(this.timestampDiv);
      this.atualizarNumeroTimer(0);
    };

    criarVisorTimer();
  },
  async gerenciarOpacidadeTimerUI() {
  const elementos = [
    this.VisorUI,
    this.visorP,
    this.botaoDiv,
    this.timestampDiv
  ];

  for (const el of elementos) {
  	if (!el) return;
    await gerenciarAnimacao(el);
  	el?.classList.toggle("oculto");
  }
},
   inicio: null,
   agora: null,
   segundos: null,
   minutos: null,
   formatado: null,
   timerInterval: null,
   pauseInterval: null,
   segundos_pausados: 0,
   rodando: null,
  timer(){
	this.inicio = performance.now() - (this.segundos_pausados * 1000);
	this.timerInterval = setInterval(() => {
	this.agora = performance.now();
	this.segundos = (this.agora - this.inicio) / 1000;
	this.formatado = Math.floor(this.segundos);
	this.atualizarNumeroTimer(this.formatado);
	},1000);
	this.rodando = true;
	if (this.segundos_pausados === 0) this.timestampInfo();
},
  reset() {
   clearInterval(this.timerInterval);
   this.inicio = null;
   this.agora = null;
   this.segundos = null;
   this.formatado = null;
   this.segundos_pausados = 0;
   this.atualizarNumeroTimer(0);
   this.rodando = false;
	},
	pause() {
		this.segundos_pausados = this.formatado;
		this.atualizarNumeroTimer(this.segundos_pausados);
		this.formatado = this.segundos_pausados;
		clearInterval(this.timerInterval);
		this.rodando = false;
	},
	resume(){
		this.timer(this.segundos_pausados);
	},
  atualizarNumeroTimer(numero) {
  	let minutos;
  	minutos = Math.floor(numero / 60);
    let minutosF = String(minutos).padStart(2, "0");
    numero = numero % 60;
    let numeroF = String(numero).padStart(2, "0");
    this.visorP.innerText = minutosF + ":" + numeroF;
  },
  async timestampInfo(){
  	const timestampInfo = document.createElement("p");
  	timestampInfo.className = "timestampInfo";
  	timestampInfo.innerText = "Deslize para a direita para criar um timestamp";
  	this.timestampDiv.appendChild(timestampInfo);
  	await delay(3000);
  	timestampInfo.offsetHeight;
  	timestampInfo.className = "timestampInfoFadeOut";
  	await delay(1000);
  	timestampInfo.remove();
  },
};
// funcao que cria os botoesTimer
async function criarBotaoTimer(acao){
	if (!modoTimer.botaoDiv){
		await delay(0);
	}
	const botaoTimer = document.createElement("button");
	botaoTimer.classList.add("botaoTimer", acao);
	modoTimer.botaoDiv.appendChild(botaoTimer);
	botaoTimer.innerText = acao;
	botaoTimer.addEventListener("click",() => {
  definirFuncoes(botaoTimer, acao);
  navigator.vibrate(2);
	});
	atualizarBotao("resetado");
}
// define a funcao dos botoesTimer
function definirFuncoes(el, acao){
			if (acao === "pause"){
			if(modoTimer.rodando) {
				modoTimer.pause();
				el.innerText = "resume";
				atualizarBotao("pause");
				} else {
				modoTimer.resume();
				el.innerText = "pause";
				atualizarBotao("pause");
				}
		} else if (acao === "iniciar") {
			if (!modoTimer.rodando) {
				modoTimer.timer();
				atualizarBotao("rodando");
		} 
		} else if (acao === "reset") {
			modoTimer.reset();
			atualizarBotao("resetado")
		}
}
// minimiza ou amplia
function atualizarBotao(estado){
	const botaoIniciar = document.querySelector(".iniciar");
	const botaoPause = document.querySelector(".pause");
	const botaoReset = document.querySelector(".reset");
	if (estado === "rodando") {
		botaoIniciar.classList.add("minimizado", "piscando")
		botaoPause.classList.remove("minimizado");
		botaoReset.classList.remove("minimizado");
		botaoIniciar.innerText = "";
		botaoPause.innerText = "pause";
		botaoReset.innerText = "reset";
	} else if (estado === "resetado"){
		botaoIniciar.classList.remove("minimizado")
		botaoPause.classList.add("minimizado");
		botaoReset.classList.add("minimizado");
		botaoIniciar.innerText = "iniciar";
		botaoPause.innerText = "";
		botaoReset.innerText = "";
		limparTimestamps();
	} else if (estado === "pause"){
		botaoIniciar.classList.toggle("piscando")
	}
}
criarBotaoTimer("pause");
criarBotaoTimer("iniciar");
criarBotaoTimer("reset");

// funcoes relacionados a marcação do tempo
function criarTimestamp(){
	if (!modoTimer.rodando) return;
	const timestamp = document.createElement("div");
	const volta = modoTimer.visorP.innerText;
	const qtd = modoTimer.timestampDiv.children.length;
	timestamp.innerText = qtd + "          " + "|" + "          " + volta;
	modoTimer.timestampDiv.appendChild(timestamp);
	timestamp.className = "timestamp";
	navigator.vibrate(20);
} 
async function limparTimestamps() {
  const timestamps = [...modoTimer.timestampDiv.children];
  const velocidade = Math.max(80, 500 - timestamps.length * 35);
for (let i = timestamps.length - 1; i >= 0; i--) {
  const tsChild = timestamps[i];
  tsChild.classList.add("desaparecer");
  await delay(velocidade);
  tsChild.remove();
}
}

// funcao relacionado ao touch
async function verificarDeslizamentoHorizontal(elemento){
	await delay(0);
  const distancia = 80;
  let inicio = 0;

  elemento.addEventListener("touchstart", (e) => {
    inicio = e.touches[0].clientX;
  });

  elemento.addEventListener("touchend", (e) => {
    const fim = e.changedTouches[0].clientX;
    const diff = fim - inicio;

    if (diff >= distancia) {
      criarTimestamp();
    }
  });
}
verificarDeslizamentoHorizontal(moldura);

function ativarOInput(index){
  modoNotas.ultimoIndexSalvo = (typeof index === "number") ? index : modoNotas.ultimoIndexSalvo;

  if (document.querySelector(".inputNotas")){
    let textoInput = document.querySelector(".inputNotas").value.trim();
    if (textoInput === ""){
      textoInput = "Nova nota";
    }
    fecharOInput(textoInput);
    return;
  }

  const inputNotas = document.createElement("textarea");
  inputNotas.placeholder = "Nova nota";
  inputNotas.classList.add("inputNotas");
  document.getElementById("moldura").appendChild(inputNotas);
  focusInput(inputNotas);
}
function focusInput(input){
  input.focus();
  
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return;
  
  setTimeout(() => {
    input.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
}

function botaoDeCriacaoEmFocus(el){
	el.classList.toggle("focus");
	if(el.classList.contains ("focus")) el.innerHTML = '<i class="fa-solid fa-check"></i>'; else {
		this.botaoDeCriacao.innerHTML = '<i class="fa-solid fa-pen"></i>';
	}
}
function fecharOInput(texto){
  if (document.querySelector(".inputNotas")){
    document.querySelectorAll(".inputNotas").forEach(el => el.remove());
  }

  const index = modoNotas.ultimoIndexSalvo;
  const nota = salvarTextoEmArray(texto, index);
  renderizarNotas(nota, index);
  modoNotas.ultimoIndexSalvo = null;
}
function salvarTextoEmArray(texto, index){
  const nota = { id: gerarId(), text: texto };
  if (typeof index === "number" && index >= 0) {
    modoNotas.notasArray.splice(index, 0, nota);
  } else {
    modoNotas.notasArray.push(nota);
  }
  localStorage.setItem("notasArray", JSON.stringify(modoNotas.notasArray));
  return nota;
}
function gerarId(){
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}
async function renderizarNotas(item, index){
  const isObj = typeof item === "object" && item !== null;
  const texto = isObj ? item.text : item;
  let id = isObj ? item.id : undefined;
  if (!id) id = gerarId();

  const notaDiv = document.createElement("div");
  notaDiv.classList.add("notaDiv");

  const notaFundo = document.createElement("div");
  notaFundo.classList.add("notaFundo");
  notaFundo.innerText = texto;
  notaFundo.dataset.id = id; 

  const botaoLixeira = criarbotaoLixeira(notaDiv, id);
  verificarToque(notaFundo, id);
  notaFundo.addEventListener("click", () => {
    trocarClassebotaoLixeira(botaoLixeira);
    notaFundo.classList.toggle("mini");
  });
  notaDiv.appendChild(notaFundo);
  if (typeof index === "number" && index >= 0 && index < modoNotas.listaNotas.children.length) {
    modoNotas.listaNotas.insertBefore(notaDiv, modoNotas.listaNotas.children[index]);
  } else {
    modoNotas.listaNotas.appendChild(notaDiv);
  }

  if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
  efeitoFadeInNota(notaDiv);
}
function verificarToque(el,id) {
  let startTouchTime = 0;
  let holdTimer;
  el.addEventListener("touchstart", () => {
    startTouchTime = performance.now();

    holdTimer = setTimeout(() => {
      el.classList.add("balançando");
      navigator.vibrate(30);
    }, 1200); 
  });

  el.addEventListener("touchend", () => {
    const duration = performance.now() - startTouchTime;
    clearTimeout(holdTimer);

    if (duration > 500 && el.classList.contains("balançando")) {
      el.classList.remove("balançando");
      editarNota(el, id);
    }
  });
}
// funcao de editar a nota
async function editarNota(el, id){
  if (document.querySelector(".inputNotas")) return;
  const index = modoNotas.notasArray.findIndex(n => n.id === id);
  console.log("editar -> index encontrado:", index);
  modoNotas.ultimoIndexSalvo = index;
  const notaPApagar = document.querySelector(`[data-id="${id}"]`);
  if (notaPApagar) {
    const notaDiv = notaPApagar.parentElement;
    efeitoFadeOutNota(notaDiv);
    await delay(200);
  }
  await apagarNotas(id);
  ativarOInput();

  botaoDeCriacaoEmFocus(modoNotas.botaoDeCriacao);
}

// efeitos
async function efeitoFadeInNota(el){
	el.classList.add("notaFadeIn");
	await delay(100);
	el.classList.remove("notaFadeIn");
}
async function efeitoFadeOutNota(el){
	el.classList.add("notaFadeOut");
}

async function apagarNotas(id){
  const index = modoNotas.notasArray.findIndex(n => n.id === id);
  if (index !== -1) modoNotas.notasArray.splice(index, 1);
  localStorage.setItem("notasArray", JSON.stringify(modoNotas.notasArray));

  const notaPApagar = document.querySelector(`[data-id="${id}"]`);
  if (!notaPApagar) {
    if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
    return;
  }
  const notaDivPApagar = notaPApagar.parentElement;
  efeitoFadeOutNota(notaDivPApagar);
  await delay(500);
  if (notaDivPApagar) notaDivPApagar.remove();
  if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
}
function criarbotaoLixeira(local, id){
	const botaoLixeira = document.createElement("button");
botaoLixeira.classList.add("botaoLixeira", "oculto");
botaoLixeira.innerHTML = '<i class="fa-solid fa-trash"></i>';
	local.appendChild(botaoLixeira);
	botaoLixeira.addEventListener("click", (e) => {
		e.stopPropagation();
		apagarNotas(id);
	});
	return botaoLixeira;
}
async function trocarClassebotaoLixeira(item){
	item.classList.toggle("oculto");
}
function renderizarNotasSalvas(){
  modoNotas.notasArray = JSON.parse(localStorage.getItem("notasArray") || "[]");
  modoNotas.notasArray.forEach((item, index) => {
    renderizarNotas(item, index);
  });
}

// funcoes relacionadas à animacao em geral
function delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
}
async function animarEntrada(el){
	el.classList.add("aparecer");
	await delay(700);
	el.classList.remove("aparecer");
}
async function animarSaida(el){
	el.classList.add("desaparecer");
	await delay(700);
	el.classList.remove("desaparecer");
}
function gerenciarAnimacao(el){
  if(el?.classList.contains("oculto")) {
    animarEntrada(el);
  } else {
    animarSaida(el);
  }
}
