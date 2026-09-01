const device = document.getElementById('device');
const screenButtons = document.querySelectorAll('[data-screen]');
const deviceButtons = document.querySelectorAll('[data-device]');

function setScreen(name){
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if(target) target.classList.add('active');
  screenButtons.forEach(b => b.classList.toggle('active', b.dataset.screen === name));
  device.classList.toggle('portal-mode', name === 'portal');
  device.classList.toggle('admin-mode', name === 'admin');
  window.scrollTo({top:0,behavior:'smooth'});
}
window.setScreen = setScreen;
screenButtons.forEach(btn => btn.addEventListener('click', () => setScreen(btn.dataset.screen)));
deviceButtons.forEach(btn => btn.addEventListener('click', () => {
  const mobile = btn.dataset.device === 'mobile';
  device.classList.toggle('mobile', mobile);
  deviceButtons.forEach(b => b.classList.toggle('active', b === btn));
}));

const categories = {
  camera:['Spiegelreflexcamera (DSLR)','Systeemcamera','Cinema camera','Compactcamera','Camerabody'],
  lenses:['Objectief (Standaard/Prime)','Zoomlens','Telelens','Macro lens','Fish-eye lens','Extenders & Teleconverters'],
  audio:['Microfoons','Geluidsrecorders','Zenders/ontvangers','Geluidsaccessoires'],
  lighting:['Flitsers','LED-lampen / continu licht','Softboxen / diffusers','Lichtstatieven','Gimbals & light rigs'],
  support:['Statief','Statiefkop','Monopod','Schouderrigs','Sliders / Dollies'],
  storage:['Geheugenkaarten',"SSD's / HDD's",'Readers & Docks'],
  computer:['Laptops','Tablets (iPads, etc.)','Computers voor bewerking'],
  drones:['Drones (zonder vliegrisicoverzekering)','Accessoires voor drones'],
  accessories:['Accu’s & Batterijen','Adapters & voedingen','Cameratassen & koffers','Camera mounts / cages','Kabels (HDMI, audio, stroom)','Filters (ND, UV, polarisatie)']
};

const receiptSelect = document.getElementById('receiptSelect');
const receiptButton = document.getElementById('receiptSelectButton');
receiptButton?.addEventListener('click', () => receiptSelect.classList.toggle('open'));
document.querySelectorAll('.receipt-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.getElementById('receiptSelected').textContent = opt.dataset.receipt;
    receiptSelect.classList.remove('open');
  });
});

function euro(v){
  return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(v);
}
function updatePremium(){
  window.GoSafeApp?.refresh?.();
}


// Jouw gegevens
const customerTypeInputs = document.querySelectorAll('input[name="customerType"]');
const customerDetailsBlocks = document.getElementById('customerDetailsBlocks');
const privateFields = document.getElementById('privateFields');
const businessFields = document.getElementById('businessFields');
const kvkNumber = document.getElementById('kvkNumber');
const kvkState = document.getElementById('kvkState');
const postcode = document.getElementById('postcode');
const houseNumber = document.getElementById('houseNumber');
const country = document.getElementById('country');
const addressState = document.getElementById('addressState');
const accountHolder = document.getElementById('accountHolder');

function currentCustomerType(){
  return document.querySelector('input[name="customerType"]:checked')?.value || '';
}
function updateAccountHolder(){
  if(!accountHolder || accountHolder.dataset.edited === 'true') return;
  const type = currentCustomerType();
  accountHolder.value = type === 'business'
    ? document.getElementById('companyName')?.value || ''
    : [document.getElementById('privateFirstName')?.value, document.getElementById('privateLastName')?.value].filter(Boolean).join(' ');
}
function setCustomerType(type){
  customerDetailsBlocks?.classList.add('visible');
  if(accountHolder) accountHolder.dataset.edited = 'false';
  privateFields?.classList.toggle('visible', type === 'private');
  businessFields?.classList.toggle('visible', type === 'business');
  document.querySelector('[data-error-for="customerType"]')?.classList.remove('visible');
  updateAccountHolder();
}
customerTypeInputs.forEach(input => input.addEventListener('change', () => setCustomerType(input.value)));
['privateFirstName','privateLastName','companyName'].forEach(id => document.getElementById(id)?.addEventListener('input', updateAccountHolder));
accountHolder?.addEventListener('input', () => { accountHolder.dataset.edited = 'true'; });
kvkNumber?.addEventListener('input', () => {
  kvkNumber.value = kvkNumber.value.replace(/\D/g,'').slice(0,8);
  if(kvkNumber.value.length < 8){
    kvkState.className = 'lookup-state';
    kvkState.textContent = 'Vul 8 cijfers in. We zoeken daarna automatisch je bedrijf op.';
    return;
  }
  if(kvkNumber.value === '00000000'){
    kvkState.className = 'lookup-state notice';
    kvkState.textContent = 'We konden je gegevens niet ophalen. Vul je bedrijfsgegevens hieronder zelf in.';
    return;
  }
  kvkState.className = 'lookup-state success';
  kvkState.textContent = 'Bedrijfsgegevens opgehaald. Controleer ze en pas ze aan als dat nodig is.';
  const company = document.getElementById('companyName');
  const legal = document.getElementById('legalForm');
  if(!company.value) company.value = 'Studio Noord B.V.';
  if(!legal.value) legal.value = 'Besloten vennootschap (bv)';
  if(!postcode.value) postcode.value = '1012 AB';
  if(!houseNumber.value) houseNumber.value = '12';
  const street = document.getElementById('street');
  const city = document.getElementById('city');
  if(!street.value) street.value = 'Voorbeeldstraat';
  if(!city.value) city.value = 'Amsterdam';
  updateAccountHolder();
});

function tryAddressLookup(){
  if(country?.value !== 'NL') return;
  const pc = (postcode?.value || '').replace(/\s/g,'').toUpperCase();
  const nr = (houseNumber?.value || '').trim();
  if(pc.length < 6 || !nr){ addressState.textContent = ''; addressState.className = 'lookup-state'; return; }
  if(pc === '0000AA'){
    addressState.className = 'lookup-state notice';
    addressState.textContent = 'We konden dit adres niet automatisch vinden. Vul straat en woonplaats handmatig in.';
    return;
  }
  addressState.className = 'lookup-state success';
  addressState.textContent = 'Adres opgehaald. Je kunt de gegevens hieronder aanpassen.';
  const street = document.getElementById('street');
  const city = document.getElementById('city');
  if(!street.value) street.value = 'Voorbeeldstraat';
  if(!city.value) city.value = 'Amsterdam';
}
postcode?.addEventListener('input', tryAddressLookup);
houseNumber?.addEventListener('input', tryAddressLookup);

