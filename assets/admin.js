// GoSafe Admin framework navigation
let dossierReturnPage='applications';
let activeDossierKey='policy-main';
function setAdminPage(name){
  document.querySelectorAll('[data-admin-page]').forEach(el=>el.classList.toggle('active',el.dataset.adminPage===name));
  const navName=name==='dossier'?dossierReturnPage:name;
  document.querySelectorAll('.admin-nav[data-admin-target]').forEach(el=>el.classList.toggle('active',el.dataset.adminTarget===navName));
  document.querySelector('.admin-main')?.scrollTo?.({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-admin-target]').forEach(btn=>btn.addEventListener('click',()=>setAdminPage(btn.dataset.adminTarget)));
document.getElementById('adminGlobalSearch')?.addEventListener('keydown',e=>{
  if(e.key==='Enter' && e.currentTarget.value.trim()) setAdminPage('relations');
});

// Polisadministratie: één dossier dat van aanvraag naar polis verandert
const equipmentItems=[
  {name:'Sony FX6',category:'Camera’s / Cinema camera',serial:'SFX6-492188',receipt:'MediaMarkt Pro · 12-08-2026',amount:'€ 8.500',premium:'€ 106,25'},
  {name:'Canon RF 70-200mm F2.8',category:'Lenzen & Optiek / Zoomlens',serial:'CRF-771204',receipt:'Kamera Express · 04-02-2025',amount:'€ 3.200',premium:'€ 40,00'},
  {name:'DJI RS 4 Pro',category:'Belichting / Gimbals & light rigs',serial:'DJI-RS4-8831',receipt:'Geen aankoopbewijs',amount:'€ 1.250',premium:'€ 15,63'},
  {name:'MacBook Pro 16',category:'Computers & Tablets / Laptops',serial:'C02Z45LRLVDN',receipt:'Apple Store · 18-05-2026',amount:'€ 4.100',premium:'€ 51,25'},
  {name:'Aputure lichtset',category:'Belichting / LED-lampen',serial:'APT-LS-14022',receipt:'Foto de Vakman · 09-07-2026',amount:'€ 22.800',premium:'€ 285,00'}
];
const instrumentItems=[
  {name:'Fender American Professional II',category:'Snaarinstrumenten / Elektrische gitaar',serial:'US22041877',receipt:'Bax Music · 12-03-2026',amount:'€ 2.240',premium:'€ 14,00'},
  {name:'Fender 1965 Stratocaster',category:'Snaarinstrumenten / Elektrische gitaar',serial:'L89214',receipt:'Vintage Guitar Shop · 06-01-2024',amount:'€ 24.000',premium:'€ 150,00'}
];
const dossierData={
  'application-main':{
    phase:'Aanvraag',status:'Ter akkoord',statusClass:'amber',dossier:'DOS-2026-00831',policy:'—',holder:{name:'Voorbeeld Media B.V.',type:'Zakelijk',kvk:'12345678',email:'sanne@voorbeeld.nl',phone:'020 123 45 67',address:'Wibautstraat 131-D, 1091 GL Amsterdam',iban:'NL45 RABO 0123 4567 89',tax:'BTW aftrekbaar'},product:'Apparatuurverzekering',received:'26 aug 2026 · 07:04',start:'1 sep 2026',amount:'€ 39.850',premium:'€ 498,13',items:equipmentItems,addons:[['Inhuur','Niet meeverzekerd'],['Verhuur','Wel meeverzekerd · 25% toeslag']],acceptance:{label:'Criteria akkoord',className:'green',text:'Alle vijf productcriteria zijn akkoord. Het dossier staat klaar voor verdere automatische verwerking.'},application:{source:'Aanvraagstraat',language:'Nederlands',submitted:'26 aug 2026 · 07:04',customerType:'Zakelijk',start:'1 sep 2026',slot:'Akkoord',privacy:'Akkoord',collection:'Akkoord met automatische incasso'},documents:[{name:'Aanvraagbevestiging DOS-2026-00831',type:'Aanvraag',date:'26 aug 2026',source:'Aanvraagstraat',status:'Opgeslagen',className:'blue'},{name:'Aankoopbewijs MediaMarkt Pro',type:'Aankoopbewijs',date:'12 aug 2026',source:'Klant',status:'Gekoppeld',className:'green'},{name:'Aankoopbewijs Kamera Express',type:'Aankoopbewijs',date:'4 feb 2025',source:'Klant',status:'Gekoppeld',className:'green'}],activities:[
      {date:'26 aug 2026 · 07:04',actor:'Klant',source:'Aanvraagstraat',title:'Aanvraag ingediend',change:'Fase ingesteld op Aanvraag; status ingesteld op Ter akkoord.',detail:'Fase: — → Aanvraag · Status: — → Ter akkoord'},
      {date:'26 aug 2026 · 07:03',actor:'Product API',source:'Aanvraagstraat',title:'Acceptatiecriteria gecontroleerd',change:'Alle vijf productcriteria zijn akkoord.',detail:'Resultaat: akkoord'},
      {date:'26 aug 2026 · 06:58',actor:'Klant',source:'Aanvraagstraat',title:'Aanvullende dekking gekozen',change:'Verhuur van eigen apparatuur toegevoegd.',detail:'Verhuur: Nee → Ja'},
      {date:'26 aug 2026 · 06:51',actor:'Klant',source:'Aanvraagstraat',title:'Item toegevoegd',change:'MacBook Pro 16 toegevoegd aan het dossier.',detail:'Verzekerd bedrag: € 35.750 → € 39.850'}
    ]
  },
  'application-fallout':{
    phase:'Aanvraag',status:'Uitval',statusClass:'red',dossier:'DOS-2026-00829',policy:'—',holder:{name:'J. de Vries',type:'Particulier',kvk:'—',email:'j.devries@example.nl',phone:'06 12 34 56 78',address:'Spaarndammerdijk 18, 1161 AA Zwanenburg',iban:'NL23 INGB 0001 2345 67',tax:'Niet van toepassing'},product:'Instrumentenverzekering',received:'25 aug 2026 · 21:18',start:'5 sep 2026',amount:'€ 112.500',premium:'€ 703,13',items:[{name:'Steinway & Sons vleugel',category:'Toetsinstrumenten / Vleugel',serial:'S-418228',receipt:'Piano Atelier · 14-06-2025',amount:'€ 87.500',premium:'€ 546,88'},{name:'Franse cello',category:'Snaarinstrumenten / Cello',serial:'CEL-1884-021',receipt:'Taxatierapport · 11-08-2026',amount:'€ 25.000',premium:'€ 156,25'}],addons:[['Inhuur','Niet meeverzekerd'],['Verhuur','Niet meeverzekerd']],acceptance:{label:'Uitval',className:'red',text:'Het totaal verzekerd bedrag is € 112.500 en overschrijdt de productgrens van € 100.000.'},application:{source:'Aanvraagstraat',language:'Nederlands',submitted:'25 aug 2026 · 21:18',customerType:'Particulier',start:'5 sep 2026',slot:'Akkoord',privacy:'Akkoord',collection:'Akkoord met automatische incasso'},documents:[{name:'Aanvraagbevestiging DOS-2026-00829',type:'Aanvraag',date:'25 aug 2026',source:'Aanvraagstraat',status:'Opgeslagen',className:'blue'},{name:'Taxatierapport cello',type:'Aankoopbewijs',date:'11 aug 2026',source:'Klant',status:'Gekoppeld',className:'green'}],activities:[
      {date:'25 aug 2026 · 21:19',actor:'Product API',source:'Aanvraagstraat',title:'Aanvraag uitgevallen',change:'Totaal verzekerd bedrag overschrijdt de productgrens.',detail:'Status: Ter akkoord → Uitval · € 112.500 > € 100.000'},
      {date:'25 aug 2026 · 21:18',actor:'Klant',source:'Aanvraagstraat',title:'Aanvraag ingediend',change:'Dossier aangemaakt in de fase Aanvraag.',detail:'Fase: — → Aanvraag · Status: — → Ter akkoord'}
    ]
  },
  'policy-main':{
    phase:'Polis',status:'Actief',statusClass:'green',dossier:'DOS-2026-00812',policy:'POL-2026-00184',holder:{name:'Voorbeeld Media B.V.',type:'Zakelijk',kvk:'12345678',email:'sanne@voorbeeld.nl',phone:'020 123 45 67',address:'Wibautstraat 131-D, 1091 GL Amsterdam',iban:'NL45 RABO 0123 4567 89',tax:'BTW aftrekbaar'},product:'Apparatuurverzekering',received:'25 aug 2026 · 15:30',start:'25 aug 2026',amount:'€ 39.850',premium:'€ 498,13',items:equipmentItems,addons:[['Inhuur','Niet meeverzekerd'],['Verhuur','Wel meeverzekerd · 25% toeslag']],acceptance:{label:'Geaccepteerd',className:'green',text:'Alle product- en compliancecontroles zijn akkoord. De verzekering is gesloten.'},application:{source:'Aanvraagstraat',language:'Nederlands',submitted:'25 aug 2026 · 15:30',customerType:'Zakelijk',start:'25 aug 2026',slot:'Akkoord',privacy:'Akkoord',collection:'Akkoord met automatische incasso'},documents:[{name:'Polis POL-2026-00184',type:'Polis',date:'25 aug 2026 · versie 1',source:'PDF-engine',status:'Definitief',className:'green'},{name:'Nota N-2026-010812',type:'Nota',date:'26 aug 2026',source:'PDF-engine',status:'Definitief',className:'green'},{name:'GoSafe Apparatuur NL 2026-01',type:'Voorwaarden',date:'Versie 2026-01',source:'Productconfiguratie',status:'Gekoppeld',className:'blue'},{name:'IPID Apparatuur NL 2026-01',type:'IPID',date:'Versie 2026-01',source:'Productconfiguratie',status:'Gekoppeld',className:'blue'},{name:'Aankoopbewijs MediaMarkt Pro',type:'Aankoopbewijs',date:'12 aug 2026',source:'Klant',status:'Gekoppeld',className:'green'}],activities:[
      {date:'26 aug 2026 · 07:18',actor:'PDF-engine',source:'Systeem',title:'Nota aangemaakt',change:'Nota N-2026-010812 aan het dossier toegevoegd.',detail:'Document: — → N-2026-010812'},
      {date:'25 aug 2026 · 15:35',actor:'Mail-engine',source:'Systeem',title:'Polisbevestiging verzonden',change:'Polis, voorwaarden en IPID verzonden aan sanne@voorbeeld.nl.',detail:'Resultaat: verzonden'},
      {date:'25 aug 2026 · 15:32',actor:'Acceptatieproces',source:'Systeem',title:'Aanvraag omgezet naar polis',change:'Hetzelfde dossier is van fase en status veranderd en heeft een polisnummer gekregen.',detail:'Fase: Aanvraag → Polis · Status: Ter akkoord → Actief · Polisnummer: — → POL-2026-00184'},
      {date:'25 aug 2026 · 15:31',actor:'Complianceproces',source:'Systeem',title:'Compliancecontrole afgerond',change:'Sanctie- en UBO-controle zijn zonder hit afgerond.',detail:'Resultaat: akkoord'},
      {date:'25 aug 2026 · 15:30',actor:'Klant',source:'Aanvraagstraat',title:'Aanvraag ingediend',change:'Dossier aangemaakt in de fase Aanvraag.',detail:'Fase: — → Aanvraag · Status: — → Ter akkoord'},
      {date:'25 aug 2026 · 15:12',actor:'Klant',source:'Aanvraagstraat',title:'Item toegevoegd',change:'Sony FX6 toegevoegd aan het dossier.',detail:'Aantal items: 4 → 5'}
    ]
  }
};
dossierData['application-sound']={...dossierData['application-main'],dossier:'DOS-2026-00824',holder:{...dossierData['application-main'].holder,name:'Sound Crew B.V.',kvk:'77440128',email:'info@soundcrew.nl',phone:'023 76 54 321'},received:'25 aug 2026 · 15:32',amount:'€ 58.400',premium:'€ 730,00'};
dossierData['application-camera']={...dossierData['application-fallout'],dossier:'DOS-2026-00807',holder:{...dossierData['application-main'].holder,name:'Camera Works B.V.',kvk:'66120988',email:'administratie@cameraworks.nl',phone:'020 88 12 400'},product:'Apparatuurverzekering',received:'24 aug 2026 · 10:22',amount:'€ 26.300',premium:'€ 328,75',acceptance:{label:'Uitval',className:'red',text:'De aanvraag is uitgevallen omdat één object het maximum van € 25.000 overschrijdt.'}};
dossierData['policy-jdevries']={...dossierData['policy-main'],dossier:'DOS-2026-00481',policy:'POL-2026-00312',holder:{...dossierData['application-fallout'].holder},product:'Instrumentenverzekering',received:'4 mei 2026 · 10:41',start:'4 mei 2026',amount:'€ 26.240',premium:'€ 164,00',items:instrumentItems};
dossierData['policy-studio']={...dossierData['policy-main'],dossier:'DOS-2025-01228',policy:'POL-2025-00917',holder:{...dossierData['application-main'].holder,name:'Studio Noord B.V.',kvk:'87654321',email:'finance@studionoord.nl',phone:'050 22 18 880',address:'Helperpark 274, 9723 ZA Groningen'},received:'12 okt 2025 · 09:12',start:'12 okt 2025',amount:'€ 38.600',premium:'€ 482,50'};

// Dossierbreed: productdocumenten horen bij de algemene gegevens; bewijsstukken en afgegeven stukken blijven apart.
Object.values(dossierData).forEach(data=>{
  const equipment=data.product==='Apparatuurverzekering';
  data.terms=equipment?'Algemene voorwaarden GoSafe 2026-01 · Voorwaarden Apparatuur 2026-01':'Algemene voorwaarden GoSafe 2026-01 · Voorwaarden Instrumenten 2026-01';
  data.ipid=equipment?'IPID Apparatuurverzekering 2026-01':'IPID Instrumentenverzekering 2026-01';
  data.renewalDate=data.phase==='Polis'?(data.start.startsWith('25 aug')?'25 aug 2027':data.start.startsWith('4 mei')?'4 mei 2027':'12 okt 2026'):'—';
  data.pendingMutation=null;
  data.itemDocuments=equipment?[
    {name:'Factuur MediaMarkt Pro.pdf',type:'Aankoopbewijs',item:'Sony FX6',date:'12 aug 2026',status:'Gekoppeld',className:'green'},
    {name:'Garantiebewijs Sony FX6.pdf',type:'Garantiebewijs',item:'Sony FX6',date:'12 aug 2026',status:'Gekoppeld',className:'green'},
    {name:'Foto serienummer MacBook.jpg',type:'Serienummerfoto',item:'MacBook Pro 16',date:'18 mei 2026',status:'Gekoppeld',className:'green'},
    {name:'Taxatierapport lichtset.pdf',type:'Taxatierapport',item:'Aputure lichtset',date:'9 jul 2026',status:'Gekoppeld',className:'green'}
  ]:[
    {name:'Factuur Bax Music.pdf',type:'Aankoopbewijs',item:'Fender American Professional II',date:'12 mrt 2026',status:'Gekoppeld',className:'green'},
    {name:'Taxatierapport vintage gitaar.pdf',type:'Taxatierapport',item:'Fender 1965 Stratocaster',date:'6 jan 2024',status:'Gekoppeld',className:'green'},
    {name:'Certificaat van echtheid.pdf',type:'Certificaat',item:'Fender 1965 Stratocaster',date:'6 jan 2024',status:'Gekoppeld',className:'green'}
  ];
  data.policyDocuments=data.phase==='Polis'?[
    {name:`Polis ${data.policy} · versie 1`,type:'Polis',issued:data.start,valid:data.start,status:'Actueel',className:'green'},
    {name:`Nota ${data.policy.replace('POL','N')}-01`,type:'Nota',issued:data.start,valid:data.start,status:'Afgegeven',className:'blue'}
  ]:[];
});
dossierData['policy-main'].pendingMutation={reference:'MUT-2026-00128',effective:'1 sep 2026',created:'27 aug 2026 · 09:42',initiator:'Klant',status:'Gepland',changes:[
  {type:'Gewijzigd',className:'blue',item:'Sony FX6',fields:[{label:'Categorie',old:'Camera’s / Cinema camera',new:'Camera’s / Professionele videocamera'},{label:'Verzekerd bedrag',old:'€ 8.500',new:'€ 9.000'}]},
  {type:'Verwijderd',className:'red',item:'DJI RS 4 Pro',fields:[{label:'Status',old:'Meeverzekerd',new:'Verwijderd'}]},
  {type:'Toegevoegd',className:'green',item:'Canon EOS R5 C',fields:[{label:'Categorie',old:'—',new:'Camera’s / Cinema camera'},{label:'Verzekerd bedrag',old:'—',new:'€ 2.650'}]}
]};
dossierData['policy-main'].activities.unshift({date:'27 aug 2026 · 09:42',actor:'Klant',source:'Mijn GoSafe',title:'Polismutatie ingepland',change:'Een wijziging is klaargezet en gaat op 1 september 2026 in.',detail:'Referentie: MUT-2026-00128 · Status: Gepland'});

function adminEscape(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));}
function renderDetailRows(rows){return rows.map(([label,value])=>`<div class="admin-detail-row"><span>${adminEscape(label)}</span><strong>${adminEscape(value)}</strong></div>`).join('');}
function renderDetailSection(title,rows){return `<section class="admin-detail-section"><h3>${adminEscape(title)}</h3><div class="admin-detail-list">${renderDetailRows(rows)}</div></section>`;}
function renderPendingChange(change){
  return `<div class="admin-mutation-change"><div><span class="admin-chip ${adminEscape(change.className)}">${adminEscape(change.type)}</span><strong>${adminEscape(change.item)}</strong></div><div>${change.fields.map(field=>`<span><b>${adminEscape(field.label)}</b><code>${adminEscape(field.old)}</code><i>→</i><code>${adminEscape(field.new)}</code></span>`).join('')}</div></div>`;
}
function renderPendingChangeTable(changes){
  return `<div class="admin-table-wrap"><table class="admin-table admin-pending-change-table"><thead><tr><th>Soort</th><th>Onderdeel</th><th>Veld</th><th>Huidig</th><th>Nieuw</th></tr></thead><tbody>${changes.flatMap(change=>change.fields.map((field,index)=>`<tr><td>${index===0?`<span class="admin-version-type ${adminEscape(change.className)}">${adminEscape(change.type)}</span>`:''}</td><td>${index===0?`<strong>${adminEscape(change.item)}</strong>`:''}</td><td>${adminEscape(field.label)}</td><td>${adminEscape(field.old)}</td><td>${adminEscape(field.new)}</td></tr>`)).join('')}</tbody></table></div>`;
}
function pendingChangeForItem(data,itemName){return data.pendingMutation?.changes?.find(change=>change.item===itemName);}
function pendingField(change,label,fallback){return change?.fields?.find(field=>field.label===label)?.new??fallback;}
function futureCategory(change,current){
  const direct=pendingField(change,'Categorie','');if(direct)return direct;
  const currentParts=String(current||'').split(' / ');
  return [pendingField(change,'Hoofdcategorie',currentParts[0]||''),pendingField(change,'Subcategorie',currentParts.slice(1).join(' / '))].filter(Boolean).join(' / ');
}
function setDossierTab(name){
  document.querySelectorAll('[data-dossier-tab]').forEach(button=>button.classList.toggle('active',button.dataset.dossierTab===name));
  document.querySelectorAll('[data-dossier-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.dossierPanel===name));
  document.querySelector('.admin-main')?.scrollTo?.({top:0,behavior:'smooth'});
}
function renderDossier(key){
  const data=dossierData[key]||dossierData['policy-main'];
  activeDossierKey=key in dossierData?key:'policy-main';
  const set=(id,html)=>{const element=document.getElementById(id);if(element)element.innerHTML=html;};
  const name=document.getElementById('dossierHolderName');if(name)name.textContent=data.holder.name;
  const meta=document.getElementById('dossierHolderMeta');if(meta)meta.textContent=[data.holder.type,data.holder.kvk!=='—'?'KvK '+data.holder.kvk:null,data.holder.email,data.holder.phone].filter(Boolean).join(' · ');
  set('dossierHeaderChips',`<span class="admin-chip blue">${adminEscape(data.phase)}</span><span class="admin-chip ${adminEscape(data.statusClass)}">${adminEscape(data.status)}</span><span class="admin-chip outline">${adminEscape(data.product)}</span>`);
  set('dossierHeaderIdentifiers',`<div class="admin-dossier-identifier"><span>Dossiernummer</span><strong>${adminEscape(data.dossier)}</strong></div><div class="admin-dossier-identifier"><span>Polisnummer</span><strong class="${data.policy==='—'?'admin-value-muted':''}">${adminEscape(data.policy)}</strong></div><div class="admin-dossier-identifier"><span>${data.phase==='Polis'?'Ingangsdatum':'Ontvangen'}</span><strong>${adminEscape(data.phase==='Polis'?data.start:data.received.split(' · ')[0])}</strong></div>${data.phase==='Polis'?`<div class="admin-dossier-identifier"><span>Prolongatiedatum</span><strong>${adminEscape(data.renewalDate)}</strong></div>`:''}`);
  set('dossierOverviewDetails',renderDetailRows([['Fase',data.phase],['Status',data.status],['Product',data.product],['Aanvraag ontvangen',data.received],['Gewenste / actuele ingang',data.start],...(data.phase==='Polis'?[['Prolongatiedatum',data.renewalDate]]:[]),['Verzekerd bedrag',data.amount],['Jaarpremie',data.premium],['Voorwaarden',data.terms],['IPID',data.ipid]]));
  const pending=document.getElementById('dossierPendingMutation');
  if(pending){pending.hidden=!data.pendingMutation;pending.innerHTML=data.pendingMutation?`<details class="admin-pending-details"><summary><span>Komende wijziging</span><strong>Gaat in op ${adminEscape(data.pendingMutation.effective)}</strong><small>Details bekijken</small></summary><div class="admin-pending-detail-meta">${adminEscape(data.pendingMutation.reference)} · ${adminEscape(data.pendingMutation.initiator)} · aangemaakt ${adminEscape(data.pendingMutation.created)}</div>${renderPendingChangeTable(data.pendingMutation.changes||[])}</details>`:'';}
  const mutate=document.getElementById('dossierStartMutation');
  if(mutate)mutate.hidden=data.phase!=='Polis';
  const editHolder=document.getElementById('dossierEditHolder');
  if(editHolder)editHolder.hidden=false;
  const editRelation=document.getElementById('dossierStartRelationMutation');
  if(editRelation)editRelation.hidden=false;
  set('dossierAddonDetails',renderDetailRows(data.addons));
  set('dossierAcceptanceSummary',`<div class="admin-acceptance-result"><div><strong>${adminEscape(data.acceptance.label)}</strong><p>${adminEscape(data.acceptance.text)}</p></div><span class="admin-chip ${adminEscape(data.acceptance.className)}">${adminEscape(data.acceptance.label)}</span></div>`);
  set('dossierApplicationMeta',`<div><span>Ingediend op</span><strong>${adminEscape(data.application.submitted)}</strong></div><div><span>Bron</span><strong>${adminEscape(data.application.source)}</strong></div><div><span>Taal</span><strong>${adminEscape(data.application.language)}</strong></div><div><span>Vastgelegd onder</span><strong>${adminEscape(data.dossier)}</strong></div>`);
  set('dossierApplicationDetails',[
    renderDetailSection('Verzekeringskeuze',[['Product',data.product],['Gewenste ingangsdatum',data.application.start],['Verzekerd bedrag',data.amount],['Jaarpremie',data.premium],['Aantal items',String(data.items.length)]]),
    renderDetailSection('Akkoorden',[['Slotbepalingen',data.application.slot],['Privacyverklaring',data.application.privacy],['Automatische incasso',data.application.collection],['Type verzekeringnemer',data.application.customerType]])
  ].join(''));
  const itemSummary=document.getElementById('dossierItemSummary');if(itemSummary)itemSummary.textContent=data.items.length+' items · totaal '+data.amount;
  const activeItemRows=data.items.map(item=>{const change=pendingChangeForItem(data,item.name);const active=`<tr><td><div class="admin-primary">${adminEscape(item.name)}</div></td><td>${adminEscape(item.category)}</td><td>${adminEscape(item.serial)}</td><td>${adminEscape(item.receipt)}</td><td class="admin-money">${adminEscape(item.amount)}</td><td class="admin-money">${adminEscape(item.premium)}</td><td><span class="admin-version-label active">Actieve versie</span><small class="admin-version-date">Sinds ${adminEscape(data.start)}</small></td></tr>`;if(!change)return active;const removed=change.type==='Verwijderd';const futureName=pendingField(change,'Item',item.name);const futureAmount=removed?'—':pendingField(change,'Verzekerd bedrag',item.amount);const future=`<tr class="admin-item-future-version ${removed?'removed':''}"><td><div class="admin-primary">${adminEscape(futureName)}</div></td><td>${adminEscape(removed?'—':futureCategory(change,item.category))}</td><td>${adminEscape(removed?'—':pendingField(change,'Serienummer',item.serial))}</td><td>${adminEscape(removed?'—':pendingField(change,'Aankoopbewijs',item.receipt))}</td><td class="admin-money">${adminEscape(futureAmount)}</td><td class="admin-money">${removed?'—':'Wordt herberekend'}</td><td><span class="admin-version-label ${removed?'removed':'future'}">${removed?'Verwijderd':'Nieuwe versie'}</span><small class="admin-version-date">Per ${adminEscape(data.pendingMutation.effective)}</small></td></tr>`;return active+future;}).join('');
  const addedItemRows=(data.pendingMutation?.changes||[]).filter(change=>change.type==='Toegevoegd').map(change=>`<tr class="admin-item-future-version added"><td><div class="admin-primary">${adminEscape(change.item)}</div></td><td>${adminEscape(futureCategory(change,''))}</td><td>${adminEscape(pendingField(change,'Serienummer','—'))}</td><td>${adminEscape(pendingField(change,'Aankoopbewijs','—'))}</td><td class="admin-money">${adminEscape(pendingField(change,'Verzekerd bedrag','—'))}</td><td class="admin-money">Wordt herberekend</td><td><span class="admin-version-label future">Nieuwe versie</span><small class="admin-version-date">Per ${adminEscape(data.pendingMutation.effective)}</small></td></tr>`).join('');
  set('dossierItemsBody',activeItemRows+addedItemRows);
  set('dossierHolderDetails',[
    renderDetailSection('Verzekeringnemer',[['Naam',data.holder.name],['Type',data.holder.type],['KvK-nummer',data.holder.kvk],['Adres',data.holder.address],['BTW',data.holder.tax]]),
    renderDetailSection('Contact en betaling',[['E-mailadres',data.holder.email],['Telefoonnummer',data.holder.phone],['IBAN',data.holder.iban],['Incassomachtiging',data.application.collection]])
  ].join(''));
  set('dossierItemDocumentsBody',data.itemDocuments.map(documentItem=>`<tr><td><div class="admin-document-name">${adminEscape(documentItem.name)}</div></td><td>${adminEscape(documentItem.type)}</td><td>${adminEscape(documentItem.item)}</td><td>${adminEscape(documentItem.date)}</td><td><span class="admin-chip ${adminEscape(documentItem.className)}">${adminEscape(documentItem.status)}</span></td></tr>`).join(''));
  set('dossierPolicyDocumentsBody',data.policyDocuments.length?data.policyDocuments.map(documentItem=>`<tr><td><div class="admin-document-name">${adminEscape(documentItem.name)}</div></td><td>${adminEscape(documentItem.type)}</td><td>${adminEscape(documentItem.issued)}</td><td>${adminEscape(documentItem.valid)}</td><td><span class="admin-chip ${adminEscape(documentItem.className)}">${adminEscape(documentItem.status)}</span></td></tr>`).join(''):'<tr><td colspan="5"><div class="admin-empty-inline">Nog geen polisdocumenten afgegeven.</div></td></tr>');
  set('dossierRecentActivities',data.activities.slice(0,5).map(activity=>`<div class="admin-event"><div class="admin-event-time">${adminEscape(activity.date.replace(' 2026','').replace(' 2025',''))}</div><div class="admin-event-mark"></div><div><div class="admin-event-title">${adminEscape(activity.title)}</div><div class="admin-event-copy">${adminEscape(activity.actor)} · ${adminEscape(activity.change)}</div></div></div>`).join(''));
  set('dossierActivitiesBody',data.activities.map(activity=>`<tr><td>${adminEscape(activity.date)}</td><td><div class="admin-primary">${adminEscape(activity.actor)}</div></td><td>${adminEscape(activity.source)}</td><td><div class="admin-primary">${adminEscape(activity.title)}</div></td><td class="admin-activity-change"><strong>${adminEscape(activity.change)}</strong><code>${adminEscape(activity.detail)}</code></td></tr>`).join(''));
  setDossierTab('overview');
}
function openDossier(trigger){
  dossierReturnPage=trigger.closest('[data-admin-page]')?.dataset.adminPage||'applications';
  if(!['applications','policies','relations','workqueue','overview'].includes(dossierReturnPage))dossierReturnPage='applications';
  renderDossier(trigger.dataset.dossierKey||'policy-main');
  const back=document.getElementById('dossierBackButton');if(back)back.textContent='← Terug naar '+({applications:'aanvragen',policies:'polissen',relations:'relaties',workqueue:'werkvoorraad',overview:'overzicht'}[dossierReturnPage]||'overzicht');
  setAdminPage('dossier');
}
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-open-dossier],.admin-open-dossier');if(trigger)openDossier(trigger);});
document.querySelectorAll('.admin-dossier-row').forEach(row=>row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openDossier(row);}}));
document.getElementById('dossierBackButton')?.addEventListener('click',()=>setAdminPage(dossierReturnPage));
document.querySelectorAll('[data-dossier-tab]').forEach(button=>button.addEventListener('click',()=>setDossierTab(button.dataset.dossierTab)));
document.querySelector('[data-show-dossier-activities]')?.addEventListener('click',()=>setDossierTab('activities'));

