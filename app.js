
// Vanilla JS SPA: search, filters, sorting, restaurant list, menu, cart, checkout, order success, theme toggle

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = { cart: [], coupon: null, theme: localStorage.getItem('theme') || 'dark' };
const CART_KEY = 'preety_cart_v1';

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); }
function loadCart(){ try{ state.cart = JSON.parse(localStorage.getItem(CART_KEY))||[] }catch{ state.cart=[] } }

function formatINR(n){ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n); }
function toast(msg){ const host=$('#toastHost'); const el=document.createElement('div'); el.className='toast'; el.textContent=msg; host.appendChild(el); setTimeout(()=>{ el.remove(); }, 2800); }

function setTheme(theme){ state.theme = theme; document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); $('#themeToggle').innerHTML = theme==='dark' ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>'; }

function restaurantsByQuery({text='', cuisine=null, veg=null, sort='relevance'}){
  let list = restaurants.slice();
  if(text){ const q = text.toLowerCase(); list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisines.some(c => c.toLowerCase().includes(q))); }
  if(cuisine){ list = list.filter(r => r.cuisines.includes(cuisine)); }
  if(veg!==null){ list = list.filter(r => r.veg===veg); }
  switch(sort){
    case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
    case 'fast': list.sort((a,b)=>a.deliveryTime-b.deliveryTime); break;
    case 'costLow': list.sort((a,b)=>a.costForTwo-b.costForTwo); break;
    case 'costHigh': list.sort((a,b)=>b.costForTwo-a.costForTwo); break;
    default: list.sort((a,b)=> (b.promoted?1:0)-(a.promoted?1:0));
  }
  return list;
}

function getRestaurant(id){ return restaurants.find(r=>r.id===id); }
function getMenu(id){ return menus[id]||[]; }

function cartCount(){ return state.cart.reduce((s,i)=>s+i.qty,0); }
function cartSubtotal(){ return state.cart.reduce((s,i)=>s + i.price * i.qty, 0); }
function cartDeliveryFee(){ return cartSubtotal() >= 499 ? 0 : 39; }
function cartTax(){ return Math.round(cartSubtotal() * 0.05); }
function cartDiscount(){ return state.coupon==='PREETY50' ? Math.min(150, Math.round(cartSubtotal()*0.5)) : 0; }
function cartTotal(){ return cartSubtotal() + cartDeliveryFee() + cartTax() - cartDiscount(); }

function addToCart(item, restaurant){
  const key = `${restaurant.id}_${item.id}`;
  const existing = state.cart.find(i=>i.key===key);
  if(existing){ existing.qty += 1; }
  else{ state.cart.push({key, name:item.name, price:item.price, qty:1, veg:item.veg, restaurantId:restaurant.id}); }
  saveCart(); updateCartBadge(); toast('Added to cart'); renderCartDrawer();
}
function removeFromCart(key){ state.cart = state.cart.filter(i=>i.key!==key); saveCart(); updateCartBadge(); renderCartDrawer(); }
function changeQty(key, delta){ const i = state.cart.find(i=>i.key===key); if(!i) return; i.qty = Math.max(1, i.qty + delta); saveCart(); updateCartBadge(); renderCartDrawer(); }
function clearCart(){ state.cart = []; state.coupon=null; saveCart(); updateCartBadge(); renderCartDrawer(); }

function updateCartBadge(){ $('#cartCount').textContent = cartCount(); }

