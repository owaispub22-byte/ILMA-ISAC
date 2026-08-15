'use strict';
/* Stable Player 2.4 patch: Admin-controlled global self-destruct timer. */
function globalTTLText(){const m=Math.max(1,Number((state&&state.chat_ttl_minutes)||5));return m+' min'+(m===1?'':'s');}
const ttlButton=document.getElementById('ttlBtn');
if(ttlButton){ttlButton.style.display='none';ttlButton.disabled=true;ttlButton.onclick=null;}
const chatTitleNode=document.getElementById('chatTitle');
if(chatTitleNode&&!document.getElementById('globalTTLBadge')){
  chatTitleNode.insertAdjacentHTML('beforeend',' <span id="globalTTLBadge" style="font-size:9px;color:#ff9bab;border:1px solid #65303a;border-radius:999px;padding:2px 5px;margin-left:5px">⏱ ADMIN TIMER</span>');
}
function syncGlobalTTL(){const b=document.getElementById('globalTTLBadge');if(b){b.textContent='⏱ '+globalTTLText()+' after read';b.title='Self-destruct time is controlled by Admin for all chats';}}
syncGlobalTTL();

const baseRefreshAll=refreshAll;
refreshAll=async function(){await baseRefreshAll();syncGlobalTTL();};

loadMessages=async function(){
  const rows=await rpc('student_get_messages_v3',{p_scope:scope,p_private_lobby_id:privateId});
  $('messages').innerHTML=(rows||[]).map(m=>{
    const content=m.attachment_type==='voice'?`<button class="voicePlay" data-mid="${m.message_id}">▶ ${esc(m.body||'Voice note')}</button>`:`<div class="body">${esc(m.body)}</div>`;
    return `<div class="msg"><div class="avatar">${esc(m.sender_initials||'?')}</div><div class="bubble"><div class="meta"><span class="name">${esc(m.sender_label)}</span><span class="time">${new Date(m.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>${content}<div class="receipt">✓✓ Viewed by ${m.view_count||0}</div></div></div>`;
  }).join('');
  document.querySelectorAll('.voicePlay').forEach(b=>b.onclick=()=>playVoice(b.dataset.mid,b));
  const unread=(rows||[]).filter(x=>!x.read_by_me).map(x=>x.message_id);
  if(unread.length)await rpc('student_mark_messages_read',{p_message_ids:unread});
};

send=async function(){
  const t=$('messageInput').value.trim();if(!t)return;
  $('messageInput').value='';
  try{await rpc('student_send_message_v3',{p_scope:scope,p_private_lobby_id:privateId,p_body:t,p_self_destruct_seconds:null});await loadMessages();}
  catch(e){gameErr(e.message||String(e));}
};
if($('sendBtn'))$('sendBtn').onclick=send;
if($('messageInput'))$('messageInput').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send();}};

const adminBtn=document.getElementById('adminAccessBtn');
if(adminBtn)adminBtn.onclick=()=>{location.href='admin-live.html';};
