'use strict';
/* Stable Player 2.3 patch: per-message self-destruct + permanent admin entry. */
let selfDestructSeconds=null;
function ttlText(sec){if(!sec)return'DEFAULT';if(sec<60)return sec+'s';if(sec%60===0)return(sec/60)+'m';return sec+'s'}
function refreshTTLButton(){const b=document.getElementById('ttlBtn');if(!b)return;b.textContent='⏱ '+ttlText(selfDestructSeconds);b.title=selfDestructSeconds?'Disappear '+ttlText(selfDestructSeconds)+' after each recipient reads it':'Use game default self-destruct time';}
window.setMessageTTL=function(sec){selfDestructSeconds=sec===null?null:Number(sec);refreshTTLButton();if(typeof hide==='function')hide();};
const ttlButton=document.getElementById('ttlBtn');
if(ttlButton)ttlButton.onclick=()=>{const def=((state&&state.chat_ttl_minutes)||5)+'m';show('SELF-DESTRUCT TIMER','<div class="card"><b>DISAPPEAR AFTER READ</b><p class="hint">Each recipient gets their own countdown after opening the message. Admin moderation history is retained.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button onclick="setMessageTTL(null)">DEFAULT ('+def+')</button><button onclick="setMessageTTL(30)">30 SECONDS</button><button onclick="setMessageTTL(60)">1 MINUTE</button><button onclick="setMessageTTL(300)">5 MINUTES</button><button onclick="setMessageTTL(600)">10 MINUTES</button><button onclick="setMessageTTL(1800)">30 MINUTES</button></div></div>');};
refreshTTLButton();

loadMessages=async function(){
  const rows=await rpc('student_get_messages_v3',{p_scope:scope,p_private_lobby_id:privateId});
  $('messages').innerHTML=(rows||[]).map(m=>{
    const content=m.attachment_type==='voice'?`<button class="voicePlay" data-mid="${m.message_id}">▶ ${esc(m.body||'Voice note')}</button>`:`<div class="body">${esc(m.body)}</div>`;
    const ttl=m.self_destruct_seconds?`<span style="font-size:9px;color:#ff8b9b;border:1px solid #65303a;border-radius:999px;padding:2px 5px">⏱ ${esc(ttlText(m.self_destruct_seconds))}</span>`:'';
    return `<div class="msg"><div class="avatar">${esc(m.sender_initials||'?')}</div><div class="bubble"><div class="meta"><span class="name">${esc(m.sender_label)}</span><span class="time">${new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>${ttl}</div>${content}<div class="receipt">✓✓ Viewed by ${m.view_count||0}</div></div></div>`;
  }).join('');
  document.querySelectorAll('.voicePlay').forEach(b=>b.onclick=()=>playVoice(b.dataset.mid,b));
  const unread=(rows||[]).filter(x=>!x.read_by_me).map(x=>x.message_id);
  if(unread.length)await rpc('student_mark_messages_read',{p_message_ids:unread});
};

send=async function(){
  const t=$('messageInput').value.trim();if(!t)return;
  $('messageInput').value='';
  try{await rpc('student_send_message_v3',{p_scope:scope,p_private_lobby_id:privateId,p_body:t,p_self_destruct_seconds:selfDestructSeconds});await loadMessages();}
  catch(e){gameErr(e.message||String(e));}
};
if($('sendBtn'))$('sendBtn').onclick=send;
if($('messageInput'))$('messageInput').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send();}};

const adminBtn=document.getElementById('adminAccessBtn');
if(adminBtn)adminBtn.onclick=()=>{location.href='admin-v2.html';};
