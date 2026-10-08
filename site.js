(()=>{
 const tabs=[...document.querySelectorAll('[role=tab]')];
 const panels=[...document.querySelectorAll('[role=tabpanel]')];
 function select(key,updateURL=false){
  const target=tabs.find(t=>t.id===key+'-tab')||tabs[0];
  tabs.forEach(t=>{const active=t===target;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
  panels.forEach(p=>p.hidden=p.id!==target.getAttribute('aria-controls'));
  if(updateURL)history.pushState(null,'','#'+target.id.replace('-tab',''));
 }
 tabs.forEach((t,i)=>{
  t.addEventListener('click',()=>select(t.id.replace('-tab',''),true));
  t.addEventListener('keydown',e=>{
   let index;
   if(e.key==='ArrowRight')index=(i+1)%tabs.length;
   if(e.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;
   if(e.key==='Home')index=0;
   if(e.key==='End')index=tabs.length-1;
   if(index!==undefined){e.preventDefault();select(tabs[index].id.replace('-tab',''),true);tabs[index].focus()}
  });
 });
 window.addEventListener('popstate',()=>select(location.hash.slice(1)));
 window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
 select(location.hash.slice(1));
})();

(()=>{
 const button=document.getElementById('email-copy');
 const status=document.getElementById('copy-status');
 if(!button||!status)return;
 let resetTimer;
 function fallbackCopy(text){
  const field=document.createElement('textarea');
  field.value=text;field.readOnly=true;
  field.style.position='fixed';field.style.left='-9999px';
  document.body.appendChild(field);field.select();
  const copied=document.execCommand('copy');field.remove();button.focus();
  if(!copied)throw new Error('Copy unavailable');
 }
 button.addEventListener('click',async()=>{
  const email=button.dataset.email;
  try{
   try{
    if(!navigator.clipboard?.writeText)throw new Error('Use fallback');
    await navigator.clipboard.writeText(email);
   }catch(_){fallbackCopy(email)}
   status.textContent='Email copied';button.title='Email copied';
  }catch(_){status.textContent=email;button.title=email}
  clearTimeout(resetTimer);
  resetTimer=setTimeout(()=>{status.textContent='';button.title='Copy email'},2000);
 });
})();