// De beheerder gebruikt functioneel dezelfde mutatieonderdelen en berekening als de klant.
let adminMutationItems=[];
let mutationInitialRentalIn=false;
let mutationInitialRentalOut=false;
let mutationInitialRentalLimit='10000';
let editingMutationItemIndex=-1;
const mutationToday='2026-08-27';
const mutationPolicyCosts=5;
const mutationInsuranceTax=.084;
const equipmentMutationCategories={'Camera’s':['Cinema camera','Professionele videocamera','Fotocamera'],'Lenzen & Optiek':['Zoomlens','Prime lens'],'Belichting':['Gimbals & light rigs','LED-lampen'],'Computers & Tablets':['Laptops','Tablets'],'Drones':['Cameradrone'],'Geluidsapparatuur':['Recorder','Microfoon']};
const instrumentMutationCategories={'Snaarinstrumenten':['Elektrische gitaar','Akoestische gitaar','Cello'],'Toetsinstrumenten':['Vleugel','Keyboard'],'Slagwerk':['Drumstel'],'Studioapparatuur':['Mengpaneel']};
function adminEuroNumber(value){return Number(String(value||'0').replace(/[^0-9,-]/g,'').replaceAll('.','').replace(',','.'))||0;}
function adminFormatEuro(value){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);}
function formatMutationDate(value){if(!value)return '—';return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value+'T00:00:00'));}
function mutationRenewalIso(data){if(data.start.startsWith('25 aug'))return '2027-08-25';if(data.start.startsWith('4 mei'))return '2027-05-04';return '2026-10-12';}
function mutationDaysBetween(start,end){return Math.max(0,Math.ceil((new Date(end+'T00:00:00')-new Date(start+'T00:00:00'))/86400000));}
function mutationItemName(item){return [item.brand,item.model].filter(Boolean).join(' ').trim()||'Nieuw item';}
function mutationCategoryMap(data){return data.product==='Instrumentenverzekering'?instrumentMutationCategories:equipmentMutationCategories;}
function mutationItemCategory(item){return [item.mainCategory,item.subCategory].filter(Boolean).join(' / ');}
function mutationReceipts(data){return ['Geen aankoopbewijs',...new Set([...data.items.map(item=>item.receipt).filter(Boolean),...data.itemDocuments.filter(documentItem=>documentItem.type==='Aankoopbewijs'||documentItem.type==='Taxatierapport').map(documentItem=>documentItem.name)])];}
function mutationSelectOptions(values,selected){return values.map(value=>`<option ${value===selected?'selected':''}>${adminEscape(value)}</option>`).join('');}
function buildAdminMutationChanges(){
  const changes=[];
  adminMutationItems.forEach(item=>{
    const name=mutationItemName(item);
    if(item.removed){changes.push({type:'Verwijderd',className:'red',item:item.original?.name||name,fields:[{label:'Status',old:'Meeverzekerd',new:'Verwijderd'}]});return;}
    const category=mutationItemCategory(item);
    if(item.isNew){changes.push({type:'Toegevoegd',className:'green',item:name,fields:[{label:'Hoofdcategorie',old:'—',new:item.mainCategory},{label:'Subcategorie',old:'—',new:item.subCategory},{label:'Serienummer',old:'—',new:item.serial||'—'},{label:'Aankoopbewijs',old:'—',new:item.receipt||'Geen aankoopbewijs'},{label:'Verzekerd bedrag',old:'—',new:adminFormatEuro(item.amountNumber)}]});return;}
    const fields=[];const original=item.original;
    if(name!==original.name)fields.push({label:'Item',old:original.name,new:name});
    if(category!==original.category){fields.push({label:'Hoofdcategorie',old:original.mainCategory,new:item.mainCategory});fields.push({label:'Subcategorie',old:original.subCategory,new:item.subCategory});}
    if(item.serial!==original.serial)fields.push({label:'Serienummer',old:original.serial||'—',new:item.serial||'—'});
    if(item.receipt!==original.receipt)fields.push({label:'Aankoopbewijs',old:original.receipt||'Geen aankoopbewijs',new:item.receipt||'Geen aankoopbewijs'});
    if(item.amountNumber!==original.amountNumber)fields.push({label:'Verzekerd bedrag',old:adminFormatEuro(original.amountNumber),new:adminFormatEuro(item.amountNumber)});
    if(fields.length)changes.push({type:'Gewijzigd',className:'blue',item:original.name,fields});
  });
  const rentalIn=document.getElementById('mutationRentalIn')?.checked;
  const rentalOut=document.getElementById('mutationRentalOut')?.checked;
  const rentalLimit=document.getElementById('mutationRentalLimit')?.value||'10000';
  if(rentalIn!==mutationInitialRentalIn||rentalLimit!==mutationInitialRentalLimit){
    const oldValue=mutationInitialRentalIn?adminFormatEuro(Number(mutationInitialRentalLimit)):'Niet meeverzekerd';
    const newValue=rentalIn?adminFormatEuro(Number(rentalLimit)):'Niet meeverzekerd';
    changes.push({type:rentalIn?(mutationInitialRentalIn?'Gewijzigd':'Toegevoegd'):'Verwijderd',className:rentalIn?(mutationInitialRentalIn?'blue':'green'):'red',item:'Aanvullende dekking · Inhuur',fields:[{label:'Verzekerd bedrag',old:oldValue,new:newValue}]});
  }
  if(rentalOut!==mutationInitialRentalOut)changes.push({type:rentalOut?'Toegevoegd':'Verwijderd',className:rentalOut?'green':'red',item:'Aanvullende dekking · Verhuur',fields:[{label:'Status',old:mutationInitialRentalOut?'Meeverzekerd':'Niet meeverzekerd',new:rentalOut?'Meeverzekerd':'Niet meeverzekerd'}]});
  return changes;
}
function adminMutationCalculation(){
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];
  const currentAmount=adminEuroNumber(data.amount);
  const currentPremium=adminEuroNumber(data.premium);
  const currentInhirePremium=mutationInitialRentalIn?Number(document.querySelector(`#mutationRentalLimit option[value="${mutationInitialRentalLimit}"]`)?.dataset.premium||0):0;
  const currentBase=(currentPremium-currentInhirePremium)/(mutationInitialRentalOut?1.25:1);
  const effectiveRate=currentAmount?currentBase/currentAmount:0;
  const total=adminMutationItems.filter(item=>!item.removed).reduce((sum,item)=>sum+Number(item.amountNumber||0),0);
  const newBase=total*effectiveRate;
  const rentalIn=document.getElementById('mutationRentalIn')?.checked;
  const rentalOut=document.getElementById('mutationRentalOut')?.checked;
  const inhirePremium=rentalIn?Number(document.getElementById('mutationRentalLimit')?.selectedOptions?.[0]?.dataset.premium||0):0;
  const newPremium=newBase+inhirePremium+(rentalOut?newBase*.25:0);
  const annualDifference=newPremium-currentPremium;
  const effective=document.getElementById('mutationEffectiveDate')?.value;
  const renewal=mutationRenewalIso(data);
  const validDate=effective>=mutationToday&&effective<renewal;
  const remaining=validDate?mutationDaysBetween(effective,renewal):0;
  const hasChanges=buildAdminMutationChanges().length>0;
  const prorated=validDate&&hasChanges?annualDifference/365*remaining:0;
  const costs=validDate&&hasChanges?mutationPolicyCosts:0;
  const tax=(prorated+costs)*mutationInsuranceTax;
  return {currentAmount,total,currentPremium,newPremium,annualDifference,remaining,prorated,costs,tax,mutationTotal:prorated+costs+tax,validDate,renewal,hasChanges};
}
function adminMutationValidation(){
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];
  const activeItems=adminMutationItems.filter(item=>!item.removed);
  const total=activeItems.reduce((sum,item)=>sum+Number(item.amountNumber||0),0);
  const computerTotal=activeItems.filter(item=>item.mainCategory==='Computers & Tablets').reduce((sum,item)=>sum+Number(item.amountNumber||0),0);
  const otherTotal=total-computerTotal;
  const completeItems=activeItems.every(item=>item.brand?.trim()&&item.model?.trim()&&item.mainCategory&&item.subCategory&&item.serial?.trim()&&Number(item.amountNumber)>0);
  const holderCountry=data.holder.country||'Nederland';
  const checks=[
    {label:'Items compleet',ok:completeItems,detail:completeItems?'Alle verplichte itemgegevens zijn ingevuld.':'Vul alle verplichte itemgegevens in.'},
    {label:'Maximaal € 25.000 per item',ok:activeItems.every(item=>Number(item.amountNumber||0)<=25000),detail:'Harde productgrens'},
    {label:'Maximaal € 100.000 totaal',ok:total<=100000,detail:`Nieuw totaal ${adminFormatEuro(total)}`},
    {label:'Maximaal 100 items',ok:activeItems.length<=100,detail:`${activeItems.length} items`},
    {label:'Vestigingsland Nederland',ok:holderCountry==='Nederland',detail:holderCountry},
    {label:'Computerapparatuur ≤ overige items',ok:computerTotal===0||computerTotal<=otherTotal,detail:`${adminFormatEuro(computerTotal)} tegenover ${adminFormatEuro(otherTotal)}`}
  ];
  return {checks,blocked:checks.some(check=>!check.ok)};
}
function renderAdminMutationValidation(){
  const validation=adminMutationValidation();
  const target=document.getElementById('adminMutationValidation');
  if(target)target.innerHTML=`<div class="admin-mutation-validation-head"><strong>Volmachtregels</strong><span class="admin-chip ${validation.blocked?'red':'green'}">${validation.blocked?'Geblokkeerd':'Akkoord'}</span></div><div class="admin-mutation-validation-list">${validation.checks.map(check=>`<div class="${check.ok?'ok':'blocked'}"><b>${check.ok?'✓':'!'}</b><span><strong>${adminEscape(check.label)}</strong><small>${adminEscape(check.detail)}</small></span></div>`).join('')}</div>`;
  return validation;
}
function refreshAdminMutationTotals(){
  const calculation=adminMutationCalculation();
  const validation=renderAdminMutationValidation();
  document.getElementById('mutationCurrentAmount').textContent=adminFormatEuro(calculation.currentAmount);
  document.getElementById('mutationNewAmount').textContent=adminFormatEuro(calculation.total);
  document.getElementById('mutationCurrentPremium').textContent=adminFormatEuro(calculation.currentPremium);
  document.getElementById('mutationNewPremium').textContent=adminFormatEuro(calculation.newPremium);
  document.getElementById('mutationAnnualDifference').textContent=calculation.validDate?adminFormatEuro(calculation.annualDifference):'—';
  document.getElementById('mutationRemainingDays').textContent=calculation.validDate?`${calculation.remaining} dagen`:'—';
  document.getElementById('mutationProratedPremium').textContent=calculation.validDate?adminFormatEuro(calculation.prorated):'—';
  document.getElementById('mutationPolicyCosts').textContent=calculation.validDate?adminFormatEuro(calculation.costs):'—';
  document.getElementById('mutationInsuranceTax').textContent=calculation.validDate?adminFormatEuro(calculation.tax):'—';
  document.getElementById('mutationTotalLabel').textContent=calculation.mutationTotal<0?'Terug te ontvangen':'Nu te betalen';
  document.getElementById('mutationTotal').textContent=calculation.validDate?adminFormatEuro(Math.abs(calculation.mutationTotal)):'—';
  document.getElementById('mutationFormula').textContent=calculation.validDate?`(${adminFormatEuro(calculation.newPremium)} − ${adminFormatEuro(calculation.currentPremium)}) ÷ 365 × ${calculation.remaining} dagen = ${adminFormatEuro(calculation.prorated)} premieverschil.`:'Kies een geldige ingangsdatum vóór de prolongatiedatum.';
  const submit=document.getElementById('mutationSubmit');if(submit){submit.disabled=!calculation.validDate||!calculation.hasChanges||validation.blocked;submit.textContent=validation.blocked?'Geblokkeerd door volmachtregels':'Wijziging inplannen';}
  document.getElementById('mutationRentalLimit').disabled=!document.getElementById('mutationRentalIn').checked;
}
function populateMutationSubcategories(mainCategory,selected){
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];
  const values=mutationCategoryMap(data)[mainCategory]||[];
  const select=document.getElementById('mutationItemSubcategory');
  if(select)select.innerHTML=mutationSelectOptions(values,values.includes(selected)?selected:values[0]);
}
function closeMutationItemEditor(){
  editingMutationItemIndex=-1;
  document.querySelectorAll('.admin-mutation-item-row.editing').forEach(row=>row.classList.remove('editing'));
  const editor=document.getElementById('mutationItemEditor');if(editor)editor.hidden=true;
  const error=document.getElementById('mutationItemEditorError');if(error)error.hidden=true;
}
function cancelMutationItemEditor(){
  const item=adminMutationItems[editingMutationItemIndex];
  if(item?.isDraft)adminMutationItems.splice(editingMutationItemIndex,1);
  closeMutationItemEditor();renderAdminMutation();
}
function openMutationItemEditor(index){
  const item=adminMutationItems[index];if(!item||item.removed)return;
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];
  editingMutationItemIndex=index;
  document.querySelectorAll('.admin-mutation-item-row').forEach((row,rowIndex)=>row.classList.toggle('editing',rowIndex===index));
  const mainCategories=Object.keys(mutationCategoryMap(data));
  document.getElementById('mutationItemEditorTitle').textContent=item.isNew?'Nieuw item toevoegen':`Item wijzigen · ${mutationItemName(item)}`;
  document.getElementById('mutationItemEditorContext').textContent=item.isNew?`Nieuwe regel · wordt regel ${index+1}`:`Je bewerkt regel ${index+1} van ${adminMutationItems.length}: ${mutationItemName(item)}`;
  document.getElementById('mutationItemBrand').value=item.brand||'';
  document.getElementById('mutationItemModel').value=item.model||'';
  document.getElementById('mutationItemMainCategory').innerHTML=mutationSelectOptions(mainCategories,item.mainCategory||mainCategories[0]);
  populateMutationSubcategories(item.mainCategory||mainCategories[0],item.subCategory);
  document.getElementById('mutationItemSerial').value=item.serial||'';
  document.getElementById('mutationItemReceipt').innerHTML=mutationSelectOptions(mutationReceipts(data),item.receipt||'Geen aankoopbewijs');
  document.getElementById('mutationItemAmount').value=Number(item.amountNumber||0)||'';
  document.getElementById('mutationItemEditorError').hidden=true;
  const editor=document.getElementById('mutationItemEditor');if(editor){editor.hidden=false;editor.scrollIntoView?.({behavior:'smooth',block:'nearest'});}
}
function saveMutationItemEditor(){
  const item=adminMutationItems[editingMutationItemIndex];if(!item)return;
  const values={brand:document.getElementById('mutationItemBrand').value.trim(),model:document.getElementById('mutationItemModel').value.trim(),mainCategory:document.getElementById('mutationItemMainCategory').value,subCategory:document.getElementById('mutationItemSubcategory').value,serial:document.getElementById('mutationItemSerial').value.trim(),receipt:document.getElementById('mutationItemReceipt').value,amountNumber:Number(document.getElementById('mutationItemAmount').value||0)};
  const valid=values.brand&&values.model&&values.mainCategory&&values.subCategory&&values.serial&&values.amountNumber>0;
  document.getElementById('mutationItemEditorError').hidden=Boolean(valid);
  if(!valid)return;
  Object.assign(item,values,{category:[values.mainCategory,values.subCategory].join(' / '),isDraft:false});
  closeMutationItemEditor();renderAdminMutation();
}
function renderAdminMutation(){
  const body=document.getElementById('mutationItemsBody');if(!body)return;
  const changedNames=new Set(buildAdminMutationChanges().filter(change=>change.type==='Gewijzigd').map(change=>change.item));
  body.innerHTML=adminMutationItems.map((item,index)=>{const status=item.removed?'Verwijderd':item.isNew?'Toegevoegd':changedNames.has(item.original?.name)?'Gewijzigd':'Actief';const statusClass=item.removed?'red':item.isNew?'green':status==='Gewijzigd'?'blue':'gray';return `<div class="admin-mutation-item-row ${item.removed?'removed':item.isNew?'added':status==='Gewijzigd'?'changed':''} ${editingMutationItemIndex===index?'editing':''}" data-mutation-index="${index}"><div class="admin-mutation-item-main"><strong>${adminEscape(mutationItemName(item))}</strong><span>${adminEscape(mutationItemCategory(item))}</span></div><div><span>Serienummer</span><strong>${adminEscape(item.serial||'—')}</strong></div><div><span>Aankoopbewijs</span><strong>${adminEscape(item.receipt||'Geen aankoopbewijs')}</strong></div><div class="admin-money"><span>Verzekerd bedrag</span><strong>${adminEscape(adminFormatEuro(item.amountNumber))}</strong></div><div class="admin-mutation-item-actions"><span class="admin-chip ${statusClass}">${status}</span><button class="admin-btn text" data-mutation-edit="${index}" type="button" ${item.removed?'disabled':''}>Bewerken</button><button class="admin-btn text" data-mutation-remove="${index}" type="button">${item.removed?'Herstellen':'Verwijderen'}</button></div></div>`;}).join('');
  refreshAdminMutationTotals();
  body.querySelectorAll('[data-mutation-edit]').forEach(button=>button.addEventListener('click',()=>openMutationItemEditor(Number(button.dataset.mutationEdit))));
  body.querySelectorAll('[data-mutation-remove]').forEach(button=>button.addEventListener('click',()=>{const item=adminMutationItems[Number(button.dataset.mutationRemove)];item.removed=!item.removed;if(editingMutationItemIndex===Number(button.dataset.mutationRemove))closeMutationItemEditor();renderAdminMutation();}));
}
function openAdminMutation(){
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];if(data.phase!=='Polis')return;
  adminMutationItems=data.items.map((item,index)=>{const parts=item.name.split(' ');const brand=parts.shift()||'';const model=parts.join(' ');const [mainCategory='',...subcategoryParts]=String(item.category||'').split(' / ');const subCategory=subcategoryParts.join(' / ');const amountNumber=adminEuroNumber(item.amount);return {...item,id:`existing-${index}`,brand,model,mainCategory,subCategory,amountNumber,isNew:false,removed:false,original:{...item,name:item.name,brand,model,mainCategory,subCategory,amountNumber}};});
  mutationInitialRentalIn=!data.addons[0][1].startsWith('Niet');
  mutationInitialRentalOut=!data.addons[1][1].startsWith('Niet');
  mutationInitialRentalLimit='10000';
  document.getElementById('mutationPageTitle').textContent=`Polis wijzigen · ${data.policy}`;
  document.getElementById('mutationPageMeta').textContent=`${data.holder.name} · ${data.product}`;
  document.getElementById('mutationRentalIn').checked=mutationInitialRentalIn;
  document.getElementById('mutationRentalOut').checked=mutationInitialRentalOut;
  document.getElementById('mutationRentalLimit').value=mutationInitialRentalLimit;
  document.getElementById('mutationEffectiveDate').value='2026-09-01';
  document.getElementById('adminMutationSuccess').hidden=true;
  closeMutationItemEditor();renderAdminMutation();setAdminPage('policy-mutation');
}
document.getElementById('dossierStartMutation')?.addEventListener('click',openAdminMutation);
document.getElementById('mutationBackButton')?.addEventListener('click',()=>{renderDossier(activeDossierKey);setAdminPage('dossier');});
document.getElementById('mutationAddItem')?.addEventListener('click',()=>{const data=dossierData[activeDossierKey];const map=mutationCategoryMap(data);const mainCategory=Object.keys(map)[0];adminMutationItems.push({id:`new-${Date.now()}`,brand:'',model:'',mainCategory,subCategory:map[mainCategory][0],serial:'',receipt:'Geen aankoopbewijs',amountNumber:0,isNew:true,isDraft:true,removed:false});renderAdminMutation();openMutationItemEditor(adminMutationItems.length-1);});
document.getElementById('mutationItemMainCategory')?.addEventListener('change',event=>populateMutationSubcategories(event.target.value,''));
document.getElementById('mutationItemEditorSave')?.addEventListener('click',saveMutationItemEditor);
document.getElementById('mutationItemEditorCancel')?.addEventListener('click',cancelMutationItemEditor);
document.getElementById('mutationItemEditorClose')?.addEventListener('click',cancelMutationItemEditor);
document.getElementById('mutationRentalIn')?.addEventListener('change',refreshAdminMutationTotals);
document.getElementById('mutationRentalOut')?.addEventListener('change',refreshAdminMutationTotals);
document.getElementById('mutationRentalLimit')?.addEventListener('change',refreshAdminMutationTotals);
document.getElementById('mutationEffectiveDate')?.addEventListener('change',refreshAdminMutationTotals);
document.getElementById('mutationSubmit')?.addEventListener('click',()=>{
  const data=dossierData[activeDossierKey];const effective=document.getElementById('mutationEffectiveDate')?.value;const changes=buildAdminMutationChanges();const calculation=adminMutationCalculation();if(!data||!effective||!calculation.validDate||!changes.length||adminMutationValidation().blocked)return;
  data.pendingMutation={reference:'MUT-2026-00129',effective:formatMutationDate(effective),created:'27 aug 2026 · 10:15',initiator:'Medewerker',status:'Gepland',changes};
  data.activities.unshift({date:'27 aug 2026 · 10:15',actor:'Medewerker',source:'GoSafe Admin',title:'Polismutatie ingepland',change:`${changes.length} wijzigingsregels klaargezet voor ${data.pendingMutation.effective}.`,detail:`Referentie: ${data.pendingMutation.reference} · Actor: Medewerker · Totaal verrekening: ${adminFormatEuro(calculation.mutationTotal)}`});
  const success=document.getElementById('adminMutationSuccess');if(success){success.hidden=false;success.innerHTML=`<div class="admin-future-mutation-head"><div><span class="admin-future-mutation-label">Wijziging opgeslagen</span><strong>${adminEscape(data.pendingMutation.reference)}</strong><small>${changes.length} technische wijzigingsregels · totaal verrekening ${adminEscape(adminFormatEuro(calculation.mutationTotal))}</small></div><div><span>Gaat in op</span><strong>${adminEscape(data.pendingMutation.effective)}</strong><span class="admin-chip amber">Gepland</span></div></div><div class="admin-mutation-change-list">${changes.map(renderPendingChange).join('')}</div>`;}
  const row=document.querySelector(`[data-dossier-key="${activeDossierKey}"]`);if(row?.cells?.[8])row.cells[8].innerHTML=`<span class="admin-chip amber">Per ${adminEscape(data.pendingMutation.effective)}</span><div class="admin-secondary">${adminEscape(data.pendingMutation.reference)} · ${changes.length} regels</div>`;
  document.getElementById('mutationSubmit').disabled=true;document.getElementById('mutationSubmit').textContent='Wijziging ingepland';
  success?.scrollIntoView?.({behavior:'smooth',block:'nearest'});
});

