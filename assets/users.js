// Gebruikers, profielen en testen als gebruiker (impersonatie)
const rightsCatalog=[
  {group:'Dossiers en werkvoorraad',rights:[['dossier.read','Dossiers lezen'],['application.review','Aanvragen beoordelen'],['task.manage','Werkvoorraadtaken behandelen'],['policy.mutate','Polissen wijzigen'],['relation.mutate','Relaties wijzigen']]},
  {group:'Bewaking',rights:[['process.read','Processen bekijken'],['process.retry','Processen herstellen'],['communication.read','E-mails bekijken'],['communication.delivery.manage','Bezorgproblemen afhandelen']]},
  {group:'Inhoud',rights:[['content.manage','Inhoud en vertalingen beheren']]},
  {group:'Financieel en rapportage',rights:[['finance.read','Financieel bekijken'],['finance.manage','Financieel beheren'],['report.read','Rapportages bekijken']]},
  {group:'Productbeheer',rights:[['product.read','Producten bekijken'],['product.write','Producten bewerken'],['product.publish','Producten publiceren']]},
  {group:'Systeem',rights:[['integration.manage','ANVA-koppeling en XML-sjablonen beheren'],['system.manage','Systeemsettings beheren']]},
  {group:'Gebruikers en audit',rights:[['user.read','Gebruikers bekijken'],['user.write','Gebruikers beheren'],['user.impersonate','Testen als gebruiker'],['profile.read','Profielen bekijken'],['profile.write','Profielen beheren'],['audit.read','Auditlog bekijken']]}
];
const rightLabels=Object.fromEntries(rightsCatalog.flatMap(group=>group.rights));
const mutationRights=['policy.mutate','relation.mutate'],productChangeRights=['product.write','product.publish'];
const criticalRights=['policy.mutate','relation.mutate','process.retry','finance.manage','product.publish','user.write','user.impersonate','profile.write'];
const iamAdminRights=['user.write','profile.write','user.impersonate'];
const profiles={
  handler:{name:'Behandelaar',status:'Actief',rights:['dossier.read','application.review','task.manage','policy.mutate','relation.mutate','process.read','communication.read','communication.delivery.manage']},
  product:{name:'Productbeheerder',status:'Actief',rights:['product.read','product.write','product.publish']},
  finance:{name:'Finance',status:'Actief',rights:['dossier.read','finance.read','finance.manage','report.read']},
  content:{name:'Inhoudbeheerder',status:'Actief',rights:['content.manage','communication.read']},
  readonly:{name:'Alleen lezen',status:'Actief',rights:['dossier.read','process.read','communication.read','report.read']},
  users:{name:'Gebruikersbeheerder',status:'Actief',rights:['user.read','user.write','user.impersonate','profile.read','profile.write','audit.read']}
};
const users={
  eva:{name:'Voorbeeld gebruikersbeheerder',email:'gebruikersbeheer@voorbeeld.nl',profile:'users',status:'Actief',mfa:'Actief'},
  sanne:{name:'Voorbeeld behandelaar',email:'behandelaar@voorbeeld.nl',profile:'handler',status:'Actief',mfa:'Actief'},
  milan:{name:'Voorbeeld productbeheerder',email:'productbeheer@voorbeeld.nl',profile:'product',status:'Actief',mfa:'Actief'},
  lotte:{name:'Voorbeeld lezer',email:'lezer@voorbeeld.nl',profile:'readonly',status:'Actief',mfa:'Actief'},
  noor:{name:'Voorbeeld inhoudbeheerder',email:'inhoud@voorbeeld.nl',profile:'content',status:'Uitgenodigd',mfa:'Niet ingesteld'},
  daan:{name:'Voorbeeld financegebruiker',email:'finance@voorbeeld.nl',profile:'finance',status:'Geblokkeerd',mfa:'Actief'}
};
const signedInUserId='eva';
const impersonationMinutes=30,reauthMinutes=15;
let selectedUser=null,selectedProfile='handler',profileDraftIsNew=false;
let impersonation=null,lastReauthAt=0,impersonationTimer=null;

const usersStyles=document.createElement('link');usersStyles.rel='stylesheet';usersStyles.href='assets/users.css?v=20261127-iam-impersonation-v1';document.head.appendChild(usersStyles);

