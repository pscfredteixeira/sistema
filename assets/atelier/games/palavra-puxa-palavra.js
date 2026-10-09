/* Atelier | Palavra Puxa Palavra | cadeia significante em tres fases
   Arquivo independente, sem dependencias, API ou servico externo. */
(function(){
'use strict';
const STORE='atelier_palavra_puxa_palavra_v1';
const DATA=[
'CASA:FAMÍLIA|PORTA|MEMÓRIA',
'FAMÍLIA:SEGREDO|ENCONTRO|RAIZ','PORTA:SAÍDA|CHAVE|ESPERA','MEMÓRIA:INFÂNCIA|FOTOGRAFIA|AUSÊNCIA',
'SEGREDO:SILÊNCIO|CARTA|PROMESSA','ENCONTRO:CONVERSA|ABRAÇO|DISTÂNCIA','RAIZ:ORIGEM|ÁRVORE|PERTENCIMENTO',
'SAÍDA:LIBERDADE|CAMINHO|RECOMEÇO','CHAVE:ACESSO|FECHADURA|ESCOLHA','ESPERA:TEMPO|ESTAÇÃO|ANSIEDADE',
'INFÂNCIA:BRINCADEIRA|QUINTAL|HISTÓRIA','FOTOGRAFIA:RETRATO|ROSTO|LEMBRANÇA','AUSÊNCIA:SAUDADE|VAZIO|PROCURA',
'SILÊNCIO:SEGURANÇA|ESCUTA|ISOLAMENTO','CARTA:NOTÍCIA|ENDEREÇO|CONFISSÃO','PROMESSA:FUTURO|CONFIANÇA|DÚVIDA',
'CONVERSA:PERGUNTA|VOZ|ACORDO','ABRAÇO:CALOR|PROTEÇÃO|DESPEDIDA','DISTÂNCIA:MAPA|SAUDADE|FRONTEIRA',
'ORIGEM:NOME|PASSADO|PERCURSO','ÁRVORE:SOMBRA|CRESCIMENTO|TEMPO','PERTENCIMENTO:GRUPO|LINGUAGEM|DIFERENÇA',
'LIBERDADE:DECISÃO|RISCO|HORIZONTE','CAMINHO:VIAGEM|ESCOLHA|ENCRUZILHADA','RECOMEÇO:MANHÃ|CORAGEM|POSSIBILIDADE',
'ACESSO:ENCONTRO|PASSAGEM|LIMITE','FECHADURA:SEGREDO|LADO DE FORA|PROTEÇÃO','ESCOLHA:RENÚNCIA|DESEJO|POSSIBILIDADE',
'TEMPO:RELÓGIO|ESPERA|MUDANÇA','ESTAÇÃO:TREM|PARTIDA|RETORNO','ANSIEDADE:INCERTEZA|PRESSA|EXPECTATIVA',
'BRINCADEIRA:REGRAS|INVENÇÃO|RISOS','QUINTAL:TERRA|REFÚGIO|CAMINHO','HISTÓRIA:VOZ|ENREDO|ESQUECIMENTO',
'RETRATO:IMAGEM|OLHAR|IDENTIDADE','ROSTO:RECONHECIMENTO|EXPRESSÃO|MÁSCARA','LEMBRANÇA:AFETO|TEMPO|PERDA',
'SAUDADE:DISTÂNCIA|ENCONTRO|FALTA','VAZIO:ECO|ESPAÇO|POSSIBILIDADE','PROCURA:PISTA|PERGUNTA|DESCOBERTA'
];
const GRAPH=Object.fromEntries(DATA.map(x=>{const i=x.indexOf(':');return [x.slice(0,i),x.slice(i+1).split('|')];}));
const RETRO=[
 {title:'O que significa estar livre?',words:['ELE DISSE','QUE ESTAVA','LIVRE'],ends:[
  ['DA PRISÃO','“Livre” passa a ser lido como saída de uma situação de confinamento.'],
  ['DO MEDO','“Livre” pode indicar uma experiência subjetiva, e não uma condição física.'],
  ['PARA PARTIR','“Livre” sugere agora uma possibilidade de tomar uma decisão.']]},
 {title:'Uma porta, três sentidos',words:['A PORTA','FICOU','ABERTA'],ends:[
  ['PARA TODOS','A abertura pode significar acesso e acolhimento.'],
  ['POR DESCUIDO','A mesma abertura pode ser lida como um erro.'],
  ['NO SONHO','O evento pode fazer parte de uma imagem narrada, não de um acontecimento literal.']]},
 {title:'Um retorno inesperado',words:['ELE','VOLTOU','PARA CASA'],ends:[
  ['NO SONHO','O retorno que parecia um fato passa a fazer parte de um relato onírico.'],
  ['DEPOIS DE ANOS','A longa ausência modifica nossa leitura do retorno.'],
  ['NA HISTÓRIA','A frase passa a pertencer a uma narrativa, não necessariamente a uma notícia.']]}
];
const fresh=(r=0)=>({phase:1,a:[],b:[],scene:-1,ending:-1,seen:[],round:r});
let s=fresh();
function validChain(c){let w='CASA';if(!Array.isArray(c)||c.length>4)return false;for(const n of c){if(!(GRAPH[w]||[]).includes(n))return false;w=n;}return true;}
function valid(x){return x&&Number.isInteger(x.phase)&&x.phase>=1&&x.phase<=4&&validChain(x.a)&&validChain(x.b)&&Number.isInteger(x.scene)&&x.scene>=-1&&x.scene<=2&&Number.isInteger(x.ending)&&x.ending>=-1&&x.ending<=2&&Array.isArray(x.seen)&&x.seen.every(k=>Number.isInteger(k)&&k>=0&&k<=2)&&(x.phase<=1||x.a.length===4)&&(x.phase<=2||(x.b.length===4&&x.a[0]!==x.b[0]));}
try{const old=JSON.parse(localStorage.getItem(STORE)||'null');if(valid(old))s=old;}catch(e){}
function save(){try{localStorage.setItem(STORE,JSON.stringify(s));}catch(e){}}
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function button(label,action,more=''){return '<button class="pp-button '+more+'" type="button" data-pp="'+action+'">'+label+'</button>';}
function chain(words,compact=false){
 const list=['CASA',...words];
 return '<div class="pp-chain '+(compact?'pp-compact':'')+'" role="list" aria-label="Cadeia de palavras: '+esc(list.join(', '))+'">'+
 list.map((w,i)=>'<div class="pp-token '+(i===list.length-1?'pp-last':'')+'" role="listitem"><span class="pp-dot" aria-hidden="true"></span><b>'+esc(w)+'</b></div>').join('')+'</div>';
}
function options(c){
 const last=c.length?c[c.length-1]:'CASA';
 return (GRAPH[last]||[]).filter(x=>!(s.phase===2&&c.length===0&&x===s.a[0]));
}
function phase12(){
 const second=s.phase===2,words=second?s.b:s.a,finished=words.length===4;
 let h='<div class="pp-eyebrow">EXPERIÊNCIA '+s.phase+' / 3</div><h2>'+(second?'Um começo, outros caminhos':'Até onde uma palavra pode levar?')+'</h2>'+
 '<p class="pp-lead">'+(second?'O começo será CASA novamente. Escolha outro primeiro passo e descubra aonde ele leva.':'Toque em uma palavra para ligá-la à anterior. Cada escolha abrirá três novas possibilidades. Não existe resposta certa.')+'</p>';
 if(second)h+='<div class="pp-archived"><small>PRIMEIRA CADEIA · GUARDADA</small>'+chain(s.a,true)+'</div>';
 h+='<div class="pp-board"><div class="pp-board-head"><strong>CADEIA '+(second?'B':'A')+'</strong><span>'+words.length+'/4 escolhas</span></div>'+
 chain(words)+'<div class="pp-meter"><i style="width:'+(words.length*25)+'%"></i></div>';
 if(!finished){
  const choices=options(words);
  h+='<div class="pp-prompt"><span>✧</span><div><b>Qual palavra vem agora?</b><p>Escolha uma associação para <strong>'+esc(words.length?words[words.length-1]:'CASA')+'</strong>.</p></div></div>'+
  '<div class="pp-choices" role="group" aria-label="Palavras para continuar">'+choices.map(w=>'<button class="pp-choice" type="button" data-pp="word" data-word="'+esc(w)+'"><i aria-hidden="true"></i><b>'+esc(w)+'</b><span aria-hidden="true">↗</span></button>').join('')+'</div>';
  if(second&&words.length===0)h+='<p class="pp-note">A primeira escolha da cadeia anterior foi retirada para você experimentar outro caminho.</p>';
 }else{
  h+='<div class="pp-insight" role="status"><b>✦ '+(second?'Compare os dois caminhos':'Você criou uma cadeia')+'</b><p>'+(second?'A mesma palavra inicial não determinou sozinha o resultado: as relações entre significantes modificaram o percurso.':'Você começou com uma palavra e chegou a outra diferente. Cada significante abriu caminho para o próximo; o sentido foi sendo construído ao longo da cadeia.')+'</p></div>';
  if(second)h+='<div class="pp-compare"><div><small>CAMINHO 01</small>'+chain(s.a,true)+'</div><div><small>CAMINHO 02</small>'+chain(s.b,true)+'</div></div>';
  h+=button(second?'Explorar o sentido retroativo →':'Criar outro caminho →','next','pp-primary pp-wide');
 }
 return h+'</div>';
}
function retro(){
 let h='<div class="pp-eyebrow">EXPERIÊNCIA 3 / 3 · EFEITO RETROATIVO</div><h2>O fim muda a leitura.</h2><p class="pp-lead">Uma expressão que vem depois pode mudar como entendemos as anteriores. Experimente dois finais diferentes para a mesma frase.</p>';
 if(s.scene<0){
  return h+'<div class="pp-board"><h3>Qual frase você quer explorar?</h3><div class="pp-scene-options">'+RETRO.map((r,i)=>'<button type="button" class="pp-scene" data-pp="scene" data-i="'+i+'"><span>0'+(i+1)+'</span><span><b>'+esc(r.title)+'</b><small>'+esc(r.words.join(' · '))+'</small></span><span>↗</span></button>').join('')+'</div></div>';
 }
 const r=RETRO[s.scene];
 h+='<div class="pp-board"><div class="pp-board-head"><strong>UMA FRASE EM CONSTRUÇÃO</strong><span>'+s.seen.length+'/2 finais comparados</span></div>';
 h+='<div class="pp-retro-line '+(s.ending>=0?'pp-lit':'')+'" role="list" aria-label="Frase alterada pelo final">'+r.words.map(w=>'<div class="pp-retro-token" role="listitem">'+esc(w)+'</div>').join('')+(s.ending>=0?'<div class="pp-retro-token pp-final-token" role="listitem">'+esc(r.ends[s.ending][0])+'</div>':'<div class="pp-retro-token pp-empty" role="listitem">?</div>')+'</div>';
 h+='<div class="pp-prompt"><span>✧</span><div><b>'+(s.ending<0?'Escolha um final':'Agora mude o final')+'</b><p>Observe como a última expressão afeta o sentido da frase inteira.</p></div></div>';
 h+='<div class="pp-choices" role="group" aria-label="Escolhas de final">'+r.ends.map((v,i)=>'<button class="pp-choice '+(s.ending===i?'pp-current':'')+'" type="button" data-pp="end" data-i="'+i+'" aria-pressed="'+(s.ending===i)+'"><i></i><b>'+esc(v[0])+'</b><span>'+(s.ending===i?'✓':'↗')+'</span></button>').join('')+'</div>';
 if(s.ending>=0)h+='<div class="pp-insight pp-retro-insight" role="status"><b>O final reorganiza a leitura</b><p>'+esc(r.ends[s.ending][1])+'</p><small>Repare como o sentido dos termos anteriores pode mudar.</small></div>';
 if(s.seen.length>=2)h+=button('Concluir a experiência →','next','pp-primary pp-wide');
 else if(s.ending>=0)h+='<p class="pp-note">Experimente mais um final para perceber a diferença.</p>';
 return h+'</div>';
}
function finish(){
 return '<div class="pp-finish"><div class="pp-finish-star" aria-hidden="true">✧</div><span class="pp-eyebrow">TRÊS EXPERIÊNCIAS CONCLUÍDAS</span>'+
 '<h2>Palavra puxa palavra.<br>O sentido se transforma.</h2>'+
 '<blockquote>“O inconsciente é estruturado como uma linguagem.” <small>— Jacques Lacan</small></blockquote>'+
 '<p>Para Lacan, o inconsciente não é apenas um depósito de pensamentos escondidos. Ele se manifesta em formações como sonhos, lapsos e sintomas, nas quais os significantes estabelecem relações, se substituem e produzem efeitos de sentido.</p>'+
 '<p>As palavras não funcionam isoladamente: sua posição e suas relações na linguagem importam.</p>'+
 '<div class="pp-insight"><b>O que você observou</b><p>Um mesmo início gerou cadeias distintas, e uma expressão posterior alterou a interpretação das anteriores.</p></div>'+
 button('Jogar novamente ↺','restart','pp-primary pp-wide')+
 '<p class="pp-disclaimer">Experiência didática sobre a articulação significante, não simulação literal da análise. Associações não são diagnósticos nem traduções universais do inconsciente.</p></div>';
}
function render(){
 const step=Math.min(s.phase,3);
 return '<section class="pp-game" id="palavraPuxaPalavra" aria-label="Jogo Palavra Puxa Palavra">'+
 '<header class="pp-header"><div class="pp-brand"><span aria-hidden="true">✧</span><div><small>ATELIER · JACQUES LACAN</small><strong>Palavra Puxa Palavra</strong></div></div><button class="pp-reset" type="button" data-pp="restart">↺ Recomeçar</button></header>'+
 '<div class="pp-progress"><b>'+(s.phase===4?'CONCLUÍDO':'FASE '+step+' DE 3')+'</b><div aria-hidden="true">'+[1,2,3].map(i=>'<i class="'+(s.phase>i?'pp-done':s.phase===i?'pp-active':'')+'"></i>').join('')+'</div></div>'+
 '<div class="pp-main">'+(s.phase===4?finish():s.phase===3?retro():phase12())+'</div>'+
 '<footer class="pp-footer">EXPERIMENTO COM A LINGUAGEM <span>SEM CRONÔMETRO · CONTROLE POR TOQUE</span></footer></section>';
}
function repaint(top=false){
 const root=document.getElementById('palavraPuxaPalavra');if(!root)return;
 const tmp=document.createElement('div');tmp.innerHTML=render();root.replaceWith(tmp.firstElementChild);
 const here=document.getElementById('palavraPuxaPalavra');
 if(top){here.scrollIntoView({block:'start',behavior:'auto'});const h=here.querySelector('h2');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}}
 else{const b=here.querySelector('.pp-choice:not([disabled]),.pp-primary');if(b)try{b.focus({preventScroll:true});}catch(e){}}
}
document.addEventListener('click',function(e){
 const b=e.target.closest&&e.target.closest('#palavraPuxaPalavra button[data-pp]');if(!b||b.disabled)return;
 const action=b.dataset.pp;
 if(action==='restart'){s=fresh((s.round||0)+1);save();repaint(true);return;}
 if(action==='word'&&(s.phase===1||s.phase===2)){
  const words=s.phase===1?s.a:s.b,w=b.dataset.word;if(words.length===4||!options(words).includes(w))return;
  words.push(w);save();repaint();return;
 }
 if(action==='scene'&&s.phase===3&&s.scene===-1){
  const i=Number(b.dataset.i);if(!Number.isInteger(i)||i<0||i>=RETRO.length)return;
  s.scene=i;s.ending=-1;s.seen=[];save();repaint();return;
 }
 if(action==='end'&&s.phase===3&&s.scene>=0){
  const i=Number(b.dataset.i);if(!Number.isInteger(i)||i<0||i>=3)return;
  s.ending=i;if(!s.seen.includes(i))s.seen.push(i);save();repaint();return;
 }
 if(action==='next'){
  if(s.phase===1&&s.a.length===4)s.phase=2;
  else if(s.phase===2&&s.b.length===4)s.phase=3;
  else if(s.phase===3&&s.seen.length>=2)s.phase=4;
  else return;save();repaint(true);
 }
});
window.AtelierPalavraPuxaPalavra={render:render};
})();