function showOutfall(message){
  document.getElementById('outfallMessage').textContent = message;
  document.getElementById('outfallBackdrop').classList.add('visible');
}
document.getElementById('outfallClose')?.addEventListener('click', () => document.getElementById('outfallBackdrop').classList.remove('visible'));
document.getElementById('outfallBackdrop')?.addEventListener('click', e => { if(e.target.id === 'outfallBackdrop') e.currentTarget.classList.remove('visible'); });
country?.addEventListener('change', () => {
  if(country.value !== 'NL') showOutfall('Op dit moment kun je deze verzekering alleen afsluiten als je in Nederland woont of als je bedrijf in Nederland is gevestigd.');
  tryAddressLookup();
});

function ibanValid(iban){
  const clean = (iban || '').replace(/\s+/g,'').toUpperCase();
  if(!/^NL\d{2}[A-Z]{4}\d{10}$/.test(clean)) return false;
  const rearranged = clean.slice(4) + clean.slice(0,4);
  let numeric = '';
  for(const ch of rearranged) numeric += /[A-Z]/.test(ch) ? String(ch.charCodeAt(0)-55) : ch;
  let remainder = 0;
  for(const digit of numeric) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}
function ageAtLeast18(dateValue){
  if(!dateValue) return false;
  const dob = new Date(dateValue + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18;
}
function clearCustomerErrors(){
  document.querySelectorAll('#screen-customer .invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('#screen-customer .field-error').forEach(el => el.classList.remove('visible'));
  document.getElementById('customerPrototypeSuccess')?.classList.remove('visible');
}
function flag(el){
  if(!el) return;
  el.classList.add('invalid');
}
function validateCustomerScreen(){
  clearCustomerErrors();
  const type = currentCustomerType();
  if(!type){ document.querySelector('[data-error-for="customerType"]')?.classList.add('visible'); return false; }
  if(country.value !== 'NL'){
    showOutfall('Op dit moment kun je deze verzekering alleen afsluiten als je in Nederland woont of als je bedrijf in Nederland is gevestigd.');
    return false;
  }
  if(type === 'private' && !ageAtLeast18(document.getElementById('dateOfBirth').value)){
    if(document.getElementById('dateOfBirth').value) showOutfall('Voor deze verzekering moet de verzekeringnemer minimaal 18 jaar zijn.');
    else flag(document.getElementById('dateOfBirth'));
    if(document.getElementById('dateOfBirth').value) return false;
  }
  const required = type === 'private'
    ? ['privateFirstName','privateLastName','dateOfBirth','privateEmail','privatePhone','postcode','houseNumber','street','city','iban','accountHolder']
    : ['kvkNumber','companyName','legalForm','businessFirstName','businessLastName','businessEmail','businessPhone','postcode','houseNumber','street','city','iban','accountHolder'];
  let ok = true;
  required.forEach(id => { const el = document.getElementById(id); if(!String(el?.value || '').trim()){ flag(el); ok = false; } });
  const iban = document.getElementById('iban');
  if(iban.value && !ibanValid(iban.value)){
    flag(iban); document.querySelector('[data-error-for="iban"]')?.classList.add('visible'); ok = false;
  }
  if(!document.getElementById('sepaConsent').checked){
    document.querySelector('[data-error-for="sepaConsent"]')?.classList.add('visible'); ok = false;
  }
  return ok;
}
document.getElementById('customerBack')?.addEventListener('click', () => setScreen('overview'));
document.getElementById('customerNext')?.addEventListener('click', () => {
  if(validateCustomerScreen()){
      setScreen('close');
      updatePremium();
  }
});


// Controleren & afsluiten
const startDate = document.getElementById('startDate');
function isoDateLocal(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function setStartDateBounds(){
  if(!startDate) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const max = new Date(today); max.setDate(max.getDate()+30);
  startDate.min = isoDateLocal(today);
  startDate.max = isoDateLocal(max);
  if(!startDate.value) startDate.value = isoDateLocal(today);
}
setStartDateBounds();
document.getElementById('editItemsFromClose')?.addEventListener('click', () => setScreen('overview'));

document.getElementById('slotClose')?.addEventListener('click', () => document.getElementById('slotBackdrop')?.classList.remove('visible'));
document.getElementById('slotBackdrop')?.addEventListener('click', e => { if(e.target.id === 'slotBackdrop') e.currentTarget.classList.remove('visible'); });
const slotGroups = ['slotDamage','slotPreviousNorisk','slotRefused','slotJustice'];
function hasYesSlotAnswer(){
  return slotGroups.some(name => document.querySelector(`input[name="${name}"]:checked`)?.value === 'yes');
}
function updateSlotAcceptanceState(){
  document.getElementById('slotError')?.classList.remove('visible');
  slotGroups.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const explanation = document.querySelector(`[data-slot-explanation="${name}"]`);
    const textarea = explanation?.querySelector('textarea');
    const show = selected?.value === 'yes';
    explanation?.classList.toggle('visible', show);
    if(!show && textarea) textarea.classList.remove('invalid');
  });
  const manual = hasYesSlotAnswer();
  document.getElementById('acceptanceNotice')?.classList.toggle('visible', manual);
  const btn = document.getElementById('finalCloseButton');
  if(btn && !btn.disabled) btn.textContent = manual ? 'Ter acceptatie aanbieden' : 'Verzekering afsluiten';
  const reassurance = document.querySelector('.final-close-bar .close-reassurance');
  if(reassurance){
    reassurance.textContent = manual
      ? 'Na aanbieden ben je nog niet verzekerd. Een collega van GoSafe beoordeelt de ingevulde slotbepalingen en neemt de aanvraag in behandeling.'
      : 'Na afsluiten ben je verzekerd vanaf de gekozen ingangsdatum, onder voorbehoud van de controles die bij deze verzekering horen.';
  }
}
document.querySelectorAll('.slot-card input[type="radio"]').forEach(r => r.addEventListener('change', updateSlotAcceptanceState));
document.querySelectorAll('.slot-explanation textarea').forEach(t => t.addEventListener('input', () => t.classList.remove('invalid')));
document.getElementById('finalConsent')?.addEventListener('change', () => document.getElementById('finalConsentError')?.classList.remove('visible'));
document.getElementById('finalCloseButton')?.addEventListener('click', () => {
  let ok = true;
  const missingSlotAnswer = slotGroups.some(name => !document.querySelector(`input[name="${name}"]:checked`));
  if(missingSlotAnswer){ document.getElementById('slotError')?.classList.add('visible'); ok = false; }
  let missingExplanation = false;
  slotGroups.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if(selected?.value === 'yes'){
      const textarea = document.querySelector(`[data-slot-explanation="${name}"] textarea`);
      if(!textarea?.value.trim()){ textarea?.classList.add('invalid'); missingExplanation = true; ok = false; }
    }
  });
  if(missingExplanation){
    const error = document.getElementById('slotError');
    if(error){ error.textContent = 'Geef bij ieder antwoord Ja een korte toelichting.'; error.classList.add('visible'); }
  } else if(missingSlotAnswer){
    const error = document.getElementById('slotError');
    if(error) error.textContent = 'Beantwoord alle slotbepalingen om verder te gaan.';
  }
  if(!document.getElementById('finalConsent')?.checked){ document.getElementById('finalConsentError')?.classList.add('visible'); ok = false; }
  if(!startDate?.value){ startDate?.classList.add('invalid'); ok = false; }
  if(ok){
    const manual = hasYesSlotAnswer();
    showThankYou(manual);
  }
});