function userRights(id){const user=users[id];const profile=user&&profiles[user.profile];return profile&&profile.status==='Actief'?profile.rights:[];}
function effectiveRights(){return userRights(impersonation?impersonation.userId:signedInUserId);}
function hasRight(right){return effectiveRights().includes(right);}
function actorHasRight(right){return userRights(signedInUserId).includes(right);}
function initials(name){return String(name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0].toUpperCase()).join('');}
function nowLabel(){return new Date().toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'});}
function statusChip(status){return `<span class="admin-chip ${status==='Actief'?'green':status==='Uitgenodigd'?'amber':'gray'}">${adminEscape(status)}</span>`;}
function activeUsersWithIamAdmin(excludeId,profileOverride){return Object.entries(users).filter(([id,user])=>{if(id===excludeId||user.status!=='Actief')return false;const rights=profileOverride&&user.profile===profileOverride.id?profileOverride.rights:(profiles[user.profile]?.status==='Actief'?profiles[user.profile].rights:[]);return rights.includes('user.write')&&rights.includes('profile.write');}).length;}

function logIamActivity(activity,result='Gelogd'){
  const body=document.querySelector('[data-admin-page="activities"] tbody');if(!body)return;
  const actor=impersonation?`${users[signedInUserId].name} (als ${users[impersonation.userId].name})`:users[signedInUserId].name;
  body.insertAdjacentHTML('afterbegin',`<tr><td>Vandaag · ${nowLabel()}</td><td>—</td><td>—</td><td>${adminEscape(actor)}</td><td>${adminEscape(activity)}</td><td><span class="admin-chip ${result==='Geweigerd'?'red':'green'}">${adminEscape(result)}</span></td></tr>`);
}

const usersPage=document.querySelector('[data-admin-page="users"]');
if(usersPage)usersPage.innerHTML=`
<div class="admin-page-head"><div><h1>Gebruikers &amp; rechten</h1></div></div>
<div class="rights-tabs"><button class="active" data-rights-view="users" type="button">Gebruikers</button><button data-rights-view="profiles" type="button">Profielen</button></div>
<section class="rights-view active" data-rights-panel="users">
  <div class="rights-toolbar"><button class="admin-btn primary" id="addUserButton" type="button">Gebruiker toevoegen</button></div>
  <div class="admin-card"><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Naam</th><th>Profiel</th><th>Status</th><th></th></tr></thead><tbody id="usersTableBody"></tbody></table></div></div>
  <div class="admin-card rights-editor" id="userEditor" hidden><div class="admin-card-head"><div><h2 id="userEditorTitle">Gebruiker bewerken</h2><div class="rights-editor-meta" id="userEditorMeta"></div></div><button class="admin-btn text" data-close-editor="user" type="button">Sluiten</button></div><div class="admin-card-body">
    <div class="rights-form"><label><span>Naam</span><input class="admin-input" id="userName" autocomplete="off"></label><label><span>E-mailadres</span><input class="admin-input" id="userEmail" type="email" autocomplete="off"></label><label><span>Profiel</span><select class="admin-input" id="userProfile"></select></label></div>
    <div class="rights-profile-preview" id="userProfilePreview"></div>
    <div class="rights-form-error" id="userFormError" hidden></div>
    <div class="admin-actions rights-editor-actions"><button class="admin-btn primary" id="saveUserButton" type="button">Opslaan</button><div class="rights-access-actions" id="userAccessActions"></div></div>
  </div></div>
</section>
<section class="rights-view" data-rights-panel="profiles">
  <div class="rights-toolbar"><button class="admin-btn primary" id="addProfileButton" type="button">Profiel toevoegen</button></div>
  <div class="rights-profile-layout"><div class="admin-card"><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Profiel</th><th>Gebruikers</th><th>Status</th></tr></thead><tbody id="profilesTableBody"></tbody></table></div></div>
  <div class="admin-card" id="profileEditor"><div class="admin-card-head"><h2 id="profileEditorTitle">Profiel bewerken</h2><button class="admin-btn text" id="duplicateProfileButton" type="button">Dupliceren</button></div><div class="admin-card-body">
    <div class="rights-form"><label><span>Naam</span><input class="admin-input" id="profileName" autocomplete="off"></label><label><span>Status</span><select class="admin-input" id="profileStatus"><option>Actief</option><option>Inactief</option></select></label></div>
    <div class="rights-list" id="profileRights"></div>
    <div class="rights-form-error" id="profileFormError" hidden></div>
    <div class="admin-actions"><button class="admin-btn primary" id="saveProfileButton" type="button">Opslaan</button></div>
    <div class="rights-profile-users" id="profileUsers"></div>
  </div></div></div>
</section>`;

document.body.insertAdjacentHTML('beforeend',`<div class="admin-auth" id="adminAuth" hidden><div class="admin-auth-card"><div class="admin-auth-brand"><strong>GoSafe</strong><span>Admin</span></div><section data-auth-screen="login"><h1>Inloggen</h1><label><span>E-mailadres</span><input class="admin-input" type="email" value="${users[signedInUserId].email}"></label><label><span>Wachtwoord</span><input class="admin-input" type="password" value="voorbeeld"></label><button class="admin-btn primary" id="adminLoginButton" type="button">Inloggen</button><button class="admin-auth-link" data-auth-target="forgot" type="button">Wachtwoord vergeten</button><button class="admin-auth-link subtle" data-auth-target="activate" type="button">Voorbeeld account activeren</button></section><section data-auth-screen="forgot" hidden><h1>Wachtwoord herstellen</h1><label><span>E-mailadres</span><input class="admin-input" id="forgotEmail" type="email"></label><button class="admin-btn primary" id="forgotSendButton" type="button">Herstellink versturen</button><button class="admin-auth-link" data-auth-target="login" type="button">Terug naar inloggen</button></section><section data-auth-screen="forgot-sent" hidden><h1>Controleer je e-mail</h1><p>Als het account bestaat, is een herstellink verstuurd.</p><button class="admin-btn" data-auth-target="login" type="button">Terug naar inloggen</button></section><section data-auth-screen="activate" hidden><h1>Adminaccount activeren</h1><label><span>Nieuw wachtwoord</span><input class="admin-input" type="password"></label><label><span>Herhaal wachtwoord</span><input class="admin-input" type="password"></label><button class="admin-btn primary" data-auth-target="activated" type="button">Account activeren</button></section><section data-auth-screen="activated" hidden><h1>Account geactiveerd</h1><button class="admin-btn primary" data-auth-target="login" type="button">Naar inloggen</button></section></div></div>
<div class="iam-dialog" id="iamDialog" hidden role="dialog" aria-modal="true" aria-labelledby="iamDialogTitle"><div class="iam-dialog-card"><h2 id="iamDialogTitle"></h2><div class="iam-dialog-body" id="iamDialogBody"></div><label class="iam-dialog-field" id="iamReasonField"><span>Reden</span><input class="admin-input" id="iamReason" autocomplete="off" placeholder="Bijvoorbeeld: nieuw profiel controleren"></label><label class="iam-dialog-field" id="iamCodeField"><span>Code uit authenticator-app</span><input class="admin-input" id="iamCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 cijfers"></label><div class="rights-form-error" id="iamDialogError" hidden></div><div class="admin-actions iam-dialog-actions"><button class="admin-btn" id="iamDialogCancel" type="button">Annuleren</button><button class="admin-btn primary" id="iamDialogConfirm" type="button">Bevestigen</button></div></div></div>`);

const topbar=document.querySelector('.admin-topbar');
topbar?.insertAdjacentHTML('afterend','<div class="iam-impersonation-bar" id="iamImpersonationBar" hidden role="status"></div>');

// Kritieke commando's: herauthenticatie maximaal 15 minuten oud; testen als gebruiker vraagt ook een reden.
let pendingCritical=null;
function requireCritical({title,body,needReason=false,confirmLabel='Bevestigen'},onConfirm){
  const fresh=Date.now()-lastReauthAt<reauthMinutes*60000;
  if(fresh&&!needReason){onConfirm({});return;}
  pendingCritical={onConfirm,needReason,fresh};
  document.getElementById('iamDialogTitle').textContent=title;
  document.getElementById('iamDialogBody').innerHTML=body||'';
  document.getElementById('iamReasonField').hidden=!needReason;
  document.getElementById('iamCodeField').hidden=fresh;
  document.getElementById('iamReason').value='';document.getElementById('iamCode').value='';
  document.getElementById('iamDialogError').hidden=true;
  document.getElementById('iamDialogConfirm').textContent=confirmLabel;
  document.getElementById('iamDialog').hidden=false;
  (needReason?document.getElementById('iamReason'):document.getElementById('iamCode')).focus();
}
function closeCritical(){document.getElementById('iamDialog').hidden=true;pendingCritical=null;}
document.getElementById('iamDialogCancel').addEventListener('click',closeCritical);
['iamReason','iamCode'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{document.getElementById('iamDialogError').hidden=true;}));
document.getElementById('iamDialog').addEventListener('keydown',event=>{if(event.key==='Escape')closeCritical();if(event.key==='Enter')document.getElementById('iamDialogConfirm').click();});
document.getElementById('iamDialogConfirm').addEventListener('click',()=>{
  if(!pendingCritical)return;
  const reason=document.getElementById('iamReason').value.trim(),code=document.getElementById('iamCode').value.trim(),error=document.getElementById('iamDialogError');
  if(pendingCritical.needReason&&reason.length<5){error.textContent='Vul een reden in.';error.hidden=false;return;}
  if(!pendingCritical.fresh&&!/^\d{6}$/.test(code)){error.textContent='Vul de 6-cijferige code in.';error.hidden=false;return;}
  if(!pendingCritical.fresh)lastReauthAt=Date.now();
  const {onConfirm}=pendingCritical;closeCritical();onConfirm({reason});
});