// Relatiegegevens worden los van de polis gewijzigd. IBAN-wijzigingen blijven een klantactie.
let relationInitialHolder={};
let relationHolderDraft={};
const relationEditableFields=[['relationHolderName','name','Naam / bedrijfsnaam'],['relationHolderEmail','email','E-mailadres'],['relationHolderPhone','phone','Telefoonnummer'],['relationHolderAddress','address','Adres'],['relationHolderCountry','country','Land']];
function relationMutationChanges(){
  return relationEditableFields.map(([,key,label])=>({key,label,old:relationInitialHolder[key]||'—',new:relationHolderDraft[key]||'—'})).filter(change=>change.old!==change.new);
}
function renderRelationMutationValidation(){
  const required=['name','email','phone','address','country'];
  const complete=required.every(key=>String(relationHolderDraft[key]||'').trim());
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(relationHolderDraft.email||'');
  const countryOk=relationHolderDraft.country==='Nederland';
  const changes=relationMutationChanges();
  const blocked=!complete||!emailOk||!countryOk;
  const target=document.getElementById('relationMutationValidation');
  if(target)target.innerHTML=`<div class="admin-mutation-validation-head"><strong>Relatiecontrole</strong><span class="admin-chip ${blocked?'red':'green'}">${blocked?'Geblokkeerd':'Akkoord'}</span></div><div class="admin-mutation-validation-list"><div class="${complete?'ok':'blocked'}"><b>${complete?'✓':'!'}</b><span><strong>Verplichte gegevens</strong><small>${complete?'Compleet':'Vul alle verplichte velden in'}</small></span></div><div class="${emailOk?'ok':'blocked'}"><b>${emailOk?'✓':'!'}</b><span><strong>E-mailadres</strong><small>${emailOk?'Geldig':'Controleer het e-mailadres'}</small></span></div><div class="${countryOk?'ok':'blocked'}"><b>${countryOk?'✓':'!'}</b><span><strong>Volmachtregel Nederland</strong><small>${adminEscape(relationHolderDraft.country||'Niet ingevuld')}</small></span></div></div>`;
  const submit=document.getElementById('relationMutationSubmit');if(submit){submit.disabled=blocked||!changes.length;submit.textContent=blocked?'Geblokkeerd door relatiecontrole':'Relatiewijziging opslaan';}
  return {blocked,changes};
}
function openRelationMutation(){
  const data=dossierData[activeDossierKey]||dossierData['policy-main'];
  relationInitialHolder={...data.holder,country:data.holder.country||'Nederland'};
  relationHolderDraft={...relationInitialHolder};
  document.getElementById('relationMutationTitle').textContent=`Relatie wijzigen · ${data.holder.name}`;
  document.getElementById('relationMutationMeta').textContent=`${data.dossier} · ${data.policy!=='—'?data.policy:data.phase}`;
  relationEditableFields.forEach(([id,key])=>{const field=document.getElementById(id);if(field)field.value=relationHolderDraft[key]||'';});
  document.getElementById('relationHolderKvk').value=data.holder.kvk||'—';
  document.getElementById('relationHolderIban').textContent=data.holder.iban||'—';
  document.getElementById('relationMutationSuccess').hidden=true;
  renderRelationMutationValidation();setAdminPage('relation-mutation');
}
document.getElementById('dossierStartRelationMutation')?.addEventListener('click',openRelationMutation);
document.getElementById('dossierEditHolder')?.addEventListener('click',openRelationMutation);
document.getElementById('relationMutationBackButton')?.addEventListener('click',()=>{renderDossier(activeDossierKey);setAdminPage('dossier');setDossierTab('holder');});
relationEditableFields.forEach(([id,key])=>document.getElementById(id)?.addEventListener('input',event=>{relationHolderDraft[key]=event.target.value;renderRelationMutationValidation();}));
document.getElementById('relationMutationSubmit')?.addEventListener('click',()=>{
  const data=dossierData[activeDossierKey];const result=renderRelationMutationValidation();if(!data||result.blocked||!result.changes.length)return;
  result.changes.forEach(change=>{data.holder[change.key]=change.new;});
  data.activities.unshift({date:'27 aug 2026 · 10:28',actor:'Medewerker',source:'GoSafe Admin',title:'Relatiegegevens gewijzigd',change:`${result.changes.length} relatievelden bijgewerkt.`,detail:result.changes.map(change=>`${change.label}: ${change.old} → ${change.new}`).join(' · ')});
  relationInitialHolder={...data.holder,country:data.holder.country||'Nederland'};relationHolderDraft={...relationInitialHolder};
  const success=document.getElementById('relationMutationSuccess');if(success){success.hidden=false;success.innerHTML=`<div class="admin-relation-success-row"><div><strong>Relatiegegevens opgeslagen</strong><small>${result.changes.length} velden vastgelegd in het activiteitenlog.</small></div><span class="admin-chip green">Opgeslagen</span></div>`;}
  renderRelationMutationValidation();
});
const adminEntryParams=new URLSearchParams(window.location.search);
if(adminEntryParams.get('dossier')&&dossierData[adminEntryParams.get('dossier')]){
  dossierReturnPage='policies';
  renderDossier(adminEntryParams.get('dossier'));
  const back=document.getElementById('dossierBackButton');if(back)back.textContent='← Terug naar polissen';
  setAdminPage('dossier');
}

