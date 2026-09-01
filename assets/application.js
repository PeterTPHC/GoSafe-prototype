const API_BASE = new URLSearchParams(location.search).get("api") || "https://gosafe.zeeroverhenk.nl";

const state = {
  products: [],
  productId: "",
  config: null,
  items: [],
  editingId: null,
  calculation: null,
  validation: null,
};

const rentalIn = document.getElementById("rentalIn");
const rentalOut = document.getElementById("rentalOut");
const rentalLimit = document.getElementById("rentalLimit");
const mainCategory = document.getElementById("mainCategory");
const subCategory = document.getElementById("subCategory");
const productSelect = document.getElementById("productSelect");
const apiBanner = document.getElementById("apiBanner");

function euro(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "€ 0,00";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(number);
}

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function asOfDate() {
  return document.getElementById("startDate")?.value || todayIso();
}

function noun() {
  const key = state.config?.productKey || "";
  return key === "instrumenten" ? "instrumenten" : "apparatuur";
}

function showBanner(message, isError) {
  if (!apiBanner) return;
  if (!message) {
    apiBanner.hidden = true;
    apiBanner.textContent = "";
    return;
  }
  apiBanner.hidden = false;
  apiBanner.classList.toggle("error", !!isError);
  apiBanner.textContent = message;
}

async function api(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error || response.statusText || "API-fout";
    throw new Error(typeof message === "string" ? message : "API-fout");
  }
  return body;
}

function mains() {
  return (state.config?.categories || []).filter((category) => category.level === "main_category");
}

function subsOf(mainId) {
  return (state.config?.categories || []).filter(
    (category) => category.level === "subcategory" && category.parentId === mainId,
  );
}

function categoryById(id) {
  return (state.config?.categories || []).find((category) => category.id === id);
}

function serialRequired(subId) {
  const category = categoryById(subId);
  return Boolean(category?.rules?.some((rule) => rule.ruleTypeKey === "serial_number_required"));
}

function parseAmount(raw) {
  const text = String(raw || "").trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (!text) return undefined;
  const value = Number(text);
  return Number.isFinite(value) ? value : undefined;
}

function itemTitle(item) {
  const model = [item.brand, item.model].filter(Boolean).join(" ");
  return [item.internalName, model].filter(Boolean).join(" · ") || "Item";
}

function itemMeta(item) {
  const main = categoryById(item.mainCategoryId);
  const sub = categoryById(item.subcategoryId);
  return [main?.name, sub?.name].filter(Boolean).join(" / ");
}

function calcItem(lineId) {
  return state.calculation?.items?.find((row) => row.lineId === lineId);
}

function applicationPayload() {
  return {
    product_id: state.productId,
    as_of_date: asOfDate(),
    market: "NL",
    country: (document.getElementById("country")?.value || "NL").toUpperCase(),
    inhire_enabled: Boolean(rentalIn?.checked),
    inhire_amount_eur: rentalIn?.checked ? Number(rentalLimit?.value || 0) : undefined,
    rental_enabled: Boolean(rentalOut?.checked),
    items: state.items.map((item) => ({
      line_id: item.lineId,
      main_category_id: item.mainCategoryId,
      subcategory_id: item.subcategoryId,
      insured_amount_eur: item.insuredAmountEur,
      serial_number: item.serialNumber || undefined,
    })),
  };
}

function fillMains(selected) {
  if (!mainCategory) return;
  const options = mains();
  mainCategory.innerHTML =
    '<option value="">Kies een hoofdcategorie</option>' +
    options.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");
  if (selected) mainCategory.value = selected;
}

function fillSubs(mainId, selected) {
  if (!subCategory) return;
  const options = mainId ? subsOf(mainId) : [];
  subCategory.innerHTML = options.length
    ? '<option value="">Kies een subcategorie</option>' +
      options.map((category) => `<option value="${category.id}">${category.name}</option>`).join("")
    : '<option value="">Kies eerst een hoofdcategorie</option>';
  subCategory.disabled = !options.length;
  if (selected) subCategory.value = selected;
}

