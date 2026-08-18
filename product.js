document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || TT.PRODUCTS[0].id;
  const p = TT.findProduct(id) || TT.PRODUCTS[0];

  document.title = `${p.name} — Thread & Trend`;
  document.getElementById('page-title').textContent = `${p.name} — Thread & Trend`;
  document.getElementById('crumb-name').textContent = p.name;

  let selectedSize = p.sizes[0] || null;
  let selectedColor = p.colors[0] ? p.colors[0].n : null;
  let qty = 1;
  let activeImg = 'img1';

  function renderLayout(){
    const wished = TT.getWishlist().includes(p.id);
    document.getElementById('pd-layout').innerHTML = `
      <div class="pd-thumbs">
        <div class="pd-thumb ${activeImg==='img1'?'active':''}" data-img="img1"><img src="${p.img1}" alt="${p.name}"></div>
        <div class="pd-thumb ${activeImg==='img2'?'active':''}" data-img="img2"><img src="${p.img2}" alt="${p.name} alternate"></div>
      </div>
      <div class="pd-main-img"><img src="${p[activeImg]}" alt="${p.name}" id="pd-main-img-tag"></div>
      <div class="pd-info">
        <span class="pc-cat">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="pd-rating-row">
          <span class="review-stars">${TT.starString(p.rating)}</span>
          <span style="font-size:13.5px;color:var(--ink-soft);">${p.rating} · ${p.reviews} reviews</span>
        </div>
        <div class="pd-price-row">
          <span class="pd-price">Rs ${TT.formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="pd-price-old">Rs ${TT.formatPrice(p.oldPrice)}</span><span class="pd-save">Save Rs ${TT.formatPrice(p.oldPrice-p.price)}</span>` : ''}
        </div>
        <p class="pd-desc">${p.desc}</p>

        ${p.colors.length ? `
        <div class="pd-option">
          <div class="pd-option-label">Colour <span class="sel" id="color-sel-label">${selectedColor}</span></div>
          <div class="color-grid" id="pd-colors">
            ${p.colors.map(c => `<label class="color-chip ${c.n===selectedColor?'active':''}" style="background:${c.h}" title="${c.n}"><input type="radio" name="pd-color" value="${c.n}" ${c.n===selectedColor?'checked':''}></label>`).join('')}
          </div>
        </div>` : ''}

        ${p.sizes.length ? `
        <div class="pd-option">
          <div class="pd-option-label">Size <a href="#tab-size" class="link-underline" data-goto-tab="size" style="text-transform:none;font-family:var(--font-body);color:var(--brass);">Size guide</a></div>
          <div class="size-grid" id="pd-sizes">
            ${p.sizes.map(s => `<label class="size-chip ${s===selectedSize?'active':''}"><input type="radio" name="pd-size" value="${s}" ${s===selectedSize?'checked':''}>${s}</label>`).join('')}
          </div>
        </div>` : ''}

        <div class="pd-option">
          <div class="pd-option-label">Quantity</div>
          <div class="qty-row">
            <button id="qty-minus">−</button><span id="qty-val">${qty}</span><button id="qty-plus">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn" id="add-to-cart-btn">Add to Bag — Rs ${TT.formatPrice(p.price*qty)}</button>
          <button class="icon-btn ${wished?'active':''}" id="pd-wish-btn" style="width:56px;height:56px;border:1px solid var(--beige-line);">${window.TT_ICONS.heart}</button>
        </div>

        <div class="pd-meta">
          <div><b>Availability</b><span>In stock, ships in 1–2 days</span></div>
          <div><b>Material</b><span>${p.category==='Accessories' ? 'Full-grain leather / brass' : 'Natural fibre blend — see description'}</span></div>
          <div><b>SKU</b><span>TT-${String(p.id).padStart(4,'0')}</span></div>
        </div>
      </div>
    `;
  }

  function wireLayout(){
    document.querySelectorAll('.pd-thumb').forEach(t => t.addEventListener('click', () => { activeImg = t.dataset.img; renderLayout(); wireLayout(); }));
    document.querySelectorAll('input[name="pd-color"]').forEach(r => r.addEventListener('change', () => { selectedColor = r.value; renderLayout(); wireLayout(); }));
    document.querySelectorAll('input[name="pd-size"]').forEach(r => r.addEventListener('change', () => { selectedSize = r.value; renderLayout(); wireLayout(); }));
    document.getElementById('qty-minus')?.addEventListener('click', () => { qty = Math.max(1, qty-1); renderLayout(); wireLayout(); });
    document.getElementById('qty-plus')?.addEventListener('click', () => { qty = qty+1; renderLayout(); wireLayout(); });
    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      TT.addToCart(p.id, selectedSize || 'One Size', selectedColor || 'Default', qty);
    });
    document.getElementById('pd-wish-btn')?.addEventListener('click', (e) => {
      const active = TT.toggleWishlist(p.id);
      e.currentTarget.classList.toggle('active', active);
    });
    document.querySelector('[data-goto-tab]')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.pd-tab[data-tab="size"]').click();
      document.getElementById('tab-size').scrollIntoView({behavior:'smooth', block:'center'});
    });
  }

  renderLayout();
  wireLayout();

  // tabs
  document.getElementById('tab-desc').innerHTML = `<p>${p.desc}</p><p style="margin-top:16px;">Care: follow the garment label; most pieces in this range prefer a gentle or hand wash cycle and should be dried flat away from direct heat.</p>`;
  document.getElementById('tab-reviews').innerHTML = TT.REVIEWS.slice(0,3).map(r => `
    <div style="padding:20px 0;border-bottom:1px solid var(--beige-line);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong style="font-family:var(--font-nav);font-size:13.5px;">${r.name}</strong>
        <span class="review-stars">${TT.starString(r.stars)}</span>
      </div>
      <p style="color:var(--ink-soft);">"${r.quote}"</p>
    </div>`).join('');

  document.querySelectorAll('.pd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.pd-tab-panel').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
    });
  });

  // related products
  function card(rp){
    const wished = TT.getWishlist().includes(rp.id);
    return `<div class="product-card">
      <a href="product.html?id=${rp.id}" class="pc-media">
        ${rp.badge ? `<div class="pc-tags"><span class="pc-tag ${rp.badge==='Sale'?'sale':rp.badge==='New'?'new':''}">${rp.badge}</span></div>` : ''}
        <button class="pc-wish ${wished?'active':''}" data-wish="${rp.id}">${window.TT_ICONS.heart}</button>
        <img class="img-a" src="${rp.img1}" alt="${rp.name}"><img class="img-b" src="${rp.img2}" alt="">
        <div class="pc-quickadd"><button data-quickadd="${rp.id}">Quick Add</button></div>
      </a>
      <div class="pc-body">
        <span class="pc-cat">${rp.category}</span>
        <a href="product.html?id=${rp.id}"><h3 class="pc-name">${rp.name}</h3></a>
        <div class="pc-rating"><span class="stars">${TT.starString(rp.rating)}</span> ${rp.rating} (${rp.reviews})</div>
        <div class="pc-price-row"><span class="pc-price">Rs ${TT.formatPrice(rp.price)}</span>${rp.oldPrice?`<span class="pc-price-old">Rs ${TT.formatPrice(rp.oldPrice)}</span>`:''}</div>
      </div></div>`;
  }
  const related = TT.PRODUCTS.filter(rp => rp.category === p.category && rp.id !== p.id).slice(0,4);
  document.getElementById('related-grid').innerHTML = (related.length ? related : TT.PRODUCTS.filter(rp=>rp.id!==p.id).slice(0,4)).map(card).join('');

  document.body.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('[data-wish]');
    if(wishBtn){ e.preventDefault(); const active = TT.toggleWishlist(wishBtn.dataset.wish); wishBtn.classList.toggle('active', active); }
    const quickBtn = e.target.closest('[data-quickadd]');
    if(quickBtn){ e.preventDefault(); const rp = TT.findProduct(quickBtn.dataset.quickadd); TT.addToCart(rp.id, rp.sizes[0]||'One Size', rp.colors[0]?rp.colors[0].n:'Default', 1); }
  });
});
