// Objeto relacionado à troca de modos
const modosSwitch = {
  botaoTrocar: null,
  botaoTema: null,
  titulo: null,
  header: null,
  modoAtual: null,
  temaAtual: "white",
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
    this.botaoTema = document.createElement("button");
    this.botaoTema.className = "botaoTrocar";
    this.header.appendChild(this.botaoTema);
    this.botaoTema.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    
  // botao para trocar os modos
modosSwitch.botaoTrocar.addEventListener("click", async () => {
	await modoNotas.gerenciarOpacidadeNotasUI();
	await modoTimer.gerenciarOpacidadeTimerUI();
	if(modoNotas.listaNotas.classList.contains("oculto")) {
      modosSwitch.mudarTitulo("Timer");
      modosSwitch.modoAtual = "modoTimer";
      visorUI.tipUI();
      if (nowBar.element){
      	nowBar.esconder();
      }
    } else {
      modosSwitch.mudarTitulo("Notas");
      modosSwitch.modoAtual = "modoNotas";
      if (timerConfig.rodando && modosSwitch !== modoTimer) nowBar.mostrarNoCentro();
    }
});
  // funcao para indentificar o tema atual e salvar em localStorage
modosSwitch.botaoTema.addEventListener("click", () => {
	modosSwitch.trocarTema();
});
  },
atualizarBotaoTema(temaAtual){
	if (temaAtual === "dark"){
		this.botaoTema.innerHTML = `<i class="fa-solid fa-sun"></i>`;
	} else {
		this.botaoTema.innerHTML = `<i class="fa-solid fa-moon"></i>`;
	}
},
  trocarTema(){
  if (this.temaAtual === "dark"){
  	document.body.removeAttribute("data-theme");
  	this.temaAtual = "white";
  } else {
  	document.body.setAttribute("data-theme", "dark");
  	this.temaAtual = "dark";
  }
  localStorage.setItem("tema", this.temaAtual);
  modosSwitch.atualizarBotaoTema(this.temaAtual);
  },
