/* Atelier — A Fábrica dos Sonhos. Jogo pedagógico local e acessível. */
(function(){
'use strict';
var STORAGE='atelier_fabrica_sonhos_v1';
var PHASES=['intro','explore','condense','shift','montage','classify','ending'];
var memories=[
 {id:'relogio',icon:'◷',label:'Relógio parado',lead:'O compromisso',body:'Na véspera, a personagem chegou atrasada a uma apresentação importante. O relógio ficou na memória.',kind:'Um resto do dia'},
 {id:'carta',icon:'✉',label:'Carta fechada',lead:'A conversa adiada',body:'Uma mensagem importante ficou sem resposta. A personagem queria escrevê-la, mas hesitou.',kind:'Um resto do dia'},
 {id:'ponte',icon:'⌁',label:'Ponte suspensa',lead:'A travessia',body:'Ao voltar para casa, a personagem viu uma ponte interditada. A imagem ficou registrada.',kind:'Uma imagem do dia'}
];
var latent=[
 {id:'pressa',icon:'◷',label:'O medo de chegar tarde'},
 {id:'mensagem',icon:'✉',label:'A mensagem não enviada'},
 {id:'ponte',icon:'⌁',label:'A ponte vista no caminho'},
 {id:'chuva',icon:'☂',label:'A previsão de chuva'}
];
var frames=[
 {id:'corredor',label:'Corredor de portas',icon:'🚪',detail:'Um corredor termina em uma porta sem maçaneta.'},
 {id:'relogio',label:'Relógio-carta',icon:'◷',detail:'Um relógio abre suas asas de envelope.'},
 {id:'palco',label:'Palco de chuva',icon:'☂',detail:'Um palco recebe uma chuva de papéis.'}
];
var cards=[
 {id:'manifesto1',label:'“Vi um relógio com asas de envelope.”',type:'manifesto',detail:'É uma cena tal como aparece no relato do sonho.'},
 {id:'associacao1',label:'“Ontem evitei responder uma mensagem.”',type:'associacao',detail:'É uma associação da personagem, oferecida depois de contar o sonho.'},
 {id:'manifesto2',label:'“Atravessei um palco coberto de chuva.”',type:'manifesto',detail:'Também pertence ao sonho narrado.'},
 {id:'associacao2',label:'“Fiquei apreensivo com uma apresentação.”',type:'associacao',detail:'É um possível elo narrado pela personagem, não uma tradução universal.'}
];
function empty(){return {phase:'intro',found:[],selectedMemory:null,combined:[],condensed:false,spot:null,shifted:false,story:[],storyDone:false,classified:{},classifiedFocus:null,stars:0,best:0,note:'',noteType:'',sound:false};}
var state=empty();
try{
 var previous=JSON.parse(localStorage.getItem(STORAGE)||'null');
 if(previous && typeof previous==='object' && PHASES.indexOf(previous.phase)>=0){
  state=Object.assign(empty(),previous);
  state.found=Array.isArray(state.found)?state.found.filter(function(n){return memories.some(function(x){return x.id===n;});}).slice(0,3):[];
  state.combined=Array.isArray(state.combined)?state.combined.filter(function(x){return latent.some(function(y){return y.id===x.id;});}).slice(0,2):[];
  state.story=Array.isArray(state.story)?state.story.filter(function(x){return frames.some(function(y){return y.id===x;});}).slice(0,3):[];
  state.classified=state.classified&&typeof state.classified==='object'?state.classified:{};
  state.stars=Math.min(5,Math.max(0,Number(state.stars)||0));
  state.best=Math.min(5,Math.max(0,Number(state.best)||0));
 }
}catch(e){}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(e){}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
function tip(message,good){state.note=message;state.noteType=good?'good':'hint';}
function seal(n){state.stars=Math.max(state.stars,n);state.best=Math.max(state.best,state.stars);}
function top(){
 var chapter=state.phase==='intro'?0:state.phase==='explore'?1:['condense','shift'].indexOf(state.phase)>=0?2:3;
 var pct=Math.round(state.stars/5*100);
 return '<div class="df-top"><div class="df-brand"><span class="df-brand-symbol">☾</span><div><small>ATELIER / EXPERIÊNCIA JOGÁVEL</small><strong>A Fábrica dos Sonhos</strong></div></div><span class="df-top-tag">FREUD · 1900</span></div>'+
 '<div class="df-progress"><span>CAPÍTULO '+chapter+' / 3</span><div class="df-progress-track" role="progressbar" aria-label="Avanço nos desafios" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+pct+'%"></i></div><span class="df-stars" aria-label="'+state.stars+' de 5 estrelas de descoberta">'+('✦ '.repeat(state.stars))+'<span>'+('✧ '.repeat(5-state.stars))+'</span></span></div>';
}
function notice(){return state.note?'<div class="df-notice '+(state.noteType==='good'?'success':'')+'" role="status">'+esc(state.note)+'</div>':'';}
function btn(action,label,opts){opts=opts||{};return '<button type="button" class="'+(opts.cls||'df-btn')+'" data-dream="'+action+'"'+(opts.value!=null?' data-value="'+esc(opts.value)+'"':'')+(opts.disabled?' disabled':'')+'>'+label+'</button>';}
function introVisual(){
 return '<div class="df-intro-art" aria-hidden="true">'+
 '<div class="df-halo"></div><div class="df-orbit a"></div><div class="df-orbit b"></div>'+
 '<div class="df-moon"><span>☾</span></div>'+
 '<div class="df-door"><div class="df-door-stars">✧ ✧ ✧</div><div class="df-door-inner"><span>✦</span></div></div>'+
 '<div class="df-key">⚿</div><div class="df-floating f1">✉</div><div class="df-floating f2">◷</div><div class="df-floating f3">✧</div><div class="df-floor"></div></div>';
}
function intro(){
 return '<div class="df-intro"><div class="df-intro-copy"><span class="df-eyebrow">UM MISTÉRIO EM TRÊS CAPÍTULOS</span><h2>Onde os sonhos<br><em>ganham forma.</em></h2><p>Esta noite, três lembranças atravessaram uma porta. Dentro da fábrica, elas viraram imagens impossíveis. Você consegue descobrir <strong>como</strong> a transformação aconteceu?</p><div class="df-feature-line"><span>✦ Explore</span><span>✦ Combine</span><span>✦ Descubra</span></div>'+btn('start','Entrar no sonho <span aria-hidden="true">↗</span>',{cls:'df-btn df-primary'})+'<p class="df-small">De 8 a 12 minutos · Toque para jogar · Progresso salvo neste navegador</p></div>'+introVisual()+'</div>'+
 '<div class="df-context"><span>O QUE VOCÊ VAI APRENDER</span><p>Os conceitos de <strong>restos diurnos, condensação, deslocamento, elaboração secundária</strong> e a distinção entre relato manifesto e associações. O sonho é fictício: não existe dicionário universal de símbolos.</p></div>';
}
function memoryScene(){
 return '<div class="df-room" role="group" aria-label="Quarto noturno com três objetos para investigar">'+
 '<div class="df-window"><div class="df-window-moon">☾</div><span>✧</span></div>'+
 '<div class="df-room-stars">✧ · ✧ · ✧</div><div class="df-shelf"></div>'+
 memories.map(function(m,i){var active=state.found.indexOf(m.id)>=0;return '<button type="button" data-dream="memory" data-value="'+m.id+'" class="df-object df-object-'+i+(active?' is-found':'')+'" aria-label="Investigar '+m.label+'"><span class="df-object-art">'+m.icon+'</span><span class="df-object-label">'+esc(m.label)+(active?' ✓':'')+'</span></button>';}).join('')+
 '<div class="df-room-ground"></div></div>';
}
function explore(){
 var open=memories.find(function(x){return x.id===state.selectedMemory;});
 return '<div class="df-headline"><span class="df-eyebrow">CAPÍTULO 1 · O QUARTO DA VÉSPERA</span><h2>O que ficou do dia?</h2><p>Toque nos três objetos espalhados pelo quarto. Cada um guarda uma lembrança anterior ao sonho.</p></div>'+
 '<div class="df-stage-grid"><div>'+memoryScene()+'<div class="df-counter">'+state.found.length+' / 3 lembranças encontradas</div></div>'+
 '<div class="df-inspector"><small>DIÁRIO DE BORDO</small><h3>'+esc(open?open.label:'Investigue os objetos')+'</h3><p>'+(open?esc(open.body):'Escolha um objeto no quarto para revelar uma pista. Não existe nenhum cronômetro.')+'</p><div class="df-found">'+memories.map(function(m){return '<div class="'+(state.found.includes(m.id)?'lit':'')+'"><span>'+m.icon+'</span><small>'+esc(m.lead)+'</small></div>';}).join('')+'</div>'+
 '<p class="df-side-note">Freud chamou atenção para materiais recentes da vida de vigília que podem participar da formação de um sonho. Encontrar uma lembrança não demonstra seu significado.</p>'+
 btn('toCondense','Abrir a oficina de imagens →',{cls:'df-btn df-primary df-full',disabled:state.found.length!==3})+'</div></div>';
}
function clockArt(reveal){
 return '<svg class="df-illustration" viewBox="0 0 340 245" role="img" aria-label="'+(reveal?'Relógio misturado a uma carta: imagem condensada':'Duas lembranças ainda não combinadas')+'">'+
 '<defs><radialGradient id="df-sky"><stop stop-color="#a28bd8" stop-opacity=".38"/><stop offset="1" stop-color="#262242" stop-opacity="0"/></radialGradient></defs><ellipse cx="170" cy="122" rx="145" ry="112" fill="url(#df-sky)"/>'+
 (reveal?'<path d="M75 118 L169 49 L266 118 L169 163 Z" fill="#cbbff0" opacity=".86"/><path d="M75 118 L169 183 L266 118" fill="none" stroke="#302c57" stroke-width="5"/><circle cx="170" cy="118" r="62" fill="#252544" stroke="#f0dfad" stroke-width="6"/><circle cx="170" cy="118" r="48" fill="none" stroke="#c9bddb" stroke-dasharray="2 14" stroke-width="5"/><path d="M169 118 L169 79 M169 118 L197 132" stroke="#fff5d4" stroke-width="5" stroke-linecap="round"/><path d="M86 115 L53 76 L112 84 M255 115 L289 76 L228 84" fill="none" stroke="#dbaf8d" stroke-width="5" stroke-linecap="round"/><path d="M95 194 Q170 230 245 194" fill="none" stroke="#dfb3ed" stroke-width="2" stroke-dasharray="5 7"/>':
 '<circle cx="108" cy="123" r="57" fill="#252544" stroke="#f0dfad" stroke-width="5"/><path d="M108 123 L108 92 M108 123 L128 135" stroke="#fff5d4" stroke-width="5" stroke-linecap="round"/><path d="M197 94 L288 94 L288 159 L197 159 Z" fill="#dfc9ed" stroke="#302c57" stroke-width="3"/><path d="M198 95 L242 128 L288 95" fill="none" stroke="#675b91" stroke-width="3"/><path d="M161 120 L187 120" stroke="#b9accd" stroke-dasharray="4 6" stroke-width="3"/>')+
 '<g fill="#f5dba9"><circle cx="35" cy="63" r="3"/><circle cx="307" cy="61" r="3"/><path d="M291 177 l5 12 l-5 12 l-5 -12Z"/></g></svg>';
}
function condense(){
 var correct=state.combined.includes('pressa')&&state.combined.includes('mensagem');
 return '<div class="df-headline"><span class="df-eyebrow">CAPÍTULO 2 · A OFICINA DAS TRANSFORMAÇÕES</span><h2>Duas lembranças. Uma imagem.</h2><p>No sonho, apareceu um relógio com asas de envelope. Quais <strong>dois elementos da história</strong> poderiam ter participado desta imagem inventada?</p></div>'+
 '<div class="df-stage-grid"><div class="df-canvas"><span class="df-canvas-label">'+(state.condensed?'CONDENSAÇÃO REALIZADA':'A IMAGEM AINDA ESTÁ EM FORMAÇÃO')+'</span>'+clockArt(state.condensed)+'<p class="df-canvas-caption">'+(state.condensed?'Várias linhas de associação foram reunidas em uma figura.':'Escolha dois fragmentos; veja a figura ganhar outra forma.')+'</p></div>'+
 '<div class="df-play-panel"><h3>Escolha dois fragmentos</h3><div class="df-tile-grid">'+latent.map(function(x){var on=state.combined.includes(x.id);return '<button type="button" class="df-tile '+(on?'selected':'')+'" data-dream="fragment" data-value="'+x.id+'" aria-pressed="'+on+'" '+(state.condensed?'disabled':'')+'><b>'+x.icon+'</b><span>'+esc(x.label)+'</span></button>';}).join('')+'</div>'+
 '<div class="df-tile-status">'+state.combined.length+' / 2 fragmentos escolhidos</div>'+
 btn('mix','Misturar os fragmentos ✧',{cls:'df-btn df-primary df-full',disabled:state.combined.length!==2||state.condensed})+
 (state.condensed?'<div class="df-learn"><b>DESCOBERTA · CONDENSAÇÃO</b><p>Na elaboração freudiana, uma formação onírica pode reunir diferentes cadeias de pensamentos. Neste exemplo, pressa e mensagem se encontram num relógio-carta.</p></div>':'')+
 btn('toShift','Avançar para a sala de luz →',{cls:'df-btn df-secondary df-full',disabled:!state.condensed})+
 '<p class="df-side-note">Estas associações pertencem apenas à nossa personagem fictícia; imagens oníricas não trazem significados fixos.</p></div></div>';
}
function shiftScene(){
 var opts=[
 {id:'palco',icon:'▤',name:'O palco',desc:'A grande apresentação'},
 {id:'botao',icon:'◎',name:'Um botão',desc:'Um detalhe do casaco'},
 {id:'carta',icon:'✉',name:'A carta',desc:'A mensagem adiada'}
 ];
 return '<div class="df-shift-scene"><div class="df-shift-stars">· ✧ · ✧ ·</div><div class="df-spot-title">PARA ONDE VAI O FOCO?</div><div class="df-spot-grid">'+opts.map(function(o){var on=state.spot===o.id;return '<button type="button" data-dream="spot" data-value="'+o.id+'" class="df-spot '+(on?'focused':'')+'" aria-pressed="'+on+'" '+(state.shifted?'disabled':'')+'><span class="df-spot-orb">'+o.icon+'</span><b>'+esc(o.name)+'</b><small>'+esc(o.desc)+'</small></button>';}).join('')+'</div><div class="df-light-beam '+(state.spot?'active':'')+'"></div></div>';
}
function shift(){
 return '<div class="df-headline"><span class="df-eyebrow">CAPÍTULO 2 · SALA DE LUZ</span><h2>O holofote mudou de lugar.</h2><p>No dia anterior, a personagem estava apreensiva com uma apresentação. No sonho, entretanto, a angústia parece se concentrar obsessivamente <strong>num minúsculo detalhe do casaco</strong>. Toque onde o holofote deve incidir.</p></div>'+
 '<div class="df-stage-grid"><div class="df-canvas df-shift-canvas">'+shiftScene()+'</div><div class="df-play-panel"><h3>Acenda a luz</h3><p class="df-pale">Mova o foco tocando em um dos elementos do cenário. Ao escolher, observe como uma intensidade pode passar de uma ideia mais importante para outra aparentemente secundária.</p>'+
 btn('confirmShift','Revelar o mecanismo →',{cls:'df-btn df-primary df-full',disabled:!state.spot||state.shifted})+
 (state.shifted?'<div class="df-learn"><b>DESCOBERTA · DESLOCAMENTO</b><p>O brilho mudou do acontecimento carregado de afeto para um detalhe aparentemente menor. Essa imagem serve para experimentar o deslocamento como hipótese freudiana, não para interpretar sonhos reais automaticamente.</p></div>':'')+
 btn('toMontage','Entrar no estúdio de montagem →',{cls:'df-btn df-secondary df-full',disabled:!state.shifted})+
 '<p class="df-side-note">O botão é importante apenas na ficção apresentada. Em outro sonho, a escuta e as associações poderiam levar a caminhos diferentes.</p></div></div>';
}
function filmStrip(){
 return '<div class="df-film" role="group" aria-label="Cenas escolhidas para montar o relato">'+[0,1,2].map(function(i){
  var id=state.story[i],f=frames.find(function(z){return z.id===id;});
  return '<div class="df-film-slot '+(f?'filled':'')+'"><span>CENA '+(i+1)+'</span><div class="df-film-icon">'+(f?f.icon:'✧')+'</div><strong>'+(f?esc(f.label):'Aguardando cena')+'</strong></div>';
 }).join('')+'</div>';
}
function montage(){
 return '<div class="df-headline"><span class="df-eyebrow">CAPÍTULO 3 · A SALA DE MONTAGEM</span><h2>Costure uma história impossível.</h2><p>O sonho deixou três fragmentos soltos. Escolha <strong>a ordem</strong> em que a personagem poderia contá-los ao acordar. Não há ordem única: a proposta é observar como tentamos dar continuidade ao relato.</p></div>'+
 '<div class="df-montage">'+filmStrip()+'<div class="df-montage-controls"><h3>Adicione uma cena ao filme</h3><div class="df-scene-list">'+frames.map(function(f){var used=state.story.includes(f.id);return '<button type="button" data-dream="scene" data-value="'+f.id+'" '+(used||state.storyDone?'disabled':'')+' class="df-scene-choice"><span class="df-scene-icon">'+f.icon+'</span><span><b>'+esc(f.label)+'</b><small>'+esc(f.detail)+'</small></span><span class="df-add">'+(used?'✓':'+')+'</span></button>';}).join('')+'</div><div class="df-edit-actions">'+btn('undoScene','↶ Desfazer último',{cls:'df-btn df-secondary',disabled:state.storyDone||!state.story.length})+btn('sealStory','Revelar a montagem ✦',{cls:'df-btn df-primary',disabled:state.story.length!==3||state.storyDone})+'</div>'+
 (state.storyDone?'<div class="df-learn"><b>DESCOBERTA · ELABORAÇÃO SECUNDÁRIA</b><p>Você encadeou cenas descontínuas e formou um relato aparentemente coerente. Freud discute como o sonho pode ganhar ligações e aparência narrativa. Nosso jogo é uma metáfora, não uma reprodução literal do processo psíquico.</p></div>':'')+
 btn('toClassify','Abrir o último arquivo →',{cls:'df-btn df-secondary df-full',disabled:!state.storyDone})+'</div></div>';
}
function classify(){
 var done=Object.keys(state.classified).length===4;
 return '<div class="df-headline"><span class="df-eyebrow">CAPÍTULO 3 · O ARQUIVO FINAL</span><h2>O que foi sonhado? O que foi associado?</h2><p>Agora separe cenas <strong>contadas no sonho</strong> de lembranças e associações <strong>feitas depois</strong>. Toque em uma ficha e escolha em qual arquivo guardá-la.</p></div>'+
 '<div class="df-classifier"><div class="df-card-list">'+cards.map(function(c){
 var assigned=state.classified[c.id],picked=state.classifiedFocus===c.id;
 return '<button type="button" class="df-evidence '+(picked?'active ':'')+(assigned?'sorted':'')+'" data-dream="evidence" data-value="'+c.id+'" '+(assigned?'disabled':'')+'><span>◈</span><b>'+esc(c.label)+'</b><small>'+(assigned?'Arquivada ✓':'Examinar ficha →')+'</small></button>';
 }).join('')+'</div><div class="df-drop-side">'+(state.classifiedFocus?'<div class="df-current">FICHA SELECIONADA<br><strong>'+esc(cards.find(function(c){return c.id===state.classifiedFocus;}).label)+'</strong></div>':'<div class="df-current">ESCOLHA UMA FICHA PARA ARQUIVAR</div>')+
 '<div class="df-archive-choices">'+btn('sort','RELATO DO SONHO <small>O que foi narrado</small>',{cls:'df-archive',value:'manifesto',disabled:!state.classifiedFocus})+btn('sort','ASSOCIAÇÃO <small>O que foi lembrado e relacionado</small>',{cls:'df-archive',value:'associacao',disabled:!state.classifiedFocus})+'</div><div class="df-sort-status">Fichas arquivadas: '+Object.keys(state.classified).length+' / 4</div>'+
 (done?'<div class="df-learn"><b>DESCOBERTA · RELATO E ASSOCIAÇÕES</b><p>O conteúdo manifesto é aquilo que o sonhador relata. Os pensamentos latentes não são revelados por um código fixo: a investigação envolve associações e hipóteses. As lembranças mostradas aqui são pistas ficcionais, não uma interpretação definitiva.</p></div>':'')+
 btn('finish','Concluir a travessia →',{cls:'df-btn df-primary df-full',disabled:!done})+'</div></div>';
}
function ending(){
 return '<div class="df-ending"><div class="df-ending-crest" aria-hidden="true">☾<span>✦</span></div><span class="df-eyebrow">A FÁBRICA FOI ILUMINADA</span><h2>Você atravessou o sonho.</h2><p>As imagens eram estranhas. O mais importante era perceber como elas podem ser estudadas sem reduzi-las a uma legenda pronta.</p><div class="df-earned">'+('✦ '.repeat(state.stars))+'</div><strong>'+state.stars+' DESCOBERTAS DESBLOQUEADAS</strong><div class="df-summary"><div><b>01</b><span>Restos diurnos</span></div><div><b>02</b><span>Condensação</span></div><div><b>03</b><span>Deslocamento</span></div><div><b>04</b><span>Elaboração secundária</span></div><div><b>05</b><span>Relato e associações</span></div></div><div class="df-final-actions">'+btn('restart','Jogar de novo',{cls:'df-btn df-secondary'})+btn('continue','Voltar ao estudo →',{cls:'df-btn df-primary'})+'</div><p class="df-end-note">O modelo apresentado é uma exploração didática de conceitos de Freud (1900), não um método de descobrir o significado de sonhos reais. Muitas teses da teoria dos sonhos são debatidas atualmente.</p></div>';
}
function markup(){
 var page=state.phase==='intro'?intro():state.phase==='explore'?explore():state.phase==='condense'?condense():state.phase==='shift'?shift():state.phase==='montage'?montage():state.phase==='classify'?classify():ending();
 return '<section id="dreamForge" class="df-root" aria-label="A Fábrica dos Sonhos, jogo de psicanálise">'+top()+'<div class="df-body">'+page+notice()+'</div><footer class="df-foot"><span>ATELIER · LABORATÓRIO DE PSICANÁLISE</span><span>UM SONHO INVENTADO, CONCEITOS REAIS</span></footer></section>';
}
function repaint(phaseChange){
 save();
 var old=document.getElementById('dreamForge');
 if(!old)return;
 var host=document.createElement('div');host.innerHTML=markup();
 old.replaceWith(host.firstElementChild);
 var node=document.getElementById('dreamForge');
 if(phaseChange && node)node.scrollIntoView({behavior:'auto',block:'start'});
}
function update(action,value){
 var oldPhase=state.phase;
 state.note='';state.noteType='';
 if(action==='start'){var b=state.best;state=empty();state.best=b;state.phase='explore';}
 else if(action==='memory' && state.phase==='explore'){
  var m=memories.find(function(x){return x.id===value;});if(!m)return;
  state.selectedMemory=value;if(!state.found.includes(value))state.found.push(value);
  if(state.found.length===3){seal(1);tip('As três pistas estão no diário! A oficina foi aberta.',true);}
 }
 else if(action==='toCondense'&&state.found.length===3)state.phase='condense';
 else if(action==='fragment'&&state.phase==='condense'&&!state.condensed){
  var valid=latent.some(function(x){return x.id===value;});if(!valid)return;
  if(state.combined.includes(value))state.combined=state.combined.filter(function(x){return x!==value;});
  else if(state.combined.length<2)state.combined.push(value);
  else tip('Escolha apenas dois fragmentos. Toque em um já selecionado para trocar.',false);
 }
 else if(action==='mix'&&state.phase==='condense'&&state.combined.length===2){
  if(state.combined.includes('pressa')&&state.combined.includes('mensagem')){state.condensed=true;seal(2);tip('Uma imagem, mais de um caminho de associação. Você descobriu a condensação!',true);}
  else tip('Observe o desenho: um relógio encontra uma carta. Quais lembranças conversam com essas duas formas?',false);
 }
 else if(action==='toShift'&&state.condensed)state.phase='shift';
 else if(action==='spot'&&state.phase==='shift'&&!state.shifted && ['palco','botao','carta'].includes(value))state.spot=value;
 else if(action==='confirmShift'&&state.phase==='shift'&&state.spot){
  if(state.spot==='botao'){state.shifted=true;seal(3);tip('O destaque passou para o pequeno botão. Você identificou o deslocamento na nossa cena.',true);}
  else tip('A descrição diz que o afeto se concentra em um detalhe pequeno do casaco. Para onde direcionar a luz?',false);
 }
 else if(action==='toMontage'&&state.shifted)state.phase='montage';
 else if(action==='scene'&&state.phase==='montage'&&!state.storyDone&&state.story.length<3&&frames.some(function(f){return f.id===value;})&&!state.story.includes(value))state.story.push(value);
 else if(action==='undoScene'&&state.phase==='montage'&&!state.storyDone)state.story.pop();
 else if(action==='sealStory'&&state.phase==='montage'&&state.story.length===3){state.storyDone=true;seal(4);tip('Você deu continuidade à sequência. Perceba a montagem que costura as cenas.',true);}
 else if(action==='toClassify'&&state.storyDone)state.phase='classify';
 else if(action==='evidence'&&state.phase==='classify'&&!state.classified[value]&&cards.some(function(c){return c.id===value;}))state.classifiedFocus=value;
 else if(action==='sort'&&state.phase==='classify'&&state.classifiedFocus&&['manifesto','associacao'].includes(value)){
  var c=cards.find(function(x){return x.id===state.classifiedFocus;});if(!c)return;
  if(c.type===value){state.classified[c.id]=value;state.classifiedFocus=null;tip(c.detail,true);
   if(Object.keys(state.classified).length===4){seal(5);tip('Todos os arquivos estão no lugar. A porta final está aberta!',true);}
  }else tip('Ainda não: observe se a frase descreve uma cena do sonho ou algo que a personagem associou depois.',false);
 }
 else if(action==='finish'&&state.phase==='classify'&&Object.keys(state.classified).length===4)state.phase='ending';
 else if(action==='restart'){var best=state.best;state=empty();state.best=best;state.phase='explore';}
 else if(action==='continue'){var next=document.querySelector('#dreamForge ~ .lesson-step, .lesson-step.example, .lesson-footer');if(next)next.scrollIntoView({behavior:'smooth',block:'start'});return;}
 else return;
 repaint(oldPhase!==state.phase);
}
document.addEventListener('click',function(e){
 var target=e.target.closest?e.target.closest('#dreamForge button[data-dream]'):null;
 if(!target||target.disabled)return;
 update(target.dataset.dream,target.dataset.value||'');
});
window.AtelierDreamForge={render:markup};
})();