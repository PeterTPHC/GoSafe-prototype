// GoSafe Admin framework navigation
function setAdminPage(name){
  document.querySelectorAll('[data-admin-page]').forEach(el=>el.classList.toggle('active',el.dataset.adminPage===name));
  document.querySelectorAll('.admin-nav[data-admin-target]').forEach(el=>el.classList.toggle('active',el.dataset.adminTarget===name));
  document.querySelector('.admin-main')?.scrollTo?.({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-admin-target]').forEach(btn=>btn.addEventListener('click',()=>setAdminPage(btn.dataset.adminTarget)));
document.querySelectorAll('.admin-open-dossier').forEach(btn=>btn.addEventListener('click',()=>setAdminPage('dossier')));
document.getElementById('adminGlobalSearch')?.addEventListener('keydown',e=>{
  if(e.key==='Enter' && e.currentTarget.value.trim()) setAdminPage('relations');
});


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
document.getElementById('productAdminProduct')?.addEventListener('change',()=>{closeProductCategoryEdit();filterProductCategories();filterProductRuleCatalog();filterCategoryRuleOptions();filterProductSettings();filterProductConditions();filterProductAddons();filterProductAcceptance();});


const productChangeEditor=document.getElementById('productChangeEditor');
document.getElementById('productOpenActiveChangeSet')?.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});

function toggleProductChangeEditor(show=true){if(productChangeEditor) productChangeEditor.classList.toggle('visible',show);}
['productNewChangeSet','productNewChangeSetInline'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});});
document.querySelectorAll('.product-edit-draft').forEach(el=>el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);}));
const productCloseChangeSet=document.getElementById('productCloseChangeSet');if(productCloseChangeSet)productCloseChangeSet.addEventListener('click',()=>toggleProductChangeEditor(false));
document.getElementById('productSaveChangeSet')?.addEventListener('click',()=>showAdminToast('Wijzigingsset en interne notitie opgeslagen'));

document.getElementById('productConfigView')?.addEventListener('change',()=>{ closeProductCategoryEdit(); });
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
  row.innerHTML='<td><div class="admin-primary">'+productEscape(name)+'</div><div class="admin-secondary">'+productEscape(code)+'</div></td><td>'+productEscape(type)+'</td><td>'+(editingProductRuleRow?productEscape(editingProductRuleRow.children[2]?.textContent||'Nog niet gekoppeld'):'Nog niet gekoppeld')+'</td><td><span class="admin-chip '+chipClass+'">'+productEscape(status)+'</span></td><td><button class="admin-btn text product-edit-rule" type="button">Bewerken</button></td>';
  syncRuleLinkOption(row);const search=document.getElementById('productRuleSearch');const statusFilter=document.getElementById('productRuleStatusFilter');if(search)search.value='';if(statusFilter)statusFilter.value='';filterCategoryRuleOptions();filterProductRuleCatalog();showAdminToast(status==='Actief'?'Regel opgeslagen en direct beschikbaar om te koppelen':'Regel opgeslagen als '+status.toLowerCase());closeProductRuleEditor();
});

function formatProductEuro(value){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',minimumFractionDigits:Number(value)%1?2:0,maximumFractionDigits:2}).format(Number(value)||0);}
function formatProductDate(value){if(!value)return '—';return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00'));}

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
  filterProductSettings();showAdminToast('Productinstelling opgeslagen in de wijzigingsset');closeProductSettingEditor();
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
  editingProductConditionsRow.dataset.conditionIds=ids.join('|');renderProductConditionsRow(editingProductConditionsRow);
  showAdminToast('Voorwaarden opgeslagen in de wijzigingsset');closeProductConditionsEditor();
});

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
  showAdminToast('Aanvullende dekking opgeslagen in de wijzigingsset');closeProductAddonEditor();
});