function profileOptions(selected=''){return Object.entries(profiles).filter(([id,p])=>p.status==='Actief'||id===selected).map(([id,p])=>`<option value="${id}" ${id===selected?'selected':''}>${adminEscape(p.name)}${p.status==='Actief'?'':' (inactief)'}</option>`).join('');}
function impersonationBlocker(id){
  const user=users[id];
  if(!actorHasRight('user.impersonate'))return 'Je profiel heeft geen recht om als gebruiker te testen.';
  if(impersonation)return 'Er loopt al een testsessie.';
  if(id===signedInUserId)return 'Je kunt niet als jezelf testen.';
  if(user.status==='Geblokkeerd')return 'Geblokkeerde gebruikers kunnen niet worden getest.';
  if(profiles[user.profile]?.status!=='Actief')return 'Het profiel van deze gebruiker is inactief.';
  if(userRights(id).some(right=>iamAdminRights.includes(right)))return 'Gebruikers met rechten op gebruikers- of profielbeheer kunnen niet worden getest.';
  return '';
}
function renderUsers(){
  document.getElementById('usersTableBody').innerHTML=Object.entries(users).map(([id,u])=>`<tr class="rights-row ${id===selectedUser?'active':''}" data-user-id="${id}"><td><strong>${adminEscape(u.name)}</strong>${id===signedInUserId?' <span class="rights-you">jij</span>':''}</td><td>${adminEscape(profiles[u.profile]?.name||'—')}</td><td>${statusChip(u.status)}</td><td class="rights-row-action">${impersonationBlocker(id)?'':`<button class="admin-btn text" data-impersonate="${id}" type="button">Testen als</button>`}</td></tr>`).join('');
}
function renderProfiles(){
  document.getElementById('profilesTableBody').innerHTML=Object.entries(profiles).map(([id,p])=>`<tr class="rights-row ${id===selectedProfile&&!profileDraftIsNew?'active':''}" data-profile-id="${id}"><td><strong>${adminEscape(p.name)}</strong></td><td>${Object.values(users).filter(u=>u.profile===id).length}</td><td>${p.status==='Actief'?'<span class="admin-chip green">Actief</span>':'<span class="admin-chip gray">Inactief</span>'}</td></tr>`).join('');
}
function renderProfilePreview(profileId){
  const rights=profiles[profileId]?.rights||[];
  document.getElementById('userProfilePreview').innerHTML=`<span>Rechten via profiel</span><div>${rights.length?rights.map(right=>`<span class="rights-tag">${adminEscape(rightLabels[right]||right)}</span>`).join(''):'<em>Geen rechten</em>'}</div>`;
}
function setFormError(id,message){const el=document.getElementById(id);el.textContent=message||'';el.hidden=!message;}