function fillInhireTiers() {
  if (!rentalLimit) return;
  const tiers = [...(state.config?.addons?.inhireTiers || [])].sort(
    (a, b) => a.maxInsuredAmountEur - b.maxInsuredAmountEur,
  );
  if (!tiers.length) return;
  const previous = rentalLimit.value;
  rentalLimit.innerHTML = tiers
    .map(
      (tier) =>
        `<option value="${tier.maxInsuredAmountEur}" data-premium="${tier.annualPremiumEur}">${euro(tier.maxInsuredAmountEur)} · + ${euro(tier.annualPremiumEur)} per jaar</option>`,
    )
    .join("");
  rentalLimit.value = tiers.some((tier) => String(tier.maxInsuredAmountEur) === previous)
    ? previous
    : String(tiers[Math.min(1, tiers.length - 1)].maxInsuredAmountEur);
}

function updateCopy() {
  const word = noun();
  const heading = word === "instrumenten" ? "Jouw instrumenten" : "Jouw apparatuur";
  const overview = document.getElementById("overviewHeading");
  const empty = document.getElementById("emptyHeading");
  const intro = document.getElementById("overviewIntro");
  if (overview) overview.textContent = heading;
  if (empty) empty.textContent = heading;
  if (intro) {
    intro.textContent = `Voeg de ${word} toe die je wilt verzekeren. Je ziet per item direct de jaarpremie.`;
  }
}

function renderItems() {
  const list = document.getElementById("applicationItemsList");
  if (!list) return;
  if (!state.items.length) {
    list.innerHTML = "";
    return;
  }
  list.innerHTML = state.items
    .map((item) => {
      const calc = calcItem(item.lineId);
      const complete = calc ? calc.complete : item.insuredAmountEur != null && item.subcategoryId;
      const amount = complete ? euro(calc?.insuredAmountEur ?? item.insuredAmountEur) : "Nog invullen";
      const premium = calc?.annualPremiumEur != null ? euro(calc.annualPremiumEur) : "Nog niet berekend";
      const proof = item.receipt ? "Aankoopbewijs gekoppeld" : "Geen aankoopbewijs gekoppeld";
      return `<div class="item-row${complete ? "" : " incomplete-row"}">
        <div>
          <div class="item-title">${itemTitle(item)}</div>
          <div class="item-meta">${itemMeta(item)}</div>
          ${complete ? `<div class="item-proof">${proof}</div>` : '<div class="status-chip">Item niet compleet</div>'}
        </div>
        <div>
          <div class="item-meta">Verzekerd bedrag</div>
          <div class="money">${amount}</div>
        </div>
        <div>
          <div class="item-meta">Jaarpremie</div>
          <div class="money">${premium}</div>
        </div>
        <div class="actions">
          <button class="icon-btn" type="button" title="Bewerken" data-edit-item="${item.lineId}">✎</button>
          <button class="icon-btn" type="button" title="Verwijderen" data-delete-item="${item.lineId}">×</button>
        </div>
      </div>`;
    })
    .join("");
  list.querySelectorAll("[data-edit-item]").forEach((button) => {
    button.addEventListener("click", () => openItemForm(button.dataset.editItem));
  });
  list.querySelectorAll("[data-delete-item]").forEach((button) => {
    button.addEventListener("click", () => {
      state.items = state.items.filter((item) => item.lineId !== button.dataset.deleteItem);
      refresh().then(showApplicationHome);
    });
  });
}

function renderCloseItems() {
  const list = document.getElementById("closeItemsList");
  if (!list) return;
  list.innerHTML = state.items
    .map((item) => {
      const calc = calcItem(item.lineId);
      const sub = categoryById(item.subcategoryId);
      const main = categoryById(item.mainCategoryId);
      return `<div class="summary-item">
        <div class="summary-item-name"><strong>${itemTitle(item)}</strong><small>${[main?.name, sub?.name].filter(Boolean).join(" · ")}</small></div>
        <div><div class="summary-mini-label">Verzekerd</div><div class="summary-mini-value">${calc?.insuredAmountEur != null ? euro(calc.insuredAmountEur) : "—"}</div></div>
        <div><div class="summary-mini-label">Eigen risico</div><div class="summary-mini-value">${calc?.deductibleEur != null ? euro(calc.deductibleEur) : "—"}</div></div>
        <div><div class="summary-mini-label">Premie p/j</div><div class="summary-mini-value">${calc?.annualPremiumEur != null ? euro(calc.annualPremiumEur) : "—"}</div></div>
      </div>`;
    })
    .join("");
}

function taxPercent() {
  const rate = state.config?.settings?.insuranceTaxRate;
  return rate != null ? `${(rate * 100).toFixed(1).replace(".", ",")}%` : "";
}

function rentalPercent() {
  const rate = state.config?.addons?.rentalSurchargeRate;
  return rate != null ? ` · ${(rate * 100).toFixed(0)}%` : "";
}