carregarTema(){
	this.temaAtual = localStorage.getItem("tema");
	if (this.temaAtual === "dark"){
		document.body.setAttribute("data-theme", "dark");
	} else {
		document.body.removeAttribute("data-theme");
	}
	modosSwitch.atualizarBotaoTema(this.temaAtual);
	},
  // função que muda o titulo
  mudarTitulo(texto){
    if (this.titulo) this.titulo.innerText = texto;
  },
  // inicia o modo
  iniciarModo(modoAtual){
  	this.modoAtual = modoAtual;
  	if (modoNotas.listaNotas === null) modoNotas.criarUINotas();
  	if (visorUI.visorP === null) modoTimer.criarUITimer();
  	if(this.modoAtual === "modoNotas"){
  		modoTimer.gerenciarOpacidadeTimerUI();
  		modosSwitch.mudarTitulo("Notas");
  	} else if (this.modoAtual === "modoTimer") {
  		modoNotas.gerenciarOpacidadeNotasUI();
  		modosSwitch.mudarTitulo();
  	}
  	modosSwitch.carregarTema();
  }
};
// objeto do modo de notas
const modoNotas = {
	criarUINotas(){
	this.botaoDeCriacao = document.createElement("button");
	this.botaoDeCriacao.className = "footerButton";
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
  	if (!el) continue;
    await gerenciarAnimacao(el);
  	el?.classList.toggle("oculto");
  }
  if (this.mensagemVazio) {
  	this.mensagemVazio.classList.toggle("oculto");
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
// objeto do visor
const visorUI = {
	VisorUI: null,
  visorP: null,
  switchT: null,
  primeiraVez: true,
  iconesDoSwitch: '<i class="fa-solid fa-stopwatch" aria-hidden="true"></i> <i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>',
  visorUIState: "hidden",
  // pode ser hidden ou reveal.
  criar(){
      if (this.VisorUI !== null) return;
      this.VisorUI = document.createElement("div");
      this.VisorUI.classList.add("visorTimer");
      moldura.appendChild(this.VisorUI);
      this.visorP = document.createElement("p");
      this.visorP.className = "visorP";
      this.VisorUI.appendChild(this.visorP);
      timerConfig.mostrar("visorP");
       this.gerenciarSwitchModoTimer();
       
     this.VisorUI.addEventListener("click", (e) => {
  if (e.target !== this.switchT && !this.switchT?.contains(e.target)) {
  	if (timerConfig.rodando) return;
  	navigator.vibrate(1);
    this.gerenciarEstadoVisorUI();
  }
});
},
gerenciarSwitchModoTimer(){
	//  switch ira servir para trocar a funcao do timer, podendo ser cronometro ou alarme.
	this.switchT = document.createElement("button");
	this.switchT.classList.add("switch");
      this.VisorUI.appendChild(this.switchT);
     	this.switchT.innerHTML = this.iconesDoSwitch;
     	this.switchT.addEventListener("click",(e) => {
     		e.stopPropagation();
		this.switchT.classList.toggle("switch--ativo");
		navigator.vibrate(2);
		timerConfig.configSwitch();
			console.log(timerConfig.config)
	});
},
gerenciarEstadoVisorUI(){
	if (this.visorUIState === "reveal"){
		this.hide();
	} else {
		this.reveal();
	}
},
reveal(){
	if(this.switchT === null) this.gerenciarSwitchModoTimer();
	this.VisorUI.classList.add("visorTimer--reveal");
	this.visorUIState = "reveal";
	this.switchT.classList.add("switch--reveal")
},
hide(){
	if(this.switchT === null) this.gerenciarSwitchModoTimer();
	this.VisorUI.classList.remove("visorTimer--reveal");
  this.switchT.classList.remove("switch--reveal")
	this.visorUIState = "hidden";
},
// o usuario nao sabe de forma clara que existe esse switch, entao, para despertar a curiosidade (e curiosidade leva a clique) eu decidi fazer uma "dica" ao criar a UI
async tipUI(){
	//irei adicionar mais coisas aqui (como vibracao e uma animacao por exemplo,mas por enquanto é experimental
	if (!this.primeiraVez) return;
	await delay(1000)
	this.reveal();
	await delay(2100);
	this.hide();
	this.primeiraVez = false;
	console.log("rodou");
}
}

// objeto do modo timer
const modoTimer = {
  numeroTimer: null,
  botaoDiv: null,
  timestampDiv: null,
  criarUITimer() {
  	visorUI.criar();
      this.botaoDiv = document.createElement("div");
      this.botaoDiv.className = "botaoDiv";
      moldura.appendChild(this.botaoDiv);
      this.timestampDiv = document.createElement("div");
      this.timestampDiv.className = "timestampDiv";
      moldura.appendChild(this.timestampDiv);
  },
  async gerenciarOpacidadeTimerUI() {
  const elementos = [
    visorUI.VisorUI,
    visorUI.visorP,
    this.botaoDiv,
    this.timestampDiv
  ];

  for (const el of elementos) {
  	if (!el) continue;
    await gerenciarAnimacao(el);
  	el?.classList.toggle("oculto");
  }
},
  // indica a funcao de criarTimestamp
  async timestampInfo(){
  	if (document.body.querySelector(".timestampInfo")) return;
  	const timestampInfo = document.createElement("p");
  	timestampInfo.className = "timestampInfo";
  	timestampInfo.innerText = "Deslize para a direita para criar um timestamp";
  	this.timestampDiv.appendChild(timestampInfo);
  	await delay(3000);
  	timestampInfo.offsetHeight;
  	timestampInfo.classList.add( "timestampInfoFadeOut");
  	await delay(1000);
  	timestampInfo?.remove();
  },
  // funcoes relacionados a marcação do tempo
criarTimestamp(){
	if (!timerConfig.rodando || timerConfig.config === "timer") return;
	const timestamp = document.createElement("div");
	const volta = visorUI.visorP.innerText;
	const qtd = document.body.querySelectorAll(".timestamp").length + 1;
	timestamp.innerText = qtd + "          " + "|" + "          " + volta;
	this.timestampDiv.appendChild(timestamp);
	timestamp.className = "timestamp";
	navigator.vibrate(20);
	console.log([...modoTimer.timestampDiv.children].map(el => el.className));
},
async limparTimestamps() {
  const timestamps = [...this.timestampDiv.children];
  const velocidade = Math.max(80, 500 - timestamps.length * 35);
for (let i = timestamps.length - 1; i >= 0; i--) {
  const tsChild = timestamps[i];
  tsChild.classList.add("desaparecer");
  await delay(velocidade);
  tsChild.remove();
}
},
};
// funcoes relacionadas ao timer
const timerConfig = {
	inicioDoTimer: null,
  agora: null,
  segundos: null,
  minutos: null,
  numeroFormatado: null,
  timerInterval: null,
  pauseInterval: null,
  segundos_pausados: 0,
  rodando: null,
  config: "stopwatch", // pode ser stopwatch ou timer
  segundosTotais: 10, // pra testes
  segundosRestantes: null,
  configSwitch(){
  	this.config = (this.config === "stopwatch") ? "timer" : "stopwatch";
  },
  rodarTimer(){
  if(this.timerInterval) return;
  this.inicioDoTimer = performance.now() - (this.segundos_pausados * 1000);
  this.rodando = true;
  if (visorUI.visorUIState === "reveal") visorUI.hide();
  if (this.segundos_pausados === 0 && this.config !== "timer"){
		modoTimer.timestampInfo();
  }
  this.timerInterval = setInterval(() => {
	this.agora = performance.now();
	this.segundos = (this.agora - this.inicioDoTimer) / 1000;
	this.configurar(this.config);
	},250);
  },
  configurar(){
		nowBar.criar();
  	if (this.config === "stopwatch"){
  	this.mostrar("visorP", this.segundos)
  	this.mostrar("nowBar", this.segundos)
  	} else if (this.config === "timer"){
   if (this.segundosRestantes === null) this.segundosRestantes = this.segundosTotais
   this.verificarTimerEnd();
   this.segundosRestantes = Math.ceil(this.segundosTotais - this.segundos);
   this.mostrar("visorP", this.segundosRestantes)
   this.mostrar("nowBar", this.segundosRestantes)
  	}
  },
  verificarTimerEnd(){
  if (this.segundosRestantes <= 0){
    this.reset();
    atualizarBotao("resetado");
  }
  // meio inutil ainda, rever dps
  },
  reset() {
   clearInterval(this.timerInterval);
   this.timerInterval = null;
   this.inicioDoTimer = null;
   this.agora = null;
   this.segundos = null;
   this.minutos = null;
   this.segundos_pausados = 0;
   this.mostrar("visorP", this.segundos)
   this.rodando = false;
   this.numeroFormatado = null,
   this.segundosRestantes = null;
   nowBar.deletar();
	},
	pause() {
		this.segundos_pausados = this.segundos;
		this.mostrar(this.segundos_pausados);
		this.segundos = this.segundos_pausados;
		clearInterval(this.timerInterval);
		this.timerInterval = null;
		this.rodando = false;
	},
	resume(){
		this.rodarTimer();
	},
	formatar(segundos){
  const minutos = Math.trunc(segundos / 60);
  const minsStr = String(minutos).padStart(2, "0");
  const segs = Math.trunc(segundos % 60);
  const segsStr = String(segs).padStart(2, "0");
  this.numeroFormatado = minsStr + ":" + segsStr;
},
	mostrar(local,segundos){
	if(!this.rodando) {
		visorUI.visorP.innerText = "00:00"
		return;
	}
	this.formatar(segundos);
	if(local === "visorP") {
		if(segundos !== null) {
			visorUI.visorP.innerText = this.numeroFormatado; 
			} else {
				visorUI.visorP.innerText = "00:00"
			}
	} else if (local === "nowBar") {
		nowBar.atualizarNowBar();
	}
	},
}
//funcoes relacionadas á nowBar
const nowBar = {
  	element: null,
  	isVisible: false,
  	estado: "oculto",
  	// estados possiveis: centro, minimizado e oculto.
  	timeoutId: null,
  	primeiraVez: true,
  	criar(){
  		if (this.element) return;
  		this.element = document.createElement("div");
     	this.element.className = "nowBar";
	modosSwitch.header.appendChild(this.element);
  	},
  	mostrarNoCentro(){
  		if(!this.primeiraVez){
  			this.mostrarMinimizado();
  			return;
  		}
  		if (!this.element) this.criar();
  		if (this.timeoutId) {
  			clearTimeout(this.timeoutId);
  		}
  		this.element.classList.remove("nowBar--oculto");
  		this.element.classList.remove("nowBar--minimizado");
  		this.element.classList.add("nowBar--centro");
  		this.isVisible = true;
  		this.estado = "centro";
  		this.timeoutId = setTimeout(() => {
  			if (this.estado === "centro"){
  			this.mostrarMinimizado();
  			this.primeiraVez = false;
  			}
  		},5000);
  	},
  	mostrarMinimizado(){
  		if (!this.element) this.criar();
  		this.element.classList.remove("nowBar--oculto");
  		this.element.classList.add("nowBar--minimizado");
  		this.element.classList.remove("nowBar--centro");
  		this.estado = "minimizado";
  		this.isVisible = true;
  	},
  	esconder(){
  		if (!this.isVisible || !this.element) return;
  		this.element.classList.add("nowBar--oculto");
  		this.element.classList.remove("nowBar--minimizado");
  		this.element.classList.remove("nowBar--centro");
  		this.estado = "oculto";
  		this.isVisible = false;
  		},
  	atualizarNowBar(){
  		if (!this.isVisible || !this.element) return;
  		const texto = visorUI.visorP.innerText;
  		this.element.innerText = texto;
  	},
  	deletar(){
  	if (!this.element) return;
  	this.esconder();
  	this.primeiraVez = true;
  	if (this.timeoutId) {
  		clearTimeout(this.timeoutId);
  		this.timeoutId = null;
  	}
  	setTimeout(() => {
    if (this.element && this.element.parentNode) {
	this.element.remove();
	this.element = null;
	this.isVisible = false;
	this.estado = "oculto";
	console.log("NowBar removida");
  	}
  	}, 300);
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
			if(timerConfig.rodando) {
				timerConfig.pause();
				el.innerText = "resume";
				atualizarBotao("pause");
				} else {
				timerConfig.resume();
				el.innerText = "pause";
				atualizarBotao("pause");
				}
		} else if (acao === "iniciar") {
			if (!timerConfig.rodando) {
				timerConfig.rodarTimer();
				atualizarBotao("rodando");
		} 
		} else if (acao === "reset") {
			timerConfig.reset();
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
		modoTimer.limparTimestamps();
	} else if (estado === "pause"){
		botaoIniciar.classList.toggle("piscando")
	}
}
criarBotaoTimer("pause");
criarBotaoTimer("iniciar");
criarBotaoTimer("reset");

// funcao relacionado ao deslizamento horizontal para criarTimestamp

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
      modoTimer.criarTimestamp();
    }
  });
}
verificarDeslizamentoHorizontal(moldura);