function setupDossierList({bodyId,searchId,statusId,productId,dateId,countId,singular,plural}){
  const body=document.getElementById(bodyId);if(!body)return;
  const controls=[searchId,statusId,productId,dateId].map(id=>document.getElementById(id));
  const apply=()=>{
    const [search,status,product,date]=controls.map(control=>(control?.value||'').trim().toLowerCase());
    let visible=0;
    body.querySelectorAll('.admin-dossier-row').forEach(row=>{
      const matches=(!search||(row.dataset.search||'').includes(search))&&(!status||row.dataset.status===status)&&(!product||row.dataset.product===product)&&(!date||(row.dataset.date||'').includes(date));
      row.hidden=!matches;if(matches)visible++;
    });
    const count=document.getElementById(countId);if(count)count.textContent=visible+' '+(visible===1?singular:plural);
  };
  controls.forEach(control=>control?.addEventListener(control.tagName==='INPUT'?'input':'change',apply));
}
setupDossierList({bodyId:'applicationListBody',searchId:'applicationListSearch',statusId:'applicationStatusFilter',productId:'applicationProductFilter',dateId:'applicationDateFilter',countId:'applicationResultCount',singular:'aanvraag',plural:'aanvragen'});
setupDossierList({bodyId:'policyListBody',searchId:'policyListSearch',statusId:'policyStatusFilter',productId:'policyProductFilter',dateId:'policyDateFilter',countId:'policyResultCount',singular:'polis',plural:'polissen'});