function renderPremium() {
  const calc = state.calculation;
  const own = calc?.ownItemsPremiumEur ?? "0.00";
  const inhire = calc?.inhirePremiumEur ?? "0.00";
  const rental = calc?.rentalSurchargeEur ?? "0.00";
  const policy =
    calc?.policyCostsEur ??
    (state.config?.settings?.policyCostsCents != null
      ? (state.config.settings.policyCostsCents / 100).toFixed(2)
      : "0.00");
  const tax = calc?.insuranceTaxEur ?? "0.00";
  const total = calc?.totalPayableEur ?? "0.00";
  const inhireOn = Boolean(rentalIn?.checked);
  const rentalOn = Boolean(rentalOut?.checked);

  document.getElementById("rentalInAmount")?.classList.toggle("visible", inhireOn);
  const inhuurRow = document.getElementById("inhuurRow");
  const verhuurRow = document.getElementById("verhuurRow");
  if (inhuurRow) inhuurRow.style.display = inhireOn ? "flex" : "none";
  if (verhuurRow) verhuurRow.style.display = rentalOn ? "flex" : "none";
  const verhuurLabel = document.getElementById("verhuurLabel");
  if (verhuurLabel) verhuurLabel.textContent = `Verhuur${rentalPercent()}`;
  const taxLabel = document.getElementById("taxLabel");
  if (taxLabel) taxLabel.textContent = `Assurantiebelasting${taxPercent() ? ` · ${taxPercent()}` : ""}`;
  const closeTaxLabel = document.getElementById("closeTaxLabel");
  if (closeTaxLabel) closeTaxLabel.textContent = taxLabel?.textContent || "Assurantiebelasting";
  const closeVerhuurLabel = document.getElementById("closeVerhuurLabel");
  if (closeVerhuurLabel) closeVerhuurLabel.textContent = `Verhuur${rentalPercent()}`;

  const ownEl = document.getElementById("ownItemsPremium");
  if (ownEl) ownEl.textContent = euro(own);
  const itemsTotal = document.getElementById("itemsTotal");
  if (itemsTotal) itemsTotal.textContent = `${euro(own)} per jaar`;
  const inhuurPremium = document.getElementById("inhuurPremium");
  if (inhuurPremium) inhuurPremium.textContent = "+ " + euro(inhire);
  const verhuurPremium = document.getElementById("verhuurPremium");
  if (verhuurPremium) verhuurPremium.textContent = "+ " + euro(rental);
  const policyCosts = document.getElementById("policyCosts");
  if (policyCosts) policyCosts.textContent = euro(policy);
  const taxPremium = document.getElementById("taxPremium");
  if (taxPremium) taxPremium.textContent = euro(tax);
  const totalPremium = document.getElementById("totalPremium");
  if (totalPremium) totalPremium.textContent = euro(total);

  const closeInhuurRow = document.getElementById("closeInhuurRow");
  const closeVerhuurRow = document.getElementById("closeVerhuurRow");
  if (closeInhuurRow) closeInhuurRow.style.display = inhireOn ? "flex" : "none";
  if (closeVerhuurRow) closeVerhuurRow.style.display = rentalOn ? "flex" : "none";
  const closeInhuurPremium = document.getElementById("closeInhuurPremium");
  if (closeInhuurPremium) closeInhuurPremium.textContent = euro(inhire);
  const closeVerhuurPremium = document.getElementById("closeVerhuurPremium");
  if (closeVerhuurPremium) closeVerhuurPremium.textContent = euro(rental);
  const closeOwnPremium = document.getElementById("closeOwnPremium");
  if (closeOwnPremium) closeOwnPremium.textContent = euro(own);
  const closePolicyCosts = document.getElementById("closePolicyCosts");
  if (closePolicyCosts) closePolicyCosts.textContent = euro(policy);
  const closeTax = document.getElementById("closeTax");
  if (closeTax) closeTax.textContent = euro(tax);
  const closeTotal = document.getElementById("closeTotal");
  if (closeTotal) closeTotal.textContent = `${euro(total)} per jaar`;

  const summary = document.getElementById("closeCoverageSummary");
  if (summary) {
    const lines = [];
    if (inhireOn) {
      lines.push(
        `<div class="summary-addon-line"><span>Ingehuurde apparatuur · verzekerd tot ${euro(Number(rentalLimit?.value || 0))}</span><strong>+ ${euro(inhire)} p/j</strong></div>`,
      );
    }
    if (rentalOn) {
      lines.push(
        `<div class="summary-addon-line"><span>Verhuur van eigen apparatuur</span><strong>+ ${euro(rental)} p/j</strong></div>`,
      );
    }
    summary.innerHTML = lines.length
      ? lines.join("")
      : '<div class="summary-addon-line"><span>Geen aanvullende dekkingen gekozen</span><strong>—</strong></div>';
  }

  const completeCount = (state.calculation?.items || []).filter((item) => item.complete).length;
  const canClose = completeCount > 0 && Boolean(state.validation?.ok);
  const status = document.getElementById("cartStatus");
  const closeButton = document.getElementById("closeButton");
  if (closeButton) closeButton.disabled = !canClose;
  if (status) {
    if (!state.items.length) {
      status.innerHTML = "<strong>Voeg minstens één compleet item toe.</strong>";
    } else if (!canClose) {
      const messages = (state.validation?.violations || []).map((row) => row.message);
      if (state.calculation?.warnings?.length) messages.push(...state.calculation.warnings);
      status.innerHTML =
        "<strong>Je kunt nog niet sluiten.</strong><br/>" +
        (messages.length ? messages.join("<br/>") : "Vul ontbrekende itemgegevens aan of verwijder incomplete items.");
    } else {
      status.innerHTML = `<strong>Je kunt verder.</strong><br/>Jaarpremie ${euro(total)} volgens de Product API.`;
    }
  }
}

