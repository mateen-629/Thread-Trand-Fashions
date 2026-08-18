document.addEventListener('DOMContentLoaded', () => {

  const SHIPPING_THRESHOLD = 42000, SHIPPING_COST = 3500, TAX_RATE = 0.08;
  const body = document.getElementById('checkout-body');
  const steps = document.querySelectorAll('.checkout-step');
  let step = 1;
  let shippingData = {};

  function setStep(n){
    step = n;
    steps.forEach((s,i) => s.classList.toggle('active', i < n));
    render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function summaryHTML(){
    const cart = TT.getCart();
    const subtotal = TT.cartTotal();
    const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    return `
    <div class="summary-card">
      <h3>Order Summary</h3>
      ${cart.map(item => {
        const p = TT.findProduct(item.id); if(!p) return '';
        return `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--beige-line);">
          <img src="${p.img1}" alt="${p.name}" style="width:52px;height:60px;object-fit:cover;border-radius:8px;">
          <div style="flex:1;">
            <div style="font-family:var(--font-display);font-size:14.5px;">${p.name}</div>
            <div style="font-size:12px;color:var(--taupe);">${item.size} · ${item.color} · Qty ${item.qty}</div>
          </div>
          <div style="font-family:var(--font-nav);font-size:13.5px;">Rs ${TT.formatPrice(p.price*item.qty)}</div>
        </div>`;
      }).join('')}
      <div class="summary-row"><span>Subtotal</span><span>Rs ${TT.formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping===0?'Free':'Rs '+TT.formatPrice(shipping)}</span></div>
      <div class="summary-row"><span>Estimated Tax</span><span>Rs ${TT.formatPrice(tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>Rs ${TT.formatPrice(total)}</span></div>
    </div>`;
  }

  function validateField(wrap, test){
    const input = wrap.querySelector('input, select, textarea');
    const ok = test(input.value);
    wrap.classList.toggle('invalid', !ok);
    return ok;
  }

  function renderShipping(){
    body.innerHTML = `
      <div class="cart-layout">
        <div>
          <h3 style="font-size:20px;margin-bottom:20px;">Shipping Address</h3>
          <form id="shipping-form" novalidate>
            <div class="form-grid">
              <div class="field" id="s-first"><label>First Name</label><input name="first" required><span class="error-msg">Required</span></div>
              <div class="field" id="s-last"><label>Last Name</label><input name="last" required><span class="error-msg">Required</span></div>
              <div class="field full" id="s-email"><label>Email</label><input type="email" name="email" required><span class="error-msg">Enter a valid email</span></div>
              <div class="field full" id="s-address"><label>Street Address</label><input name="address" required placeholder="123 Bishop Lane"><span class="error-msg">Required</span></div>
              <div class="field" id="s-city"><label>City</label><input name="city" required><span class="error-msg">Required</span></div>
              <div class="field" id="s-zip"><label>ZIP / Postal Code</label><input name="zip" required><span class="error-msg">Required</span></div>
              <div class="field" id="s-country"><label>Country</label>
                <select name="country" required>
                  <option value="">Select country</option>
                  <option>United States</option><option>Canada</option><option>United Kingdom</option>
                  <option>Australia</option><option>Germany</option><option>India</option>
                </select>
                <span class="error-msg">Required</span>
              </div>
              <div class="field" id="s-phone"><label>Phone</label><input name="phone" required><span class="error-msg">Required</span></div>
            </div>
            <button type="submit" class="btn btn-block">Continue to Payment</button>
          </form>
        </div>
        ${summaryHTML()}
      </div>`;

    document.getElementById('shipping-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const checks = [
        ['s-first', v=>v.trim().length>0], ['s-last', v=>v.trim().length>0],
        ['s-email', v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)], ['s-address', v=>v.trim().length>3],
        ['s-city', v=>v.trim().length>0], ['s-zip', v=>v.trim().length>2],
        ['s-country', v=>v.trim().length>0], ['s-phone', v=>v.trim().length>5],
      ];
      let valid = true;
      const form = new FormData(e.target);
      checks.forEach(([id,test]) => { const ok = validateField(document.getElementById(id), test); if(!ok) valid=false; });
      if(valid){
        shippingData = Object.fromEntries(form.entries());
        setStep(2);
      }
    });
  }

  function renderPayment(){
    body.innerHTML = `
      <div class="cart-layout">
        <div>
          <h3 style="font-size:20px;margin-bottom:20px;">Payment Method</h3>
          <div class="pay-methods">
            <label class="pay-method active"><input type="radio" name="pay" value="card" checked> Credit / Debit Card</label>
            <label class="pay-method"><input type="radio" name="pay" value="paypal"> PayPal</label>
            <label class="pay-method"><input type="radio" name="pay" value="applepay"> Apple Pay</label>
          </div>
          <form id="payment-form" novalidate>
            <div id="card-fields">
              <div class="field full" id="p-name"><label>Name on Card</label><input name="cardname" required><span class="error-msg">Required</span></div>
              <div class="field full" id="p-number"><label>Card Number</label><input name="cardnumber" required maxlength="19" placeholder="1234 5678 9012 3456"><span class="error-msg">Enter a 16-digit card number</span></div>
              <div class="form-grid">
                <div class="field" id="p-exp"><label>Expiry (MM/YY)</label><input name="exp" required placeholder="08/28"><span class="error-msg">Required</span></div>
                <div class="field" id="p-cvc"><label>CVC</label><input name="cvc" required maxlength="4" placeholder="123"><span class="error-msg">Required</span></div>
              </div>
            </div>
            <label class="check-line"><input type="checkbox" checked> Billing address same as shipping</label>
            <div style="display:flex;gap:12px;">
              <button type="button" class="btn btn-outline" id="back-to-shipping">Back</button>
              <button type="submit" class="btn" style="flex:1;">Place Order</button>
            </div>
          </form>
        </div>
        ${summaryHTML()}
      </div>`;

    document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener('change', () => {
      document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
      r.closest('.pay-method').classList.add('active');
      document.getElementById('card-fields').style.display = r.value === 'card' ? 'block' : 'none';
    }));

    document.getElementById('back-to-shipping').addEventListener('click', () => setStep(1));

    document.getElementById('payment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const method = document.querySelector('input[name="pay"]:checked').value;
      if(method !== 'card'){ setStep(3); return; }
      const checks = [
        ['p-name', v=>v.trim().length>0],
        ['p-number', v=>v.replace(/\s/g,'').length>=15],
        ['p-exp', v=>/^\d{2}\/\d{2}$/.test(v.trim())],
        ['p-cvc', v=>v.trim().length>=3],
      ];
      let valid = true;
      checks.forEach(([id,test]) => { const ok = validateField(document.getElementById(id), test); if(!ok) valid=false; });
      if(valid) setStep(3);
    });
  }

  function renderConfirmation(){
    const orderNum = 'TT-' + Math.floor(100000 + Math.random()*900000);
    const total = TT.formatPrice(TT.cartTotal() * (1+TAX_RATE) + (TT.cartTotal() >= SHIPPING_THRESHOLD || TT.cartTotal()===0 ? 0 : SHIPPING_COST));
    body.innerHTML = `
      <div style="max-width:560px;margin:0 auto;text-align:center;padding:40px 0;">
        <div style="width:74px;height:74px;border-radius:50%;background:var(--success);color:white;display:flex;align-items:center;justify-content:center;margin:0 auto 26px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 style="font-size:32px;margin-bottom:14px;">Order Confirmed</h2>
        <p style="color:var(--ink-soft);margin-bottom:28px;">Thank you${shippingData.first ? ', ' + shippingData.first : ''} — a confirmation has been sent to ${shippingData.email || 'your email'}. Your order number is <strong>${orderNum}</strong>.</p>
        <div style="background:var(--ivory-deep);border-radius:var(--radius-m);padding:26px;margin-bottom:30px;display:flex;justify-content:space-between;">
          <span style="font-family:var(--font-nav);font-size:13px;text-transform:uppercase;letter-spacing:.06em;">Order Total</span>
          <span style="font-family:var(--font-display);font-size:20px;">Rs ${total}</span>
        </div>
        <div style="display:flex;gap:14px;justify-content:center;">
          <a href="shop.html" class="btn btn-outline">Continue Shopping</a>
          <a href="index.html" class="btn">Back to Home</a>
        </div>
      </div>`;
    TT.setCart([]);
  }

  function render(){
    if(step === 1) renderShipping();
    else if(step === 2) renderPayment();
    else renderConfirmation();
  }

  if(TT.getCart().length === 0){
    body.innerHTML = `<div class="empty-cart">${window.TT_ICONS.bagEmpty}<h3>Your bag is empty</h3><p>Add something to your bag before checking out.</p><a href="shop.html" class="btn">Shop Now</a></div>`;
  } else {
    render();
  }
});