// Productbeheer prototype interactions
const productAdminPage=document.querySelector('.product-admin-page');
let selectedAdminProduct='';
let pendingProductPage='categories';
function showProductChooser(){
  selectedAdminProduct='';
  productAdminPage?.classList.add('choosing-product');
  const current=document.getElementById('productCurrentName');if(current)current.textContent='—';
  closeProductCategoryEdit();
}
function selectAdminProduct(name){
  selectedAdminProduct=name;
  const select=document.getElementById('productAdminProduct');if(select)select.value=name;
  const current=document.getElementById('productCurrentName');if(current)current.textContent=name;
  const apiProduct=document.getElementById('productApiProduct');if(apiProduct)apiProduct.value=name;
  productAdminPage?.classList.remove('choosing-product');
  setProductPage(pendingProductPage||'categories');
  closeProductCategoryEdit();
  filterProductCategories();
  filterProductRuleCatalog();
  filterCategoryRuleOptions();
  filterProductSettings();
  filterProductConditions();
  filterProductIpids();
  filterProductAddons();
  filterProductAcceptance();
}
function setProductPage(name){
  document.querySelectorAll('[data-product-page]').forEach(el=>el.classList.toggle('active',el.dataset.productPage===name));
  document.querySelectorAll('[data-product-target]').forEach(el=>el.classList.toggle('active',el.dataset.productTarget===name));
  document.querySelector('.admin-main')?.scrollTo?.({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-product-target]').forEach(btn=>btn.addEventListener('click',()=>{
  setAdminPage('products');
  pendingProductPage=btn.dataset.productTarget;
  if(selectedAdminProduct)setProductPage(pendingProductPage);else showProductChooser();
}));
document.querySelector('.admin-nav[data-admin-target="products"]')?.addEventListener('click',()=>{pendingProductPage='categories';showProductChooser();});
document.querySelectorAll('[data-product-choice]').forEach(btn=>btn.addEventListener('click',()=>selectAdminProduct(btn.dataset.productChoice)));
document.getElementById('productChangeProduct')?.addEventListener('click',showProductChooser);
function productEscape(value){return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));}

function editProductCategory(row){
  if(!row)return;
  document.querySelectorAll('.product-category-row').forEach(r=>r.classList.toggle('selected',r===row));
  document.getElementById('productCategoryLayout')?.classList.add('editing');
  const name=row.dataset.categoryName||'';
  const main=row.dataset.mainCategory||'';
  const product=row.dataset.product||'';
  const rate=row.dataset.rate||'';
  const rateSource=row.dataset.rateSource||'';
  const deductible=row.dataset.deductible||'';
  const deductibleSource=row.dataset.deductibleSource||'';
  const level=row.dataset.level||'sub';
  const title=document.getElementById('productCategoryTitle');if(title)title.textContent=name;
  const crumb=document.getElementById('productCategoryBreadcrumb');if(crumb)crumb.textContent=[product,main!==name?main:null,name].filter(Boolean).join(' / ');
  const er=document.getElementById('productCategoryEffectiveRate');if(er)er.textContent=rate;
  const ers=document.getElementById('productCategoryRateSource');if(ers)ers.textContent=(rateSource===name||level==='root')?'':'Overgenomen van '+rateSource;
  const ed=document.getElementById('productCategoryEffectiveDeductible');if(ed)ed.textContent=deductible;
  const eds=document.getElementById('productCategoryDeductibleSource');if(eds)eds.textContent=(deductibleSource===name||level==='root')?'':'Overgenomen van '+deductibleSource;
  const rateMode=document.getElementById('productCategoryRateMode');if(rateMode)rateMode.value=(rateSource===name||level==='root')?'override':'inherit';
  const dedMode=document.getElementById('productCategoryDeductibleMode');if(dedMode)dedMode.value=(deductibleSource===name||level==='root')?'override':'inherit';
  const rateInput=document.getElementById('productCategoryRate');if(rateInput){rateInput.value=rate;rateInput.disabled=(rateSource!==name&&level!=='root');}
  const deductibleInput=document.getElementById('productCategoryDeductible');if(deductibleInput){deductibleInput.value=deductible;deductibleInput.disabled=(deductibleSource!==name&&level!=='root');}
  const upcoming=document.getElementById('productCategoryUpcoming');if(upcoming)upcoming.innerHTML=row.dataset.upcoming?'<span class="admin-chip amber">'+row.dataset.upcoming+'</span>':'Geen';
  const rules=(row.dataset.rule||'').split('|').map(value=>value.trim()).filter(Boolean), ruleSource=row.dataset.ruleSource||'';
  const inheritedRules=document.getElementById('productCategoryInheritedRules');
  const ownRules=document.getElementById('productCategoryOwnRules');
  if(inheritedRules){
    inheritedRules.innerHTML=(rules.length&&ruleSource&&ruleSource!==name)?rules.map(rule=>'<div class="product-rule-effective-row"><div><strong>'+productEscape(rule)+'</strong><small>Overgenomen van '+productEscape(ruleSource)+'</small></div><span class="product-rule-inherit">Overgenomen</span></div>').join(''):'';
  }
  if(ownRules){ownRules.innerHTML=(rules.length&&ruleSource===name)?rules.map(rule=>'<span class="product-rule-chip" data-rule-name="'+productEscape(rule)+'">'+productEscape(rule)+' <button type="button" class="product-rule-remove" aria-label="Regel ontkoppelen">×</button></span>').join(''):'';}
  document.querySelectorAll('#productCategoryRuleOptions input').forEach(input=>input.checked=false);
  const ruleSearch=document.getElementById('productCategoryRuleSearch');if(ruleSearch)ruleSearch.value='';
  filterCategoryRuleOptions();
  updateCategoryRuleSelection();
  document.getElementById('productCategoryDetail')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
function closeProductCategoryEdit(){
  document.getElementById('productCategoryLayout')?.classList.remove('editing');
  document.querySelectorAll('.product-category-row').forEach(r=>r.classList.remove('selected'));
}
document.querySelectorAll('.product-open-category').forEach(btn=>btn.addEventListener('click',e=>editProductCategory(e.currentTarget.closest('.product-category-row'))));
['productCloseCategoryEdit','productCancelCategoryEdit'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductCategoryEdit));
document.getElementById('productSaveCategoryChange')?.addEventListener('click',e=>{
  const row=document.querySelector('.product-category-row.selected');if(row){row.dataset.upcoming='Concept · Tarieven 2027';setProductNextVersion(row,'concept','Tarieven 2027');}
  e.currentTarget.textContent='Opgeslagen';
  window.setTimeout(()=>e.currentTarget.textContent='Opslaan',1200);
});
function filterProductCategories(){
  const q=(document.getElementById('productCategorySearch')?.value||'').trim().toLowerCase();
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const rows=[...document.querySelectorAll('.product-category-row')];
  let shown=0;
  rows.forEach(row=>{
    const matchProduct=row.dataset.product===product;
    const hay=(row.dataset.categoryName+' '+row.dataset.mainCategory+' '+row.dataset.product).toLowerCase();
    const matchText=!q||hay.includes(q);
    const visible=matchProduct&&matchText;
    row.classList.toggle('filtered-out',!visible);
    if(visible&&row.dataset.level==='sub')shown++;
  });
  const count=document.getElementById('productCategoryCount');if(count)count.textContent=shown+' subcategorieën zichtbaar';
}
document.getElementById('productCategorySearch')?.addEventListener('input',filterProductCategories);
document.getElementById('productAdminProduct')?.addEventListener('change',()=>{closeProductCategoryEdit();filterProductCategories();filterProductRuleCatalog();filterCategoryRuleOptions();filterProductSettings();filterProductConditions();filterProductIpids();filterProductAddons();filterProductAcceptance();});


const productChangeEditor=document.getElementById('productChangeEditor');
document.getElementById('productOpenActiveChangeSet')?.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});

function toggleProductChangeEditor(show=true){if(productChangeEditor) productChangeEditor.classList.toggle('visible',show);}
['productNewChangeSet','productNewChangeSetInline'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});});
document.querySelectorAll('.product-edit-draft').forEach(el=>el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);}));
const productCloseChangeSet=document.getElementById('productCloseChangeSet');if(productCloseChangeSet)productCloseChangeSet.addEventListener('click',()=>toggleProductChangeEditor(false));
document.getElementById('productSaveChangeSet')?.addEventListener('click',()=>showAdminToast('Wijzigingsset en interne notitie opgeslagen'));

