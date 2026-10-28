/* Boutique statique : aucune API, aucun serveur ni base de données requis. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const money = (amount) => new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND" }).format(amount);
  const FALLBACK_PRODUCTS = [
    {id:"sac-01",name:"Sac essentiel",category:"Accessoires",price:59.9,description:"Un compagnon élégant pour tous les jours.",image:"images/sac.svg",featured:1},
    {id:"lampe-01",name:"Lampe minimaliste",category:"Maison",price:89.0,description:"Une lumière douce pour votre espace.",image:"images/lampe.svg",featured:1},
    {id:"ecouteurs-01",name:"Écouteurs sans fil",category:"Électronique",price:119.0,description:"Un format compact pour vos déplacements.",image:"images/ecouteurs.svg",featured:1},
    {id:"gourde-01",name:"Gourde réutilisable",category:"Accessoires",price:29.9,description:"Une gourde pratique pour chaque journée.",image:"images/gourde.svg",featured:0},
    {id:"carnet-01",name:"Carnet de notes",category:"Papeterie",price:18.5,description:"Gardez vos idées et vos projets à portée de main.",image:"images/carnet.svg",featured:0},
    {id:"plante-01",name:"Pot décoratif",category:"Maison",price:35.0,description:"Une touche naturelle pour votre intérieur.",image:"images/plante.svg",featured:0},
    {id:"montre-01",name:"Montre classique",category:"Accessoires",price:149.0,description:"Un style discret et intemporel.",image:"images/montre.svg",featured:0},
    {id:"support-01",name:"Support de téléphone",category:"Électronique",price:24.0,description:"Gardez votre téléphone bien installé.",image:"images/support.svg",featured:0}
  ];
  let products = [];
  let cart = loadCart();
  let toastTimeout;

  function loadCart() {
    try { const value = JSON.parse(localStorage.getItem("shop-cart") || "{}"); return value && typeof value === "object" ? value : {}; }
    catch { return {}; }
  }
  function saveCart() { try { localStorage.setItem("shop-cart", JSON.stringify(cart)); } catch { showToast("Le navigateur ne permet pas de sauvegarder le panier."); } }
  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
  function showToast(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
  }
  function getProduct(id) { return products.find(p => p.id === id); }
  function filteredProducts() {
    const query = $("#search-input").value.trim().toLocaleLowerCase("fr");
    const category = $("#category-filter").value;
    const sort = $("#sort-filter").value;
    let list = products.filter(p => (category === "all" || p.category === category) &&
      `${p.name} ${p.category} ${p.description}`.toLocaleLowerCase("fr").includes(query));
    if (sort === "price-asc") list.sort((a,b) => a.price-b.price);
    if (sort === "price-desc") list.sort((a,b) => b.price-a.price);
    if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name, "fr"));
    if (sort === "featured") list.sort((a,b) => (b.featured||0)-(a.featured||0));
    return list;
  }
  function renderProducts() {
    const list = filteredProducts();
    $("#product-count").textContent = `${list.length} produit${list.length>1?"s":""}`;
    $("#empty-state").hidden = list.length !== 0;
    $("#product-grid").innerHTML = list.map(p => `<article class="product-card">
      <img class="product-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='icons/product-placeholder.svg'">
      <div class="product-info"><span class="product-category">${escapeHTML(p.category)}</span>
      <h3>${escapeHTML(p.name)}</h3><p class="product-description">${escapeHTML(p.description)}</p>
      <div class="product-buy"><span class="product-price">${money(p.price)}</span>
      <button class="add-button" type="button" data-add="${escapeHTML(p.id)}" aria-label="Ajouter ${escapeHTML(p.name)} au panier">+</button></div></div></article>`).join("");
  }
  function renderCategories() {
    const select = $("#category-filter");
    const categories = [...new Set(products.map(p => p.category))].sort((a,b)=>a.localeCompare(b,"fr"));
    select.innerHTML = '<option value="all">Toutes les catégories</option>' + categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  }
  function cartEntries() { return Object.entries(cart).map(([id,qty]) => ({product:getProduct(id),qty:Number(qty)})).filter(e=>e.product&&e.qty>0); }
  function cartTotal() { return cartEntries().reduce((sum,e)=>sum+e.product.price*e.qty,0); }
  function renderCart() {
    const entries = cartEntries();
    $("#cart-count").textContent = entries.reduce((sum,e)=>sum+e.qty,0);
    $("#cart-total").textContent = money(cartTotal());
    $("#cart-items").innerHTML = entries.length ? entries.map(({product:p,qty})=>`<div class="cart-row">
      <img src="${escapeHTML(p.image)}" alt="" onerror="this.onerror=null;this.src='icons/product-placeholder.svg'">
      <div><h3>${escapeHTML(p.name)}</h3><p>${money(p.price)} l'unité</p>
      <div class="quantity-controls"><button type="button" data-qty="${escapeHTML(p.id)}" data-delta="-1" aria-label="Retirer une unité">−</button><span>${qty}</span><button type="button" data-qty="${escapeHTML(p.id)}" data-delta="1" aria-label="Ajouter une unité">+</button></div></div>
      <div><strong>${money(p.price*qty)}</strong><button class="remove-button" type="button" data-remove="${escapeHTML(p.id)}">Retirer</button></div></div>`).join("") : '<div class="empty-state"><span>🛒</span><h3>Votre panier est vide</h3><p>Ajoutez un produit pour commencer.</p></div>';
  }
  function addToCart(id) { if (!getProduct(id)) return; cart[id]=(Number(cart[id])||0)+1; saveCart(); renderCart(); showToast("Produit ajouté au panier."); }
  function changeQty(id, delta) { cart[id]=(Number(cart[id])||0)+delta; if(cart[id]<=0) delete cart[id]; saveCart(); renderCart(); }
  function openCart() { $("#cart-overlay").hidden=false; document.body.style.overflow="hidden"; $("#close-cart").focus(); }
  function closeCart() { $("#cart-overlay").hidden=true; document.body.style.overflow=""; $("#cart-button").focus(); }
  function makeSummary() {
    const entries=cartEntries();
    if(!entries.length){showToast("Votre panier est vide.");return;}
    $("#order-summary").value = ["RÉCAPITULATIF DE COMMANDE — Ma Boutique","",...entries.map(({product:p,qty})=>`${p.name} × ${qty} — ${money(p.price*qty)}`),"",`TOTAL ESTIMÉ : ${money(cartTotal())}`,"","Nom du client : __________________","Téléphone : __________________","Adresse / livraison : __________________","", "Commande à confirmer avec le vendeur. Aucun paiement n'a été effectué."].join("\n");
    $("#order-overlay").hidden=false; document.body.style.overflow="hidden"; $("#close-order").focus();
  }
  function closeOrder(){ $("#order-overlay").hidden=true; document.body.style.overflow=""; }
  async function copySummary() {
    const area=$("#order-summary");
    try { await navigator.clipboard.writeText(area.value); $("#copy-status").textContent="Récapitulatif copié."; }
    catch { area.select(); const ok=document.execCommand("copy"); $("#copy-status").textContent=ok?"Récapitulatif copié. Sélectionnez et copiez le texte si nécessaire.":"Sélectionnez le texte pour le copier."; }
  }
  async function init() {
    $("#year").textContent=new Date().getFullYear();
    try {
      const response=await fetch("products.json");
      if(!response.ok) throw new Error("catalogue indisponible");
      const data=await response.json();
      if(!Array.isArray(data)||!data.length) throw new Error("catalogue vide");
      products=data.filter(p=>p&&p.id&&p.name&&Number.isFinite(Number(p.price))).map(p=>({...p,price:Number(p.price)}));
      if(!products.length) throw new Error("aucun produit valide");
    } catch { products=FALLBACK_PRODUCTS; }
    renderCategories(); renderProducts(); renderCart();
    if ("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")) {
      navigator.serviceWorker.register("sw.js").catch(()=>{});
    }
  }
  $("#search-input").addEventListener("input",renderProducts);
  $("#category-filter").addEventListener("change",renderProducts);
  $("#sort-filter").addEventListener("change",renderProducts);
  $("#product-grid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add);});
  $("#cart-items").addEventListener("click",e=>{
    const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
    if(qty)changeQty(qty.dataset.qty,Number(qty.dataset.delta));
    if(remove){delete cart[remove.dataset.remove];saveCart();renderCart();}
  });
  $("#cart-button").addEventListener("click",openCart);
  $("#close-cart").addEventListener("click",closeCart);
  $("#cart-overlay").addEventListener("click",e=>{if(e.target===$("#cart-overlay"))closeCart();});
  $("#clear-cart").addEventListener("click",()=>{cart={};saveCart();renderCart();showToast("Panier vidé.");});
  $("#order-button").addEventListener("click",makeSummary);
  $("#close-order").addEventListener("click",closeOrder);
  $("#order-overlay").addEventListener("click",e=>{if(e.target===$("#order-overlay"))closeOrder();});
  $("#copy-order").addEventListener("click",copySummary);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#order-overlay").hidden)closeOrder();else if(!$("#cart-overlay").hidden)closeCart();}});
  init();
})();
