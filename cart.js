document.addEventListener('DOMContentLoaded', () => {

  const SHIPPING_THRESHOLD = 42000;
  const SHIPPING_COST = 3500;
  const TAX_RATE = 0.08;

  function renderCart(){
    const cart = TT.getCart();
    const content = document.getElementById('cart-content');

    if(cart.length === 0){
      content.innerHTML = `
        <div class="empty-cart">
          ${window.TT_ICONS.bagEmpty}
          <h3>Your bag is empty</h3>
          <p>Looks like you haven't added anything yet. Let's fix that.</p>
          <a href="shop.html" class="btn">Continue Shopping</a>
        </div>`;
      return;
    }

    const subtotal = TT.cartTotal();
    const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    content.innerHTML = `
      <div class="cart-layout">
        <div>
          ${cart.map(item => {
            const p = TT.findProduct(item.id);
            if(!p) return '';
            return `
            <div class="cart-item-row" data-key="${item.key}">
              <div class="cart-item">
                <a href="product.html?id=${p.id}"><img src="${p.img1}" alt="${p.name}"></a>
                <div class="cart-item-info" style="flex:1;">
                  <a href="product.html?id=${p.id}"><h4>${p.name}</h4></a>
                  <div class="cart-item-meta">Size: ${item.size} &nbsp;·&nbsp; Colour: ${item.color}</div>
                  <div class="cart-item-actions">
                    <div class="qty-row">
                      <button data-qty-minus="${item.key}">−</button>
                      <span>${item.qty}</span>
                      <button data-qty-plus="${item.key}">+</button>
                    </div>
                    <button class="remove-btn" data-remove="${item.key}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0l-1 13H8L7 7"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
                <div class="cart-item-price">Rs ${TT.formatPrice(p.price * item.qty)}</div>
              </div>
            </div>`;
          }).join('')}
          <a href="shop.html" class="link-underline" style="font-family:var(--font-nav);font-size:13px;letter-spacing:.06em;text-transform:uppercase;display:inline-block;margin-top:20px;">← Continue Shopping</a>
        </div>

        <div class="summary-card">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Subtotal</span><span>Rs ${TT.formatPrice(subtotal)}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : 'Rs '+TT.formatPrice(shipping)}</span></div>
          <div class="summary-row"><span>Estimated Tax</span><span>Rs ${TT.formatPrice(tax)}</span></div>
          ${subtotal < SHIPPING_THRESHOLD ? `<p style="font-size:12.5px;color:var(--brass);margin:6px 0 0;">Add Rs ${TT.formatPrice(SHIPPING_THRESHOLD-subtotal)} more for free shipping</p>` : ''}
          <div class="promo-row">
            <input type="text" placeholder="Promo code" id="promo-input">
            <button class="btn btn-outline btn-sm" id="promo-apply">Apply</button>
          </div>
          <div class="summary-row total"><span>Total</span><span>Rs ${TT.formatPrice(total)}</span></div>
          <a href="checkout.html" class="btn btn-block" style="margin-top:18px;">Proceed to Checkout</a>
        </div>
      </div>`;

    // wire quantity/remove buttons
    content.querySelectorAll('[data-qty-plus]').forEach(b => b.addEventListener('click', () => {
      const item = cart.find(i=>i.key===b.dataset.qtyPlus);
      TT.updateCartQty(b.dataset.qtyPlus, item.qty+1); renderCart();
    }));
    content.querySelectorAll('[data-qty-minus]').forEach(b => b.addEventListener('click', () => {
      const item = cart.find(i=>i.key===b.dataset.qtyMinus);
      TT.updateCartQty(b.dataset.qtyMinus, item.qty-1); renderCart();
    }));
    content.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      TT.removeFromCart(b.dataset.remove); renderCart();
    }));

    document.getElementById('promo-apply')?.addEventListener('click', () => {
      const val = document.getElementById('promo-input').value.trim();
      TT.showToast(val ? 'Promo code applied' : 'Enter a code first');
    });
  }

  function renderWishlist(){
    const wish = TT.getWishlist();
    const grid = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty');
    if(wish.length === 0){ grid.innerHTML=''; empty.style.display='block'; return; }
    empty.style.display = 'none';
    grid.innerHTML = wish.map(id => {
      const p = TT.findProduct(id);
      if(!p) return '';
      return `<div class="product-card">
        <a href="product.html?id=${p.id}" class="pc-media">
          <button class="pc-wish active" data-wish="${p.id}">${window.TT_ICONS.heart}</button>
          <img class="img-a" src="${p.img1}" alt="${p.name}"><img class="img-b" src="${p.img2}" alt="">
          <div class="pc-quickadd"><button data-quickadd="${p.id}">Quick Add</button></div>
        </a>
        <div class="pc-body">
          <span class="pc-cat">${p.category}</span>
          <a href="product.html?id=${p.id}"><h3 class="pc-name">${p.name}</h3></a>
          <div class="pc-price-row"><span class="pc-price">Rs ${TT.formatPrice(p.price)}</span></div>
        </div></div>`;
    }).join('');
  }

  document.body.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('[data-wish]');
    if(wishBtn){ e.preventDefault(); TT.toggleWishlist(wishBtn.dataset.wish); renderWishlist(); }
    const quickBtn = e.target.closest('[data-quickadd]');
    if(quickBtn){ e.preventDefault(); const p = TT.findProduct(quickBtn.dataset.quickadd); TT.addToCart(p.id, p.sizes[0]||'One Size', p.colors[0]?p.colors[0].n:'Default', 1); renderCart(); }
  });

  renderCart();
  renderWishlist();
});