function syncProductVersionContext(){
  const select=document.getElementById('productConfigView'),box=document.getElementById('productVersionContext');if(!select||!box)return;
  const views={current:{chip:'green',label:'Actief',copy:'Geldig sinds 1 jan 2026'},'change-2027':{chip:'gray',label:'Concept',copy:'Tarieven 2027 · nog niet gepubliceerd'},'scheduled-2027':{chip:'blue',label:'Gepland',copy:'Productdocumenten 2027 · vanaf 1 mrt 2027'}};
  const view=views[select.value]||views.current;box.innerHTML='<span class="admin-chip '+view.chip+'">'+view.label+'</span><small>'+view.copy+'</small>';
}
document.getElementById('productConfigView')?.addEventListener('change',()=>{closeProductCategoryEdit();syncProductVersionContext();});
function applyCategoryInheritanceDisplay(){
  document.querySelectorAll('.product-category-row').forEach(row=>{
    const name=row.dataset.categoryName||'';
    const level=row.dataset.level||'';
    if(level==='root') return;
    [[1,'rateSource'],[2,'deductibleSource']].forEach(([idx,key])=>{
      const source=row.dataset[key]||'';
      if(source && source!==name){
        const cell=row.children[idx];
        if(cell){cell.innerHTML='<span class="product-inherit-mark" title="Overgenomen van '+source+'">Overgenomen</span>';}
      }
    });
    const rules=(row.dataset.rule||'').split('|').map(value=>value.trim()).filter(Boolean), ruleSource=row.dataset.ruleSource||'', ruleCell=row.children[3];
    if(ruleCell){
      if(!rules.length){ruleCell.innerHTML='<span class="admin-secondary">—</span>';}
      else if(ruleSource&&ruleSource!==name){ruleCell.innerHTML='<span class="product-rule-inherit" title="Overgenomen van '+productEscape(ruleSource)+': '+productEscape(rules.join(', '))+'">'+rules.length+' overgenomen</span>';}
      else{ruleCell.innerHTML=rules.map(rule=>'<span class="product-rule-chip">'+productEscape(rule)+'</span>').join('');}
    }
  });
}
function syncInheritanceInput(modeId,inputId,sourceId){
  const mode=document.getElementById(modeId), input=document.getElementById(inputId), source=document.getElementById(sourceId);
  if(!mode||!input)return;
  const sync=()=>{const inherit=mode.value==='inherit';input.disabled=inherit;if(source)source.style.display=inherit?'block':'none';};
  mode.addEventListener('change',sync);sync();
}
syncInheritanceInput('productCategoryRateMode','productCategoryRate','productCategoryRateSource');
syncInheritanceInput('productCategoryDeductibleMode','productCategoryDeductible','productCategoryDeductibleSource');
document.querySelectorAll('.product-category-row[data-product="Apparatuurverzekering"]').forEach(row=>{
  if(row.dataset.mainCategory==='Camera’s'){row.dataset.rule='Serienummer verplicht';row.dataset.ruleSource='Camera’s';}
  if(row.dataset.mainCategory==='Lenzen & Optiek'){row.dataset.rule='Clausule CL233 toevoegen';row.dataset.ruleSource='Lenzen & Optiek';}
});
applyCategoryInheritanceDisplay();
filterProductCategories();

function filterCategoryRuleOptions(){
  const q=(document.getElementById('productCategoryRuleSearch')?.value||'').trim().toLowerCase();
  const type=document.getElementById('productCategoryRuleTypeFilter')?.value||'';
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  let shown=0;
  document.querySelectorAll('.product-rule-option').forEach(option=>{
    const optionType=option.querySelector('em')?.textContent||'';
    const visible=option.dataset.product===product&&(!q||(option.dataset.ruleSearch||'').includes(q))&&(!type||optionType===type);
    option.classList.toggle('filtered-out',!visible);if(visible)shown++;
  });
  const count=document.getElementById('productCategoryRuleResultCount');if(count)count.textContent=shown+(shown===1?' actieve regel gevonden':' actieve regels gevonden');
  const empty=document.getElementById('productCategoryRuleEmpty');if(empty)empty.hidden=shown!==0;
  const clear=document.getElementById('productCategoryRuleClearSearch');if(clear)clear.style.visibility=(q||type)?'visible':'hidden';
}
function updateCategoryRuleSelection(){
  const selected=[...document.querySelectorAll('#productCategoryRuleOptions input:checked')];
  const count=document.getElementById('productCategoryRuleSelection');if(count)count.textContent=selected.length+(selected.length===1?' regel geselecteerd':' regels geselecteerd');
  const button=document.getElementById('productCategoryAddRule');if(button)button.disabled=!selected.length;
}
document.getElementById('productCategoryRuleSearch')?.addEventListener('input',filterCategoryRuleOptions);
document.getElementById('productCategoryRuleTypeFilter')?.addEventListener('change',filterCategoryRuleOptions);
document.getElementById('productCategoryRuleClearSearch')?.addEventListener('click',()=>{const search=document.getElementById('productCategoryRuleSearch');const type=document.getElementById('productCategoryRuleTypeFilter');if(search)search.value='';if(type)type.value='';filterCategoryRuleOptions();search?.focus();});
document.getElementById('productCategoryRuleOptions')?.addEventListener('change',updateCategoryRuleSelection);
document.getElementById('productCategoryAddRule')?.addEventListener('click',()=>{
  const list=document.getElementById('productCategoryOwnRules');if(!list)return;
  const existing=new Set([...list.querySelectorAll('.product-rule-chip')].map(el=>el.dataset.ruleName));
  [...document.querySelectorAll('#productCategoryRuleOptions input:checked')].forEach(input=>{
    if(!existing.has(input.value)){
      const chip=document.createElement('span');chip.className='product-rule-chip';chip.dataset.ruleName=input.value;chip.innerHTML=productEscape(input.value)+' <button type="button" class="product-rule-remove" aria-label="Regel ontkoppelen">×</button>';list.appendChild(chip);existing.add(input.value);
    }
    input.checked=false;
  });
  const selectedRow=document.querySelector('.product-category-row.selected');
  if(selectedRow){selectedRow.dataset.rule=[...existing].join('|');selectedRow.dataset.ruleSource=selectedRow.dataset.categoryName||'';const cell=selectedRow.children[3];if(cell)cell.innerHTML=[...existing].map(rule=>'<span class="product-rule-chip">'+productEscape(rule)+'</span>').join('');}
  updateCategoryRuleSelection();
});
document.getElementById('productCategoryOwnRules')?.addEventListener('click',e=>{
  const remove=e.target.closest('.product-rule-remove');if(!remove)return;
  remove.closest('.product-rule-chip')?.remove();
  const selectedRow=document.querySelector('.product-category-row.selected');
  if(selectedRow){const rules=[...document.querySelectorAll('#productCategoryOwnRules .product-rule-chip')].map(el=>el.dataset.ruleName);selectedRow.dataset.rule=rules.join('|');const cell=selectedRow.children[3];if(cell)cell.innerHTML=rules.length?rules.map(rule=>'<span class="product-rule-chip">'+productEscape(rule)+'</span>').join(''):'<span class="admin-secondary">—</span>';}
});

function filterProductRuleCatalog(){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const q=(document.getElementById('productRuleSearch')?.value||'').trim().toLowerCase();
  const status=document.getElementById('productRuleStatusFilter')?.value||'';
  let shown=0;
  document.querySelectorAll('.product-rule-row').forEach(row=>{const hay=[row.dataset.ruleName,row.dataset.ruleCode,row.dataset.ruleType,row.dataset.ruleDescription].join(' ').toLowerCase();const visible=row.dataset.product===product&&(!q||hay.includes(q))&&(!status||row.dataset.ruleStatus===status);row.style.display=visible?'':'none';if(visible)shown++;});
  const count=document.getElementById('productRuleCount');if(count)count.textContent=shown+' regels';
}
document.getElementById('productRuleSearch')?.addEventListener('input',filterProductRuleCatalog);
document.getElementById('productRuleStatusFilter')?.addEventListener('change',filterProductRuleCatalog);
filterProductRuleCatalog();

let editingProductRuleRow=null;
function syncProductRuleTypeConfig(){
  const type=document.getElementById('productRuleType')?.value||'Serienummer verplicht';
  const serial=document.getElementById('productRuleSerialConfig');if(serial)serial.hidden=type!=='Serienummer verplicht';
  const clause=document.getElementById('productRuleClauseConfig');if(clause)clause.hidden=type!=='Clausule toevoegen';
}
function openProductRuleEditor(row=null){
  editingProductRuleRow=row;
  const title=document.getElementById('productRuleEditorTitle');if(title)title.textContent=row?'Categorieregel bewerken':'Nieuwe categorieregel';
  document.getElementById('productRuleCode').value=row?.dataset.ruleCode||'';
  document.getElementById('productRuleName').value=row?.dataset.ruleName||'';
  document.getElementById('productRuleType').value=row?.dataset.ruleType||'Serienummer verplicht';
  document.getElementById('productRuleDescription').value=row?.dataset.ruleDescription||'';
  document.getElementById('productRuleClause').value=row?.dataset.ruleClause||'';
  document.getElementById('productRuleStatus').value=row?.dataset.ruleStatus||'Concept';
  syncProductRuleTypeConfig();
  document.getElementById('productRuleEditorError')?.classList.remove('visible');
  document.getElementById('productRuleEditor')?.classList.add('visible');
  document.getElementById('productRuleEditor')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
function closeProductRuleEditor(){editingProductRuleRow=null;document.getElementById('productRuleEditor')?.classList.remove('visible');document.getElementById('productRuleEditorError')?.classList.remove('visible');}
document.getElementById('productNewCategoryRule')?.addEventListener('click',()=>openProductRuleEditor());
document.getElementById('productRuleType')?.addEventListener('change',syncProductRuleTypeConfig);
['productRuleEditorClose','productRuleEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductRuleEditor));
document.querySelector('.product-category-rules-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-rule');if(button)openProductRuleEditor(button.closest('.product-rule-row'));});
function syncRuleLinkOption(row){
  const options=document.getElementById('productCategoryRuleOptions');if(!options)return;
  let option=[...options.querySelectorAll('.product-rule-option')].find(el=>el.dataset.ruleCode===row.dataset.ruleCode||el.querySelector('input')?.value===row.dataset.ruleName);
  if(row.dataset.ruleStatus!=='Actief'){option?.remove();return;}
  if(!option){option=document.createElement('label');option.className='product-rule-option';option.innerHTML='<input type="checkbox"><span><strong></strong><small></small></span><em></em>';options.appendChild(option);}
  option.dataset.product=row.dataset.product;option.dataset.ruleCode=row.dataset.ruleCode;option.dataset.ruleSearch=[row.dataset.ruleName,row.dataset.ruleCode,row.dataset.ruleType].join(' ').toLowerCase();option.querySelector('input').value=row.dataset.ruleName;option.querySelector('strong').textContent=row.dataset.ruleName;option.querySelector('small').textContent=row.dataset.ruleCode;option.querySelector('em').textContent=row.dataset.ruleType;
}
document.getElementById('productRuleSave')?.addEventListener('click',()=>{
  const code=document.getElementById('productRuleCode').value.trim().toUpperCase();
  const name=document.getElementById('productRuleName').value.trim();
  const type=document.getElementById('productRuleType').value;
  const description=document.getElementById('productRuleDescription').value.trim();
  const status=document.getElementById('productRuleStatus').value;
  const clause=document.getElementById('productRuleClause')?.value||'';
  const editorError=document.getElementById('productRuleEditorError');
  if(!code||!name||!description){if(editorError){editorError.textContent='Vul code, naam en omschrijving in.';editorError.classList.add('visible');}return;}
  if(type==='Clausule toevoegen'&&!clause){if(editorError){editorError.textContent='Selecteer de clausule die deze regel moet toevoegen.';editorError.classList.add('visible');}return;}
  const duplicate=[...document.querySelectorAll('.product-rule-row')].find(row=>row!==editingProductRuleRow&&(row.dataset.ruleCode||'').toUpperCase()===code);
  if(duplicate){if(editorError){editorError.textContent='Deze regelcode bestaat al binnen dit product.';editorError.classList.add('visible');}return;}
  let row=editingProductRuleRow;
  if(!row){row=document.createElement('tr');row.className='product-rule-row';document.querySelector('.product-category-rules-table tbody')?.prepend(row);}
  row.dataset.product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';row.dataset.ruleName=name;row.dataset.ruleCode=code;row.dataset.ruleType=type;row.dataset.ruleDescription=description;row.dataset.ruleStatus=status;row.dataset.ruleClause=type==='Clausule toevoegen'?clause:'';
  const chipClass=status==='Actief'?'green':status==='Concept'?'gray':'amber';
  row.innerHTML='<td><div class="admin-primary">'+productEscape(name)+'</div><div class="admin-secondary">'+productEscape(code)+'</div></td><td>'+productEscape(type)+'</td><td>'+(editingProductRuleRow?productEscape(editingProductRuleRow.children[2]?.textContent||'Nog niet gekoppeld'):'Nog niet gekoppeld')+'</td><td><span class="admin-chip '+chipClass+'">'+productEscape(status)+'</span></td><td class="product-next-version"></td><td><button class="admin-btn text product-edit-rule" type="button">Bewerken</button></td>';
  setProductNextVersion(row,'concept','Tarieven 2027');
  syncRuleLinkOption(row);const search=document.getElementById('productRuleSearch');const statusFilter=document.getElementById('productRuleStatusFilter');if(search)search.value='';if(statusFilter)statusFilter.value='';filterCategoryRuleOptions();filterProductRuleCatalog();showAdminToast(status==='Actief'?'Regel opgeslagen en direct beschikbaar om te koppelen':'Regel opgeslagen als '+status.toLowerCase());closeProductRuleEditor();
});

