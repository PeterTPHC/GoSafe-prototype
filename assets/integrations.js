// ANVA-koppeling, XML-sjablonen en systeemsettings
(()=>{
const styles=document.createElement('link');styles.rel='stylesheet';styles.href='assets/integrations.css?v=20261127-anva-settings-v1';document.head.appendChild(styles);
const esc=value=>adminEscape(value);
const actorName=()=>typeof users!=='undefined'&&typeof signedInUserId!=='undefined'?users[signedInUserId].name:'Beheerder';
const nowLabel=()=>new Date().toLocaleString('nl-NL',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'}).replace(' om ',' · ');

const environments={
  production:{label:'Productie',base:'https://api.anva.example/gosafe/v1'},
  acceptance:{label:'Acceptatie',base:'https://acc-api.anva.example/gosafe/v1'}
};
const connection={environment:'production',organisationCode:'GOSAFE',officeCode:'1201',clientId:'gosafe-prod-01',secretSet:true,endpointOverride:'',
  lastTest:{ok:true,at:'27 nov 2026 · 09:12',ms:184,http:200},
  lastMessage:{at:'27 nov 2026 · 11:02',name:'Relatie en polis aanmaken',ok:true},
  day:{accepted:41,rejected:1}};
const requiredConnectionFields=[['organisationCode','Organisatiecode'],['officeCode','Kantoorcode'],['clientId','Client ID'],['secretSet','Client secret']];
const connectionBase=()=>connection.endpointOverride.trim()||environments[connection.environment].base;
const missingConnectionFields=()=>requiredConnectionFields.filter(([key])=>!connection[key]).map(([,label])=>label);
function connectionStatus(){
  const missing=missingConnectionFields();
  if(missing.length)return{tone:'amber',label:'Niet actief',text:`Berichten worden opgemaakt en bewaard, maar niet naar ANVA verstuurd. Ontbreekt: ${missing.join(', ')}.`};
  if(connection.lastTest&&!connection.lastTest.ok)return{tone:'red',label:'Storing',text:`Laatste verbindingstest mislukt: ${connection.lastTest.error}. Berichten blijven in de wachtrij tot de verbinding werkt.`};
  return{tone:'green',label:'Actief',text:`Berichten worden verstuurd naar ANVA ${environments[connection.environment].label.toLowerCase()}.`};
}

const fields=[
  ['policy_number','Polisnummer'],['product_code','Productcode'],['product_name','Product'],['start_date','Ingangsdatum'],['term_end_date','Einde huidige termijn'],['payment_term','Betaaltermijn'],
  ['insured_amount','Verzekerd bedrag'],['premium','Premie per termijn'],['policy_costs','Poliskosten'],['insurance_tax','Assurantiebelasting'],['total_amount','Totaal termijnbedrag'],
  ['anva_relation_pk','ANVA-relatienummer'],['is_business','Zakelijk (voorwaarde)'],['holder_name','Naam verzekeringnemer'],['kvk_number','KvK-nummer'],['initials','Voorletters'],['last_name','Achternaam'],['birth_date','Geboortedatum'],
  ['street','Straat'],['house_number','Huisnummer'],['postal_code','Postcode'],['city','Woonplaats'],['country','Land'],['email','E-mailadres'],['iban','IBAN'],
  ['mutation_date','Ingangsdatum mutatie'],['new_term_start','Start nieuwe termijn'],['cancel_date','Royementsdatum'],['cancel_reason','Reden royement'],['document_name','Documentnaam'],['document_reference','Documentreferentie'],
  ['office_code','Kantoorcode (koppeling)'],['organisation_code','Organisatiecode (koppeling)']
];
const fieldKeys=new Set(fields.map(([key])=>key));
const testPolicies=[
  {id:'business',label:'POL-2026-00276 · Voorbeeldbedrijf D · zakelijk',values:{policy_number:'POL-2026-00276',product_code:'APP',product_name:'Apparatuurverzekering',start_date:'2026-06-18',term_end_date:'2027-06-17',payment_term:'12',insured_amount:'64500.00',premium:'806.25',policy_costs:'7.50',insurance_tax:'170.90',total_amount:'984.65',anva_relation_pk:'1004872',is_business:true,holder_name:'Voorbeeldbedrijf D B.V.',kvk_number:'12345678',initials:'',last_name:'',birth_date:'',street:'Voorbeeldstraat',house_number:'12',postal_code:'1234 AB',city:'Voorbeeldstad',country:'NL',email:'administratie@voorbeeld.nl',iban:'NL00BANK0123456789',mutation_date:'2026-12-01',new_term_start:'2027-06-18',cancel_date:'2027-06-17',cancel_reason:'Op verzoek klant',document_name:'Polisblad',document_reference:'DOC-2026-00276-01'}},
  {id:'private',label:'POL-2026-00109 · Voorbeeldklant E · particulier',values:{policy_number:'POL-2026-00109',product_code:'INS',product_name:'Instrumentenverzekering',start_date:'2026-02-09',term_end_date:'2027-02-08',payment_term:'12',insured_amount:'18750.00',premium:'117.19',policy_costs:'7.50',insurance_tax:'26.19',total_amount:'150.88',anva_relation_pk:'',is_business:false,holder_name:'E. Voorbeeld',kvk_number:'',initials:'E.',last_name:'Voorbeeld',birth_date:'1988-04-14',street:'Testlaan',house_number:'7a',postal_code:'5678 CD',city:'Voorbeelddorp',country:'NL',email:'klant-e@voorbeeld.nl',iban:'NL00BANK9876543210',mutation_date:'2026-12-15',new_term_start:'2027-02-09',cancel_date:'2027-02-08',cancel_reason:'Instrument verkocht',document_name:'Polisblad',document_reference:'DOC-2026-00109-02'}},
  {id:'rental',label:'POL-2025-01142 · Voorbeeldbedrijf F · zakelijk, verhuur',values:{policy_number:'POL-2025-01142',product_code:'APP',product_name:'Apparatuurverzekering',start_date:'2025-12-03',term_end_date:'2026-12-02',payment_term:'12',insured_amount:'92300.00',premium:'1153.75',policy_costs:'7.50',insurance_tax:'243.86',total_amount:'1405.11',anva_relation_pk:'1003311',is_business:true,holder_name:'Voorbeeldbedrijf F & Zn.',kvk_number:'87654321',initials:'',last_name:'',birth_date:'',street:'Verhuurweg',house_number:'40',postal_code:'4321 EF',city:'Voorbeeldhaven',country:'NL',email:'verhuur@voorbeeld.nl',iban:'NL00BANK1122334455',mutation_date:'2026-11-30',new_term_start:'2026-12-03',cancel_date:'2026-12-02',cancel_reason:'Bedrijf beëindigd',document_name:'Nota',document_reference:'DOC-2025-01142-07'}}
];

const relationXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="RelatieEnPolisAanmaken">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Relatie>
{{#if is_business}}    <Bedrijf>
      <Naam>{{holder_name}}</Naam>
      <KvkNummer>{{kvk_number}}</KvkNummer>
    </Bedrijf>
{{else}}    <Persoon>
      <Voorletters>{{initials}}</Voorletters>
      <Achternaam>{{last_name}}</Achternaam>
      <Geboortedatum>{{birth_date}}</Geboortedatum>
    </Persoon>
{{/if}}    <Adres>
      <Straat>{{street}}</Straat>
      <Huisnummer>{{house_number}}</Huisnummer>
      <Postcode>{{postal_code}}</Postcode>
      <Plaats>{{city}}</Plaats>
      <Land>{{country}}</Land>
    </Adres>
    <Email>{{email}}</Email>
    <Iban>{{iban}}</Iban>
  </Relatie>
  <Polis>
    <Polisnummer>{{policy_number}}</Polisnummer>
    <Product>{{product_code}}</Product>
    <Ingangsdatum>{{start_date}}</Ingangsdatum>
    <Termijn maanden="{{payment_term}}"/>
    <VerzekerdBedrag>{{insured_amount}}</VerzekerdBedrag>
    <Premie>{{premium}}</Premie>
    <Poliskosten>{{policy_costs}}</Poliskosten>
    <Assurantiebelasting>{{insurance_tax}}</Assurantiebelasting>
  </Polis>
</AnvaBericht>`;
const documentXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="DocumentInDossier">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Polis nummer="{{policy_number}}" relatie="{{anva_relation_pk}}"/>
  <Document>
    <Naam>{{document_name}}</Naam>
    <Referentie>{{document_reference}}</Referentie>
    <Formaat>application/pdf</Formaat>
  </Document>
</AnvaBericht>`;
const mutationXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="PolisMutatie">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Polis nummer="{{policy_number}}" relatie="{{anva_relation_pk}}">
    <Ingangsdatum>{{mutation_date}}</Ingangsdatum>
    <VerzekerdBedrag>{{insured_amount}}</VerzekerdBedrag>
    <Premie>{{premium}}</Premie>
    <Assurantiebelasting>{{insurance_tax}}</Assurantiebelasting>
  </Polis>
</AnvaBericht>`;
const relationUpdateXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="RelatieWijziging">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Relatie nummer="{{anva_relation_pk}}">
    <Naam>{{holder_name}}</Naam>
    <Adres>
      <Straat>{{street}}</Straat>
      <Huisnummer>{{house_number}}</Huisnummer>
      <Postcode>{{postal_code}}</Postcode>
      <Plaats>{{city}}</Plaats>
    </Adres>
    <Email>{{email}}</Email>
  </Relatie>
</AnvaBericht>`;
const renewalXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="Prolongatie">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Polis nummer="{{policy_number}}" relatie="{{anva_relation_pk}}">
    <NieuweTermijn start="{{new_term_start}}" maanden="{{payment_term}}"/>
    <Premie>{{premium}}</Premie>
    <Poliskosten>{{policy_costs}}</Poliskosten>
    <Assurantiebelasting>{{insurance_tax}}</Assurantiebelasting>
    <Totaal>{{total_amount}}</Totaal>
  </Polis>
</AnvaBericht>`;
const cancelXml=`<?xml version="1.0" encoding="UTF-8"?>
<AnvaBericht type="Royement">
  <Kantoor code="{{office_code}}" organisatie="{{organisation_code}}"/>
  <Polis nummer="{{policy_number}}" relatie="{{anva_relation_pk}}">
    <Einddatum>{{cancel_date}}</Einddatum>
    <Reden>{{cancel_reason}}</Reden>
  </Polis>
</AnvaBericht>`;
const templates=[
  {key:'relation_policy_create',name:'Relatie en polis aanmaken',usedIn:'Nieuwe polis',body:relationXml,changedAt:'26 nov 2026 · 14:32',changedBy:'Voorbeeld applicatiebeheerder'},
  {key:'policy_document',name:'Polis- en notadocument in dossier',usedIn:'Nieuwe polis, Mutatie, Prolongatie',body:documentXml,changedAt:'12 nov 2026 · 10:05',changedBy:'Voorbeeld applicatiebeheerder'},
  {key:'policy_mutation',name:'Polismutatie',usedIn:'Mutatie',body:mutationXml,draft:mutationXml.replace('    <Assurantiebelasting>','    <Poliskosten>{{policy_costs}}</Poliskosten>\n    <Assurantiebelasting>'),draftAt:'27 nov 2026 · 08:47',draftBy:'Voorbeeld functioneel beheerder',changedAt:'3 nov 2026 · 16:20',changedBy:'Voorbeeld functioneel beheerder'},
  {key:'relation_update',name:'Relatiewijziging',usedIn:'Mutatie',body:relationUpdateXml,changedAt:'3 nov 2026 · 16:12',changedBy:'Voorbeeld functioneel beheerder'},
  {key:'policy_renewal',name:'Prolongatie',usedIn:'Prolongatie',body:renewalXml,changedAt:'21 okt 2026 · 11:40',changedBy:'Voorbeeld applicatiebeheerder'},
  {key:'policy_cancel',name:'Royement',usedIn:'Royement',body:cancelXml,changedAt:'21 okt 2026 · 11:38',changedBy:'Voorbeeld applicatiebeheerder'}
];
const latestChange=t=>t.draft?{at:t.draftAt,by:t.draftBy}:{at:t.changedAt,by:t.changedBy};

const systemSettings={runTime:'06:00',batchSize:5,intervalSeconds:120,changedAt:'24 nov 2026 · 15:10',changedBy:'Voorbeeld applicatiebeheerder'};

// Navigatie: sub-pagina's houden ANVA actief in het hoofdmenu.
const anvaPages=['anva','anva-connection','anva-templates','anva-template'];
let openTemplateKey=null,previewPolicy='business',editorBody='';
function showPage(name,hash=name){
  setAdminPage(name);
  if(!document.querySelector(`[data-admin-page="${name}"]`)?.classList.contains('active'))return;
  if(anvaPages.includes(name))document.querySelector('.admin-nav[data-admin-target="anva"]')?.classList.add('active');
  document.querySelectorAll('[data-anva-target]').forEach(btn=>btn.classList.toggle('active',btn.dataset.anvaTarget===(name==='anva-template'?'anva-templates':name)));
  history.replaceState(null,'',`#${hash}`);
}

function renderChooser(){
  const status=connectionStatus(),recent=[...templates].sort((a,b)=>toSortable(latestChange(b).at)-toSortable(latestChange(a).at))[0],drafts=templates.filter(t=>t.draft).length;
  document.querySelector('[data-admin-page="anva"]').innerHTML=`<div class="admin-page-head"><div><h1>ANVA</h1></div></div>
  <section class="product-choice-screen" aria-labelledby="anvaChoiceTitle"><h2 id="anvaChoiceTitle">Wat wil je inrichten?</h2>
    <div class="product-choice-grid">
      <button class="product-choice-card anva-choice-card" type="button" data-anva-target="anva-connection"><span>Koppeling</span><strong>Koppelinginstellingen</strong><div class="anva-choice-status"><span class="admin-chip ${status.tone}">${status.label}</span><small>${connection.lastTest?`Laatste test ${connection.lastTest.ok?'geslaagd':'mislukt'} · ${esc(connection.lastTest.at)}`:'Nog niet getest'}</small></div><em>Open koppeling →</em></button>
      <button class="product-choice-card anva-choice-card" type="button" data-anva-target="anva-templates"><span>Berichten</span><strong>XML-sjablonen</strong><div class="anva-choice-status">${drafts?`<span class="admin-chip amber">${drafts} concept${drafts>1?'en':''}</span>`:''}<small>Laatst aangepast ${esc(latestChange(recent).at)} · ${esc(latestChange(recent).by)}</small></div><em>Open sjablonen →</em></button>
    </div></section>`;
}
const months={jan:0,feb:1,mrt:2,apr:3,mei:4,jun:5,jul:6,aug:7,sep:8,okt:9,nov:10,dec:11};
function toSortable(label){const m=/(\d+) (\w+)\.? (\d{4}) · (\d+):(\d+)/.exec(label||'');return m?new Date(+m[3],months[m[2].slice(0,3)]??0,+m[1],+m[4],+m[5]).getTime():0;}

// Koppeling
let testState=null,showSecretInput=false;const openDetails=new Set();
function renderConnection(){
  const status=connectionStatus(),base=connectionBase();
  document.querySelector('[data-admin-page="anva-connection"]').innerHTML=`<div class="admin-page-head"><div><h1>ANVA-koppeling</h1></div></div>
  <div class="admin-card anva-status-card anva-status-${status.tone}">
    <div class="anva-status-main"><span class="anva-status-dot"></span><div><strong>Koppeling ${status.label.toLowerCase()}</strong><p>${esc(status.text)}</p></div></div>
    <div class="anva-status-facts">
      <div><span>Omgeving</span><strong>${environments[connection.environment].label}</strong></div>
      <div><span>Laatste verbindingstest</span><strong>${connection.lastTest?`${connection.lastTest.ok?'Geslaagd':'Mislukt'} · ${esc(connection.lastTest.at)}`:'Nog niet getest'}</strong></div>
      <div><span>Laatste bericht</span><strong>${esc(connection.lastMessage.name)} · ${connection.lastMessage.ok?'geaccepteerd':'afgewezen'} · ${esc(connection.lastMessage.at)}</strong></div>
      <div><span>Afgelopen 24 uur</span><strong>${connection.day.accepted} geaccepteerd${connection.day.rejected?` · <button class="admin-link-button anva-rejected-link" type="button" data-anva-goto="processes">${connection.day.rejected} afgewezen</button>`:''}</strong></div>
    </div>
  </div>
  <div class="anva-connection-layout">
    <div class="admin-card"><div class="admin-card-head"><div><h2>Verbindingsgegevens</h2></div></div><div class="admin-card-body">
      <div class="anva-form">
        <label class="anva-field-wide"><span>Omgeving</span><div class="anva-segmented" role="radiogroup">${Object.entries(environments).map(([key,env])=>`<button type="button" role="radio" aria-checked="${connection.environment===key}" class="${connection.environment===key?'active':''}" data-anva-env="${key}">${env.label}</button>`).join('')}</div></label>
        <label><span>Organisatiecode *</span><input class="admin-input" id="anvaOrganisationCode" value="${esc(connection.organisationCode)}" ${connection.organisationCode?'':'aria-invalid="true"'} autocomplete="off"></label>
        <label><span>Kantoorcode *</span><input class="admin-input" id="anvaOfficeCode" value="${esc(connection.officeCode)}" ${connection.officeCode?'':'aria-invalid="true"'} autocomplete="off"></label>
        <label><span>Client ID *</span><input class="admin-input" id="anvaClientId" value="${esc(connection.clientId)}" ${connection.clientId?'':'aria-invalid="true"'} autocomplete="off"></label>
        <label><span>Client secret *</span>${connection.secretSet&&!showSecretInput?`<div class="anva-secret-set"><span>Ingesteld · wordt niet getoond</span><button class="admin-btn text" type="button" id="anvaReplaceSecret">Vervangen</button></div>`:`<input class="admin-input" id="anvaSecret" type="password" placeholder="Plak het secret uit ANVA" autocomplete="new-password" ${connection.secretSet?'':'aria-invalid="true"'}>`}</label>
      </div>
      <details class="anva-advanced" data-anva-details="technical" ${openDetails.has('technical')?'open':''}><summary>Technische gegevens</summary>
        <div class="anva-form">
          <label class="anva-field-wide"><span>Afwijkend endpoint (optioneel)</span><input class="admin-input" id="anvaEndpointOverride" value="${esc(connection.endpointOverride)}" placeholder="${esc(environments[connection.environment].base)}"></label>
          <div class="anva-readonly anva-field-wide"><span>Token-URL</span><code>${esc(base)}/oauth/token</code></div>
          <div class="anva-readonly anva-field-wide"><span>Berichten-URL</span><code>${esc(base)}/berichten</code></div>
        </div>
      </details>
      <div class="anva-form-actions"><button class="admin-btn primary" id="anvaSaveConnection" type="button">Opslaan en testen</button></div>
    </div></div>
    <div class="admin-card"><div class="admin-card-head"><div><h2>Verbindingstest</h2></div></div><div class="admin-card-body">
      <p class="anva-help">Vraagt een token aan bij ANVA zonder proces of dossier te starten.</p>
      <button class="admin-btn primary" id="anvaTestConnection" type="button" ${testState==='busy'?'disabled':''}>${testState==='busy'?'Bezig met testen…':'Verbinding testen'}</button>
      <div id="anvaTestResult">${renderTestResult()}</div>
      <details class="anva-advanced" data-anva-details="xml-test" ${openDetails.has('xml-test')?'open':''}><summary>Testbericht met eigen XML</summary>
        <label class="anva-xml-label"><span>XML</span><textarea class="admin-input anva-code" id="anvaTestXml" spellcheck="false">&lt;AnvaBericht type="Ping"&gt;&lt;Kantoor code="${esc(connection.officeCode)}"/&gt;&lt;/AnvaBericht&gt;</textarea></label>
        <button class="admin-btn" id="anvaSendTestXml" type="button" ${testState==='busy'?'disabled':''}>XML versturen</button>
        <div id="anvaXmlResult"></div>
      </details>
    </div></div>
  </div>`;
}
function renderTestResult(){
  const t=connection.lastTest;if(!t||testState==='busy')return'';
  const missing=t.missing||[];
  const steps=[[missing.length?'failed':'ok',missing.length?`Gegevens onvolledig: ${missing.join(', ')}`:'Gegevens compleet'],[t.ok?'ok':missing.length?'skipped':'failed',t.ok?`Token ontvangen · HTTP ${t.http} · ${t.ms} ms`:missing.length?'Token niet aangevraagd':`Token geweigerd · ${t.error}`],[t.ok?'ok':'skipped',t.ok?`ANVA ${environments[connection.environment].label.toLowerCase()} bereikbaar`:'ANVA niet bereikt']];
  return `<ol class="anva-test-steps">${steps.map(([state,label])=>`<li class="${state}"><span>${state==='ok'?'✓':state==='failed'?'!':'–'}</span>${esc(label)}</li>`).join('')}</ol><small class="anva-test-meta">${t.ok?'Geslaagd':'Mislukt'} · ${esc(t.at)}</small>`;
}
function runConnectionTest(source){
  testState='busy';renderConnection();
  setTimeout(()=>{
    const missing=missingConnectionFields();
    connection.lastTest=missing.length?{ok:false,at:nowLabel(),missing,error:`gegevens onvolledig (${missing.join(', ')})`}:{ok:true,at:nowLabel(),ms:140+Math.round(Math.random()*90),http:200};
    testState=null;renderConnection();renderChooser();
    showAdminToast(source==='save'?(connection.lastTest.ok?'Koppeling opgeslagen · verbinding werkt':'Koppeling opgeslagen · verbinding werkt nog niet'):(connection.lastTest.ok?'Verbinding werkt':'Verbindingstest mislukt'));
  },900);
}
function saveConnection(){
  connection.organisationCode=document.getElementById('anvaOrganisationCode').value.trim();
  connection.officeCode=document.getElementById('anvaOfficeCode').value.trim();
  connection.clientId=document.getElementById('anvaClientId').value.trim();
  connection.endpointOverride=document.getElementById('anvaEndpointOverride').value.trim();
  const secret=document.getElementById('anvaSecret');if(secret&&secret.value)connection.secretSet=true;
  showSecretInput=false;runConnectionTest('save');
}
function sendTestXml(){
  const xml=document.getElementById('anvaTestXml').value,target=document.getElementById('anvaXmlResult');
  const parsed=new DOMParser().parseFromString(xml,'application/xml'),invalid=parsed.querySelector('parsererror');
  if(invalid){target.innerHTML=`<div class="anva-response fail"><strong>Niet verstuurd</strong><p>De XML is niet geldig. Controleer de opbouw.</p></div>`;return;}
  if(missingConnectionFields().length){target.innerHTML=`<div class="anva-response fail"><strong>Niet verstuurd</strong><p>Vul eerst de verbindingsgegevens aan.</p></div>`;return;}
  target.innerHTML=`<div class="anva-response ok"><strong>ANVA heeft geantwoord · HTTP 200</strong><span>Response</span><pre class="anva-code-block">${esc(`<AnvaAntwoord status="OK">\n  <Referentie>TEST-${Date.now().toString().slice(-6)}</Referentie>\n  <Melding>Testbericht ontvangen, niet verwerkt</Melding>\n</AnvaAntwoord>`)}</pre></div>`;
}

// XML-sjablonen
function renderTemplates(){
  document.querySelector('[data-admin-page="anva-templates"]').innerHTML=`<div class="admin-page-head"><div><h1>XML-sjablonen</h1></div></div>
  <div class="admin-card"><div class="admin-table-wrap"><table class="admin-table anva-template-table"><thead><tr><th>Sjabloon</th><th>Gebruikt in</th><th>Status</th><th>Laatst aangepast</th><th>Door</th><th></th></tr></thead><tbody>
  ${templates.map(t=>{const change=latestChange(t);return `<tr class="anva-template-row" data-anva-template="${t.key}" tabindex="0"><td><div class="admin-primary">${esc(t.name)}</div><div class="admin-secondary">${t.key}</div></td><td>${esc(t.usedIn)}</td><td>${t.draft?'<span class="admin-chip amber">Concept aanwezig</span>':'<span class="admin-chip green">Actief</span>'}</td><td>${esc(change.at)}</td><td>${esc(change.by)}</td><td><span class="admin-link">Bewerken</span></td></tr>`;}).join('')}
  </tbody></table></div></div>`;
}
function renderXml(body,values){
  const context={...values,office_code:connection.officeCode,organisation_code:connection.organisationCode};
  let text=body,guard=0;
  const conditional=/\{\{#if (\w+)\}\}((?:(?!\{\{#if )[\s\S])*?)(?:\{\{else\}\}((?:(?!\{\{#if )[\s\S])*?))?\{\{\/if\}\}/;
  while(conditional.test(text)&&guard++<50)text=text.replace(conditional,(all,key,yes,no='')=>context[key]?yes:no);
  const unknown=new Set(),empty=new Set();
  const xmlEscape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const plain=text.replace(/\{\{\s*([\w#/]+)\s*\}\}/g,(all,key)=>{if(!fieldKeys.has(key)){unknown.add(key);return all;}const v=context[key];if(v===''||v==null)empty.add(key);return xmlEscape(v??'');});
  const marked=text.replace(/\{\{\s*([\w#/]+)\s*\}\}/g,(all,key)=>!fieldKeys.has(key)?`\u0001x${all}\u0002`:`\u0001v${xmlEscape(context[key]??'')}\u0002`);
  const html=esc(marked).replace(/\u0001x([^\u0002]*)\u0002/g,'<mark class="unknown">$1</mark>').replace(/\u0001v([^\u0002]*)\u0002/g,(all,v)=>`<mark>${v||'&nbsp;'}</mark>`);
  const doc=new DOMParser().parseFromString(plain.trim(),'application/xml'),error=doc.querySelector('parsererror');
  return{html,unknown:[...unknown],empty:[...empty],error:error?xmlErrorLabel(error.textContent):null};
}
function xmlErrorLabel(message){const m=/line (\d+) at column (\d+)/i.exec(message);return m?`De opbouw klopt niet rond regel ${m[1]}, kolom ${m[2]} van het voorbeeld. Controleer of iedere tag goed wordt gesloten.`:'De opbouw van de XML klopt niet.';}
function validateAll(body){
  const failures=testPolicies.map(p=>({policy:p,result:renderXml(body,p.values)})).filter(({result})=>result.error||result.unknown.length);
  return failures;
}
function openTemplate(key){
  const t=templates.find(row=>row.key===key);if(!t)return;
  openTemplateKey=key;editorBody=t.draft??t.body;renderTemplateDetail();showPage('anva-template',`anva-templates/${key}`);
}
function renderTemplateDetail(){
  const t=templates.find(row=>row.key===openTemplateKey);if(!t)return;
  document.querySelector('[data-admin-page="anva-template"]').innerHTML=`<div class="admin-page-head admin-dossier-back"><div><button class="admin-btn text" type="button" data-anva-target="anva-templates">← Terug naar XML-sjablonen</button></div></div>
  <div class="admin-page-head"><div><h1>${esc(t.name)}</h1><p><code class="anva-key">${t.key}</code> · gebruikt in ${esc(t.usedIn)} · actieve versie aangepast ${esc(t.changedAt)} door ${esc(t.changedBy)}</p></div>${t.draft?'<span class="admin-chip amber">Concept aanwezig</span>':'<span class="admin-chip green">Actief</span>'}</div>
  ${t.draft?`<div class="anva-draft-note">Je bewerkt het concept van ${esc(t.draftAt)} (${esc(t.draftBy)}). ANVA ontvangt de actieve versie totdat je de wijziging opslaat. <button class="admin-btn text" type="button" id="anvaDiscardDraft">Concept verwijderen</button></div>`:''}
  <div class="anva-template-layout">
    <div class="admin-card"><div class="admin-card-head"><div><h2>Sjabloon</h2></div></div><div class="admin-card-body">
      <textarea class="admin-input anva-code anva-editor" id="anvaTemplateEditor" spellcheck="false" aria-label="XML-sjabloon">${esc(editorBody)}</textarea>
      <div class="anva-fields"><span>Velden invoegen</span><div>${fields.map(([key,label])=>`<button type="button" class="anva-field-chip" data-anva-field="${key}" title="${esc(label)}">{{${key}}}</button>`).join('')}</div>
      <small>Voorwaarde: <code>{{#if is_business}}…{{else}}…{{/if}}</code>. Geen vrije code.</small></div>
      <div id="anvaTemplateValidation"></div>
      <div class="anva-form-actions"><button class="admin-btn" id="anvaSaveDraft" type="button">Als concept bewaren</button><button class="admin-btn primary" id="anvaSaveTemplate" type="button">Wijziging direct opslaan</button></div>
    </div></div>
    <div class="admin-card anva-preview-card"><div class="admin-card-head"><div><h2>Voorbeeld</h2></div></div><div class="admin-card-body">
      <label class="anva-preview-select"><span>Testpolis</span><select class="admin-input" id="anvaPreviewPolicy">${testPolicies.map(p=>`<option value="${p.id}" ${p.id===previewPolicy?'selected':''}>${esc(p.label)}</option>`).join('')}</select></label>
      <div id="anvaPreviewStatus"></div>
      <pre class="anva-code-block anva-preview" id="anvaPreview"></pre>
      <small class="anva-help">Testdata. Er wordt niets naar ANVA verstuurd.</small>
    </div></div>
  </div>`;
  updatePreview();
}
function updatePreview(){
  const policy=testPolicies.find(p=>p.id===previewPolicy),result=renderXml(editorBody,policy.values);
  document.getElementById('anvaPreview').innerHTML=result.html;
  const notes=[];
  if(result.error)notes.push(`<div class="anva-check fail"><strong>XML ongeldig</strong>${esc(result.error)}</div>`);
  if(result.unknown.length)notes.push(`<div class="anva-check fail"><strong>Onbekend veld</strong>${result.unknown.map(k=>`<code>{{${esc(k)}}}</code>`).join(' ')}</div>`);
  if(result.empty.length)notes.push(`<div class="anva-check warn"><strong>Leeg voor deze polis</strong>${result.empty.map(k=>`<code>{{${esc(k)}}}</code>`).join(' ')}</div>`);
  if(!notes.length)notes.push('<div class="anva-check ok"><strong>Geldige XML</strong>Alle velden gevuld voor deze polis.</div>');
  document.getElementById('anvaPreviewStatus').innerHTML=notes.join('');
  document.getElementById('anvaTemplateValidation').innerHTML='';
}
function saveTemplate(asDraft){
  const t=templates.find(row=>row.key===openTemplateKey);if(!t)return;
  if(asDraft){t.draft=editorBody;t.draftAt=nowLabel();t.draftBy=actorName();renderTemplateDetail();renderTemplates();renderChooser();showAdminToast('Concept bewaard · ANVA gebruikt nog de actieve versie');return;}
  const failures=validateAll(editorBody);
  if(failures.length){document.getElementById('anvaTemplateValidation').innerHTML=`<div class="anva-check fail"><strong>Niet opgeslagen</strong>Het sjabloon levert geen geldige XML op voor ${failures.map(f=>esc(f.policy.values.policy_number)).join(', ')}. Bewaar het als concept of herstel de opbouw.</div>`;return;}
  t.body=editorBody;delete t.draft;delete t.draftAt;delete t.draftBy;t.changedAt=nowLabel();t.changedBy=actorName();
  renderTemplateDetail();renderTemplates();renderChooser();showAdminToast('Sjabloon opgeslagen · geldt voor nieuwe ANVA-berichten');
}
function insertField(key){
  const editor=document.getElementById('anvaTemplateEditor');if(!editor)return;
  const token=`{{${key}}}`,start=editor.selectionStart,end=editor.selectionEnd;
  editor.setRangeText(token,start,end,'end');editor.focus();editorBody=editor.value;updatePreview();
}

// Systeemsettings
function renderSettings(){
  document.querySelector('[data-admin-page="settings"]').innerHTML=`<div class="admin-page-head"><div><h1>Systeemsettings</h1></div></div>
  <div class="settings-sections">
    <div class="admin-card" id="settingsProcessing"><div class="admin-card-head"><div><h2>Wachtrij en prolongatie</h2><p class="settings-scope">Geldt voor alle producten · Europe/Amsterdam</p></div></div><div class="admin-card-body">
      <div class="settings-form">
        <label><span>Prolongatie start om</span><input class="admin-input" type="time" id="settingsRunTime" value="${systemSettings.runTime}"><small>Op de laatste dag van de lopende termijn.</small></label>
        <label><span>Acties per batch</span><input class="admin-input" type="number" min="1" max="50" id="settingsBatchSize" value="${systemSettings.batchSize}"><small>1 tot 50.</small></label>
        <label><span>Seconden tussen batches</span><input class="admin-input" type="number" min="10" max="3600" id="settingsInterval" value="${systemSettings.intervalSeconds}"><small>Minimaal 10. Werk dat tijdens een batch startbaar wordt, wacht op de volgende.</small></label>
      </div>
      <div class="anva-form-actions settings-actions"><small>Laatst aangepast ${esc(systemSettings.changedAt)} · ${esc(systemSettings.changedBy)}</small><button class="admin-btn primary" id="settingsSave" type="button" disabled>Instellingen opslaan</button></div>
    </div></div>
  </div>`;
}
function readSettings(){return{runTime:document.getElementById('settingsRunTime').value||systemSettings.runTime,batchSize:Math.min(50,Math.max(1,Number(document.getElementById('settingsBatchSize').value)||1)),intervalSeconds:Math.min(3600,Math.max(10,Number(document.getElementById('settingsInterval').value)||10))};}
function settingsDirty(){const v=readSettings();return v.runTime!==systemSettings.runTime||v.batchSize!==systemSettings.batchSize||v.intervalSeconds!==systemSettings.intervalSeconds;}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-anva-target]');if(target){event.preventDefault();if(target.dataset.anvaTarget==='anva-templates')renderTemplates();showPage(target.dataset.anvaTarget);return;}
  const goto=event.target.closest('[data-anva-goto]');if(goto){setAdminPage(goto.dataset.anvaGoto);return;}
  const row=event.target.closest('[data-anva-template]');if(row){openTemplate(row.dataset.anvaTemplate);return;}
  const env=event.target.closest('[data-anva-env]');if(env){connection.environment=env.dataset.anvaEnv;connection.organisationCode=document.getElementById('anvaOrganisationCode').value.trim();connection.officeCode=document.getElementById('anvaOfficeCode').value.trim();connection.clientId=document.getElementById('anvaClientId').value.trim();renderConnection();return;}
  const field=event.target.closest('[data-anva-field]');if(field){insertField(field.dataset.anvaField);return;}
  switch(event.target.closest('button')?.id){
    case'anvaReplaceSecret':showSecretInput=true;renderConnection();document.getElementById('anvaSecret')?.focus();break;
    case'anvaSaveConnection':saveConnection();break;
    case'anvaTestConnection':runConnectionTest('test');break;
    case'anvaSendTestXml':sendTestXml();break;
    case'anvaSaveDraft':saveTemplate(true);break;
    case'anvaSaveTemplate':saveTemplate(false);break;
    case'anvaDiscardDraft':{const t=templates.find(row=>row.key===openTemplateKey);delete t.draft;delete t.draftAt;delete t.draftBy;editorBody=t.body;renderTemplateDetail();renderTemplates();renderChooser();showAdminToast('Concept verwijderd');break;}
    case'settingsSave':{Object.assign(systemSettings,readSettings(),{changedAt:nowLabel(),changedBy:actorName()});renderSettings();showAdminToast('Systeemsettings opgeslagen · gelden meteen voor de hele wachtrij');break;}
  }
});
document.addEventListener('keydown',event=>{const row=event.target.closest?.('[data-anva-template]');if(row&&event.key==='Enter')openTemplate(row.dataset.anvaTemplate);});
document.addEventListener('input',event=>{
  if(event.target.id==='anvaTemplateEditor'){editorBody=event.target.value;updatePreview();}
  if(event.target.closest?.('#settingsProcessing')){const save=document.getElementById('settingsSave');if(save)save.disabled=!settingsDirty();}
});
document.addEventListener('toggle',event=>{const key=event.target.dataset?.anvaDetails;if(key)event.target.open?openDetails.add(key):openDetails.delete(key);},true);
document.addEventListener('change',event=>{if(event.target.id==='anvaPreviewPolicy'){previewPolicy=event.target.value;updatePreview();}});
document.querySelector('.admin-nav[data-admin-target="anva"]')?.addEventListener('click',()=>{renderChooser();showPage('anva');});
document.querySelector('.admin-nav[data-admin-target="settings"]')?.addEventListener('click',()=>{renderSettings();history.replaceState(null,'','#settings');});

renderChooser();renderConnection();renderTemplates();renderSettings();
function route(){
  const hash=location.hash.slice(1);
  if(hash.startsWith('anva-templates/'))openTemplate(hash.split('/')[1]);
  else if(anvaPages.includes(hash))showPage(hash);
  else if(hash==='settings')showPage('settings');
}
if(document.readyState==='complete')route();else window.addEventListener('load',route);
})();