// Views
function renderHome(){
  const view = $('#view');
  view.innerHTML = `
    <section class="hero">
      <h1>Cravings, delivered \\ preetty fast</h1>
      <p>Discover top-rated restaurants near you. Filter by cuisine, sort by rating, and add dishes to your cart.</p>
      <div class="chips" id="cuisineChips"></div>
    </section>
    <section class="controls">
      <div class="left">
        <button class="chip active" data-sort="relevance">Top Picks</button>
        <button class="chip" data-sort="rating">\u2605 Rating</button>
        <button class="chip" data-sort="fast">⚡ Fast Delivery</button>
        <button class="chip" data-sort="costLow">₹ Low to High</button>
        <button class="chip" data-sort="costHigh">₹ High to Low</button>
      </div>
      <div class="right">
        <select class="select" id="vegSelect">
          <option value="all">All</option>
          <option value="veg">Veg Only</option>
          <option value="nonveg">Non-Veg</option>
        </select>
      </div>
    </section>
    <section id="restaurantGrid" class="grid"></section>
  `;

  // Popular cuisines in footer
  const pc = $('#popularCuisines'); pc.innerHTML = cuisines.map(c=>`<li><span class="chip">${c}</span></li>`).join('');

  // Cuisine chips
  const chips = $('#cuisineChips'); chips.innerHTML = cuisines.map(c=>`<button class="chip" data-cuisine="${c}">${c}</button>`).join('');

  // Search bar render
  renderGlobalSearch();

  let filter = { text: '', cuisine: null, veg: null, sort: 'relevance' };
  function refresh(){ const list = restaurantsByQuery(filter); renderRestaurantGrid(list); }
  refresh();

  // Listeners
  $$('#cuisineChips .chip').forEach(ch => ch.addEventListener('click', () => {
    const c = ch.dataset.cuisine;
    if(filter.cuisine === c){ filter.cuisine = null; ch.classList.remove('active'); }
    else{ filter.cuisine = c; $$('#cuisineChips .chip').forEach(x=>x.classList.remove('active')); ch.classList.add('active'); }
    refresh();
  }));
  $$('.controls .chip').forEach(ch => ch.addEventListener('click', () => {
    filter.sort = ch.dataset.sort; $$('.controls .chip').forEach(x=>x.classList.remove('active')); ch.classList.add('active'); refresh();
  }));
  $('#vegSelect').addEventListener('change', (e) => {
    const v = e.target.value;
    filter.veg = v==='all' ? null : (v==='veg');
    refresh();
  });
}

function renderRestaurantGrid(list){
  const grid = $('#restaurantGrid');
  grid.innerHTML = list.map(r=>`<article class="card">
    <div class="card-media">
      <img src="${r.imageUrl}" alt="${r.name}" loading="lazy" />
      <div class="media-badges">
        ${r.promoted ? '<span class="badge">Promoted</span>' : ''}
        <span class="badge soft">${r.deliveryTime} min</span>
      </div>
    </div>
    <div class="card-body">
      <div class="card-title">
        <h3>${r.name}</h3>
        <span class="badge icon"><i class="ri-star-fill" style="color:#ffd166"></i> ${r.rating}</span>
      </div>
      <div class="meta">
        <span>${r.cuisines.join(', ')}</span>
        <span class="dot"></span>
        <span>${formatINR(r.costForTwo)} for two</span>
      </div>
      <div class="tags">
        ${r.veg?'<span class="tag veg">Veg Only</span>':'<span class="tag nonveg">Non-Veg options</span>'}
        <span class="tag">\u26A1 Fast</span>
      </div>
      <div style="margin-top:10px; display:flex; justify-content:flex-end">
        <a class="btn primary" href="#/restaurant/${r.id}">View Menu</a>
      </div>
    </div>
  </article>`).join('');
}

function renderRestaurantPage(id){
  const r = getRestaurant(id);
  if(!r){ $('#view').innerHTML = '<p>Restaurant not found.</p>'; return; }
  const items = getMenu(id);
  $('#view').innerHTML = `
    <section class="hero">
      <div style="display:flex; align-items:center; justify-content:space-between">
        <div>
          <h1>${r.name}</h1>
          <p>${r.cuisines.join(', ')} • ${r.deliveryTime} min • ${formatINR(r.costForTwo)} for two</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center">
          <span class="badge icon"><i class="ri-star-fill" style="color:#ffd166"></i> ${r.rating}</span>
          ${r.veg?'<span class="badge veg">Veg</span>':'<span class="badge nonveg">Non-Veg</span>'}
        </div>
      </div>
    </section>
    <section class="grid" id="menuGrid"></section>
  `;
  const grid = $('#menuGrid');
  grid.innerHTML = items.map(it=>`<article class="card">
    <div class="card-body">
      <div class="card-title"><h3>${it.name}</h3><span>${formatINR(it.price)}</span></div>
      <p style="color:var(--muted); margin:8px 0">${it.desc}</p>
      <div style="display:flex; justify-content:space-between; align-items:center">
        <span class="tag ${it.veg?'veg':'nonveg'}">${it.veg?'Veg':'Non-Veg'}</span>
        <button class="btn primary" data-add="${it.id}">Add</button>
      </div>
    </div>
  </article>`).join('');
  $$('#menuGrid [data-add]').forEach(btn => btn.addEventListener('click', () => {
    const item = items.find(i=>i.id===btn.dataset.add); addToCart(item, r);
  }));
}