function formatProductEuro(value){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',minimumFractionDigits:Number(value)%1?2:0,maximumFractionDigits:2}).format(Number(value)||0);}
function formatProductDate(value){if(!value)return '—';return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00'));}

function productNextVersionHtml(row){
  const state=row.dataset.versionState||'none';
  if(state==='concept')return '<div class="product-version-state"><span class="admin-chip gray">Concept</span><small>'+productEscape(row.dataset.versionSet||'Tarieven 2027')+'</small></div>';
  if(state==='scheduled')return '<div class="product-version-state"><span class="admin-chip blue">Gepland</span><small>'+productEscape(formatProductDate(row.dataset.versionDate||'2027-01-01'))+'</small></div>';
  return '<span class="product-version-none">Geen</span>';
}
function renderProductNextVersion(row){const cell=row?.querySelector('.product-next-version');if(cell)cell.innerHTML=productNextVersionHtml(row);}
function setProductNextVersion(row,state='concept',setName='Tarieven 2027',date=''){
  if(!row)return;row.dataset.versionState=state;row.dataset.versionSet=setName;row.dataset.versionDate=date;renderProductNextVersion(row);
}
function ensureProductVersionColumn(tableSelector,rowSelector){
  const table=document.querySelector(tableSelector);if(!table)return;
  const header=table.querySelector('thead tr');if(header&&!header.querySelector('.product-version-heading')){const th=document.createElement('th');th.className='product-version-heading';th.textContent='Volgende versie';header.insertBefore(th,header.lastElementChild);}
  table.querySelectorAll(rowSelector).forEach(row=>{if(!row.querySelector('.product-next-version')){const td=document.createElement('td');td.className='product-next-version';row.insertBefore(td,row.lastElementChild);}renderProductNextVersion(row);});
}
function initializeProductVersionStates(){
  document.querySelectorAll('.product-category-row').forEach(row=>{row.children[4]?.classList.add('product-next-version');if(row.dataset.upcoming)setProductNextVersion(row,'concept','Tarieven 2027');else setProductNextVersion(row,'none');});
  ensureProductVersionColumn('.product-category-rules-table','.product-rule-row');
  ensureProductVersionColumn('.product-settings-table','.product-setting-row');
  ensureProductVersionColumn('.product-conditions-table','.product-conditions-row');
  ensureProductVersionColumn('.product-ipid-table','.product-ipid-row');
  ensureProductVersionColumn('.product-addons-table','.product-addon-row');
  ensureProductVersionColumn('.product-acceptance-table','.product-acceptance-row');
  document.querySelectorAll('.product-rule-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.ruleCode==='REG-SERIAL-REQ')setProductNextVersion(row,'concept','Tarieven 2027');else if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.ruleCode==='CLA-CL233')setProductNextVersion(row,'scheduled','', '2027-03-01');});
  document.querySelectorAll('.product-setting-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.settingKey==='minimum_annual_premium')setProductNextVersion(row,'concept','Tarieven 2027');else if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.settingKey==='policy_costs_renewal')setProductNextVersion(row,'scheduled','', '2027-01-01');});
  document.querySelectorAll('.product-conditions-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering')setProductNextVersion(row,'scheduled','', '2027-03-01');});
  document.querySelectorAll('.product-ipid-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering')setProductNextVersion(row,'concept','Productdocumenten 2027');});
  document.querySelectorAll('.product-addon-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.addonType==='inhire')setProductNextVersion(row,'concept','Tarieven 2027');else if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.addonType==='rental')setProductNextVersion(row,'scheduled','', '2027-01-01');});
  document.querySelectorAll('.product-acceptance-row').forEach(row=>{if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.acceptanceType==='computer_ratio')setProductNextVersion(row,'concept','Tarieven 2027');else if(row.dataset.product==='Apparatuurverzekering'&&row.dataset.acceptanceType==='max_total_amount')setProductNextVersion(row,'scheduled','', '2027-01-01');});
  syncProductVersionContext();
}

