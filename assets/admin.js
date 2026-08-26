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
document.getElementById('productAdminProduct')?.addEventListener('change',()=>{closeProductCategoryEdit();filterProductCategories();filterProductRuleCatalog();filterCategoryRuleOptions();});


const productChangeEditor=document.getElementById('productChangeEditor');
document.getElementById('productOpenActiveChangeSet')?.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});

function toggleProductChangeEditor(show=true){if(productChangeEditor) productChangeEditor.classList.toggle('visible',show);}
['productNewChangeSet','productNewChangeSetInline'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);});});
document.querySelectorAll('.product-edit-draft').forEach(el=>el.addEventListener('click',()=>{setProductPage('changes');toggleProductChangeEditor(true);}));
const productCloseChangeSet=document.getElementById('productCloseChangeSet');if(productCloseChangeSet)productCloseChangeSet.addEventListener('click',()=>toggleProductChangeEditor(false));

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
  if(row.dataset.mainCategory==='Camera’s'){row.dataset.rule='Serienummer verplicht|Aankoopbewijs controle';row.dataset.ruleSource='Camera’s';}
  if(row.dataset.mainCategory==='Lenzen & Optiek'){row.dataset.rule='CL233|Maximumbedrag per item';row.dataset.ruleSource='Lenzen & Optiek';}
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
function openProductRuleEditor(row=null){
  editingProductRuleRow=row;
  const title=document.getElementById('productRuleEditorTitle');if(title)title.textContent=row?'Categorieregel bewerken':'Nieuwe categorieregel';
  document.getElementById('productRuleCode').value=row?.dataset.ruleCode||'';
  document.getElementById('productRuleName').value=row?.dataset.ruleName||'';
  document.getElementById('productRuleType').value=row?.dataset.ruleType||'Itemcontrole';
  document.getElementById('productRuleDescription').value=row?.dataset.ruleDescription||'';
  document.getElementById('productRuleStatus').value=row?.dataset.ruleStatus||'Concept';
  document.getElementById('productRuleEditorError')?.classList.remove('visible');
  document.getElementById('productRuleEditor')?.classList.add('visible');
  document.getElementById('productRuleEditor')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
function closeProductRuleEditor(){editingProductRuleRow=null;document.getElementById('productRuleEditor')?.classList.remove('visible');document.getElementById('productRuleEditorError')?.classList.remove('visible');}
document.getElementById('productNewCategoryRule')?.addEventListener('click',()=>openProductRuleEditor());
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
  const editorError=document.getElementById('productRuleEditorError');
  if(!code||!name||!description){if(editorError){editorError.textContent='Vul code, naam en omschrijving in.';editorError.classList.add('visible');}return;}
  const duplicate=[...document.querySelectorAll('.product-rule-row')].find(row=>row!==editingProductRuleRow&&(row.dataset.ruleCode||'').toUpperCase()===code);
  if(duplicate){if(editorError){editorError.textContent='Deze regelcode bestaat al binnen dit product.';editorError.classList.add('visible');}return;}
  let row=editingProductRuleRow;
  if(!row){row=document.createElement('tr');row.className='product-rule-row';document.querySelector('.product-category-rules-table tbody')?.prepend(row);}
  row.dataset.product=document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';row.dataset.ruleName=name;row.dataset.ruleCode=code;row.dataset.ruleType=type;row.dataset.ruleDescription=description;row.dataset.ruleStatus=status;
  const chipClass=status==='Actief'?'green':status==='Concept'?'gray':'amber';
  row.innerHTML='<td><div class="admin-primary">'+productEscape(name)+'</div><div class="admin-secondary">'+productEscape(code)+'</div></td><td>'+productEscape(type)+'</td><td>'+(editingProductRuleRow?productEscape(editingProductRuleRow.children[2]?.textContent||'Nog niet gekoppeld'):'Nog niet gekoppeld')+'</td><td><span class="admin-chip '+chipClass+'">'+productEscape(status)+'</span></td><td><button class="admin-btn text product-edit-rule" type="button">Bewerken</button></td>';
  syncRuleLinkOption(row);const search=document.getElementById('productRuleSearch');const statusFilter=document.getElementById('productRuleStatusFilter');if(search)search.value='';if(statusFilter)statusFilter.value='';filterCategoryRuleOptions();filterProductRuleCatalog();showAdminToast(status==='Actief'?'Regel opgeslagen en direct beschikbaar om te koppelen':'Regel opgeslagen als '+status.toLowerCase());closeProductRuleEditor();
});

function runProductApiTest(){
  const scenario=document.getElementById('productApiScenario')?.value||'application';
  const date=document.getElementById('productApiDate')?.value||'2026-08-26';
  const productName=document.getElementById('productApiProduct')?.value||document.getElementById('productAdminProduct')?.value||'Apparatuurverzekering';
  const engine={application:'application_premium',mutation:'policy_mutation',renewal:'renewal_premium'}[scenario];
  const extra=scenario==='mutation'?{mutation_proration_divisor:365}:scenario==='renewal'?{resolve_on:'new_period_start'}:{acceptance:'automatic_or_manual'};
  const data={product:productName==='Instrumentenverzekering'?'INS-NL':'APP-NL',scenario,peildatum:date,resolved:{subcategory:productName==='Instrumentenverzekering'?'strijkinstrumenten':'cinema_camera',premium_rate:productName==='Instrumentenverzekering'?0.00625:0.0125,deductible:250,category_rules:productName==='Instrumentenverzekering'?['Serienummer optioneel']:['Serienummer verplicht'],policy_costs:5.00,insurance_tax_rate:0.084,...extra},engine,calculation_snapshot:'stored'};
  const pre=document.getElementById('productApiPreview');if(pre)pre.textContent=JSON.stringify(data,null,2);
}
const productApiRun=document.getElementById('productApiRun');if(productApiRun)productApiRun.addEventListener('click',runProductApiTest);

let adminToastTimer;
function showAdminToast(message){const toast=document.getElementById('productAdminToast');if(!toast)return;toast.textContent=message;toast.classList.add('visible');window.clearTimeout(adminToastTimer);adminToastTimer=window.setTimeout(()=>toast.classList.remove('visible'),2600);}