function renderGlobalSearch(){
  const host = $('#globalSearch'); host.innerHTML = `
    <i class="ri-search-2-line" style="color:var(--muted)"></i>
    <input type="text" placeholder="Search restaurants or cuisines" aria-label="Search" />
    <button class="chip" id="clearSearch">Clear</button>
  `;
  const input = $('input', host);
  const clear = $('#clearSearch', host);
  input.addEventListener('input', () => {
    const q = input.value.trim(); const list = restaurantsByQuery({text:q}); renderRestaurantGrid(list);
  });
  clear.addEventListener('click', () => { input.value=''; const list = restaurantsByQuery({text:''}); renderRestaurantGrid(list); });
}

function renderCartDrawer(){
  const drawer = $('#cartDrawer');
  drawer.innerHTML = `
    <div class="cart-header">
      <strong>Your Cart</strong>
      <div style="display:flex; gap:8px">
        <input id="couponInput" class="input" placeholder="Coupon? Try PREETY50" style="width:180px" />
        <button class="btn" id="applyCoupon">Apply</button>
        <button class="btn ghost" id="closeCart"><i class="ri-close-line"></i></button>
      </div>
    </div>
    <div class="cart-items">
      ${state.cart.length===0?'<p style="color:var(--muted)">Your cart is empty.</p>':state.cart.map(i=>`
        <div class="cart-item">
          <div style="flex:1">
            <div style="font-weight:600">${i.name}</div>
            <div style="color:var(--muted)">${formatINR(i.price)} • ${i.veg?'Veg':'Non-Veg'}</div>
          </div>
          <div class="qty">
            <button data-dec="${i.key}">-</button>
            <span>${i.qty}</span>
            <button data-inc="${i.key}">+</button>
          </div>
          <button class="btn ghost" data-remove="${i.key}"><i class="ri-delete-bin-6-line"></i></button>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="row"><span>Subtotal</span><strong>${formatINR(cartSubtotal())}</strong></div>
      <div class="row"><span>Delivery Fee</span><strong>${cartDeliveryFee()===0?'Free':formatINR(cartDeliveryFee())}</strong></div>
      <div class="row"><span>Tax (5%)</span><strong>${formatINR(cartTax())}</strong></div>
      <div class="row"><span>Discount</span><strong>-${formatINR(cartDiscount())}</strong></div>
      <div class="row" style="border-top:1px dashed var(--border); padding-top:8px"><span>Total</span><strong>${formatINR(cartTotal())}</strong></div>
      <button class="checkout-btn" id="goCheckout" ${state.cart.length===0?'disabled':''}>Proceed to Checkout</button>
      <button class="btn" style="margin-top:8px; width:100%" id="clearCart">Clear Cart</button>
    </div>
  `;
  drawer.classList.add('open');
  $('#closeCart').addEventListener('click', ()=> drawer.classList.remove('open'));
  $('#applyCoupon').addEventListener('click', ()=>{ const code=$('#couponInput').value.trim().toUpperCase(); if(code==='PREETY50'){ state.coupon=code; toast('Coupon applied: 50% up to ₹150'); } else { state.coupon=null; toast('Invalid coupon'); } renderCartDrawer(); });
  $('#goCheckout').addEventListener('click', ()=>{ location.hash = '#/checkout'; drawer.classList.remove('open'); });
  $('#clearCart').addEventListener('click', ()=>{ clearCart(); });
  $$('#cartDrawer [data-inc]').forEach(btn=> btn.addEventListener('click',()=> changeQty(btn.dataset.inc, +1)));
  $$('#cartDrawer [data-dec]').forEach(btn=> btn.addEventListener('click',()=> changeQty(btn.dataset.dec, -1)));
  $$('#cartDrawer [data-remove]').forEach(btn=> btn.addEventListener('click',()=> removeFromCart(btn.dataset.remove)));
}

function renderCheckout(){
  const v = $('#view');
  v.innerHTML = `
    <section class="hero">
      <h1>Checkout</h1>
      <p>Securely complete your order.</p>
    </section>
    <div class="card" style="padding:14px">
      <div class="row">
        <div>
          <label class="label">Name</label>
          <input class="input" id="name" placeholder="Your name" />
        </div>
        <div>
          <label class="label">Phone</label>
          <input class="input" id="phone" placeholder="10-digit" />
        </div>
      </div>
      <div>
        <label class="label">Address</label>
        <input class="input" id="address" placeholder="Flat, Street, Area" />
      </div>
      <div class="row">
        <div>
          <label class="label">City</label>
          <input class="input" id="city" placeholder="City" value="Chennai" />
        </div>
        <div>
          <label class="label">Pincode</label>
          <input class="input" id="pin" placeholder="6000xx" />
        </div>
      </div>
      <div class="row">
        <div>
          <label class="label">Payment</label>
          <select class="input" id="pay">
            <option>Cash on Delivery</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>
        <div>
          <label class="label">Instructions</label>
          <input class="input" id="instr" placeholder="E.g., no onions" />
        </div>
      </div>
      <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center">
        <div>
          <div style="color:var(--muted)">Items: ${cartCount()}</div>
          <div style="font-weight:600">Total: ${formatINR(cartTotal())}</div>
        </div>
        <button class="btn primary" id="placeOrder">Place Order</button>
      </div>
    </div>
  `;
  $('#placeOrder').addEventListener('click', ()=>{
    if(state.cart.length===0){ toast('Add items to cart first'); return; }
    const id = 'ORD' + Math.floor(Math.random()*1e6);
    const order = { id, items: state.cart, total: cartTotal(), ts: Date.now(), status: 'PLACED' };
    localStorage.setItem('preety_last_order', JSON.stringify(order));
    clearCart();
    location.hash = `#/order/${id}`;
  });
}

