/* ATELIER · Palavras Perdidas 2.0: três microaventuras sem questionários */
(function(){
'use strict';
const C=window.AtelierWordsTwoCases||[];
const KEY='atelier_palavras_microaventuras_v2';
const fresh=()=>({index:0,phase:'play',opened:false,seen:[],message:'',sent:false,compared:false,postFound:false});
let s=fresh();
try{
 const v=JSON.parse(localStorage.getItem(KEY)||'null');
 if(v&&Number.isInteger(v.index)&&v.index>=0&&v.index<=3){
   s=Object.assign(fresh(),v);
   s.seen=Array.isArray(s.seen)?s.seen.filter(x=>x==='0'||x==='1'):[];
   if(!['play','end'].includes(s.phase))s.phase='play';
 }
}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function btn(action,label,extra='',data=''){return '<button type="button" class="pw-btn '+extra+'" data-pw="'+action+'"'+(data?' data-value="'+esc(data)+'"':'')+'>'+label+'</button>';}
function header(){
 const end=s.phase==='end'||s.index>=3;
 return '<header class="pw-header"><div class="pw-identity"><span class="pw-mark">⌕</span><div><small>ATELIER · JOGO 02</small><strong>Palavras Perdidas</strong></div></div>'+btn('restart','↺ Recomeçar','pw-restart')+'</header><div class="pw-progress"><span>'+(end?'AVENTURA CONCLUÍDA':'HISTÓRIA '+(s.index+1)+' DE 3')+'</span><div class="pw-segments" aria-hidden="true">'+[0,1,2].map((i)=>'<i class="'+(end||s.index>i?'done':s.index===i?'current':'')+'"></i>').join('')+'</div></div>';
}
function character(c){return '<div class="pw-dialogue"><span class="pw-avatar">'+c.initial+'</span><div><small>'+esc(c.name).toUpperCase()+'</small><p>'+esc(c.speech)+'</p></div></div>';}
function progressNote(number,text){return '<div class="pw-instruction"><span>'+number+'</span><strong>'+text+'</strong></div>';}
function clues(c){
 return '<div class="pw-extra"><div class="pw-miniheading">QUER INVESTIGAR MAIS? <span>OPCIONAL</span></div><div class="pw-clue-list">'+c.prompts.map((p,i)=>{
 const open=s.seen.includes(String(i));
 return '<div class="pw-clue-entry">'+btn('clue','<span>'+p[1]+'</span><b>'+esc(p[2])+'</b><i>'+(open?'✓':'＋')+'</i>',(open?'pw-clue-button active':'pw-clue-button'),String(i))+
 (open?'<p>'+esc(p[3])+'</p>':'')+'</div>';
 }).join('')+'</div></div>';
}
function lesson(c){
 return '<div class="pw-learning" role="note"><span>✧ A DESCOBERTA</span><p>'+esc(c.takeaway)+'</p><small>'+esc(c.concept).toUpperCase()+' · FREUD, 1901</small></div>';
}
function next(){return btn('next',s.index===2?'Concluir a aventura →':'Continuar para a próxima história →','pw-primary pw-next');}
function invitation(c){
 return '<section class="pw-content"><div class="pw-chapter"><small>01 · UMA FESTA</small><h2>'+esc(c.title)+'</h2><p>'+esc(c.intro)+'</p></div>'+character(c)+
 progressNote(s.opened?'✓':'1',s.opened?'Você encontrou o nome!':'Toque no convite para revelar o nome esquecido.')+
 '<div class="pw-invite-stage"><button type="button" class="pw-invite '+(s.opened?'open':'')+'" data-pw="open" aria-label="Revelar nome no convite"><span class="pw-paper-label">CONVITE · SEXTA-FEIRA · 19H40</span><span class="pw-ornament">✧ ✦ ✧</span><small>APRESENTAÇÃO DE</small><strong>'+(s.opened?'MARINA COSTA':'MARINA <span class="pw-redact">?????</span>')+'</strong><span class="pw-paper-bottom">ATELIER SOCIAL · SALÃO PRINCIPAL</span></button><div class="pw-tap-label">'+(s.opened?'✓ Nome encontrado':'↑ TOQUE NO CONVITE')+'</div></div>'+
 (s.opened?'<div class="pw-reveal"><strong>O nome estava lá o tempo todo.</strong><p>Lia o conhecia e o esqueceu naquele momento. Isso não diz, por si só, o motivo.</p></div>'+clues(c)+lesson(c)+next():'<p class="pw-smallhelp">Não precisa arrastar nada. Um toque revela a primeira surpresa.</p>')+'</section>';
}
function phone(c){
 const sent=s.sent;
 const phone='<div class="pw-phone"><div class="pw-phone-notch"></div><div class="pw-phone-header"><span>‹</span><b>Rui</b><span>⋯</span></div><div class="pw-phone-chat">'+
 '<div class="pw-message received">A gente conversa hoje?</div>'+
 (sent?'<div class="pw-message outgoing">Queria te <b>esquecer.</b></div><div class="pw-phone-stamp">Enviada · 22:14</div>':'<form id="pw-send-form" class="pw-form"><label for="pw-word">Complete a mensagem que Bia quer enviar:</label><div class="pw-compose"><span>Queria te</span><input id="pw-word" name="word" type="text" maxlength="24" placeholder="encontrar" value="'+esc(s.message)+'" autocomplete="off" autocapitalize="off" spellcheck="false" required><span>.</span></div><button type="submit" class="pw-send" aria-label="Enviar a mensagem">➤ <span>Enviar mensagem</span></button></form>')+
 '</div></div>';
 return '<section class="pw-content"><div class="pw-chapter"><small>02 · NO CELULAR</small><h2>'+esc(c.title)+'</h2><p>'+esc(c.intro)+'</p></div>'+character(c)+
 progressNote(sent?'✓':'1',sent?'A mensagem saiu diferente!':'Digite “encontrar” e envie a mensagem.')+
 '<div class="pw-phone-stage">'+phone+'</div>'+
 (sent?'<div class="pw-reveal pw-alert"><strong>Mas o que foi enviado?</strong><p>Bia escreveu “encontrar”, mas o aparelho mostrou “esquecer”. Não sabemos ainda por quê.</p>'+btn('compare',s.compared?'Ocultar rascunho':'Comparar com o que ela escreveu','pw-secondary')+(s.compared?'<div class="pw-comparison"><span>ELA ESCREVEU <b>encontrar</b></span><span>FOI ENVIADO <b>esquecer</b></span></div>':'')+'</div>'+clues(c)+lesson(c)+next():
 '<p class="pw-smallhelp">Você pode tocar no campo e digitar, ou usar o atalho abaixo.</p>'+btn('fill','Preencher com “encontrar”','pw-secondary pw-smallbtn')+'<div id="pw-form-message" class="pw-form-error" role="status" aria-live="polite"></div>')+'</section>';
}
function poster(c){
 return '<section class="pw-content"><div class="pw-chapter"><small>03 · NA BIBLIOTECA</small><h2>'+esc(c.title)+'</h2><p>'+esc(c.intro)+'</p></div>'+character(c)+
 progressNote(s.postFound?'✓':'1',s.postFound?'Você identificou a palavra alterada.':'Encontre o erro. Toque na palavra suspeita no cartaz.')+
 '<div class="pw-posters"><div class="pw-poster"><span>PUBLICADO HOJE</span><div class="pw-poster-paper"><small>BIBLIOTECA · INFORMAÇÃO</small><b>REUNIÃO</b><button type="button" class="pw-poster-word '+(s.postFound?'found':'')+'" data-pw="poster" aria-label="Investigar a palavra cancelada">CANCELADA</button><span>ENCONTRO · 18H30</span></div></div>'+
 (s.postFound?'<div class="pw-poster"><span>ARQUIVO ORIGINAL</span><div class="pw-poster-paper original"><small>BIBLIOTECA · DOCUMENTO</small><b>REUNIÃO</b><strong>CONFIRMADA</strong><span>ENCONTRO · 18H30</span></div></div>':'<div class="pw-poster-placeholder"><span>?</span><p>O arquivo original aparece depois que você encontra a palavra diferente.</p></div>')+'</div>'+
 (s.postFound?'<div class="pw-reveal"><strong>A mesma reunião, duas mensagens opostas.</strong><p>A diferença é clara. A intenção de quem cometeu o erro ainda não.</p></div>'+clues(c)+lesson(c)+next(): '<p class="pw-smallhelp">A palavra grande no cartaz é um botão. Toque nela para comparar.</p>')+'</section>';
}
function ending(){
 return '<section class="pw-ending"><div class="pw-end-symbol">✦</div><small>TRÊS HISTÓRIAS · TRÊS DESCOBERTAS</small><h2>Você investigou. Não adivinhou.</h2><p>Freud observou que esquecimentos, trocas de palavras e outros lapsos poderiam ganhar sentido nas associações de cada sujeito. Mas nenhum episódio isolado entrega uma interpretação pronta.</p><div class="pw-achievements">'+C.map((c,i)=>'<div><span>0'+(i+1)+'</span><div><strong>'+esc(c.concept)+'</strong><p>'+esc(c.takeaway)+'</p></div><b>✓</b></div>').join('')+'</div><p class="pw-smallhelp">Casos fictícios inspirados em <em>Sobre a Psicopatologia da Vida Cotidiana</em> (1901). Um jogo não é ferramenta de diagnóstico.</p>'+btn('restart','Jogar novamente ↺','pw-primary pw-next')+'</section>';
}
function render(){
 if(!C.length)return '<section id="wordMystery"><p>As histórias ainda não foram carregadas. Atualize a página.</p></section>';
 return '<section class="pw-game" id="wordMystery" aria-label="O Mistério das Palavras Perdidas: jogo educativo">'+header()+'<div class="pw-body">'+(s.phase==='end'||s.index>=3?ending():[invitation,phone,poster][s.index](C[s.index]))+'</div><footer class="pw-footer">UMA AÇÃO DE CADA VEZ <span>ATELIER · FREUD</span></footer></section>';
}
function update(scroll){
 save();
 const old=document.getElementById('wordMystery');if(!old)return;
 const holder=document.createElement('div');holder.innerHTML=render();old.replaceWith(holder.firstElementChild);
 const freshRoot=document.getElementById('wordMystery');
 if(scroll==='top')freshRoot.scrollIntoView({block:'start',behavior:'auto'});
 if(scroll==='more'){const el=freshRoot.querySelector('.pw-reveal');if(el)el.scrollIntoView({block:'nearest',behavior:'auto'});}
}
function act(name,value){
 if(name==='restart'){s=fresh();update('top');return;}
 if(name==='next'&&((s.index===0&&s.opened)||(s.index===1&&s.sent)||(s.index===2&&s.postFound))){
  if(s.index===2){s.phase='end';s.index=3;}else{s.index++;s.opened=false;s.sent=false;s.compared=false;s.postFound=false;s.seen=[];s.message='';}
  update('top');return;
 }
 if(s.index===0&&name==='open'){s.opened=true;update('more');return;}
 if(s.index===2&&name==='poster'){s.postFound=true;update('more');return;}
 if(s.index===1){
   if(name==='fill'){const input=document.getElementById('pw-word');if(input){input.value='encontrar';input.focus();}return;}
   if(name==='compare'&&s.sent){s.compared=!s.compared;update();return;}
 }
 if(name==='clue'&&s.index<3&&((s.index===0&&s.opened)||(s.index===1&&s.sent)||(s.index===2&&s.postFound))){
  if(value!=='0'&&value!=='1')return;
  if(s.seen.includes(value))s.seen=s.seen.filter(x=>x!==value);else s.seen.push(value);
  update();return;
 }
}
document.addEventListener('click',function(ev){
 const b=ev.target.closest&&ev.target.closest('#wordMystery [data-pw]');
 if(b&&!b.disabled)act(b.getAttribute('data-pw'),b.getAttribute('data-value'));
});
document.addEventListener('submit',function(ev){
 if(!ev.target.matches('#pw-send-form'))return;
 ev.preventDefault();
 const input=ev.target.querySelector('#pw-word');
 const word=(input&&input.value||'').trim().toLowerCase().replace(/[.!?]+$/,'');
 if(word!=='encontrar'){
  const note=document.getElementById('pw-form-message');
  if(note)note.textContent='Para descobrir a surpresa desta cena, escreva “encontrar”. Você também pode usar o atalho abaixo.';
  return;
 }
 s.message='encontrar';s.sent=true;update('more');
});
window.AtelierWordMystery={render};
})();