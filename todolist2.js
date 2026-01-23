// Objeto relacionado à troca de modos
appConfig = {
	moldura: null,
	temaAtual: null,
	init(){
		this.moldura = document.getElementById("moldura");
		header.criar();
		modos.init();
		temas.init();
		setGestures.verificarDeslizamento(appConfig.moldura, setGestures.onSwipe);
		tutorialManager.init();
		botaoFooter.criar();
    botaoFooter.update();
    overlay.criar();
	},
};
const modos = {
	modoAtual: null,
	init(){
	this.modoAtual = localStorage.getItem("modoAtual");
  console.log(this.modoAtual);
  if(this.modoAtual === null) this.modoAtual = "Notas";
  this.iniciar(this.modoAtual);
	},
	update(modoAtual){
		if (modoAtual !== "Notas" && modoAtual !== "Timer") return;
		this.modoAtual = modoAtual;
  	localStorage.setItem("modoAtual", modoAtual);
	},
	async modoSwitch(){
		await modoNotas.gerenciarOpacidadeNotasUI();
  	await modoTimer.gerenciarOpacidadeTimerUI();
  	let modoAtual;
  	if(modoNotas.listaNotas.classList.contains("oculto")) {
  		modoAtual = "Timer";
      header.mudarTitulo(modoAtual);
      inputNotas.fechar();
      visorUI.tipUI();
      nowBar.esconder();
	} else {
		modoAtual = "Notas";
		header.mudarTitulo(modoAtual);
      if (timerConfig.rodando && modoAtual !== "Timer") nowBar.mostrarNoCentro();
	}
	this.update(modoAtual);
	botaoFooter.update();
	},
	iniciar(modoAtual){
  	this.modoAtual = modoAtual;
  	if (modoNotas.listaNotas === null) modoNotas.criarUINotas();
  	if (visorUI.visorP === null) modoTimer.criarUITimer();
  	if(this.modoAtual === "Notas"){
  		modoTimer.gerenciarOpacidadeTimerUI();
  		header.mudarTitulo("Notas");
  	} else if (this.modoAtual === "Timer") {
  		modoNotas.gerenciarOpacidadeNotasUI();
  		header.mudarTitulo("Timer");
  	}
  }
};
const temas = {
	temaAtual: null,
  init(){
	this.temaAtual = localStorage.getItem("tema");
	if (this.temaAtual === "dark"){
		document.body.setAttribute("data-theme", "dark");
	} else {
		document.body.removeAttribute("data-theme");
	}
	header.atualizarBotaoTema(this.temaAtual);
	},
	temasSwicth(){
		if (this.temaAtual === "dark"){
  	document.body.removeAttribute("data-theme");
  	this.temaAtual = "white";
  } else {
  	document.body.setAttribute("data-theme", "dark");
  	this.temaAtual = "dark";
  }
  localStorage.setItem("tema", this.temaAtual);
  header.atualizarBotaoTema(this.temaAtual);
  },
};
const header = {
  botaoTrocar: null,
  botaoTema: null,
  titulo: null,
  header: null,
  modoAtual: null,
  temaAtual: "white",
  // cria o header
  criar() {
  	if (this.header !== null) return;
  	this.header = helperFunctions.createElement("div", appConfig.moldura, "header");
  	
    this.titulo = helperFunctions.createElement("h1", this.header, "titulo");
    this.titulo.id = "titulo";
    
    this.botaoTrocar = helperFunctions.createElement("button", this.header, "headerButton");
    this.botaoTrocar.innerHTML = `<i class="fa-solid fa-clock"></i>`;
    
    this.botaoTema = helperFunctions.createElement("button",this.header, "headerButton");
    this.botaoTema.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    
  // botao para trocar os modos
this.botaoTrocar.addEventListener("click", async () => {
  modos.modoSwitch();
});
  // funcao para indentificar o tema atual e salvar em localStorage
this.botaoTema.addEventListener("click", () => {
	temas.temasSwicth();
});
  },
atualizarBotaoTema(temaAtual){
	if (temaAtual === "dark"){
		this.botaoTema.innerHTML = `<i class="fa-solid fa-sun"></i>`;
	} else {
		this.botaoTema.innerHTML = `<i class="fa-solid fa-moon"></i>`;
	}
},
  // função que muda o titulo
  mudarTitulo(texto){
    if (this.titulo) this.titulo.innerText = texto;
  },
};

