document.addEventListener('DOMContentLoaded', () => {

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

  function mount(id, list){
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = list.map(productCard).join('');
  }

  const newArrivals = TT.PRODUCTS.filter(p => p.badge === 'New').concat(TT.PRODUCTS.slice(0,2)).slice(0,4);
  const bestSellers = TT.PRODUCTS.filter(p => p.badge === 'Best Seller').concat(TT.PRODUCTS.filter(p=>p.rating>=4.7)).slice(0,4);

  mount('new-arrivals-grid', newArrivals);
  mount('best-sellers-grid', bestSellers);

  document.body.addEventListener('click', (e) => {
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
      const size = p.sizes[0] || 'One Size';
      const color = p.colors[0] ? p.colors[0].n : 'Default';
      TT.addToCart(p.id, size, color, 1);
    }
  });

  // reviews
  const track = document.getElementById('reviews-track');
  if(track){
    track.innerHTML = TT.REVIEWS.slice(0,3).map(r => `
      <div class="review-card">
        <span class="review-stars">${TT.starString(r.stars)}</span>
        <p class="review-quote">"${r.quote}"</p>
        <div class="review-person">
          <img class="review-avatar" src="${r.avatar}" alt="${r.name}">
          <div><div class="review-name">${r.name}</div><div class="review-role">${r.role}</div></div>
        </div>
      </div>`).join('');
  }

  // newsletter
  const nlForm = document.getElementById('newsletter-form');
  nlForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('newsletter-success')?.classList.add('show');
    nlForm.reset();
  });

  // countdown to end of week (Sunday midnight)
  const cdH = document.getElementById('cd-h'), cdM = document.getElementById('cd-m'), cdS = document.getElementById('cd-s');
  if(cdH){
    function tick(){
      const now = new Date();
      const end = new Date();
      end.setDate(now.getDate() + (7 - now.getDay()));
      end.setHours(0,0,0,0);
      let diff = Math.max(0, end - now);
      const h = Math.floor(diff/3600000); diff -= h*3600000;
      const m = Math.floor(diff/60000); diff -= m*60000;
      const s = Math.floor(diff/1000);
      cdH.textContent = String(h).padStart(2,'0');
      cdM.textContent = String(m).padStart(2,'0');
      cdS.textContent = String(s).padStart(2,'0');
    }
    tick(); setInterval(tick, 1000);
  }
});