let lastSubmissionNeedsAcceptance = false;
function showThankYou(manual){
  lastSubmissionNeedsAcceptance = !!manual;
  const title = document.getElementById('thanksTitle');
  const text = document.getElementById('thanksText');
  if(manual){
    if(title) title.textContent = 'Bedankt, je aanvraag is ontvangen';
    if(text) text.textContent = 'We gaan je aanvraag beoordelen. Een bevestiging staat in je mailbox.';
  } else {
    if(title) title.textContent = 'Je verzekering is afgesloten';
    if(text) text.textContent = 'Een bevestiging staat in je mailbox.';
  }
  updatePortalPreview();
  setScreen('thanks');
}

document.getElementById('goToMyGoSafe')?.addEventListener('click', () => setScreen('login'));

// Mijn GoSafe - passwordless code via e-mail of SMS
const authEmailStep = document.getElementById('authEmailStep');
const authCodeStep = document.getElementById('authCodeStep');
const authEmailField = document.getElementById('authEmailField');
const authSmsField = document.getElementById('authSmsField');
const loginEmail = document.getElementById('loginEmail');
const loginPhone = document.getElementById('loginPhone');
const loginCode = document.getElementById('loginCode');
let authMethod = 'email';
function emailValid(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim()); }
function phoneValid(value){ return String(value||'').replace(/\D/g,'').length >= 8; }
function setAuthMethod(method){
  authMethod = method === 'sms' ? 'sms' : 'email';
  document.querySelectorAll('[data-auth-method]').forEach(btn => btn.classList.toggle('active',btn.dataset.authMethod===authMethod));
  if(authEmailField) authEmailField.style.display = authMethod==='email' ? 'block' : 'none';
  if(authSmsField) authSmsField.style.display = authMethod==='sms' ? 'block' : 'none';
  document.getElementById('loginEmailError')?.classList.remove('visible');
  document.getElementById('loginPhoneError')?.classList.remove('visible');
}
document.querySelectorAll('[data-auth-method]').forEach(btn => btn.addEventListener('click',()=>setAuthMethod(btn.dataset.authMethod)));
function authDestination(){ return authMethod==='sms' ? String(loginPhone?.value||'').trim() : String(loginEmail?.value||'').trim(); }
function showCodeStep(){
  const destination = authDestination();
  if(authMethod==='email' && !emailValid(destination)){ document.getElementById('loginEmailError')?.classList.add('visible'); loginEmail?.classList.add('invalid'); return; }
  if(authMethod==='sms' && !phoneValid(destination)){ document.getElementById('loginPhoneError')?.classList.add('visible'); loginPhone?.classList.add('invalid'); return; }
  document.getElementById('loginEmailError')?.classList.remove('visible'); loginEmail?.classList.remove('invalid');
  document.getElementById('loginPhoneError')?.classList.remove('visible'); loginPhone?.classList.remove('invalid');
  document.getElementById('codeChannelLabel').textContent = authMethod==='sms' ? 'SMS' : 'e-mail';
  document.getElementById('codeDestinationLabel').textContent = destination;
  if(authEmailStep) authEmailStep.style.display='none';
  if(authCodeStep) authCodeStep.style.display='block';
  if(loginCode){ loginCode.value=''; setTimeout(()=>loginCode.focus(),0); }
}
document.getElementById('sendLoginCode')?.addEventListener('click', showCodeStep);
document.getElementById('resendLoginCode')?.addEventListener('click', () => {
  const message = document.querySelector('#authCodeStep .auth-message');
  const channel = authMethod==='sms' ? 'SMS' : 'e-mail';
  if(message){ message.innerHTML = `Er is een nieuwe inlogcode gestuurd via <strong>${channel}</strong> naar <strong>${authDestination()}</strong>.`; }
});
document.getElementById('changeLoginMethod')?.addEventListener('click', () => {
  if(authCodeStep) authCodeStep.style.display='none';
  if(authEmailStep) authEmailStep.style.display='block';
  (authMethod==='sms' ? loginPhone : loginEmail)?.focus();
});
loginCode?.addEventListener('input', () => { loginCode.value = loginCode.value.replace(/\D/g,'').slice(0,6); document.getElementById('loginCodeError')?.classList.remove('visible'); });
document.getElementById('verifyLoginCode')?.addEventListener('click', () => {
  if(!/^\d{6}$/.test(loginCode?.value || '')){ document.getElementById('loginCodeError')?.classList.add('visible'); return; }
  const loggedInAs = document.getElementById('portalLoggedInAs');
  if(loggedInAs) loggedInAs.textContent = authDestination();
  syncPortalProfile();
  updatePortalPreview();
  openPortalPage('insurance');
  setScreen('portal');
});
document.getElementById('logoutPortal')?.addEventListener('click', () => {
  if(authCodeStep) authCodeStep.style.display='none';
  if(authEmailStep) authEmailStep.style.display='block';
  if(loginCode) loginCode.value='';
  setScreen('login');
});