function renderOrderSuccess(id){
  const order = JSON.parse(localStorage.getItem('preety_last_order')||'null');
  $('#view').innerHTML = `
    <section class="hero">
      <h1>Order Confirmed ✨</h1>
      <p>Your order <strong>${id}</strong> is on the way. Track progress below.</p>
    </section>
    <div class="card" style="padding:14px">
      <div style="display:flex; gap:12px; align-items:center; justify-content:space-between">
        <div class="badge icon"><i class="ri-check-line" style="color:var(--success)"></i> Placed</div>
        <div class="badge icon"><i class="ri-restaurant-line"></i> Preparing</div>
        <div class="badge icon"><i class="ri-motorbike-line"></i> Out for delivery</div>
        <div class="badge icon"><i class="ri-home-2-line"></i> Delivered</div>
      </div>
      <p style="color:var(--muted);margin-top:10px">(This is a demo tracker. In production, update via live order status.)</p>
      <div style="margin-top:16px">
        <strong>Total Paid:</strong> ${order?formatINR(order.total):'—'}
      </div>
      <a class="btn" style="margin-top:12px" href="#/">Back to Home</a>
    </div>
  `;
}

// Router
function router(){
  const hash = location.hash || '#/';
  const [_, route, param] = hash.split('/');
  switch(route){
    case '': renderHome(); break;
    case 'restaurant': renderRestaurantPage(param); break;
    case 'checkout': renderCheckout(); break;
    case 'order': renderOrderSuccess(param); break;
    default: renderHome();
  }
}

// Init
(function init(){
  loadCart(); updateCartBadge(); setTheme(state.theme);
  router();
  window.addEventListener('hashchange', router);
  $('#year').textContent = new Date().getFullYear();
  $('#cartOpen').addEventListener('click', renderCartDrawer);
  $('#themeToggle').addEventListener('click', ()=> setTheme(state.theme==='dark'?'light':'dark'));
})();