function openUser(id,isNew=false){
  selectedUser=isNew?null:id;
  const u=isNew?{name:'',email:'',profile:'handler',status:'Uitgenodigd',mfa:'Niet ingesteld'}:users[id];
  document.getElementById('userEditorTitle').textContent=isNew?'Gebruiker toevoegen':u.name;
  document.getElementById('userEditorMeta').innerHTML=isNew?'Ontvangt een uitnodiging (72 uur geldig) en stelt bij activatie MFA in.':`${statusChip(u.status)} <span>MFA ${u.mfa==='Actief'?'actief':'niet ingesteld'}</span>`;
  document.getElementById('userName').value=u.name;document.getElementById('userEmail').value=u.email;
  document.getElementById('userProfile').innerHTML=profileOptions(u.profile);renderProfilePreview(u.profile);
  document.getElementById('saveUserButton').textContent=isNew?'Uitnodiging versturen':'Opslaan';
  setFormError('userFormError','');
  let actions='';
  if(!isNew){
    const blocker=impersonationBlocker(id);
    actions+=blocker?`<span class="rights-hint" title="${adminEscape(blocker)}">Testen als niet beschikbaar: ${adminEscape(blocker.charAt(0).toLowerCase()+blocker.slice(1))}</span>`:`<button class="admin-btn" data-impersonate="${id}" type="button">Testen als ${adminEscape(u.name)}</button>`;
    if(u.status==='Uitgenodigd')actions+='<button class="admin-btn" data-user-action="invite" type="button">Uitnodiging opnieuw versturen</button>';
    if(u.status==='Actief')actions+='<button class="admin-btn" data-user-action="reset" type="button">Wachtwoordherstel versturen</button><button class="admin-btn" data-user-action="sessions" type="button">Sessies intrekken</button>'+(u.mfa==='Actief'?'<button class="admin-btn" data-user-action="mfa" type="button">MFA opnieuw instellen</button>':'');
    if(id!==signedInUserId)actions+=u.status==='Geblokkeerd'?'<button class="admin-btn" data-user-action="unblock" type="button">Deblokkeren</button>':'<button class="admin-btn danger" data-user-action="block" type="button">Blokkeren</button>';
  }
  document.getElementById('userAccessActions').innerHTML=actions;
  document.getElementById('userEditor').hidden=false;renderUsers();
  document.getElementById('userEditor').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function syncSegregation(){
  const checked=[...document.querySelectorAll('#profileRights input:checked')].map(input=>input.value);
  const hasMutation=checked.some(right=>mutationRights.includes(right)),hasProductChange=checked.some(right=>productChangeRights.includes(right));
  document.querySelectorAll('#profileRights input').forEach(input=>{
    const conflict=(productChangeRights.includes(input.value)&&hasMutation)||(mutationRights.includes(input.value)&&hasProductChange);
    input.disabled=conflict&&!input.checked;
    input.closest('label').classList.toggle('conflict',input.disabled);
    input.closest('label').querySelector('.rights-conflict').textContent=input.disabled?(productChangeRights.includes(input.value)?'Niet combineerbaar met polis- of relatiewijzigingen':'Niet combineerbaar met productbeheer'):'';
  });
}
function renderProfileUsers(id){
  const linked=Object.entries(users).filter(([,u])=>u.profile===id);
  document.getElementById('profileUsers').innerHTML=profileDraftIsNew?'':`<h3>Gebruikers met dit profiel</h3>${linked.length?linked.map(([userId,u])=>`<div class="rights-profile-user"><button class="admin-link-button" data-open-user="${userId}" type="button">${adminEscape(u.name)}</button>${statusChip(u.status)}${impersonationBlocker(userId)?'':`<button class="admin-btn text" data-impersonate="${userId}" type="button">Testen als</button>`}</div>`).join(''):'<p>Nog geen gebruikers. Koppel een gebruiker aan dit profiel om de rechtenset te testen.</p>'}`;
}
function openProfile(id,isNew=false,base=null){
  profileDraftIsNew=isNew;selectedProfile=isNew?null:id;
  const p=isNew?{name:base?`${base.name} (kopie)`:'',status:'Actief',rights:base?[...base.rights]:[]}:profiles[id];
  document.getElementById('profileEditorTitle').textContent=isNew?'Profiel toevoegen':'Profiel bewerken';
  document.getElementById('duplicateProfileButton').hidden=isNew;
  document.getElementById('profileName').value=p.name;document.getElementById('profileStatus').value=p.status;
  document.getElementById('profileRights').innerHTML=rightsCatalog.map(group=>`<div class="rights-group"><h3>${adminEscape(group.group)}</h3>${group.rights.map(([key,label])=>`<label><input type="checkbox" value="${key}" ${p.rights.includes(key)?'checked':''}><span class="rights-label">${adminEscape(label)}<code>${key}</code></span><span class="rights-conflict"></span></label>`).join('')}</div>`).join('');
  setFormError('profileFormError','');syncSegregation();renderProfiles();renderProfileUsers(id);
  if(isNew)document.getElementById('profileName').focus();
}
function switchRightsView(view){document.querySelectorAll('[data-rights-view]').forEach(b=>b.classList.toggle('active',b.dataset.rightsView===view));document.querySelectorAll('[data-rights-panel]').forEach(p=>p.classList.toggle('active',p.dataset.rightsPanel===view));}

document.querySelectorAll('[data-rights-view]').forEach(button=>button.addEventListener('click',()=>switchRightsView(button.dataset.rightsView)));
document.getElementById('usersTableBody').addEventListener('click',e=>{if(e.target.closest('[data-impersonate]'))return;const row=e.target.closest('[data-user-id]');if(row)openUser(row.dataset.userId);});
document.getElementById('profilesTableBody').addEventListener('click',e=>{const row=e.target.closest('[data-profile-id]');if(row)openProfile(row.dataset.profileId);});
document.getElementById('profileRights').addEventListener('change',syncSegregation);
document.getElementById('userProfile').addEventListener('change',e=>renderProfilePreview(e.target.value));
document.getElementById('profileUsers').addEventListener('click',e=>{const id=e.target.closest('[data-open-user]')?.dataset.openUser;if(id){switchRightsView('users');openUser(id);}});
document.getElementById('addUserButton').addEventListener('click',()=>openUser(null,true));
document.querySelector('[data-close-editor="user"]').addEventListener('click',()=>{document.getElementById('userEditor').hidden=true;selectedUser=null;renderUsers();});
document.getElementById('addProfileButton').addEventListener('click',()=>openProfile(null,true));
document.getElementById('duplicateProfileButton').addEventListener('click',()=>openProfile(null,true,profiles[selectedProfile]));

document.getElementById('saveUserButton').addEventListener('click',()=>{
  const name=document.getElementById('userName').value.trim(),email=document.getElementById('userEmail').value.trim().toLowerCase(),profile=document.getElementById('userProfile').value;
  if(!name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){setFormError('userFormError','Vul een naam en geldig e-mailadres in.');return;}
  if(Object.entries(users).some(([id,u])=>id!==selectedUser&&u.email.toLowerCase()===email)){setFormError('userFormError','Dit e-mailadres is al in gebruik.');return;}
  const existing=selectedUser&&users[selectedUser];
  if(existing&&existing.profile!==profile&&existing.status==='Actief'){
    const keepsIamAdmin=profiles[profile].rights.includes('user.write')&&profiles[profile].rights.includes('profile.write');
    if(!keepsIamAdmin&&userRights(selectedUser).includes('user.write')&&userRights(selectedUser).includes('profile.write')&&activeUsersWithIamAdmin(selectedUser)===0){setFormError('userFormError','Dit is de laatste actieve gebruiker die gebruikers en profielen kan beheren.');return;}
  }
  const isNew=!existing;
  requireCritical({title:isNew?'Gebruiker uitnodigen':'Gebruiker wijzigen',confirmLabel:isNew?'Uitnodigen':'Opslaan'},()=>{
    const lostCritical=existing?userRights(selectedUser).filter(right=>criticalRights.includes(right)&&!profiles[profile].rights.includes(right)):[];
    const id=selectedUser||`user_${Date.now()}`;
    users[id]={...(existing||{status:'Uitgenodigd',mfa:'Niet ingesteld'}),name,email,profile};
    if(isNew)logIamActivity(`Uitnodiging verstuurd aan ${name} · profiel ${profiles[profile].name}`);
    else if(existing.profile!==profile)logIamActivity(`Profiel van ${name} gewijzigd naar ${profiles[profile].name}`);
    else logIamActivity(`Gebruiker ${name} gewijzigd`);
    if(lostCritical.length)logIamActivity(`Sessies van ${name} ingetrokken na verlies van kritiek recht`);
    selectedUser=id;renderUsers();renderProfiles();document.getElementById('userEditor').hidden=true;selectedUser=null;renderUsers();
    showAdminToast(isNew?'Uitnodiging verstuurd':lostCritical.length?'Gebruiker opgeslagen · actieve sessies ingetrokken':'Gebruiker opgeslagen');
  });
});

document.getElementById('userAccessActions').addEventListener('click',e=>{
  const action=e.target.closest('[data-user-action]')?.dataset.userAction;if(!action||!selectedUser)return;
  const id=selectedUser,u=users[id];
  if(action==='invite'){logIamActivity(`Uitnodiging opnieuw verstuurd aan ${u.name}`);showAdminToast('Uitnodiging opnieuw verstuurd · eerdere link ongeldig');return;}
  if(action==='reset'){logIamActivity(`Wachtwoordherstel verstuurd aan ${u.name}`);showAdminToast('Wachtwoordherstel verstuurd · link 30 minuten geldig');return;}
  if(action==='block'&&userRights(id).includes('user.write')&&userRights(id).includes('profile.write')&&activeUsersWithIamAdmin(id)===0){setFormError('userFormError','Dit is de laatste actieve gebruiker die gebruikers en profielen kan beheren.');return;}
  const labels={sessions:['Sessies intrekken','Intrekken','Actieve sessies ingetrokken',`Sessies van ${u.name} ingetrokken`],mfa:['MFA opnieuw instellen','Bevestigen','MFA moet opnieuw worden ingesteld',`MFA-reset voor ${u.name}`],block:['Gebruiker blokkeren','Blokkeren','Gebruiker geblokkeerd · sessies ingetrokken',`${u.name} geblokkeerd · sessies ingetrokken`],unblock:['Gebruiker deblokkeren','Deblokkeren','Gebruiker gedeblokkeerd',`${u.name} gedeblokkeerd`]};
  const [title,confirmLabel,toast,activity]=labels[action];
  requireCritical({title,body:`<p>${adminEscape(u.name)}</p>`,confirmLabel},()=>{
    if(action==='mfa')u.mfa='Niet ingesteld';
    if(action==='block')u.status='Geblokkeerd';
    if(action==='unblock')u.status='Actief';
    logIamActivity(activity);renderUsers();renderProfiles();openUser(id);showAdminToast(toast);
  });
});

document.getElementById('saveProfileButton').addEventListener('click',()=>{
  const name=document.getElementById('profileName').value.trim(),status=document.getElementById('profileStatus').value;
  const chosen=[...document.querySelectorAll('#profileRights input:checked')].map(i=>i.value);
  const id=profileDraftIsNew?`profile_${Date.now()}`:selectedProfile;
  const linkedUsers=Object.values(users).filter(u=>u.profile===id);
  if(!name){setFormError('profileFormError','Vul een naam in.');return;}
  if(Object.entries(profiles).some(([pid,p])=>pid!==id&&p.name.toLowerCase()===name.toLowerCase())){setFormError('profileFormError','Er bestaat al een profiel met deze naam.');return;}
  if(!chosen.length){setFormError('profileFormError','Kies minimaal één recht.');return;}
  if(chosen.some(r=>mutationRights.includes(r))&&chosen.some(r=>productChangeRights.includes(r))){setFormError('profileFormError','Polis- of relatiewijzigingen en productbeheer kunnen niet in één profiel.');return;}
  if(status==='Inactief'&&linkedUsers.length){setFormError('profileFormError',`Een profiel met gekoppelde gebruikers kan niet inactief worden (${linkedUsers.length} gekoppeld).`);return;}
  const effective=status==='Actief'?chosen:[];
  if(!profileDraftIsNew&&activeUsersWithIamAdmin(null,{id,rights:effective})===0){setFormError('profileFormError','Na deze wijziging kan geen actieve gebruiker meer gebruikers en profielen beheren.');return;}
  requireCritical({title:profileDraftIsNew?'Profiel toevoegen':'Profiel wijzigen',confirmLabel:'Opslaan'},()=>{
    const previous=profiles[id]?.rights||[];
    const lostCritical=previous.filter(r=>criticalRights.includes(r)&&!chosen.includes(r));
    profiles[id]={name,status,rights:chosen};
    const wasNew=profileDraftIsNew;profileDraftIsNew=false;selectedProfile=id;
    logIamActivity(wasNew?`Profiel ${name} aangemaakt`:`Profiel ${name} gewijzigd`);
    const activeLinked=linkedUsers.filter(u=>u.status!=='Geblokkeerd').length;
    if(lostCritical.length&&activeLinked)logIamActivity(`Sessies van ${activeLinked} gebruiker(s) met profiel ${name} ingetrokken`);
    openProfile(id);renderUsers();
    if(!document.getElementById('userEditor').hidden&&selectedUser)document.getElementById('userProfile').innerHTML=profileOptions(users[selectedUser].profile);
    showAdminToast(wasNew?'Profiel toegevoegd':lostCritical.length&&activeLinked?'Profiel opgeslagen · sessies van gekoppelde gebruikers ingetrokken':'Profiel opgeslagen · geldt bij het volgende verzoek');
  });
});

// Rechten per scherm en actie. Verbergen is alleen UX; de server controleert ieder commando.
const pageRights={overview:['dossier.read'],workqueue:['task.manage'],applications:['dossier.read'],policies:['dossier.read'],renewals:['dossier.read'],processes:['process.read'],communications:['communication.read'],activities:['dossier.read','audit.read'],relations:['dossier.read'],finance:['finance.read'],reports:['report.read'],products:['product.read'],content:['content.manage'],anva:['integration.manage'],'anva-connection':['integration.manage'],'anva-templates':['integration.manage'],'anva-template':['integration.manage'],settings:['system.manage'],users:['user.read','profile.read'],dossier:['dossier.read'],'email-detail':['communication.read'],'policy-mutation':['policy.mutate'],'relation-mutation':['relation.mutate']};
const navOrder=['overview','workqueue','applications','policies','renewals','processes','communications','activities','relations','finance','reports','products','content','anva','settings','users'];
const guardedReads=[['.admin-open-dossier,[data-open-dossier]','dossier.read'],['[data-dossier-tab="processes"]','process.read'],['[data-dossier-tab="communications"],[data-open-full-email]','communication.read'],['.admin-search','dossier.read'],['.admin-anva-subnav','integration.manage']];
const guardedWrites=[
  ['#dossierStartMutation,#mutationSubmit,#mutationItemEditorSave,[data-mutation-edit],[data-mutation-remove]','policy.mutate'],
  ['#dossierEditHolder,#relationMutationSubmit,[data-admin-page="relations"] .admin-page-head .admin-btn.primary','relation.mutate'],
  ['[data-admin-page="workqueue"] .admin-page-head .admin-btn.primary','task.manage'],
  ['[data-process-retry]','process.retry'],
  ['[data-communication-assign]','communication.delivery.manage'],
  ['[data-template-action="save"],[data-template-action="publish"]','content.manage'],
  ['#productNewChangeSet,#productNewChangeSetInline,#productSaveChangeSet,#productSettingSave,#productSaveCategoryChange,#productRuleSave,#productNewCategoryRule,#productIpidSave,#productConditionsSave,#productAddonSave,#productAcceptanceSave,#productAddInhireTier,.product-remove-tier','product.write'],
  ['.product-change-actions .primary','product.publish'],
  ['#anvaSaveConnection,#anvaTestConnection,#anvaSendTestXml,#anvaReplaceSecret,#anvaSaveDraft,#anvaSaveTemplate,#anvaDiscardDraft','integration.manage'],
  ['#settingsSave','system.manage'],
  ['#addUserButton,#saveUserButton,[data-user-action]','user.write'],
  ['#addProfileButton,#saveProfileButton,#duplicateProfileButton','profile.write'],
  ['[data-impersonate]','user.impersonate']
];
function pageAllowed(name){const required=pageRights[name];return !required||required.some(hasRight);}
function firstAllowedPage(){return navOrder.find(pageAllowed)||'overview';}
function applyIam(){
  const testing=!!impersonation;
  document.querySelectorAll('.admin-nav[data-admin-target]').forEach(nav=>nav.classList.toggle('iam-hidden',testing&&!pageAllowed(nav.dataset.adminTarget)));
  document.querySelectorAll('[data-admin-target]:not(.admin-nav)').forEach(link=>link.classList.toggle('iam-hidden',testing&&!pageAllowed(link.dataset.adminTarget)));
  document.querySelectorAll('.admin-nav-group').forEach(group=>group.classList.toggle('iam-hidden',testing&&![...group.querySelectorAll('.admin-nav')].some(nav=>!nav.classList.contains('iam-hidden'))));
  document.querySelector('.admin-product-subnav')?.classList.toggle('iam-hidden',testing&&!pageAllowed('products'));
  guardedReads.forEach(([selector,right])=>document.querySelectorAll(selector).forEach(el=>el.classList.toggle('iam-hidden',testing&&!hasRight(right))));
  guardedWrites.forEach(([selector,right])=>document.querySelectorAll(selector).forEach(el=>{el.dataset.iamWrite=right;el.classList.toggle('iam-hidden',testing&&!hasRight(right));}));
}
let iamFrame=0;
new MutationObserver(()=>{if(iamFrame)return;iamFrame=requestAnimationFrame(()=>{iamFrame=0;applyIam();});}).observe(document.body,{childList:true,subtree:true});

let baseSetAdminPage=null;
function guardedSetAdminPage(name){
  if(impersonation&&!pageAllowed(name)){showAdminToast(`Geen toegang met profiel ${profiles[users[impersonation.userId].profile].name}`);logIamActivity(`Toegang tot ${name} geweigerd in testsessie`,'Geweigerd');name=firstAllowedPage();}
  baseSetAdminPage(name);
  if(name==='users')history.replaceState(null,'','#users');
}
function ensurePageGuard(){if(setAdminPage!==guardedSetAdminPage){baseSetAdminPage=setAdminPage;setAdminPage=guardedSetAdminPage;}}

// Tijdens een testsessie zijn schrijfcommando's geweigerd, ook als het geteste profiel ze mag uitvoeren.
document.addEventListener('click',event=>{
  if(!impersonation)return;
  const trigger=event.target.closest('[data-iam-write]');if(!trigger)return;
  event.preventDefault();event.stopImmediatePropagation();
  const action=(trigger.textContent||'').trim()||trigger.dataset.iamWrite;
  logIamActivity(`Testsessie: ${action} toegestaan (${trigger.dataset.iamWrite}), niet uitgevoerd`);
  showAdminToast(`Toegestaan voor ${profiles[users[impersonation.userId].profile].name} · niet uitgevoerd in testsessie`);
},true);

function renderIdentity(){
  const box=document.querySelector('.admin-user');if(!box)return;
  const actor=users[signedInUserId];
  if(impersonation){
    const target=users[impersonation.userId];
    box.classList.add('impersonating');
    box.innerHTML=`<div class="admin-avatar">${adminEscape(initials(target.name))}</div><div class="admin-user-copy"><strong>${adminEscape(target.name)}</strong>Test als · ${adminEscape(profiles[target.profile].name)}</div><button class="admin-logout" data-stop-impersonation type="button">Stoppen</button>`;
    const bar=document.getElementById('iamImpersonationBar');
    bar.innerHTML=`<div><strong>Testsessie als ${adminEscape(target.name)}</strong><span>Profiel ${adminEscape(profiles[target.profile].name)} · gestart door ${adminEscape(actor.name)} · eindigt om ${impersonation.endsAt} · wijzigingen worden niet uitgevoerd</span></div><button class="admin-btn" data-stop-impersonation type="button">Testsessie stoppen</button>`;
    bar.hidden=false;
  }else{
    box.classList.remove('impersonating');
    box.innerHTML=`<div class="admin-avatar">${adminEscape(initials(actor.name))}</div><div class="admin-user-copy"><strong>${adminEscape(actor.name)}</strong>${adminEscape(profiles[actor.profile]?.name||'Geen profiel')}</div><button class="admin-logout" type="button">Uitloggen</button>`;
    document.getElementById('iamImpersonationBar').hidden=true;
  }
}
function startImpersonation(id){
  const blocker=impersonationBlocker(id);if(blocker){showAdminToast(blocker);return;}
  const target=users[id],profile=profiles[target.profile];
  requireCritical({title:`Testen als ${target.name}`,needReason:true,confirmLabel:'Testsessie starten',body:`<p>Je ziet GoSafe met de rechten van profiel <strong>${adminEscape(profile.name)}</strong>. Wijzigingen worden niet uitgevoerd. De testsessie stopt na ${impersonationMinutes} minuten.</p>`},({reason})=>{
    ensurePageGuard();
    const ends=new Date(Date.now()+impersonationMinutes*60000);
    logIamActivity(`Testsessie gestart als ${target.name} (${profile.name}) · reden: ${reason}`);
    impersonation={userId:id,reason,endsAt:ends.toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'})};
    clearTimeout(impersonationTimer);impersonationTimer=setTimeout(()=>stopImpersonation('verlopen'),impersonationMinutes*60000);
    document.getElementById('userEditor').hidden=true;
    renderIdentity();applyIam();setAdminPage(firstAllowedPage());
    showAdminToast(`Testsessie gestart als ${target.name}`);
  });
}
function stopImpersonation(cause='gestopt'){
  if(!impersonation)return;
  const target=users[impersonation.userId],id=impersonation.userId;
  logIamActivity(`Testsessie als ${target.name} ${cause}`);
  impersonation=null;clearTimeout(impersonationTimer);
  renderIdentity();applyIam();renderUsers();renderProfiles();
  setAdminPage('users');switchRightsView('users');openUser(id);
  showAdminToast(cause==='verlopen'?'Testsessie verlopen':'Testsessie gestopt');
}
document.addEventListener('click',event=>{
  const impersonate=event.target.closest('[data-impersonate]');
  if(impersonate&&!impersonation){event.preventDefault();startImpersonation(impersonate.dataset.impersonate);return;}
  if(event.target.closest('[data-stop-impersonation]')){stopImpersonation();return;}
  if(event.target.closest('.admin-logout')){document.getElementById('adminAuth').hidden=false;showAuthScreen('login');}
});

function showAuthScreen(screen){document.querySelectorAll('[data-auth-screen]').forEach(s=>s.hidden=s.dataset.authScreen!==screen);}
document.getElementById('adminLoginButton').addEventListener('click',()=>{document.getElementById('adminAuth').hidden=true;showAdminToast('Ingelogd');});
document.querySelectorAll('[data-auth-target]').forEach(button=>button.addEventListener('click',()=>showAuthScreen(button.dataset.authTarget)));
document.getElementById('forgotSendButton').addEventListener('click',()=>showAuthScreen('forgot-sent'));
document.querySelector('.admin-nav[data-admin-target="users"]')?.addEventListener('click',()=>history.replaceState(null,'','#users'));

renderIdentity();renderUsers();renderProfiles();openProfile(selectedProfile);applyIam();
function routeUsersHash(){ensurePageGuard();if(location.hash.slice(1)==='users')setAdminPage('users');}
if(document.readyState==='complete')routeUsersHash();else window.addEventListener('load',routeUsersHash);