function openPortalPage(name){
  document.querySelectorAll('[data-portal-page]').forEach(page => page.classList.toggle('active', page.dataset.portalPage===name));
  const menuName = name === 'insurance-item' ? 'insurance' : name;
  document.querySelectorAll('[data-portal-target]').forEach(link => link.classList.toggle('active', link.dataset.portalTarget===menuName));
  document.querySelector('.portal-main')?.scrollTo?.({top:0,behavior:'smooth'});
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-portal-target]').forEach(link => link.addEventListener('click', e => { e.preventDefault(); openPortalPage(link.dataset.portalTarget); }));

// Mijn verzekering hergebruikt dezelfde itemflow als de aanvraag, maar binnen de Mijn GoSafe-shell.
// Alle polisrelevante wijzigingen worden als één conceptmutatie behandeld. Alleen een aankoopbewijs-koppeling is administratief.
const portalPolicyStart='2026-08-25';
const portalPolicyEnd='2027-08-25';
const portalToday='2026-08-25';
let portalCurrentAnnualPremium=220;
const portalPolicyCosts=5;
const portalInsuranceTaxRate=.084;
const portalItemRate=.025; // illustratief prototype: sluit aan op de reeds getoonde itempremies.
const initialPortalItems = {
  fx6:{name:'Camera A',category:'camera',subcategory:'Cinema camera',brand:'Sony',model:'FX6',serial:'123456789',amount:'6500',receipt:'CameraStore_factuur_2026-04-18.pdf',deleted:false},
  lens:{name:'Lens 24–70',category:'lenses',subcategory:'Zoomlens',brand:'Sony',model:'FE 24–70 GM II',serial:'987654321',amount:'2300',receipt:'',deleted:false}
};
function clonePortalItems(source){ return JSON.parse(JSON.stringify(source)); }
let portalItemData = clonePortalItems(initialPortalItems);
let portalCommittedItemData = clonePortalItems(initialPortalItems);
const portalCategoryLabels={camera:'Camera’s',lenses:'Lenzen & Optiek',audio:'Geluidsapparatuur',lighting:'Belichting',support:'Statieven & Ondersteuning',storage:'Opslag & Media',computer:'Computers & Tablets',drones:'Drones',accessories:'Accessoires'};
let portalEditingItemKey = null;
let portalMutationDirty = false;
let portalApplicationLocked = false;
let portalCommittedRentalIn = false;
let portalCommittedRentalOut = false;
let portalCommittedRentalLimit = '10000';
let portalMutationDocumentVersion = 1;
const portalMainCategory = document.getElementById('portalMainCategory');
const portalSubCategory = document.getElementById('portalSubCategory');
function fillPortalSubcategories(category, selected=''){
  const opts = categories[category] || [];
  if(!portalSubCategory) return;
  portalSubCategory.innerHTML = opts.length ? '<option value="">Kies een subcategorie</option>' + opts.map(x=>`<option value="${x}">${x}</option>`).join('') : '<option value="">Kies eerst een hoofdcategorie</option>';
  portalSubCategory.disabled = !opts.length;
  if(selected) portalSubCategory.value = selected;
}
portalMainCategory?.addEventListener('change',()=>fillPortalSubcategories(portalMainCategory.value));
function portalItemAnnualPremium(item){ return Number(item?.amount||0)*portalItemRate; }
function portalOwnAnnualPremium(items=portalItemData){ return Object.values(items).filter(x=>!x.deleted).reduce((sum,item)=>sum+portalItemAnnualPremium(item),0); }
function policyRelevantItem(item){
  if(!item) return null;
  return {name:item.name||'',category:item.category||'',subcategory:item.subcategory||'',brand:item.brand||'',model:item.model||'',serial:item.serial||'',amount:String(item.amount||''),deleted:!!item.deleted};
}
function portalPolicyState(items, rentalIn, rentalLimit, rentalOut){
  const normalized=Object.keys(items).sort().map(key=>[key,policyRelevantItem(items[key])]);
  return JSON.stringify({items:normalized,rentalIn:!!rentalIn,rentalLimit:rentalIn?String(rentalLimit||''):'',rentalOut:!!rentalOut});
}
function currentPortalPolicyState(){ return portalPolicyState(portalItemData,portalRentalIn?.checked,portalRentalLimit?.value,portalRentalOut?.checked); }
function committedPortalPolicyState(){ return portalPolicyState(portalCommittedItemData,portalCommittedRentalIn,portalCommittedRentalLimit,portalCommittedRentalOut); }
function renderPortalItems(){
  const list=document.getElementById('portalItemsList');
  if(!list) return;
  const rows=Object.entries(portalItemData).filter(([,item])=>!item.deleted).map(([key,item])=>{
    const title=[item.name, [item.brand,item.model].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
    const proof=item.receipt?'Aankoopbewijs gekoppeld':'Geen aankoopbewijs gekoppeld';
    const actions=portalApplicationLocked?'':`<div class="actions"><button class="icon-btn" title="Bewerken" data-edit-portal-item="${key}">✎</button><button class="icon-btn" title="Verwijderen" data-delete-portal-item="${key}">×</button></div>`;
    return `<div class="item-row" data-portal-item="${key}"><div><div class="item-title">${title||'Item'}</div><div class="item-meta">${portalCategoryLabels[item.category]||''}${item.subcategory?' / '+item.subcategory:''}</div><div class="item-proof">${proof}</div></div><div><div class="item-meta">Verzekerd bedrag</div><div class="money">${euro(Number(item.amount||0))}</div></div><div><div class="item-meta">Jaarpremie</div><div class="money">${euro(portalItemAnnualPremium(item))}</div></div>${actions}</div>`;
  }).join('');
  list.innerHTML=rows || '<div style="padding:18px;color:var(--muted);font-size:12px">Er zijn geen items meer in deze conceptwijziging.</div>';
  list.querySelectorAll('[data-edit-portal-item]').forEach(btn=>btn.addEventListener('click',()=>openPortalItemForm(btn.dataset.editPortalItem)));
  list.querySelectorAll('[data-delete-portal-item]').forEach(btn=>btn.addEventListener('click',()=>{
    if(portalApplicationLocked) return;
    if(portalItemData[btn.dataset.deletePortalItem]) portalItemData[btn.dataset.deletePortalItem].deleted=true;
    renderPortalItems(); refreshPortalMutationState();
  }));
  const total=document.getElementById('portalItemsAnnualTotal'); if(total) total.textContent=`${euro(portalOwnAnnualPremium())} per jaar`;
}
function openPortalItemForm(key=null){
  if(portalApplicationLocked) return;
  portalEditingItemKey = key;
  const data = key ? portalItemData[key] : {name:'',category:'',subcategory:'',brand:'',model:'',serial:'',amount:'',receipt:''};
  document.getElementById('portalItemFormTitle').textContent = key ? 'Item wijzigen' : 'Item toevoegen';
  document.getElementById('portalItemFormIntro').textContent = key ? 'Pas de gegevens van dit verzekerde item aan.' : 'Vul de gegevens in van één apparaat dat je wilt verzekeren.';
  portalMainCategory.value = data.category || '';
  fillPortalSubcategories(data.category || '', data.subcategory || '');
  document.getElementById('portalItemBrand').value = data.brand || '';
  document.getElementById('portalItemModel').value = data.model || '';
  document.getElementById('portalItemSerial').value = data.serial || '';
  document.getElementById('portalItemAmount').value = data.amount || '';
  document.getElementById('portalItemName').value = data.name || '';
  document.getElementById('portalReceiptSelected').textContent = data.receipt || 'Selecteer een aankoopbewijs';
  openPortalPage('insurance-item');
}
document.getElementById('portalAddItem')?.addEventListener('click',()=>openPortalItemForm());
document.getElementById('portalCancelItemForm')?.addEventListener('click',()=>openPortalPage('insurance'));
document.getElementById('portalSaveItemForm')?.addEventListener('click',()=>{
  if(portalApplicationLocked) return;
  const amount=Number(document.getElementById('portalItemAmount')?.value||0);
  const category=portalMainCategory?.value||'';
  const subcategory=portalSubCategory?.value||'';
  const brand=document.getElementById('portalItemBrand')?.value?.trim()||'';
  const model=document.getElementById('portalItemModel')?.value?.trim()||'';
  if(!category || !subcategory || !brand || !model || !amount) return;
  const selectedReceipt=document.getElementById('portalReceiptSelected')?.textContent||'';
  const data={name:document.getElementById('portalItemName')?.value?.trim()||'',category,subcategory,brand,model,serial:document.getElementById('portalItemSerial')?.value?.trim()||'',amount:String(amount),receipt:selectedReceipt==='Selecteer een aankoopbewijs'?'':selectedReceipt,deleted:false};
  const key=portalEditingItemKey || `item_${Date.now()}`;
  // Aankoopbewijs is administratief: bij een bestaand item wordt die koppeling direct als committed gezien.
  if(portalCommittedItemData[key]) portalCommittedItemData[key].receipt=data.receipt;
  portalItemData[key]=data;
  renderPortalItems();
  refreshPortalMutationState();
  openPortalPage('insurance');
});

const portalReceiptSelect=document.getElementById('portalReceiptSelect');
document.getElementById('portalReceiptSelectButton')?.addEventListener('click',()=>portalReceiptSelect?.classList.toggle('open'));
document.querySelectorAll('.portal-receipt-option').forEach(btn=>btn.addEventListener('click',()=>{
  document.getElementById('portalReceiptSelected').textContent=btn.dataset.receipt;
  portalReceiptSelect?.classList.remove('open');
}));
document.addEventListener('click',e=>{ if(portalReceiptSelect && !portalReceiptSelect.contains(e.target)) portalReceiptSelect.classList.remove('open'); });
document.getElementById('portalUploadReceipt')?.addEventListener('click',()=>{ document.getElementById('portalUploadName').textContent='Nieuw_aankoopbewijs.pdf'; document.getElementById('portalReceiptSelected').textContent='Nieuw_aankoopbewijs.pdf'; });

const portalRentalIn=document.getElementById('portalRentalIn');
const portalRentalOut=document.getElementById('portalRentalOut');
const portalRentalLimit=document.getElementById('portalRentalLimit');
const portalMutationDate=document.getElementById('portalMutationDate');
function dateAtMidnight(value){ const [y,m,d]=String(value||'').split('-').map(Number); return y&&m&&d?new Date(y,m-1,d):null; }
function daysBetween(a,b){ return Math.max(0,Math.round((b-a)/86400000)); }
function formatDateLong(value){ const d=dateAtMidnight(value); return d?new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric'}).format(d):value; }
function isoDayBefore(value){ const d=dateAtMidnight(value); if(!d) return ''; d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
if(portalMutationDate){ portalMutationDate.min=portalToday; portalMutationDate.max=isoDayBefore(portalPolicyEnd); portalMutationDate.value=portalToday; }
function portalProposedAnnualPremium(){
  const own=portalOwnAnnualPremium();
  const inhuur=portalRentalIn?.checked ? Number(portalRentalLimit?.selectedOptions?.[0]?.dataset?.premium || 150) : 0;
  const verhuur=portalRentalOut?.checked ? own*.25 : 0;
  return {own,inhuur,verhuur,total:own+inhuur+verhuur};
}
function refreshPortalMutationState(){
  portalMutationDirty=!portalApplicationLocked && currentPortalPolicyState()!==committedPortalPolicyState();
  document.getElementById('portalMutationSummary')?.classList.toggle('visible',portalMutationDirty);
  const cancel=document.getElementById('portalCancelChanges'); if(cancel) cancel.disabled=!portalMutationDirty;
  updatePortalPolicyPremium();
}
function updatePortalPolicyPremium(){
  const p=portalProposedAnnualPremium();
  document.getElementById('portalRentalInAmount')?.classList.toggle('visible',!!portalRentalIn?.checked && !portalApplicationLocked);
  const end=dateAtMidnight(portalPolicyEnd), min=dateAtMidnight(portalToday), effective=dateAtMidnight(portalMutationDate?.value);
  const validDate=effective && min && effective>=min && effective<end;
  const remaining=validDate?daysBetween(effective,end):0;
  const annualDifference=p.total-portalCurrentAnnualPremium;
  const proratedDifference=portalMutationDirty && validDate ? annualDifference/365*remaining : 0;
  const costs=portalMutationDirty && validDate ? portalPolicyCosts : 0;
  const tax=(proratedDifference+costs)*portalInsuranceTaxRate;
  const mutationTotal=proratedDifference+costs+tax;
  if(document.getElementById('portalMutationOldAnnual')) document.getElementById('portalMutationOldAnnual').textContent=euro(portalCurrentAnnualPremium);
  if(document.getElementById('portalMutationNewAnnual')) document.getElementById('portalMutationNewAnnual').textContent=euro(p.total);
  if(document.getElementById('portalMutationAnnualDifference')) document.getElementById('portalMutationAnnualDifference').textContent=validDate?euro(annualDifference):'—';
  if(document.getElementById('portalMutationRemainingDays')) document.getElementById('portalMutationRemainingDays').textContent=validDate?`${remaining} dagen`:'—';
  if(document.getElementById('portalMutationNet')) document.getElementById('portalMutationNet').textContent=validDate?euro(proratedDifference):'—';
  if(document.getElementById('portalMutationTax')) document.getElementById('portalMutationTax').textContent=validDate?euro(tax):'—';
  if(document.getElementById('portalMutationCosts')) document.getElementById('portalMutationCosts').textContent=validDate?euro(costs):'—';
  const totalEl=document.getElementById('portalMutationTotal'); if(totalEl) totalEl.textContent=validDate?euro(Math.abs(mutationTotal)):'—';
  const label=document.getElementById('portalMutationTotalLabel'); if(label) label.textContent=mutationTotal<0?'Terug te ontvangen':'Nu te betalen';
  const formula=document.getElementById('portalMutationFormula'); if(formula) formula.textContent=validDate?`Berekening premieverschil: (${euro(p.total)} − ${euro(portalCurrentAnnualPremium)}) ÷ 365 × ${remaining} dagen = ${euro(proratedDifference)}.`:'Berekening premieverschil: (nieuwe jaarpremie − oude jaarpremie) ÷ 365 × resterende dagen.';
  const note=document.getElementById('portalMutationNote'); if(note) note.textContent=validDate?`Vanaf ${formatDateLong(portalPolicyEnd)} geldt de nieuwe jaarpremie van ${euro(p.total)} voor een volledige verzekeringsperiode.`:'Kies een ingangsdatum vanaf vandaag en vóór het einde van de huidige verzekeringsperiode.';
  const btn=document.getElementById('portalApplyChanges'); if(btn) btn.disabled=!portalMutationDirty || !validDate || portalApplicationLocked;
}
portalRentalIn?.addEventListener('change',()=>{ if(!portalApplicationLocked) refreshPortalMutationState(); });
portalRentalOut?.addEventListener('change',()=>{ if(!portalApplicationLocked) refreshPortalMutationState(); });
portalRentalLimit?.addEventListener('change',()=>{ if(!portalApplicationLocked) refreshPortalMutationState(); });
portalMutationDate?.addEventListener('change',updatePortalPolicyPremium);

document.getElementById('portalCancelChanges')?.addEventListener('click',()=>{
  if(portalApplicationLocked) return;
  portalItemData=clonePortalItems(portalCommittedItemData);
  if(portalRentalIn) portalRentalIn.checked=portalCommittedRentalIn;
  if(portalRentalOut) portalRentalOut.checked=portalCommittedRentalOut;
  if(portalRentalLimit) portalRentalLimit.value=portalCommittedRentalLimit;
  if(portalMutationDate) portalMutationDate.value=portalToday;
  renderPortalItems(); refreshPortalMutationState();
});
function updatePortalCurrentPremiumDisplay(){
  const tax=(portalCurrentAnnualPremium+portalPolicyCosts)*portalInsuranceTaxRate;
  document.getElementById('portalCurrentAnnualPremium').textContent=euro(portalCurrentAnnualPremium);
  document.getElementById('portalCurrentPolicyCosts').textContent=euro(portalPolicyCosts);
  document.getElementById('portalCurrentTax').textContent=euro(tax);
  document.getElementById('portalCurrentTotal').textContent=euro(portalCurrentAnnualPremium+portalPolicyCosts+tax);
}
function addPortalMutationDocuments(amount,effectiveDate){
  const archive=document.getElementById('portalDocumentArchive2026'); if(!archive) return;
  portalMutationDocumentVersion += 1;
  const previous=archive.querySelector('.portal-doc-status'); if(previous){ previous.textContent='Archief'; previous.classList.add('neutral'); }
  const financeType=amount<0?'Creditnota':'Nota';
  const number=`2026-001284-${String(portalMutationDocumentVersion).padStart(2,'0')}`;
  const rows=document.createElement('div');
  rows.innerHTML=`<div class="portal-doc-row"><div class="portal-doc-main"><div class="portal-doc-icon">PDF</div><div><div class="portal-doc-title">Polis GS-2026-001284 · versie ${portalMutationDocumentVersion}</div><div class="portal-doc-sub">Apparatuurverzekering · verwerkt per ${formatDateLong(effectiveDate)}</div></div></div><div class="portal-doc-meta"><span>Datum</span><strong>${formatDateLong(effectiveDate)}</strong></div><div><span class="portal-doc-status">Actueel</span></div><div><button class="btn btn-secondary portal-document-open" type="button">Bekijken</button></div></div><div class="portal-doc-row"><div class="portal-doc-main"><div class="portal-doc-icon">PDF</div><div><div class="portal-doc-title">${financeType} ${number}</div><div class="portal-doc-sub">Poliswijziging apparatuurverzekering</div></div></div><div class="portal-doc-meta"><span>Bedrag</span><strong>${euro(Math.abs(amount))}</strong></div><div><span class="portal-doc-status">Nieuw</span></div><div><button class="btn btn-secondary portal-document-open" type="button">Bekijken</button></div></div>`;
  [...rows.children].reverse().forEach(row=>archive.prepend(row));
}
document.getElementById('portalApplyChanges')?.addEventListener('click',()=>{
  if(portalApplicationLocked || !portalMutationDirty) return;
  const effective=portalMutationDate?.value;
  const eff=dateAtMidnight(effective), min=dateAtMidnight(portalToday), end=dateAtMidnight(portalPolicyEnd);
  if(!eff || eff<min || eff>=end) return;
  const proposed=portalProposedAnnualPremium();
  const remaining=daysBetween(eff,end);
  const net=(proposed.total-portalCurrentAnnualPremium)/365*remaining;
  const costs=portalPolicyCosts;
  const tax=(net+costs)*portalInsuranceTaxRate;
  const mutationTotal=net+costs+tax;
  portalCommittedItemData=clonePortalItems(portalItemData);
  portalCommittedRentalIn=!!portalRentalIn?.checked;
  portalCommittedRentalOut=!!portalRentalOut?.checked;
  portalCommittedRentalLimit=portalRentalLimit?.value||'10000';
  portalCurrentAnnualPremium=proposed.total;
  addPortalMutationDocuments(mutationTotal,effective);
  updatePortalCurrentPremiumDisplay();
  portalMutationDirty=false;
  document.getElementById('portalMutationSummary')?.classList.remove('visible');
  const cancel=document.getElementById('portalCancelChanges'); if(cancel) cancel.disabled=true;
  const btn=document.getElementById('portalApplyChanges'); if(btn){ btn.disabled=true; btn.textContent='Wijzigingen verwerkt'; setTimeout(()=>{btn.textContent='Wijzigingen doorvoeren';},1200); }
  renderPortalItems();
});
function applyPortalLockState(locked){
  portalApplicationLocked=!!locked;
  const page=document.querySelector('[data-portal-page="insurance"]'); page?.classList.toggle('portal-locked',portalApplicationLocked);
  document.getElementById('portalLockBanner')?.classList.toggle('visible',portalApplicationLocked);
  const add=document.getElementById('portalAddItem'); if(add) add.style.display=portalApplicationLocked?'none':'';
  if(portalRentalIn) portalRentalIn.disabled=portalApplicationLocked;
  if(portalRentalOut) portalRentalOut.disabled=portalApplicationLocked;
  if(portalRentalLimit) portalRentalLimit.disabled=portalApplicationLocked;
  if(portalApplicationLocked){
    document.getElementById('portalReferenceLabel').textContent='Aanvraag';
    document.getElementById('portalReferenceValue').textContent='GS-AANVRAAG-2026-001284';
    document.getElementById('portalPolicyStatusValue').textContent='In beoordeling';
    document.getElementById('portalPolicyStatusValue').classList.remove('active-value');
    document.getElementById('portalPolicyStartValue').textContent='Na acceptatie';
    document.getElementById('portalPolicyEndValue').textContent='—';
    document.getElementById('portalPremiumKicker').textContent='Aangevraagde verzekering';
    document.getElementById('portalPremiumTitle').textContent='Aangevraagd per jaar';
  }else{
    document.getElementById('portalReferenceLabel').textContent='Polis';
    document.getElementById('portalReferenceValue').textContent='GS-2026-001284';
    document.getElementById('portalPolicyStatusValue').textContent='Actief';
    document.getElementById('portalPolicyStatusValue').classList.add('active-value');
    document.getElementById('portalPolicyStartValue').textContent='25 augustus 2026';
    document.getElementById('portalPolicyEndValue').textContent='25 augustus 2027';
    document.getElementById('portalPremiumKicker').textContent='Huidige verzekering';
    document.getElementById('portalPremiumTitle').textContent='Je betaalt per jaar';
  }
  renderPortalItems(); refreshPortalMutationState();
}
renderPortalItems();
updatePortalCurrentPremiumDisplay();
refreshPortalMutationState();

function applicationCustomerType(){ return document.querySelector('input[name="customerType"]:checked')?.value || 'business'; }
function valOr(id,fallback){ const el=document.getElementById(id); return (el && String(el.value||'').trim()) || fallback; }
function countryLabel(value){return ({NL:'Nederland',BE:'België',DE:'Duitsland',FR:'Frankrijk',OTHER:'Ander land'})[value]||value||'Nederland';}
function profileDate(value,fallback){ if(!value) return fallback; try{return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T00:00:00'))}catch(e){return fallback} }
function syncPortalProfile(){
  const type=applicationCustomerType(); const isBusiness=type==='business';
  document.getElementById('portalBusinessViewCard').style.display=isBusiness?'block':'none';
  document.getElementById('portalPrivateViewCard').style.display=isBusiness?'none':'block';
  document.getElementById('portalBusinessEditBlock').style.display=isBusiness?'block':'none';
  document.getElementById('portalPrivateEditBlock').style.display=isBusiness?'none':'block';
  const email=isBusiness?valOr('businessEmail','sanne@voorbeeld.nl'):valOr('privateEmail','sanne@voorbeeld.nl');
  const phone=isBusiness?valOr('businessPhone','06 12345678'):valOr('privatePhone','06 12345678');
  if(isBusiness){
    const company=valOr('companyName','Voorbeeld Media B.V.'); const first=valOr('businessFirstName','Sanne'); const last=valOr('businessLastName','de Vries');
    document.getElementById('profileCompanyName').textContent=company; document.getElementById('profileKvk').textContent=valOr('kvkNumber','12345678'); document.getElementById('profileLegalForm').textContent=valOr('legalForm','Besloten vennootschap (BV)'); document.getElementById('profileBusinessContact').textContent=`${first} ${last}`; document.getElementById('profileEmail').textContent=email; document.getElementById('profilePhone').textContent=phone;
    document.getElementById('profileEditCompany').value=company; document.getElementById('profileEditKvk').value=valOr('kvkNumber','12345678'); document.getElementById('profileEditLegalForm').value=valOr('legalForm','Besloten vennootschap (BV)'); document.getElementById('profileEditFirst').value=first; document.getElementById('profileEditLast').value=last;
  }else{
    const first=valOr('privateFirstName','Sanne'); const last=valOr('privateLastName','de Vries');
    document.getElementById('profilePrivateName').textContent=`${first} ${last}`; document.getElementById('profileBirthDate').textContent=profileDate(valOr('dateOfBirth','1990-03-12'),'12 maart 1990'); document.getElementById('profilePrivateEmail').textContent=email; document.getElementById('profilePrivatePhone').textContent=phone;
    document.getElementById('profileEditPrivateFirst').value=first; document.getElementById('profileEditPrivateLast').value=last; document.getElementById('profileEditDob').value=valOr('dateOfBirth','1990-03-12');
  }
  document.getElementById('profileEditEmail').value=email; document.getElementById('profileEditPhone').value=phone;
  const pc=valOr('postcode','1234 AB'), hn=valOr('houseNumber','12'), add=valOr('houseAddition','A'), st=valOr('street','Voorbeeldstraat'), cityv=valOr('city','Amsterdam');
  document.getElementById('profileAddress').textContent=`${st} ${hn}${add?' '+add:''}, ${pc} ${cityv}`;
  const country=countryLabel(valOr('country','NL'));
  document.getElementById('profileCountry').textContent=country; document.getElementById('profileEditPostcode').value=pc; document.getElementById('profileEditHouse').value=hn; document.getElementById('profileEditAddition').value=add; document.getElementById('profileEditCountry').value=country; document.getElementById('profileEditStreet').value=st; document.getElementById('profileEditCity').value=cityv;
  const ibanv=valOr('iban','NL91 ABNA 0417 1643 00'), holder=valOr('accountHolder',isBusiness?valOr('companyName','Voorbeeld Media B.V.'):`${valOr('privateFirstName','Sanne')} ${valOr('privateLastName','de Vries')}`);
  document.getElementById('profileIban').textContent=ibanv; document.getElementById('profileAccountHolder').textContent=holder; document.getElementById('profileEditIban').value=ibanv; document.getElementById('profileEditHolder').value=holder;
}
const profileView=document.getElementById('portalProfileView'), profileEdit=document.getElementById('portalProfileEditForm');
document.getElementById('portalEditProfile')?.addEventListener('click',()=>{syncPortalProfile();profileView?.classList.add('hidden');profileEdit?.classList.add('visible');document.getElementById('portalEditProfile').style.display='none'});
document.getElementById('portalCancelProfileEdit')?.addEventListener('click',()=>{profileView?.classList.remove('hidden');profileEdit?.classList.remove('visible');document.getElementById('portalEditProfile').style.display='inline-flex'});
document.getElementById('portalSaveProfileEdit')?.addEventListener('click',()=>{
  const isBusiness=applicationCustomerType()==='business';
  if(isBusiness){document.getElementById('profileCompanyName').textContent=valOr('profileEditCompany','Voorbeeld Media B.V.');document.getElementById('profileLegalForm').textContent=valOr('profileEditLegalForm','Besloten vennootschap (BV)');document.getElementById('profileBusinessContact').textContent=`${valOr('profileEditFirst','Sanne')} ${valOr('profileEditLast','de Vries')}`;document.getElementById('profileEmail').textContent=valOr('profileEditEmail','');document.getElementById('profilePhone').textContent=valOr('profileEditPhone','');}
  else{document.getElementById('profilePrivateName').textContent=`${valOr('profileEditPrivateFirst','Sanne')} ${valOr('profileEditPrivateLast','de Vries')}`;document.getElementById('profileBirthDate').textContent=profileDate(valOr('profileEditDob','1990-03-12'),'12 maart 1990');document.getElementById('profilePrivateEmail').textContent=valOr('profileEditEmail','');document.getElementById('profilePrivatePhone').textContent=valOr('profileEditPhone','');}
  document.getElementById('profileAddress').textContent=`${valOr('profileEditStreet','')} ${valOr('profileEditHouse','')}${valOr('profileEditAddition','')?' '+valOr('profileEditAddition',''):''}, ${valOr('profileEditPostcode','')} ${valOr('profileEditCity','')}`;document.getElementById('profileCountry').textContent=valOr('profileEditCountry','Nederland');
  document.getElementById('profileIban').textContent=valOr('profileEditIban','');document.getElementById('profileAccountHolder').textContent=valOr('profileEditHolder','');
  profileView?.classList.remove('hidden');profileEdit?.classList.remove('visible');document.getElementById('portalEditProfile').style.display='inline-flex';
});


// Polis/nota archief en aankoopbewijzen
const portalReceiptPanel=document.getElementById('portalReceiptUploadPanel');
document.getElementById('portalAddReceipt')?.addEventListener('click',()=>{portalReceiptPanel?.classList.add('visible');document.getElementById('portalAddReceipt')?.scrollIntoView?.({behavior:'smooth',block:'nearest'});});
document.getElementById('portalCancelReceiptUpload')?.addEventListener('click',()=>{portalReceiptPanel?.classList.remove('visible');});
document.getElementById('portalChooseReceiptFile')?.addEventListener('click',()=>{document.getElementById('portalReceiptUploadFile').textContent='Nieuw_aankoopbewijs_2026-08-25.pdf';});
document.getElementById('portalSaveReceiptUpload')?.addEventListener('click',()=>{
  const file=document.getElementById('portalReceiptUploadFile')?.textContent || 'Nieuw_aankoopbewijs.pdf';
  const selected=[...document.querySelectorAll('#portalReceiptUploadPanel .portal-select-item input:checked')].map(x=>x.value);
  const archive=document.getElementById('portalReceiptArchive');
  if(archive){
    const row=document.createElement('div'); row.className='portal-receipt-row';
    const chips=selected.length?selected.map(x=>`<span class="portal-item-chip">${x}</span>`).join(''):'<span class="portal-receipt-sub">Nog niet gekoppeld</span>';
    row.innerHTML=`<div><div class="portal-receipt-file">${file}</div><div class="portal-receipt-sub">Zojuist geüpload</div></div><div class="portal-item-chips">${chips}</div><div class="portal-doc-meta"><span>Bestand</span><strong>PDF</strong></div><div><button class="btn btn-secondary portal-receipt-open" type="button">Bekijken</button></div>`;
    archive.prepend(row);
  }
  portalReceiptPanel?.classList.remove('visible');
  document.getElementById('portalReceiptUploadFile').textContent='Nog geen bestand gekozen';
  document.querySelectorAll('#portalReceiptUploadPanel .portal-select-item input').forEach(x=>x.checked=false);
});

function formatNlDate(value){
  if(!value) return '—';
  const d = new Date(value + 'T00:00:00');
  return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric'}).format(d);
}
function updatePortalPreview(){
  applyPortalLockState(lastSubmissionNeedsAcceptance);
  syncPortalProfile();
}