function ativarOInput(index, placeholder){
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
  if (!placeholder) {
  	inputNotas.placeholder = "Nova nota";
  } else {
  	inputNotas.value = placeholder;
  	inputNotas.placeholder = placeholder;
  }
  inputNotas.classList.add("inputNotas");
  document.getElementById("moldura").appendChild(inputNotas);
  focusInput(inputNotas);
}
function focusInput(input){
  input.focus();
  inputOverlay();
  // se for mobile deixa o input visivel
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return;
  
  setTimeout(() => {
    input.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
}
// efeito visual para tornar mais dinamico
function botaoDeCriacaoEmFocus(el){
	el.classList.toggle("footerButton--focus");
	if(el.classList.contains ("footerButton--focus")) el.innerHTML = '<i class="fa-solid fa-check"></i>'; else {
		this.botaoDeCriacao.innerHTML = '<i class="fa-solid fa-pen"></i>';
	}
}
// fecha o input e guarda o texto
function fecharOInput(texto){
  if (document.querySelector(".inputNotas")){
    document.querySelectorAll(".inputNotas").forEach(el => el.remove());
  }
  deletarOverlay();
  const index = modoNotas.ultimoIndexSalvo;
  const nota = salvarTextoEmArray(texto, index);
  renderizarNotas(nota, index);
  modoNotas.ultimoIndexSalvo = null;
}
//salva o texto em array e envia ao localstorage para renderizar
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

//gera id
function gerarId(){
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

// renderiza notas no dom
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
// funcao para verificar o toque para editar notas.
function verificarToque(el,id) {
  let startTouchTime = 0;
  let holdTimer;
  el.addEventListener("touchstart", () => {
    startTouchTime = performance.now();

    holdTimer = setTimeout(() => {
      el.classList.add("balançando");
      navigator.vibrate(30);
    }, 800);
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
  const textoPlaceholder = modoNotas.notasArray[index].text
  console.log("editar -> index encontrado:", index);
  modoNotas.ultimoIndexSalvo = index;
  const notaPApagar = document.querySelector(`[data-id="${id}"]`);
  if (notaPApagar) {
    const notaDiv = notaPApagar.parentElement;
    efeitoFadeOutNota(notaDiv);
    await delay(200);
  }
  await apagarNotas(id);
  ativarOInput(index, textoPlaceholder);
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

// funcoes de gerenciamento da extincao de notas
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

// renderiza as notas salvas no localStorage
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
	// isso é meio gambiarra, mas futuramenre pretendo melhorar isso aqui.
	if (el === modoNotas.mensagemVazio) return
  if(el?.classList.contains("oculto")) {
    animarEntrada(el);
  } else {
    animarSaida(el);
  }
}

// experimental, reorganizar efeitos depois
function inputOverlay(fechar){
	if (fechar) {
		overlay?.remove();
		return
	}
	const overlay = document.createElement("div");
	console.log("funcionou?")
	overlay.className = "overlay";
	moldura.appendChild(overlay);
	//overlay.addEventListener("click", () => {
		//overlay?.remove();
		//console.log("funcionou")
	//});
}

function deletarOverlay(){
	const overlay = document.querySelector(".overlay")
	if(overlay) {
		overlay.remove();
	}
			}