// objeto do modo de notas
const botaoFooter = {
	botaoFooter: null,
	emFocus: false,
	criar(){
		if(this.botaoFooter !== null) return;
		this.botaoFooter = helperFunctions.createElement("button", appConfig.moldura, "footerButton");
    this.botaoFooter.innerHTML = '<i class="fa-solid fa-pen"></i>';
    if(this.botaoFooter){
    	this.botaoFooter.addEventListener("click", () => {
    		this.acao();
    	});
    }
	},
	acao(){
		if(this.botaoFooter === null) this.criar();
		if (modos.modoAtual === "Notas"){
			inputNotas.ativar();
			if(this.emFocus && (!overlay.element || !overlay.element.classList.contains("overlay--hidden"))){
				overlay.hide();
			} else {
				overlay.show(true);
				// ao editar nota, ele nao faz o hide porque nao é derivado da acao do usuario, comportamento plausivel com a funcao, mas errado, irei consertar dps
			}
			this.focus();
		} else if (modos.modoAtual === "Timer" && !timerConfig.rodando){
			if(!overlay.element || !overlay.element.classList.contains("overlay--hidden")) overlay.hide(); else overlay.show();
			editTimerValue.criarEditUI();
			if (this.emFocus){
				editTimerValue.transformarValorInput();
			}
			this.focus();
		}
	},
	focus(){
	this.botaoFooter.classList.toggle("footerButton--focus");
	if(this.botaoFooter.classList.contains ("footerButton--focus")) {
		this.emFocus = true;
		this.botaoFooter.innerHTML = '<i class="fa-solid fa-check"></i>';
		} else {
			this.emFocus = false;
			this.botaoFooter.innerHTML = '<i class="fa-solid fa-pen"></i>';
		}
	},
	update(){
		if(modos.modoAtual === "Notas"){
			this.reveal();
			return;
		}
		if (timerConfig.config === "stopwatch"){
			this.hide();
			console.log("esconde");
		} else if (timerConfig.config === "timer"){
			this.reveal();
			console.log("revelou")
		}
	},
	hide(){
		this.botaoFooter.classList.add("footerButton--hidden");
	},
	reveal(){
		this.botaoFooter.classList.remove("footerButton--hidden");
	}
};
const modoNotas = {
	criarUINotas(){
		this.listaNotas = helperFunctions.createElement("div", appConfig.moldura, "listaNotas");
    this.listaNotas.id = "listaNotas";
    createNotas.renderizarNotasSalvas();
    this.atualizarMensagemVazio();
	},
	async gerenciarOpacidadeNotasUI() {
  const elementos = [
    this.listaNotas,
    this.mensagemVazio
  ];

  for (const el of elementos) {
  	if (!el) continue;
    await helperFunctions.gerenciarAnimacao(el);
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
	listaNotas: null,
	notasArray: [],
	ultimoIndexSalvo: null
};
// cria o header e inicia o modo quando a pagina carregar
window.addEventListener("DOMContentLoaded", () => {
	appConfig.init();
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
     this.VisorUI = helperFunctions.createElement("div", appConfig.moldura, "visorTimer");
     
      this.visorP = helperFunctions.createElement("p", this.VisorUI, "visorP");
      
      timerConfig.mostrar("visorP");
       this.gerenciarSwitchModoTimer();
       if(!botaoTimer.existe)botaoTimer.init();
     this.VisorUI.addEventListener("click", (e) => {
  if (e.target !== this.switchT && !this.switchT?.contains(e.target)) {
  	if (timerConfig.rodando) return;
  	navigator.vibrate(1);
    this.gerenciarEstadoVisorUI();
  }
});
},
visorUIFocusON(){
	if (this.VisorUI === null) return;
	this.VisorUI.classList.add("visorTimer--focus");
},
visorUIFocusOFF(){
	if (this.VisorUI === null) return;
	this.VisorUI.classList.remove("visorTimer--focus");
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
		if (botaoFooter.botaoFooter)botaoFooter.update();
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
	await helperFunctions.delay(1000)
	this.reveal();
	await helperFunctions.delay(2100);
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
      this.botaoDiv = helperFunctions.createElement("div", appConfig.moldura, "botaoDiv");
      
      this.timestampDiv = helperFunctions.createElement("div", appConfig.moldura, "timestampDiv");
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
    await helperFunctions.gerenciarAnimacao(el);
  	el?.classList.toggle("oculto");
  }
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
  await helperFunctions.delay(velocidade);
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
  segundosTotais: 1, // pra testes
  segundosRestantes: null,
  configSwitch(){
  	this.config = (this.config === "stopwatch") ? "timer" : "stopwatch";
  },
  rodarTimer(){
  if(this.timerInterval) return;
  this.inicioDoTimer = performance.now() - (this.segundos_pausados * 1000);
  this.rodando = true;
  if (visorUI.visorUIState === "reveal") visorUI.hide();
  this.timerInterval = setInterval(() => {
	this.agora = performance.now();
	this.segundos = (this.agora - this.inicioDoTimer) / 1000;
	this.configurar(this.config);
	},500);
  },
  configurar(){
		if (!nowBar.element)nowBar.criar();
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
    timerFinishedScreen.show();
  	visorUI.visorUIFocusON();
  	navigator.vibrate(100);
  }
  },
  timerEnd(){
  	timerFinishedScreen.hide();
  	visorUI.visorUIFocusOFF();
  	this.reset();
    botaoTimer.atualizar("resetado");
  },
  reset() {
   clearInterval(this.timerInterval);
   this.timerInterval = null;
   this.inicioDoTimer = null;
   this.agora = null;
   this.segundos = null;
   this.minutos = null;
   this.segundos_pausados = 0;
   this.rodando = false;
   this.mostrar("visorP", this.segundos)
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
  const segsStr = String(Math.abs(segs)).padStart(2, "0");
  if (segs > 0) this.numeroFormatado = minsStr + ":" + segsStr; else this.numeroFormatado = "-" + minsStr + ":" + segsStr;
},
	mostrar(local,segundos){
	if(!this.rodando) {
		if (segundos){
		this.formatar(segundos);
		visorUI.visorP.innerText = this.numeroFormatado;
		} else {
			visorUI.visorP.innerText = "00:00";
		}
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
// tela de timer
const timerFinishedScreen = {
	element: null,
	criar(){
	 if(this.element !== null) return;
	 this.element = helperFunctions.createElement("div", appConfig.moldura,"timerFinishedScreen");
	 const screenArrow = helperFunctions.createElement("div", this.element, "screenArrow");
	 const screenTip = helperFunctions.createElement("p", this.element, "screenTip");
	 screenTip.innerText = "deslize para cima para encerrar";
	},
	show(){
		if(this.element === null) this.criar();
		this.element.classList.remove("timerFinishedScreen--hidden");
	},
	hide(){
	 	if(this.element === null) this.criar();
		this.element.classList.add("timerFinishedScreen--hidden");
	},
};
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
	header.header.appendChild(this.element);
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
const botaoTimer = {
	existe: false,
	async criarBotaoTimer(acao){
	if (!modoTimer.botaoDiv){
		await helperFunctions.delay(0);
	}
	const botaoTimer = document.createElement("button");
	botaoTimer.classList.add("botaoTimer", acao);
	modoTimer.botaoDiv.appendChild(botaoTimer);
	botaoTimer.innerText = acao;
	botaoTimer.addEventListener("click",() => {
  this.definirFuncoes(botaoTimer, acao);
  tutorialManager.timestampTutorial();
  navigator.vibrate(2);
	});
	this.atualizar("resetado");
	this.existe = true; 
},
// define a funcao dos botoesTimer
definirFuncoes(el, acao){
			if (acao === "pause"){
			if(timerConfig.rodando) {
				timerConfig.pause();
				el.innerText = "resume";
				this.atualizar("pause");
				} else {
				timerConfig.resume();
				el.innerText = "pause";
				this.atualizar("pause");
				}
		} else if (acao === "iniciar") {
			if (!timerConfig.rodando) {
				timerConfig.rodarTimer();
		this.atualizar("rodando");
		} 
		} else if (acao === "reset") {
			timerConfig.reset();
		this.atualizar("resetado")
		}
},
// minimiza ou amplia
atualizar(estado){
	const botaoTimerObj = {
		botaoIniciar: document.querySelector(".iniciar"),
		botaoPause: document.querySelector(".pause"),
		botaoReset:document.querySelector(".reset"),
	};
	if (estado === "rodando") {
		botaoTimerObj.botaoIniciar.classList.add("minimizado", "piscando")
		botaoTimerObj.botaoPause.classList.remove("minimizado");
		botaoTimerObj.botaoReset.classList.remove("minimizado");
		botaoTimerObj.botaoIniciar.innerText = "";
		botaoTimerObj.botaoPause.innerText = "pause";
		botaoTimerObj.botaoReset.innerText = "reset";
	} else if (estado === "resetado"){
		botaoTimerObj.botaoIniciar.classList.remove("minimizado")
		botaoTimerObj.botaoPause.classList.add("minimizado");
		botaoTimerObj.botaoReset.classList.add("minimizado");
		botaoTimerObj.botaoIniciar.innerText = "iniciar";
		botaoTimerObj.botaoPause.innerText = "";
		botaoTimerObj.botaoReset.innerText = "";
		modoTimer.limparTimestamps();
	} else if (estado === "pause"){
		botaoTimerObj.botaoIniciar.classList.toggle("piscando")
	}
},
init(){
this.criarBotaoTimer("pause");
this.criarBotaoTimer("iniciar");
this.criarBotaoTimer("reset");
},
};
const editTimerValue = {
	editMenu: null,
	editValue: null,
	minInput: null,
	secInput: null,
	criarEditUI(){
		if(this.editMenu !== null || this.minInput !== null || this.secInput !== null) return;
		this.editMenu = document.createElement("div");
		this.editMenu.className = "editMenu";
		appConfig.moldura.appendChild(this.editMenu);
		this.minInput = this.criarInput(this.minInput);
		this.secInput = this.criarInput(this.secInput);
	},
	criarInput(input){
		input = document.createElement("input");
		input.required = true;
		input.className = "inputEditValue";
		input.maxLength = "2";
		input.addEventListener("click",() => {
			this.focus(input)
		});
		if (document.querySelectorAll(".inputEditValue").length === 0) input.placeholder = "MM"; else input.placeholder = "SS";
		this.editMenu.appendChild(input);
		input.addEventListener("keydown", (e) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== "Backspace"
  ) {
    e.preventDefault()
  }
})
    input.addEventListener("input", () => {
  input.value = input.value.replace(/\D/g, "")
})
return input;
	},
	focus(input){
  input.focus();
  // se for mobile deixa o input visivel
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return;
  
  setTimeout(() => {
    input.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
},
	async transformarValorInput(){
		const minutos = this.minInput.value !== "" ? this.minInput.value : "1";
   const segundos = this.secInput.value !== "" ? this.secInput.value : "00";
   
		timerConfig.segundosTotais = (minutos * 60) + Number(segundos);
		console.log(timerConfig.segundosTotais);
		timerConfig.mostrar("visorP", timerConfig.segundosTotais);
		this.deletarEditUI();
	},
	deletarEditUI(){
		if (this.editMenu === null) return;
		this.editMenu.remove();
		this.editMenu = null;
		this.secInput = null;
		this.minInput = null;
	},
};
const inputNotas = {
	input: null,
	criar(placeholder){
	if (this.input !== null) return;
	this.input = helperFunctions.createElement("textarea",appConfig.moldura, "inputNotas");
  if (!placeholder) {
  this.input.placeholder = "Nova nota";
  } else {
  this.input.value = placeholder;
  this.input.placeholder = placeholder;
  }
},
	ativar(index, placeholder){
		if (this.input !== null){
    let textoInput = this.input.value.trim();
    if (textoInput === ""){
      textoInput = "Nova nota";
    }
    modoNotas.ultimoIndexSalvo = (typeof index === "number") ? index : modoNotas.ultimoIndexSalvo;
    this.fechar(textoInput);
    return;
	}
		if (this.input === null) {
			this.criar(placeholder);
   		this.focus(this.input);
   		console.log("criou e focou")
		}
},
focus(input){
	if (this.input === null) return;
  input.focus();
  // se for mobile deixa o input visivel
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) return;
  
  setTimeout(() => {
    input.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
},
// fecha o input e guarda o texto
fechar(texto){
	if (this.input === null) return;
  if (this.input !== null){
    this.input.remove();
    this.input = null;
  }
  console.log(texto)
  if (!texto){
  	botaoFooter.focus();
  	return;
  } 
  const index = modoNotas.ultimoIndexSalvo;
  const nota = createNotas.salvarTextoEmArray(texto, index);
  createNotas.renderizarNotas(nota, index);
  modoNotas.ultimoIndexSalvo = null;
},
};
// objeto com funcoes relacionadas a criacao de notas
const createNotas = {
salvarTextoEmArray(texto, index){
  const nota = { id: this.gerarId(), text: texto };
  if (typeof index === "number" && index >= 0) {
    modoNotas.notasArray.splice(index, 0, nota);
  } else {
    modoNotas.notasArray.push(nota);
  }
  localStorage.setItem("notasArray", JSON.stringify(modoNotas.notasArray));
  return nota;
},
gerarId(){
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
},
// renderiza notas no dom
async renderizarNotas(item, index){
  const isObj = typeof item === "object" && item !== null;
  const texto = isObj ? item.text : item;
  let id = isObj ? item.id : undefined;
  if (!id) id = this.gerarId();

  const notaDiv = document.createElement("div");
  notaDiv.classList.add("notaDiv");

  const notaFundo = document.createElement("div");
  notaFundo.classList.add("notaFundo");
  notaFundo.innerText = texto;
  notaFundo.dataset.id = id;

  const botaoLixeira = this.criarbotaoLixeira(notaDiv, id);
  setGestures.verificarToque(notaFundo, id);
  notaFundo.addEventListener("click", () => {
    this.trocarClassebotaoLixeira(botaoLixeira);
    notaFundo.classList.toggle("mini");
  });
  notaDiv.appendChild(notaFundo);
  if (typeof index === "number" && index >= 0 && index < modoNotas.listaNotas.children.length) {
    modoNotas.listaNotas.insertBefore(notaDiv, modoNotas.listaNotas.children[index]);
  } else {
    modoNotas.listaNotas.appendChild(notaDiv);
  }

  if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
  this.efeitoFadeInNota(notaDiv);
},
// funcao de editar a nota
async editarNota(el, id){
  if (document.querySelector(".inputNotas")) return;
  const index = modoNotas.notasArray.findIndex(n => n.id === id);
  const textoPlaceholder = modoNotas.notasArray[index].text
  console.log("editar -> index encontrado:", index);
  modoNotas.ultimoIndexSalvo = index;
  const notaPApagar = document.querySelector(`[data-id="${id}"]`);
  if (notaPApagar) {
    const notaDiv = notaPApagar.parentElement;
    this.efeitoFadeOutNota(notaDiv);
    await helperFunctions.delay(200);
  }
  await this.apagarNotas(id);
  inputNotas.ativar(index, textoPlaceholder);
  botaoFooter.focus();
},
// efeitos
async efeitoFadeInNota(el){
	el.classList.add("notaFadeIn");
	await helperFunctions.delay(100);
	el.classList.remove("notaFadeIn");
},
async efeitoFadeOutNota(el){
	el.classList.add("notaFadeOut");
},

// funcoes de gerenciamento da extincao de notas
async apagarNotas(id){
  const index = modoNotas.notasArray.findIndex(n => n.id === id);
  if (index !== -1) modoNotas.notasArray.splice(index, 1);
  localStorage.setItem("notasArray", JSON.stringify(modoNotas.notasArray));

  const notaPApagar = document.querySelector(`[data-id="${id}"]`);
  if (!notaPApagar) {
    if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
    return;
  }
  const notaDivPApagar = notaPApagar.parentElement;
  this.efeitoFadeOutNota(notaDivPApagar);
  await helperFunctions.delay(500);
  if (notaDivPApagar) notaDivPApagar.remove();
  if (modoNotas.listaNotas) modoNotas.atualizarMensagemVazio();
},
criarbotaoLixeira(local, id){
	const botaoLixeira = document.createElement("button");
botaoLixeira.classList.add("botaoLixeira", "oculto");
botaoLixeira.innerHTML = '<i class="fa-solid fa-trash"></i>';
	local.appendChild(botaoLixeira);
	botaoLixeira.addEventListener("click", (e) => {
		e.stopPropagation();
		this.apagarNotas(id);
	});
	return botaoLixeira;
},
async trocarClassebotaoLixeira(item){
	item.classList.toggle("oculto");
},

// renderiza as notas salvas no localStorage
renderizarNotasSalvas(){
  modoNotas.notasArray = JSON.parse(localStorage.getItem("notasArray") || "[]");
  modoNotas.notasArray.forEach((item, index) => {
    this.renderizarNotas(item, index);
  });
},
};
// funcoes relacionadas à animacao em geral
const helperFunctions = {
delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
},
async animarEntrada(el){
	el.classList.add("aparecer");
	await this.delay(700);
	el.classList.remove("aparecer");
},
async animarSaida(el){
	el.classList.add("desaparecer");
	await this.delay(700);
	el.classList.remove("desaparecer");
},
async gerenciarAnimacao(el){
	// isso é meio gambiarra, mas futuramenre pretendo melhorar isso aqui.
	if (el === modoNotas.mensagemVazio) return
  if(el?.classList.contains("oculto")) {
    this.animarEntrada(el);
  } else {
    this.animarSaida(el);
  }
},
createElement(tipo, local, classe){
	const nome = document.createElement(tipo);
	nome.classList.add(classe)
  local.appendChild(nome);
  return nome;
},
async createMsg(texto, duracao){
	const mensagem = this.createElement("p",appConfig.moldura, "mensagem");
	mensagem.innerText = texto;
	if (!(duracao >= 0)) duracao = 3000;
  await this.delay(duracao);
	this.animarSaida(mensagem);
	await this.delay(700);
  mensagem.remove();
},
};
// experimental, reorganizar efeitos depois
const overlay = {
	element: null,
  criar(){
  	if(this.element !== null) return;
  	this.element = document.createElement("div");
  	this.element.className = "overlay";
  	appConfig.moldura.appendChild(this.element);
  	this.element.addEventListener("click", () => {
  		if(this.element?.classList.contains("overlay--timer")) return;
  if (document.querySelector(".inputNotas")) {
    inputNotas.fechar();
  }
  if (document.querySelector(".inputEditValue")) {
    editTimerValue.deletarEditUI();
    if(botaoFooter.emFocus) botaoFooter.focus();
  }
  this.hide();
});
  	this.hide();
  },
  show(){
  	if(this.element === null) this.criar();
		this.element.classList.remove("overlay--hidden");
  },
	async hide(){
		if(this.element === null) return;
		this.element.classList.add("overlay--hidden");
	},
};

// MUITO experimental, pode quebrar

const setGestures = {
	verificarDeslizamento(elemento, callback){
		const distancia = 100;
		let inicioX = 0;
		let inicioY = 0;
		elemento.addEventListener("touchstart", (e) => {
			inicioX = e.touches[0].clientX;
			inicioY = e.touches[0].clientY;
		});
		elemento.addEventListener("touchend", (e) => {
		const fimX = e.changedTouches[0].clientX;
		const fimY = e.changedTouches[0].clientY;
		const diffX = inicioX - fimX;
		const diffY = inicioY - fimY;
		if (Math.abs(diffX) > Math.abs(diffY)){
			if (Math.abs(diffX) > distancia) {
			const direcao = diffX > 0 ? "left" : "right";
			callback(direcao, Math.abs(diffX));
			}
		} else {
			if (Math.abs(diffY) > distancia) {
				const direcao = diffY > 0 ? "up" : "down";
			callback(direcao, Math.abs(diffY));
			}
		}
		});
	},
	onSwipe(direcao, diff){
		//criarTimestamp
		if(direcao === "right" && timerConfig.rodando && timerConfig.config === "stopwatch") {
			modoTimer.criarTimestamp();
			} else if (direcao === "up" && timerConfig.segundosRestantes < 0)	{
				timerConfig.timerEnd();
			}
	},
	verificarToque(el,id) {
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
      createNotas.editarNota(el, id);
    }
  });
}
};

const tutorialManager = {
	tutoriais: {
		 //pode ser inProgress ou completed
		createTimestamp: "inProgress",
		toDoList: "inProgress",
		editTimerValue: "inProgress",
	},
	init(){
	  this.getTutorialStatus();
	  this.toDoListTutorial();
	},
	getTutorialStatus(){
    const salvo = localStorage.getItem("tutoriais");
    if (salvo) {
        this.tutoriais = JSON.parse(salvo);
    }
    console.log(this.tutoriais);
},
	tutorialUpdate(){
		localStorage.setItem("tutoriais", JSON.stringify(this.tutoriais));
	},
	timestampTutorial(){
		this.getTutorialStatus();
		if(this.tutoriais.createTimestamp === "completed") return;
		helperFunctions.createMsg("Deslize para direita para criar um timestamp", 3000);
		this.tutoriais.createTimestamp = "completed";
		this.tutorialUpdate();
	},
	toDoListTutorial(){
		if(this.tutoriais.toDoList === "completed") return;
		const texto = "Clique no botão com icone de lapis para criar | Toque e segure em uma nota para editar";
		const nota = createNotas.salvarTextoEmArray(texto);
    createNotas.renderizarNotas(nota);
    this.tutoriais.toDoList = "completed";
    this.tutorialUpdate();
	},
	editTimerValueTutorial(){
		if(this.tutoriais.editTimerValue === "completed") return;
		helperFunctions.createMsg("Deslize os numeros para alterar-los", 2000);
		this.tutoriais.editTimerValue = "completed";
		this.tutorialUpdate();
	},
};
