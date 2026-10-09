/* ATELIER · O Mistério das Palavras Perdidas · jogo investigativo acessível e responsivo */
(function(){
'use strict';
const ALL=window.AtelierLostWordCases||[];
const KEY='atelier_palavras_perdidas_v1';
const PHASES=['intro','desk','sequence','theory','report','solved','end'];
const fresh=()=>({phase:'intro',caseIndex:0,seen:[],selected:0,compare:false,chain:[],picked:[],verdict:null,score:0,scores:[],granted:{clues:[],sequence:false,theory:false,report:false},feedback:'',good:false,mistakes:0});
let state=fresh();
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function restore(){
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(!saved||!PHASES.includes(saved.phase))return;state={...fresh(),...saved};
  state.caseIndex=Math.max(0,Math.min(ALL.length-1,Number(state.caseIndex)||0));
  state.seen=Array.isArray(state.seen)?Array.from(new Set(state.seen.filter(x=>Number.isInteger(x)&&x>=0&&x<4))):[];
  state.selected=Math.max(0,Math.min(3,Number(state.selected)||0));
  state.chain=Array.isArray(state.chain)?Array.from(new Set(state.chain.filter(x=>current().puzzle.some(p=>p[0]===x)))).slice(0,current().order.length):[];
  state.picked=Array.isArray(state.picked)?Array.from(new Set(state.picked.filter(x=>current().hypotheses.some(p=>p[0]===x)))).slice(0,2):[];
  state.scores=Array.isArray(state.scores)?state.scores.slice(0,ALL.length).map(x=>Math.max(0,Math.min(100,Number(x)||0))):[];
  state.score=Math.max(0,Math.min(100,Number(state.score)||0));
  state.granted=Object.assign(fresh().granted,state.granted||{});
  state.granted.clues=Array.isArray(state.granted.clues)?state.granted.clues.filter(x=>Number.isInteger(x)&&x>=0&&x<4):[];
 }catch(e){}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function current(){return ALL[state.caseIndex];}
restore();
function total(){return state.scores.reduce((a,b)=>a+b,0)+(state.phase==='end'?0:state.score);}
function note(msg,ok){state.feedback=msg;state.good=!!ok;}
function score(n){state.score=Math.min(100,state.score+n);}
function button(act,label,cls='',disable=false,value){return '<button type="button" class="wm-btn '+cls+'" data-wm="'+act+'"'+(value!=null?' data-id="'+esc(value)+'"':'')+(disable?' disabled':'')+'>'+label+'</button>';}
function header(){
 const step={intro:'APRESENTAÇÃO',desk:'INVESTIGUE',sequence:'RECONSTRUA',theory:'COMPARE',report:'CONCLUA',solved:'DESVENDADO',end:'FIM DO ARQUIVO'}[state.phase];
 return '<div class="wm-head"><div class="wm-brand"><span class="wm-brandmark">⌕</span><div><small>ATELIER · INVESTIGAÇÕES DO COTIDIANO</small><strong>O Mistério das Palavras Perdidas</strong></div></div><span class="wm-head-stamp">1901 · FREUD</span></div>'+
 '<div class="wm-progress"><span>'+step+' · '+(state.phase==='end'?'3/3':state.phase==='intro'?'0/3':(state.caseIndex+1)+'/3')+'</span><div role="progressbar" aria-label="Pontos conquistados" aria-valuemin="0" aria-valuemax="300" aria-valuenow="'+total()+'" class="wm-progressbar"><i style="width:'+(total()/3)+'%"></i></div><b>'+total()+' <small>/300</small></b></div>';
}
function feedback(){return state.feedback?'<div class="wm-feedback '+(state.good?'wm-feedback-ok':'')+'" role="status">'+esc(state.feedback)+'</div>':'';}
function intro(){
 return '<section class="wm-intro"><div class="wm-intro-copy"><span class="wm-kicker">TRÊS CASOS · UMA INVESTIGAÇÃO</span><h2>As palavras<br><em>deixam pistas.</em></h2><p>Um nome desaparece. Uma mensagem diz outra coisa. Um cartaz anuncia o contrário. Explore documentos, recupere acontecimentos e compare hipóteses para descobrir o que <strong>podemos</strong> — e o que não podemos — concluir.</p><div class="wm-micro"><span>✧ Documentos</span><span>✧ Enigmas</span><span>✧ Decisões</span></div>'+button('start','Abrir o primeiro arquivo ↗','wm-primary')+'<p class="wm-small">Sem cronômetro · Controle por toque · Progresso salvo no navegador</p></div><div class="wm-intro-art" aria-hidden="true"><div class="wm-art-circle"></div><div class="wm-paper wm-paper-back"><span>DATA 1901</span><b>PALAVRA<br>PERDIDA</b><small>ARQUIVO Nº 001</small></div><div class="wm-paper wm-paper-front"><span>DOCUMENTO Nº 002</span><b>ESQUE<span class="wm-redact">CER</span></b><small>ENCONTRAR?</small></div><div class="wm-glass"><span>?</span></div><div class="wm-art-stars">✧ · ✦ · ✧</div></div></section>'+
 '<div class="wm-context"><b>UM PRINCÍPIO DO JOGO</b><p>Freud investigou esquecimentos e lapsos em <em>Sobre a Psicopatologia da Vida Cotidiana</em> (1901). Os casos são fictícios. Uma palavra trocada não prova um desejo inconsciente: também importam causas técnicas, atenção, memória e associações singulares.</p></div>';
}
function caseIntro(){
 const c=current();
 return '<div class="wm-caseintro"><div><span class="wm-kicker">ARQUIVO '+c.num+' · '+esc(c.tag)+'</span><h2>'+esc(c.title)+'</h2><p>'+esc(c.summary)+'</p></div><div class="wm-casebadge"><span>'+c.glyph+'</span><small>'+esc(c.place)+'</small></div></div>';
}
function evidenceVisual(){
 const c=current();
 return '<div class="wm-evidence"><div class="wm-evidence-meta"><span>EVIDÊNCIA ORIGINAL</span><span>'+esc(c.doc)+'</span></div><div class="wm-evidence-sheet"><div class="wm-sheet-dots">· · ·</div><small>DOCUMENTO '+c.num+'</small><div class="wm-evidence-word" aria-live="polite">'+esc(state.compare?c.before:c.after)+'</div><div class="wm-evidence-caption">'+esc(c.small)+'</div></div><div class="wm-evidence-footer">'+(state.compare?'VERSÃO ANTERIOR':'REGISTRO OBSERVADO')+'</div>'+button('compare',state.compare?'← Voltar ao registro observado':'Comparar com a versão anterior →','wm-outline wm-wide')+'</div>';
}
function desk(){
 const c=current(),clue=c.clues[state.selected],n=state.seen.length;
 return caseIntro()+'<div class="wm-layout"><div>'+evidenceVisual()+'</div><div class="wm-investigate"><div class="wm-sectionhead"><div><span class="wm-kicker">01 · INVESTIGAR</span><h3>Pistas de um mistério</h3></div><strong>'+n+'/4</strong></div><p>Abra os documentos. Cada nova pista vale dez pontos; voltar a consultá-la não custa nada.</p><div class="wm-clues">'+c.clues.map((x,i)=>'<button type="button" class="wm-clue '+(i===state.selected?'on ':'')+(state.seen.includes(i)?'seen':'')+'" data-wm="clue" data-id="'+i+'" aria-pressed="'+(i===state.selected)+'"><span class="wm-clue-glyph">'+x[0]+'</span><span><small>'+esc(x[1])+'</small><b>'+esc(x[2])+'</b></span><i>'+(state.seen.includes(i)?'✓':'+')+'</i></button>').join('')+'</div><div class="wm-clue-description" aria-live="polite"><small>'+esc(clue[1])+'</small><h4>'+esc(clue[2])+'</h4><p>'+esc(clue[3])+'</p></div>'+button('toSequence','Reconstituir os acontecimentos →','wm-primary wm-wide',n!==4)+'</div></div>';
}
function sequence(){
 const c=current();return caseIntro()+'<div class="wm-layout"><div class="wm-storyboard"><span class="wm-kicker">02 · RECONSTITUIÇÃO</span><h3>O que veio primeiro?</h3><p>'+esc(c.puzzlePrompt)+'</p><div class="wm-chain">'+c.order.map((id,i)=>{const chosen=state.chain[i],x=c.puzzle.find(p=>p[0]===chosen);return '<div class="wm-chain-slot '+(x?'is-filled':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+(x?esc(x[1]):'<em>Selecione uma peça</em>')+'</strong></div>';}).join('')+'</div><div class="wm-row-actions">'+button('undo','↶ Voltar um passo','wm-outline',!state.chain.length)+button('clear','Limpar','wm-outline',!state.chain.length)+'</div></div><div class="wm-investigate"><span class="wm-kicker">PEÇAS DE INVESTIGAÇÃO</span><h3>Monte uma sequência</h3><p>Toque nos acontecimentos na ordem correta. Uma das opções tenta transformar uma hipótese em fato.</p><div class="wm-pieces">'+c.puzzle.map(x=>'<button type="button" class="wm-piece" data-wm="piece" data-id="'+x[0]+'" '+(state.chain.includes(x[0])||state.chain.length===c.order.length?'disabled':'')+'><span>'+x[2]+'</span><b>'+esc(x[1])+'</b><i>'+(state.chain.includes(x[0])?'✓':'+')+'</i></button>').join('')+'</div>'+button('checkSequence','Conferir a sequência','wm-primary wm-wide',state.chain.length!==c.order.length)+'</div></div>';
}
function theories(){
 const c=current();return caseIntro()+'<div class="wm-layout"><div class="wm-thinking"><span class="wm-kicker">03 · O PROBLEMA DAS HIPÓTESES</span><div class="wm-theory-scales"><div><small>OBSERVAÇÃO</small><strong>'+esc(c.quote)+'</strong></div><div class="wm-symbol">≠</div><div><small>INTERPRETAÇÃO</small><strong>Uma explicação depende de contexto.</strong></div></div><div class="wm-clarity"><b>Algo aconteceu. Mas por quê?</b><p>Um registro, uma associação e uma causa confirmada pertencem a níveis diferentes. Uma hipótese interessante não é automaticamente verdadeira.</p></div></div><div class="wm-investigate"><span class="wm-kicker">ESCOLHA DUAS POSSIBILIDADES</span><h3>O que merece investigação?</h3><p>Selecione duas explicações que podem ser discutidas. Evite a afirmação que diz conhecer o inconsciente da personagem com certeza.</p><div class="wm-theory-list">'+c.hypotheses.map(x=>'<button type="button" class="wm-theory '+(state.picked.includes(x[0])?'selected':'')+'" data-wm="hypothesis" data-id="'+x[0]+'" aria-pressed="'+state.picked.includes(x[0])+'"><span>'+(state.picked.includes(x[0])?'✓':'○')+'</span><span><b>'+esc(x[1])+'</b><small>'+esc(x[2])+'</small></span></button>').join('')+'</div><div class="wm-selection">'+state.picked.length+' / 2 possibilidades selecionadas</div>'+button('checkTheory','Confrontar hipóteses','wm-primary wm-wide',state.picked.length!==2)+'</div></div>';
}
function report(){
 const c=current();return caseIntro()+'<div class="wm-layout"><div class="wm-report"><span>RELATÓRIO Nº '+c.num+' / PARTE FINAL</span><div class="wm-report-icon">⌕</div><h3>O que é possível afirmar?</h3><p>Você reuniu pistas, reconstruiu uma sequência e comparou hipóteses. Agora assine apenas aquilo que os dados permitem concluir.</p><div class="wm-report-evidence"><div><small>PISTAS LIDAS</small><b>4/4</b></div><div><small>SEQUÊNCIA</small><b>✓</b></div><div><small>HIPÓTESES</small><b>2/2</b></div></div></div><div class="wm-investigate"><span class="wm-kicker">04 · CONCLUSÃO RESPONSÁVEL</span><h3>Qual relatório você entregaria?</h3><p>Escolha o texto que distingue observação, interpretação e limites.</p><div class="wm-verdict-list">'+c.verdicts.map((x,i)=>'<button type="button" class="wm-verdict '+(state.verdict===i?'selected':'')+'" data-wm="verdict" data-id="'+i+'" aria-pressed="'+(state.verdict===i)+'"><span>'+String.fromCharCode(65+i)+'</span><b>'+esc(x)+'</b></button>').join('')+'</div>'+button('submit','Entregar relatório','wm-primary wm-wide',state.verdict===null)+'</div></div>';
}
function solved(){
 const c=current();
 return '<div class="wm-result"><div class="wm-result-stamp">✓</div><span class="wm-kicker">ARQUIVO '+c.num+' · ENCERRADO</span><h2>Você desvendou o enigma. Não a pessoa.</h2><p>'+esc(c.lesson)+'</p><div class="wm-scorecards"><div><small>ESSE CASO</small><strong>'+state.score+'<span>/100</span></strong></div><div><small>SUA PONTUAÇÃO</small><strong>'+total()+'<span>/300</span></strong></div></div>'+button('next',state.caseIndex===2?'Abrir o dossiê completo ✦':'Investigar o próximo caso →','wm-primary')+'<p class="wm-small">O jogo recompensa curiosidade e cuidado com a interpretação. Não se trata de um instrumento diagnóstico.</p></div>';
}
function end(){
 const sum=state.scores.reduce((a,b)=>a+b,0);
 return '<div class="wm-ending"><div class="wm-result-stamp">⌕</div><span class="wm-kicker">ATELIER · INVESTIGAÇÃO CONCLUÍDA</span><h2>O melhor detetive sabe fazer perguntas.</h2><p>Você percorreu três casos, encontrou pistas e evitou transformar qualquer equívoco em uma certeza sobre outra pessoa.</p><div class="wm-total">'+sum+' <small>DE 300 PONTOS</small></div><div class="wm-end-files">'+ALL.map((c,i)=>'<div><span>ARQUIVO '+c.num+'</span><b>'+esc(c.title)+'</b><strong>'+state.scores[i]+'/100</strong></div>').join('')+'</div><div class="wm-context wm-end-context"><b>PARA LEVAR AO ESTUDO</b><p>Freud estudou atos falhos e esquecimentos a partir de associações. Hoje, também consideramos fenômenos linguísticos, memória, atenção e tecnologia. Nenhuma palavra isolada oferece uma tradução definitiva do inconsciente.</p></div>'+button('restart','Jogar novamente ↺','wm-outline')+'<p class="wm-small">Por caso: 4 pistas × 10 + reconstrução 20 + comparação 20 + relatório 20 = 100 pontos.</p></div>';
}
function render(){
 if(!ALL.length)return '<div id="wordMystery">Não foi possível carregar os casos. Atualize a página.</div>';
 const views={intro,desk,sequence,theory:theories,report,solved,end};
 return '<section id="wordMystery" class="wm-game" aria-label="O Mistério das Palavras Perdidas, jogo educativo">'+header()+'<main class="wm-body">'+views[state.phase]()+feedback()+'</main><footer class="wm-footer"><span>ATELIER · PSICOPATOLOGIA DA VIDA COTIDIANA</span><span>FICÇÃO DIDÁTICA · NÃO É DIAGNÓSTICO</span></footer></section>';
}
function freshCase(){const i=state.caseIndex,scores=state.scores.slice();state=fresh();state.caseIndex=i;state.scores=scores;state.phase='desk';}
function clickAction(action,val){
 if(!ALL.length)return;
 const c=current(),previousPhase=state.phase;state.feedback='';
 if(action==='start'&&state.phase==='intro'){state.phase='desk';state.selected=0;}
 else if(action==='compare'&&state.phase==='desk')state.compare=!state.compare;
 else if(action==='clue'&&state.phase==='desk'){
  const n=Number(val);if(!Number.isInteger(n)||n<0||n>=c.clues.length)return;state.selected=n;
  if(!state.seen.includes(n)){state.seen.push(n);if(!state.granted.clues.includes(n)){state.granted.clues.push(n);score(10);}}
  if(state.seen.length===4)note('As quatro pistas foram encontradas. Agora você pode reconstruir a história.',true);
 }
 else if(action==='toSequence'&&state.phase==='desk'&&state.seen.length===4)state.phase='sequence';
 else if(action==='piece'&&state.phase==='sequence'&&state.chain.length<c.order.length&&c.puzzle.some(x=>x[0]===val)&&!state.chain.includes(val))state.chain.push(val);
 else if(action==='undo'&&state.phase==='sequence')state.chain.pop();
 else if(action==='clear'&&state.phase==='sequence')state.chain=[];
 else if(action==='checkSequence'&&state.phase==='sequence'&&state.chain.length===c.order.length){
  if(state.chain.join('|')===c.order.join('|')){if(!state.granted.sequence){score(20);state.granted.sequence=true;}state.phase='theory';note('Sequência reconstruída! Repare como o arquivo difere de uma interpretação.',true);}
  else{state.mistakes++;note('A sequência contém algo fora de lugar. Confira os registros: uma peça não é um fato observado.',false);}
 }
 else if(action==='hypothesis'&&state.phase==='theory'&&c.hypotheses.some(x=>x[0]===val)){
  if(state.picked.includes(val))state.picked=state.picked.filter(x=>x!==val);
  else if(state.picked.length<2)state.picked.push(val);
  else note('Para trocar uma hipótese, desmarque uma das duas selecionadas.',false);
 }
 else if(action==='checkTheory'&&state.phase==='theory'&&state.picked.length===2){
  if(c.good.every(x=>state.picked.includes(x))){if(!state.granted.theory){score(20);state.granted.theory=true;}state.phase='report';note('Você comparou possibilidades sem transformar hipótese em certeza.',true);}
  else{state.mistakes++;note('Uma das propostas diz saber mais do que os dados permitem. Compare novamente as opções.',false);}
 }
 else if(action==='verdict'&&state.phase==='report'){let n=Number(val);if(Number.isInteger(n)&&n>=0&&n<c.verdicts.length)state.verdict=n;}
 else if(action==='submit'&&state.phase==='report'&&state.verdict!==null){
  if(state.verdict===c.answer){if(!state.granted.report){score(20);state.granted.report=true;}state.phase='solved';note('Relatório aceito: você respeitou os limites das evidências.',true);}
  else{state.mistakes++;note('O relatório vai além das evidências. Revise a diferença entre hipótese e fato.',false);}
 }
 else if(action==='next'&&state.phase==='solved'){
  state.scores[state.caseIndex]=state.score;
  if(state.caseIndex===ALL.length-1){state.phase='end';state.score=0;}
  else{state.caseIndex++;freshCase();}
 }
 else if(action==='restart'&&state.phase==='end')state=fresh();
 else return;
 save();const old=document.getElementById('wordMystery');
 if(old){const temp=document.createElement('div');temp.innerHTML=render();old.replaceWith(temp.firstElementChild);
  if(previousPhase!==state.phase){const next=document.getElementById('wordMystery');if(next)next.scrollIntoView({behavior:'auto',block:'start'});}
 }
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#wordMystery button[data-wm]');if(b&&!b.disabled)clickAction(b.dataset.wm,b.dataset.id||'');});
window.AtelierWordMystery={render};
})();