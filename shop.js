document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const state = {
    category: params.get('cat') ? [params.get('cat')] : [],
    size: [],
    color: [],
    maxPrice: 90000,
    sort: params.get('sort') || 'featured',
    q: (params.get('q') || '').toLowerCase(),
    page: 1,
  };
  const PER_PAGE = 8;

  const categories = [...new Set(TT.PRODUCTS.map(p=>p.category))];
  const sizes = ['S','M','L','XL'];
  const colorMap = {};
  TT.PRODUCTS.forEach(p => p.colors.forEach(c => { colorMap[c.n] = c.h; }));

  // ---- build filter UI ----
  document.getElementById('filter-category').innerHTML = categories.map(c => {
    const count = TT.PRODUCTS.filter(p=>p.category===c).length;
    return `<label class="check-row"><span><input type="checkbox" data-filter="category" value="${c}" ${state.category.includes(c)?'checked':''}> ${c}</span><span class="count">${count}</span></label>`;
  }).join('');

  document.getElementById('filter-size').innerHTML = sizes.map(s =>
    `<label class="size-chip"><input type="checkbox" data-filter="size" value="${s}">${s}</label>`
  ).join('');

  document.getElementById('filter-color').innerHTML = Object.entries(colorMap).map(([name,hex]) =>
    `<label class="color-chip" style="background:${hex}" title="${name}"><input type="checkbox" data-filter="color" value="${name}"></label>`
  ).join('');

  const sortSelect = document.getElementById('sort-select');
  if(state.sort) sortSelect.value = state.sort;

  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');

  function productCard(p){
    const wished = TT.getWishlist().includes(p.id);
    const swatches = p.colors.slice(0,4).map(c => `<span class="pc-swatch" style="background:${c.h}"></span>`).join('');
    return `
    <div class="product-card" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="pc-media">
        ${p.badge ? `<div class="pc-tags"><span class="pc-tag ${p.badge==='Sale'?'sale':p.badge==='New'?'new':''}">${p.badge}</span></div>` : ''}
        <button class="pc-wish ${wished?'active':''}" aria-label="Save to wishlist" data-wish="${p.id}">${window.TT_ICONS.heart}</button>
        <img class="img-a" src="${p.img1}" alt="${p.name}">
        <img class="img-b" src="${p.img2}" alt="${p.name} alternate view">
        <div class="pc-quickadd"><button data-quickadd="${p.id}">Quick Add</button></div>
      </a>
      <div class="pc-body">
        <span class="pc-cat">${p.category}</span>
        <a href="product.html?id=${p.id}"><h3 class="pc-name">${p.name}</h3></a>
        <div class="pc-rating"><span class="stars">${TT.starString(p.rating)}</span> ${p.rating} (${p.reviews})</div>
        <div class="pc-price-row">
          <span class="pc-price">Rs ${TT.formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="pc-price-old">Rs ${TT.formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        ${swatches ? `<div class="pc-swatches">${swatches}</div>` : ''}
      </div>
    </div>`;
  }

  function applyFilters(){
    let list = TT.PRODUCTS.filter(p => {
      if(state.category.length && !state.category.includes(p.category)) return false;
      if(state.size.length && !p.sizes.some(s => state.size.includes(s))) return false;
      if(state.color.length && !p.colors.some(c => state.color.includes(c.n))) return false;
      if(p.price > state.maxPrice) return false;
      if(state.q && !(p.name.toLowerCase().includes(state.q) || p.category.toLowerCase().includes(state.q))) return false;
      return true;
    });

    switch(state.sort){
      case 'new': list = list.filter(p=>p.badge==='New').concat(list.filter(p=>p.badge!=='New')); break;
      case 'popular': list = [...list].sort((a,b)=> b.reviews - a.reviews); break;
      case 'price-asc': list = [...list].sort((a,b)=> a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a,b)=> b.price - a.price); break;
      case 'sale': list = list.filter(p=>p.oldPrice>0); break;
      default: break;
    }
    return list;
  }

  function render(){
    const list = applyFilters();
    const grid = document.getElementById('shop-grid');
    const noResults = document.getElementById('no-results');
    const resultCount = document.getElementById('result-count');
    const pagination = document.getElementById('pagination');

    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if(state.page > totalPages) state.page = totalPages;
    const start = (state.page-1) * PER_PAGE;
    const pageItems = list.slice(start, start+PER_PAGE);

    if(list.length === 0){
      grid.innerHTML = ''; noResults.style.display = 'block'; pagination.innerHTML = '';
      resultCount.textContent = 'No products found';
      return;
    }
    noResults.style.display = 'none';
    grid.innerHTML = pageItems.map(productCard).join('');
    resultCount.textContent = `Showing ${start+1}–${Math.min(start+PER_PAGE,list.length)} of ${list.length} products`;

    pagination.innerHTML = '';
    if(totalPages > 1){
      for(let i=1;i<=totalPages;i++){
        const btn = document.createElement('button');
        btn.textContent = i;
        if(i === state.page) btn.classList.add('active');
        btn.addEventListener('click', ()=>{ state.page = i; render(); window.scrollTo({top:300,behavior:'smooth'}); });
        pagination.appendChild(btn);
      }
    }
  }

  // ---- events ----
  document.body.addEventListener('change', (e) => {
    const f = e.target.closest('[data-filter]');
    if(f){
      const type = f.dataset.filter, val = f.value;
      if(f.checked) state[type].push(val); else state[type] = state[type].filter(v=>v!==val);
      state.page = 1;
      render();
    }
  });

  priceRange?.addEventListener('input', () => {
    state.maxPrice = Number(priceRange.value);
    priceValue.textContent = state.maxPrice >= 90000 ? 'Up to Rs 90,000' : `Up to Rs ${state.maxPrice}`;
    state.page = 1;
    render();
  });

  sortSelect?.addEventListener('change', () => { state.sort = sortSelect.value; state.page = 1; render(); });

  document.body.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('[data-clear]');
    if(clearBtn){
      const type = clearBtn.dataset.clear;
      state[type] = [];
      document.querySelectorAll(`[data-filter="${type}"]`).forEach(el => el.checked = false);
      state.page = 1; render();
    }
    if(e.target.closest('#reset-all')){
      state.category = []; state.size = []; state.color = []; state.maxPrice = 90000; state.q = '';
      document.querySelectorAll('[data-filter]').forEach(el => el.checked = false);
      priceRange.value = 90000; priceValue.textContent = 'Up to Rs 90,000';
      render();
    }
    const wishBtn = e.target.closest('[data-wish]');
    if(wishBtn){
      e.preventDefault();
      const active = TT.toggleWishlist(wishBtn.dataset.wish);
      wishBtn.classList.toggle('active', active);
    }
    const quickBtn = e.target.closest('[data-quickadd]');
    if(quickBtn){
      e.preventDefault();
      const p = TT.findProduct(quickBtn.dataset.quickadd);
      TT.addToCart(p.id, p.sizes[0] || 'One Size', p.colors[0] ? p.colors[0].n : 'Default', 1);
    }
  });

  // mobile filter drawer
  const panel = document.getElementById('filter-panel');
  const scrim = document.getElementById('filter-scrim');
  document.getElementById('open-filters')?.addEventListener('click', ()=>{ panel.classList.add('open'); scrim.classList.add('open'); document.getElementById('close-filters').style.display='block'; document.getElementById('apply-filters-mobile').style.display='block'; });
  scrim?.addEventListener('click', ()=>{ panel.classList.remove('open'); scrim.classList.remove('open'); });
  document.getElementById('close-filters')?.addEventListener('click', ()=>{ panel.classList.remove('open'); scrim.classList.remove('open'); });
  document.getElementById('apply-filters-mobile')?.addEventListener('click', ()=>{ panel.classList.remove('open'); scrim.classList.remove('open'); });

  render();
});