const acceptanceTypeDefinitions={
  max_item_amount:{name:'Maximaal verzekerd bedrag per item',code:'ACC-MAX-ITEM',unit:'EUR',outcome:'Handmatige beoordeling',defaultValue:'25000',description:'Ieder item wordt afzonderlijk vergeleken met het ingestelde maximumbedrag.'},
  max_item_count:{name:'Maximaal aantal objecten',code:'ACC-MAX-COUNT',unit:'objecten',outcome:'Handmatige beoordeling',defaultValue:'100',description:'Het systeem telt alle objecten in de aanvraag.'},
  max_total_amount:{name:'Maximaal totaal verzekerd bedrag',code:'ACC-MAX-TOTAL',unit:'EUR',outcome:'Handmatige beoordeling',defaultValue:'100000',description:'Het systeem telt de verzekerde bedragen van alle items bij elkaar op.'},
  allowed_country:{name:'Woon-/vestigingsland',code:'ACC-COUNTRY-NL',unit:'land',outcome:'Uitval',defaultValue:'Nederland',description:'De verzekeringnemer moet wonen of gevestigd zijn in het ingestelde land.'},
  computer_ratio:{name:'Maximum aandeel computerapparatuur',code:'ACC-COMPUTER-RATIO',unit:'procent',outcome:'Handmatige beoordeling',defaultValue:'100',description:'De som van geselecteerde computercategorieën mag niet hoger zijn dan het ingestelde percentage van de overige verzekerde items.'}
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
  const outcome=row.dataset.acceptanceOutcome||'Handmatige beoordeling';
  const outcomeClass=outcome==='Uitval'?'red':'amber';
  row.innerHTML='<td><div class="admin-primary">'+productEscape(row.dataset.acceptanceName)+'</div><div class="admin-secondary">'+productEscape(row.dataset.acceptanceCode)+'</div></td><td class="product-acceptance-setting">'+acceptanceSettingHtml(row)+'</td><td><span class="admin-chip '+outcomeClass+'">'+(outcome==='Uitval'?'Uitval':'Handmatig')+'</span></td><td><span class="admin-chip '+statusClass+'">'+productEscape(status)+'</span></td><td><button class="admin-btn text product-edit-acceptance" type="button">Bewerken</button></td>';
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
  const outcome=document.getElementById('productAcceptanceOutcomeLabel');if(outcome)outcome.textContent=definition.outcome==='Uitval'?'Bij afwijking: directe uitval':'Bij overschrijding: handmatige beoordeling';
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
  renderAcceptanceRow(row);filterProductAcceptance();showAdminToast('Acceptatiecriterium opgeslagen in de wijzigingsset');closeAcceptanceEditor();
});
filterProductSettings();
filterProductConditions();
filterProductAddons();
filterProductAcceptance();

function runProductApiTest(){
  const scenario=document.getElementById('productApiScenario')?.value||'application';
  const date=document.getElementById('productApiDate')?.value||'2026-08-26';
  const productName=document.getElementById('productApiProduct')?.value||document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const engine={application:'application_premium',mutation:'policy_mutation',renewal:'renewal_premium'}[scenario];
  const extra=scenario==='mutation'?{mutation_proration_divisor:365}:scenario==='renewal'?{resolve_on:'new_period_start'}:{acceptance:'automatic_or_manual'};
  const data={product:productName==='Instrumentenverzekering'?'INS-NL':'APP-NL',scenario,peildatum:date,resolved:{subcategory:productName==='Instrumentenverzekering'?'strijkinstrumenten':'cinema_camera',premium_rate:productName==='Instrumentenverzekering'?0.00625:0.0125,deductible:250,category_rules:productName==='Instrumentenverzekering'?[]:['Serienummer verplicht'],minimum_annual_premium:100,policy_costs_renewal:5.00,administration_costs:2.50,policy_condition_ids:productName==='Instrumentenverzekering'?['AV-GS-2026-01','VW-INS-2026-01']:['AV-GS-2026-01','VW-APP-2026-01'],additional_coverages:{inhire_tiers:[{insured_amount:5000,annual_premium:75},{insured_amount:10000,annual_premium:150},{insured_amount:15000,annual_premium:225},{insured_amount:20000,annual_premium:300},{insured_amount:25000,annual_premium:375}],rental_surcharge_percentage:25},acceptance_criteria:{max_item_amount:25000,max_item_count:100,max_total_amount:100000,allowed_country:'NL',computer_ratio:1.00},insurance_tax_rate:0.084,...extra},engine,calculation_snapshot:'stored'};
  const pre=document.getElementById('productApiPreview');if(pre)pre.textContent=JSON.stringify(data,null,2);
}
const productApiRun=document.getElementById('productApiRun');if(productApiRun)productApiRun.addEventListener('click',runProductApiTest);

let adminToastTimer;
function showAdminToast(message){const toast=document.getElementById('productAdminToast');if(!toast)return;toast.textContent=message;toast.classList.add('visible');window.clearTimeout(adminToastTimer);adminToastTimer=window.setTimeout(()=>toast.classList.remove('visible'),2600);}