function showApplicationHome() {
  window.setScreen(state.items.length ? "overview" : "empty");
}

function resetItemForm() {
  state.editingId = null;
  document.getElementById("itemFormTitle").textContent = "Item toevoegen";
  document.getElementById("itemFormIntro").textContent = "Vul de gegevens in van één apparaat dat je wilt verzekeren.";
  fillMains("");
  fillSubs("", "");
  ["brand", "model", "serial", "insuredAmount", "internalName"].forEach((id) => {
    const field = document.getElementById(id);
    if (field) field.value = "";
  });
  const receipt = document.getElementById("receiptSelected");
  if (receipt) receipt.textContent = "Selecteer een aankoopbewijs";
  const error = document.getElementById("itemFormError");
  error?.classList.remove("visible");
  if (error) error.textContent = "";
}

function openItemForm(lineId) {
  resetItemForm();
  if (lineId) {
    const item = state.items.find((row) => row.lineId === lineId);
    if (item) {
      state.editingId = lineId;
      document.getElementById("itemFormTitle").textContent = "Item wijzigen";
      document.getElementById("itemFormIntro").textContent = "Pas de gegevens van dit item aan.";
      fillMains(item.mainCategoryId);
      fillSubs(item.mainCategoryId, item.subcategoryId);
      document.getElementById("brand").value = item.brand || "";
      document.getElementById("model").value = item.model || "";
      document.getElementById("serial").value = item.serialNumber || "";
      document.getElementById("insuredAmount").value =
        item.insuredAmountEur != null ? String(item.insuredAmountEur).replace(".", ",") : "";
      document.getElementById("internalName").value = item.internalName || "";
      document.getElementById("receiptSelected").textContent = item.receipt || "Selecteer een aankoopbewijs";
    }
  }
  window.setScreen("item");
}

function collectItemForm() {
  const error = document.getElementById("itemFormError");
  const show = (message) => {
    if (error) {
      error.textContent = message;
      error.classList.add("visible");
    }
    return null;
  };
  error?.classList.remove("visible");
  const mainId = mainCategory?.value || "";
  const subId = subCategory?.value || "";
  const brand = document.getElementById("brand")?.value.trim() || "";
  const model = document.getElementById("model")?.value.trim() || "";
  const amount = parseAmount(document.getElementById("insuredAmount")?.value);
  const serial = document.getElementById("serial")?.value.trim() || "";
  if (!mainId || !subId) return show("Kies een hoofd- en subcategorie.");
  if (!brand || !model) return show("Vul merk en type/model in.");
  if (amount == null || amount < 0) return show("Vul een geldig verzekerd bedrag in.");
  if (serialRequired(subId) && !serial) return show("Serienummer is verplicht voor deze categorie.");
  const receiptText = document.getElementById("receiptSelected")?.textContent || "";
  return {
    lineId: state.editingId || crypto.randomUUID(),
    mainCategoryId: mainId,
    subcategoryId: subId,
    brand,
    model,
    serialNumber: serial,
    insuredAmountEur: amount,
    internalName: document.getElementById("internalName")?.value.trim() || "",
    receipt: receiptText === "Selecteer een aankoopbewijs" ? "" : receiptText,
  };
}