let editingProductSettingRow=null;
function filterProductSettings(){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  document.querySelectorAll('.product-setting-row').forEach(row=>row.style.display=row.dataset.product===product?'':'none');
  const rows=[...document.querySelectorAll('.product-setting-row')].filter(row=>row.dataset.product===product);
  const byKey=key=>rows.find(row=>row.dataset.settingKey===key)?.dataset.settingValue;
  const minimum=document.getElementById('productMinimumPremiumSummary');if(minimum)minimum.textContent=formatProductEuro(byKey('minimum_annual_premium'));
  const policy=document.getElementById('productPolicyCostsSummary');if(policy)policy.textContent=formatProductEuro(byKey('policy_costs_renewal'));
  const admin=document.getElementById('productAdminCostsSummary');if(admin)admin.textContent=formatProductEuro(byKey('administration_costs'));
}
function openProductSettingEditor(row){
  editingProductSettingRow=row;if(!row)return;
  const title=document.getElementById('productSettingEditorTitle');if(title)title.textContent=row.dataset.settingName+' wijzigen';
  document.getElementById('productSettingName').value=row.dataset.settingName||'';
  document.getElementById('productSettingValue').value=row.dataset.settingValue||'';
  document.getElementById('productSettingEffective').value=row.dataset.settingEffective||'2026-01-01';
  document.getElementById('productSettingEditorError')?.classList.remove('visible');
  document.getElementById('productSettingEditor')?.classList.add('visible');
}
function closeProductSettingEditor(){editingProductSettingRow=null;document.getElementById('productSettingEditor')?.classList.remove('visible');document.getElementById('productSettingEditorError')?.classList.remove('visible');}
document.querySelector('.product-settings-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-setting');if(button)openProductSettingEditor(button.closest('.product-setting-row'));});
['productSettingEditorClose','productSettingEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductSettingEditor));
document.getElementById('productSettingSave')?.addEventListener('click',()=>{
  if(!editingProductSettingRow)return;
  const value=Number(document.getElementById('productSettingValue')?.value);
  const effective=document.getElementById('productSettingEffective')?.value||'';
  if(!Number.isFinite(value)||value<0||!effective){document.getElementById('productSettingEditorError')?.classList.add('visible');return;}
  editingProductSettingRow.dataset.settingValue=String(value);editingProductSettingRow.dataset.settingEffective=effective;
  const valueCell=editingProductSettingRow.querySelector('.product-setting-value');if(valueCell)valueCell.textContent=formatProductEuro(value);
  if(editingProductSettingRow.children[3])editingProductSettingRow.children[3].textContent=formatProductDate(effective);
  setProductNextVersion(editingProductSettingRow,'concept','Tarieven 2027');filterProductSettings();showAdminToast('Productinstelling opgeslagen in de wijzigingsset');closeProductSettingEditor();
});

const productConditionCatalog={
  'AV-GS-2026-01':{name:'Algemene voorwaarden GoSafe',version:'2026-01'},
  'VW-APP-2026-01':{name:'Voorwaarden Apparatuurverzekering',version:'2026-01'},
  'VW-INS-2026-01':{name:'Voorwaarden Instrumentenverzekering',version:'2026-01'}
};
let editingProductConditionsRow=null;
function filterProductConditions(){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  document.querySelectorAll('.product-conditions-row').forEach(row=>row.style.display=row.dataset.product===product?'':'none');
}
function renderProductConditionsRow(row){
  const ids=(row.dataset.conditionIds||'').split('|').filter(Boolean);
  const names=row.querySelector('.product-condition-names');
  if(names)names.innerHTML=ids.map(id=>'<div class="admin-primary">'+productEscape(productConditionCatalog[id]?.name||id)+'</div>').join('');
  if(row.children[1])row.children[1].textContent=[...new Set(ids.map(id=>productConditionCatalog[id]?.version).filter(Boolean))].join(', ');
}
function openProductConditionsEditor(row){
  if(!row)return;editingProductConditionsRow=row;
  const product=row.dataset.product;
  const selected=(row.dataset.conditionIds||'').split('|').filter(Boolean);
  document.querySelectorAll('#productConditionOptions label').forEach(label=>{
    const visible=(label.dataset.products||'').split('|').includes(product);label.hidden=!visible;
    const input=label.querySelector('input');if(input)input.checked=visible&&selected.includes(input.value);
  });
  document.getElementById('productConditionsEditorError')?.classList.remove('visible');
  document.getElementById('productConditionsEditor')?.classList.add('visible');
}
function closeProductConditionsEditor(){editingProductConditionsRow=null;document.getElementById('productConditionsEditor')?.classList.remove('visible');document.getElementById('productConditionsEditorError')?.classList.remove('visible');}
document.querySelector('.product-conditions-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-conditions');if(button)openProductConditionsEditor(button.closest('.product-conditions-row'));});
['productConditionsEditorClose','productConditionsEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductConditionsEditor));
document.getElementById('productConditionsSave')?.addEventListener('click',()=>{
  if(!editingProductConditionsRow)return;
  const ids=[...document.querySelectorAll('#productConditionOptions label:not([hidden]) input:checked')].map(input=>input.value);
  if(!ids.length){document.getElementById('productConditionsEditorError')?.classList.add('visible');return;}
  editingProductConditionsRow.dataset.conditionIds=ids.join('|');renderProductConditionsRow(editingProductConditionsRow);setProductNextVersion(editingProductConditionsRow,'concept','Productdocumenten 2027');
  showAdminToast('Voorwaarden opgeslagen in de wijzigingsset');closeProductConditionsEditor();
});

const productIpidCatalog={
  'IPID-APP-2026-01':{name:'IPID Apparatuurverzekering',version:'2026-01'},
  'IPID-INS-2026-01':{name:'IPID Instrumentenverzekering',version:'2026-01'},
  'IPID-GS-2027-01':{name:'IPID GoSafe 2027',version:'2027-01'}
};
let editingProductIpidRow=null;
function filterProductIpids(){const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';document.querySelectorAll('.product-ipid-row').forEach(row=>row.style.display=row.dataset.product===product?'':'none');}
function renderProductIpidRow(row){const item=productIpidCatalog[row.dataset.ipidId]||{name:row.dataset.ipidId,version:'—'};const name=row.querySelector('.product-ipid-name');if(name)name.innerHTML='<div class="admin-primary">'+productEscape(item.name)+'</div>';if(row.children[1])row.children[1].textContent=item.version;}
function openProductIpidEditor(row){
  if(!row)return;editingProductIpidRow=row;const product=row.dataset.product;
  document.querySelectorAll('#productIpidOptions label').forEach(label=>{const visible=(label.dataset.products||'').split('|').includes(product);label.hidden=!visible;const input=label.querySelector('input');if(input)input.checked=visible&&input.value===row.dataset.ipidId;});
  document.getElementById('productIpidEditorError')?.classList.remove('visible');document.getElementById('productIpidEditor')?.classList.add('visible');
}
function closeProductIpidEditor(){editingProductIpidRow=null;document.getElementById('productIpidEditor')?.classList.remove('visible');document.getElementById('productIpidEditorError')?.classList.remove('visible');}
document.querySelector('.product-ipid-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-ipid');if(button)openProductIpidEditor(button.closest('.product-ipid-row'));});
['productIpidEditorClose','productIpidEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductIpidEditor));
document.getElementById('productIpidSave')?.addEventListener('click',()=>{if(!editingProductIpidRow)return;const selected=document.querySelector('#productIpidOptions label:not([hidden]) input:checked');if(!selected){document.getElementById('productIpidEditorError')?.classList.add('visible');return;}editingProductIpidRow.dataset.ipidId=selected.value;renderProductIpidRow(editingProductIpidRow);setProductNextVersion(editingProductIpidRow,'concept','Productdocumenten 2027');showAdminToast('IPID opgeslagen in de wijzigingsset');closeProductIpidEditor();});

let editingProductAddonRow=null;
function parseAddonTiers(value){return String(value||'').split('|').filter(Boolean).map(pair=>{const [amount,premium]=pair.split(':').map(Number);return {amount,premium};}).filter(tier=>Number.isFinite(tier.amount)&&Number.isFinite(tier.premium));}
function formatAddonTierRange(tiers){
  if(!tiers.length)return 'Geen staffel';
  const amounts=tiers.map(tier=>tier.amount).sort((a,b)=>a-b);return formatProductEuro(amounts[0]).replace(',00','')+' – '+formatProductEuro(amounts.at(-1)).replace(',00','');
}
function filterProductAddons(){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  document.querySelectorAll('.product-addon-row').forEach(row=>row.style.display=row.dataset.product===product?'':'none');
  const name=document.getElementById('productAddonsProductName');if(name)name.textContent=product;
}
function renderAddonTierRows(tiers){
  const box=document.getElementById('productInhireTierRows');if(!box)return;
  box.innerHTML=tiers.map(tier=>'<div class="product-tier-row"><div><span>€</span><input class="admin-input product-tier-amount" type="number" min="1" step="1" value="'+tier.amount+'"></div><div><span>€</span><input class="admin-input product-tier-premium" type="number" min="0" step="0.01" value="'+tier.premium+'"></div><button class="admin-btn text product-remove-tier" type="button" aria-label="Staffelregel verwijderen">Verwijder</button></div>').join('');
}
function openProductAddonEditor(row){
  if(!row)return;editingProductAddonRow=row;
  const inhire=row.dataset.addonType==='inhire';
  document.getElementById('productAddonEditorTitle').textContent=inhire?'Inhuurstaffel bewerken':'Verhuurpercentage bewerken';
  document.getElementById('productInhireTierEditor').hidden=!inhire;
  document.getElementById('productRentalPercentageEditor').hidden=inhire;
  if(inhire)renderAddonTierRows(parseAddonTiers(row.dataset.addonTiers));
  else document.getElementById('productRentalPercentage').value=row.dataset.addonPercentage||'0';
  document.getElementById('productAddonEditorError')?.classList.remove('visible');
  document.getElementById('productAddonEditor')?.classList.add('visible');
}
function closeProductAddonEditor(){editingProductAddonRow=null;document.getElementById('productAddonEditor')?.classList.remove('visible');document.getElementById('productAddonEditorError')?.classList.remove('visible');}
document.querySelector('.product-addons-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-addon');if(button)openProductAddonEditor(button.closest('.product-addon-row'));});
['productAddonEditorClose','productAddonEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeProductAddonEditor));
document.getElementById('productAddInhireTier')?.addEventListener('click',()=>{const tiers=[...document.querySelectorAll('#productInhireTierRows .product-tier-row')].map(row=>({amount:Number(row.querySelector('.product-tier-amount')?.value)||0,premium:Number(row.querySelector('.product-tier-premium')?.value)||0}));const last=tiers.at(-1)||{amount:0,premium:0};tiers.push({amount:last.amount+5000,premium:last.premium+75});renderAddonTierRows(tiers);});
document.getElementById('productInhireTierRows')?.addEventListener('click',e=>{const button=e.target.closest('.product-remove-tier');if(button)button.closest('.product-tier-row')?.remove();});
document.getElementById('productAddonSave')?.addEventListener('click',()=>{
  if(!editingProductAddonRow)return;
  const error=document.getElementById('productAddonEditorError');
  if(editingProductAddonRow.dataset.addonType==='inhire'){
    const tiers=[...document.querySelectorAll('#productInhireTierRows .product-tier-row')].map(row=>({amount:Number(row.querySelector('.product-tier-amount')?.value),premium:Number(row.querySelector('.product-tier-premium')?.value)})).sort((a,b)=>a.amount-b.amount);
    const invalid=!tiers.length||tiers.some(tier=>!Number.isFinite(tier.amount)||tier.amount<=0||!Number.isFinite(tier.premium)||tier.premium<0)||new Set(tiers.map(tier=>tier.amount)).size!==tiers.length;
    if(invalid){if(error){error.textContent='Vul minimaal één unieke staffelregel met geldige bedragen in.';error.classList.add('visible');}return;}
    editingProductAddonRow.dataset.addonTiers=tiers.map(tier=>tier.amount+':'+tier.premium).join('|');
    const cell=editingProductAddonRow.querySelector('.product-addon-value');if(cell)cell.textContent=formatAddonTierRange(tiers);
  }else{
    const percentage=Number(document.getElementById('productRentalPercentage')?.value);
    if(!Number.isFinite(percentage)||percentage<0){if(error){error.textContent='Vul een geldig toeslagpercentage in.';error.classList.add('visible');}return;}
    editingProductAddonRow.dataset.addonPercentage=String(percentage);
    const cell=editingProductAddonRow.querySelector('.product-addon-value');if(cell)cell.textContent=String(percentage).replace('.',',')+'%';
  }
  setProductNextVersion(editingProductAddonRow,'concept','Tarieven 2027');showAdminToast('Aanvullende dekking opgeslagen in de wijzigingsset');closeProductAddonEditor();
});

const acceptanceTypeDefinitions={
  max_item_amount:{name:'Maximaal verzekerd bedrag per item',code:'ACC-MAX-ITEM',unit:'EUR',outcome:'Uitval',defaultValue:'25000',description:'Ieder item wordt afzonderlijk vergeleken met het ingestelde maximumbedrag.'},
  max_item_count:{name:'Maximaal aantal objecten',code:'ACC-MAX-COUNT',unit:'objecten',outcome:'Uitval',defaultValue:'100',description:'Het systeem telt alle objecten in de aanvraag.'},
  max_total_amount:{name:'Maximaal totaal verzekerd bedrag',code:'ACC-MAX-TOTAL',unit:'EUR',outcome:'Uitval',defaultValue:'100000',description:'Het systeem telt de verzekerde bedragen van alle items bij elkaar op.'},
  allowed_country:{name:'Woon-/vestigingsland',code:'ACC-COUNTRY-NL',unit:'land',outcome:'Uitval',defaultValue:'Nederland',description:'De verzekeringnemer moet wonen of gevestigd zijn in het ingestelde land.'},
  computer_ratio:{name:'Maximum aandeel computerapparatuur',code:'ACC-COMPUTER-RATIO',unit:'procent',outcome:'Uitval',defaultValue:'100',description:'De som van geselecteerde computercategorieën mag niet hoger zijn dan het ingestelde percentage van de overige verzekerde items.'}
};
const acceptanceCategoriesByProduct={
  'Apparatuurverzekering':['Laptops','Tablets (iPads, etc.)','Computers voor bewerking'],
  'Instrumentenverzekering':['Laptop voor muziekproductie','Tablet voor muziekproductie']
};
let editingAcceptanceRow=null;
function acceptanceSettingHtml(row){
  const value=row.dataset.acceptanceValue||'';
  if(row.dataset.acceptanceType==='allowed_country')return 'Alleen '+productEscape(value);
  if(row.dataset.acceptanceType==='computer_ratio'){
    const categories=(row.dataset.acceptanceCategories||'').split('|').filter(Boolean);
    return '<strong>'+productEscape(value)+'% van overige items</strong><small>'+productEscape(categories.join(', '))+'</small>';
  }
  if(row.dataset.acceptanceUnit==='EUR')return productEscape(formatProductEuro(value));
  return productEscape(value+' '+(row.dataset.acceptanceUnit||''));
}
function renderAcceptanceRow(row){
  const status=row.dataset.acceptanceStatus||'Concept';
  const statusClass=status==='Actief'?'green':status==='Inactief'?'amber':'gray';
  const outcome=row.dataset.acceptanceOutcome||'Uitval';
  const outcomeClass=outcome==='Uitval'?'red':'amber';
  row.innerHTML='<td><div class="admin-primary">'+productEscape(row.dataset.acceptanceName)+'</div><div class="admin-secondary">'+productEscape(row.dataset.acceptanceCode)+'</div></td><td class="product-acceptance-setting">'+acceptanceSettingHtml(row)+'</td><td><span class="admin-chip '+outcomeClass+'">'+(outcome==='Uitval'?'Uitval':'Handmatig')+'</span></td><td><span class="admin-chip '+statusClass+'">'+productEscape(status)+'</span></td><td class="product-next-version"></td><td><button class="admin-btn text product-edit-acceptance" type="button">Bewerken</button></td>';
}
function filterProductAcceptance(){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  document.querySelectorAll('.product-acceptance-row').forEach(row=>{
    row.style.display=row.dataset.product===product?'':'none';
  });
  const name=document.getElementById('productAcceptanceProductName');if(name)name.textContent=product;
}
function rebuildAcceptanceCategoryOptions(selected=[]){
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const box=document.getElementById('productAcceptanceCategoryOptions');if(!box)return;
  box.innerHTML=(acceptanceCategoriesByProduct[product]||[]).map(category=>'<label><input type="checkbox" value="'+productEscape(category)+'" '+(selected.includes(category)?'checked':'')+'><span>'+productEscape(category)+'</span></label>').join('');
}
function syncAcceptanceEditorType(){
  const type=document.getElementById('productAcceptanceType')?.value||'max_item_amount';
  const definition=acceptanceTypeDefinitions[type];
  const country=document.getElementById('productAcceptanceCountryField');if(country)country.hidden=type!=='allowed_country';
  const valueField=document.getElementById('productAcceptanceValueField');if(valueField)valueField.hidden=type==='allowed_country';
  const categories=document.getElementById('productAcceptanceCategoryConfig');if(categories)categories.hidden=type!=='computer_ratio';
  const label=document.getElementById('productAcceptanceValueLabel');if(label)label.textContent=type==='computer_ratio'?'Maximale verhouding (%)':type==='max_item_count'?'Maximum aantal':'Maximum bedrag';
  const value=document.getElementById('productAcceptanceValue');if(value&&!editingAcceptanceRow)value.value=definition.defaultValue;
  const outcome=document.getElementById('productAcceptanceOutcomeLabel');if(outcome)outcome.textContent='Bij afwijking: uitval';
}
function openAcceptanceEditor(row){
  if(!row)return;
  editingAcceptanceRow=row;
  const type=row.dataset.acceptanceType;
  const typeSelect=document.getElementById('productAcceptanceType');if(typeSelect)typeSelect.value=type;
  document.getElementById('productAcceptanceValue').value=row.dataset.acceptanceValue;
  document.getElementById('productAcceptanceCountry').value=type==='allowed_country'?(row.dataset.acceptanceValue||'Nederland'):'Nederland';
  document.getElementById('productAcceptanceStatus').value=row.dataset.acceptanceStatus||'Actief';
  document.getElementById('productAcceptanceEffective').value=row.dataset.acceptanceEffective||'2026-01-01';
  rebuildAcceptanceCategoryOptions((row.dataset.acceptanceCategories||'').split('|').filter(Boolean));
  const title=document.getElementById('productAcceptanceEditorTitle');if(title)title.textContent=row.dataset.acceptanceName;
  document.getElementById('productAcceptanceEditorError')?.classList.remove('visible');syncAcceptanceEditorType();
  document.getElementById('productAcceptanceEditor')?.classList.add('visible');
}
function closeAcceptanceEditor(){editingAcceptanceRow=null;document.getElementById('productAcceptanceEditor')?.classList.remove('visible');document.getElementById('productAcceptanceEditorError')?.classList.remove('visible');}
document.querySelector('.product-acceptance-table tbody')?.addEventListener('click',e=>{const button=e.target.closest('.product-edit-acceptance');if(button)openAcceptanceEditor(button.closest('.product-acceptance-row'));});
['productAcceptanceEditorClose','productAcceptanceEditorCancel'].forEach(id=>document.getElementById(id)?.addEventListener('click',closeAcceptanceEditor));
document.getElementById('productAcceptanceSave')?.addEventListener('click',()=>{
  if(!editingAcceptanceRow)return;
  const type=document.getElementById('productAcceptanceType')?.value||'max_item_amount';
  const definition=acceptanceTypeDefinitions[type];
  const status=document.getElementById('productAcceptanceStatus')?.value||'Actief';
  const effective=document.getElementById('productAcceptanceEffective')?.value||'';
  const value=type==='allowed_country'?(document.getElementById('productAcceptanceCountry')?.value||''):String(Number(document.getElementById('productAcceptanceValue')?.value));
  const categories=[...document.querySelectorAll('#productAcceptanceCategoryOptions input:checked')].map(input=>input.value);
  const invalid=!effective||!value||value==='NaN'||(type!=='allowed_country'&&Number(value)<0)||(type==='computer_ratio'&&!categories.length);
  if(invalid){const error=document.getElementById('productAcceptanceEditorError');if(error){error.textContent=type==='computer_ratio'?'Vul een geldige verhouding, minimaal één categorie en een ingangsdatum in.':'Vul een geldige waarde en ingangsdatum in.';error.classList.add('visible');}return;}
  const product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const row=editingAcceptanceRow;
  row.dataset.product=product;row.dataset.acceptanceType=type;row.dataset.acceptanceCode=definition.code+(product==='Instrumentenverzekering'?'-INS':'');row.dataset.acceptanceName=definition.name;row.dataset.acceptanceValue=value;row.dataset.acceptanceUnit=definition.unit;row.dataset.acceptanceOutcome=definition.outcome;row.dataset.acceptanceStatus=status;row.dataset.acceptanceEffective=effective;row.dataset.acceptanceCategories=type==='computer_ratio'?categories.join('|'):'';
  renderAcceptanceRow(row);setProductNextVersion(row,'concept','Tarieven 2027');filterProductAcceptance();showAdminToast('Acceptatiecriterium opgeslagen in de wijzigingsset');closeAcceptanceEditor();
});
initializeProductVersionStates();
filterProductSettings();
filterProductConditions();
filterProductIpids();
filterProductAddons();
filterProductAcceptance();

function runProductApiTest(){
  const scenario=document.getElementById('productApiScenario')?.value||'application';
  const date=document.getElementById('productApiDate')?.value||'2026-08-26';
  const productName=document.getElementById('productApiProduct')?.value||document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const engine={application:'application_premium',mutation:'policy_mutation',renewal:'renewal_premium'}[scenario];
  const extra=scenario==='mutation'?{mutation_proration_divisor:365}:scenario==='renewal'?{resolve_on:'new_period_start'}:{acceptance:'automatic_or_manual'};
  const data={product:productName==='Instrumentenverzekering'?'INS-NL':'APP-NL',scenario,peildatum:date,resolved:{subcategory:productName==='Instrumentenverzekering'?'strijkinstrumenten':'cinema_camera',premium_rate:productName==='Instrumentenverzekering'?0.00625:0.0125,deductible:250,category_rules:productName==='Instrumentenverzekering'?[]:['Serienummer verplicht'],minimum_annual_premium:100,policy_costs_renewal:5.00,administration_costs:2.50,policy_condition_ids:productName==='Instrumentenverzekering'?['AV-GS-2026-01','VW-INS-2026-01']:['AV-GS-2026-01','VW-APP-2026-01'],ipid_document_version_id:productName==='Instrumentenverzekering'?'IPID-INS-2026-01':'IPID-APP-2026-01',additional_coverages:{inhire_tiers:[{insured_amount:5000,annual_premium:75},{insured_amount:10000,annual_premium:150},{insured_amount:15000,annual_premium:225},{insured_amount:20000,annual_premium:300},{insured_amount:25000,annual_premium:375}],rental_surcharge_percentage:25},acceptance_criteria:{max_item_amount:25000,max_item_count:100,max_total_amount:100000,allowed_country:'NL',computer_ratio:1.00},insurance_tax_rate:0.084,...extra},engine,calculation_snapshot:'stored'};
  const pre=document.getElementById('productApiPreview');if(pre)pre.textContent=JSON.stringify(data,null,2);
}
const productApiRun=document.getElementById('productApiRun');if(productApiRun)productApiRun.addEventListener('click',runProductApiTest);

let adminToastTimer;
function showAdminToast(message){const toast=document.getElementById('productAdminToast');if(!toast)return;toast.textContent=message;toast.classList.add('visible');window.clearTimeout(adminToastTimer);adminToastTimer=window.setTimeout(()=>toast.classList.remove('visible'),2600);}