async function saveItem(andAnother) {
  const item = collectItemForm();
  if (!item) return;
  const index = state.items.findIndex((row) => row.lineId === item.lineId);
  if (index >= 0) state.items[index] = item;
  else state.items.push(item);
  await refresh();
  if (andAnother) {
    resetItemForm();
    window.setScreen("item");
    return;
  }
  showApplicationHome();
}

async function resolveConfig() {
  if (!state.productId) return;
  const body = await api("/product/config/resolve", {
    method: "POST",
    body: JSON.stringify({ product_id: state.productId, as_of_date: asOfDate(), market: "NL" }),
  });
  state.config = body.config;
  fillInhireTiers();
  fillMains(mainCategory?.value || "");
  if (mainCategory?.value) fillSubs(mainCategory.value, subCategory?.value || "");
  updateCopy();
}

async function refresh() {
  renderItems();
  renderCloseItems();
  if (!state.productId || !state.config) {
    renderPremium();
    return;
  }
  if (!state.items.length) {
    state.calculation = null;
    state.validation = { ok: false, violations: [] };
    renderPremium();
    return;
  }
  const payload = applicationPayload();
  const [calculation, validation] = await Promise.all([
    api("/product/calculate/application", { method: "POST", body: JSON.stringify(payload) }),
    api("/product/validate", { method: "POST", body: JSON.stringify(payload) }),
  ]);
  state.calculation = calculation;
  state.validation = validation;
  renderItems();
  renderCloseItems();
  renderPremium();
}

async function loadProducts() {
  const body = await api("/products");
  state.products = body.products || [];
  if (!productSelect) return;
  productSelect.innerHTML = state.products
    .map((product) => `<option value="${product.product_id}">${product.name}</option>`)
    .join("");
  const preferred =
    state.products.find((product) => product.product_key === "apparatuur") || state.products[0];
  state.productId = preferred?.product_id || "";
  if (state.productId) productSelect.value = state.productId;
}

async function boot() {
  try {
    showBanner("Catalogus laden vanaf de Product API…", false);
    await loadProducts();
    await resolveConfig();
    await refresh();
    showBanner("");
  } catch (error) {
    showBanner(
      `De Product API is niet bereikbaar (${error.message}). Controleer ${API_BASE}.`,
      true,
    );
  }
}

const originalSetScreen = window.setScreen;
window.setScreen = function (name) {
  if (name === "overview" && !state.items.length) name = "empty";
  originalSetScreen(name);
  if (name === "overview" || name === "close") {
    refresh().catch((error) => showBanner(error.message, true));
  }
};

document.getElementById("goAdd")?.addEventListener("click", () => openItemForm());
document.getElementById("goAddEmpty")?.addEventListener("click", () => openItemForm());
document.getElementById("cancelItem")?.addEventListener("click", () => showApplicationHome());
document.getElementById("saveOverview")?.addEventListener("click", () => saveItem(false));
document.getElementById("saveAnother")?.addEventListener("click", () => saveItem(true));
mainCategory?.addEventListener("change", () => fillSubs(mainCategory.value, ""));
productSelect?.addEventListener("change", async () => {
  state.productId = productSelect.value;
  state.items = [];
  try {
    await resolveConfig();
    await refresh();
    showApplicationHome();
  } catch (error) {
    showBanner(error.message, true);
  }
});
rentalIn?.addEventListener("change", () => refresh().catch((error) => showBanner(error.message, true)));
rentalOut?.addEventListener("change", () => refresh().catch((error) => showBanner(error.message, true)));
rentalLimit?.addEventListener("change", () => refresh().catch((error) => showBanner(error.message, true)));
document.getElementById("startDate")?.addEventListener("change", async () => {
  try {
    await resolveConfig();
    await refresh();
  } catch (error) {
    showBanner(error.message, true);
  }
});
document.getElementById("closeButton")?.addEventListener("click", () => {
  if (document.getElementById("closeButton")?.disabled) return;
  window.setScreen("customer");
});
document.getElementById("uploadReceipt")?.addEventListener("click", () => {
  document.getElementById("receiptFile")?.click();
});
document.getElementById("receiptFile")?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  document.getElementById("receiptSelected").textContent = file.name;
});

window.GoSafeApp = { refresh, state };

boot();
