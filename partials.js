/* ============================================================
   THREAD & TREND — partials.js
   Injects header, mobile drawer, search overlay, and footer
   into every page so markup stays consistent site-wide.
   ============================================================ */

(function(){

  const ICONS = {
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.7.7 6.5 3.3C14.8 4.7 16.5 3.7 18.5 4c3.5.5 5 4 3.5 7.7C19.5 16.4 12 21 12 21z"/></svg>`,
    bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>`,
    burger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8 9.9a16 16 0 006 6l1.4-1.4a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.8 2z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v14H4V5z"/><path d="M4 6l8 7 8-7"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`,
    fb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg>`,
    tw: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4 4 0 00-6.9 3.7A11.5 11.5 0 013 4.6a4 4 0 001.2 5.4c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.4 3.5 3.2 3.9-.6.1-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8 8 0 012 18.6a11.3 11.3 0 006.2 1.8c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2.3-2.1z"/></svg>`,
    pin2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7z"/><circle cx="12" cy="9" r="2.4"/></svg>`,
    bagEmpty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>`,
  };

  const nav = [
    ['index.html','Home'], ['shop.html','Shop'], ['categories.html','Categories'],
    ['about.html','About'], ['contact.html','Contact'], ['faq.html','FAQ']
  ];

  function headerHTML(){
    return `
    <div id="preloader"><div class="preloader-mark">Thread <span style="font-style:italic;color:#A3854E">&amp;</span> Trend</div><div class="preloader-bar"></div></div>

    <div class="announce"><span>Complimentary shipping on all orders over Rs 42,000 &nbsp;·&nbsp; <b>New Season Edit now live</b> &nbsp;·&nbsp; Easy 30-day returns</span></div>

    <header class="site">
      <div class="nav-row">
        <a href="index.html" class="logo">Thread<span class="amp">&amp;</span>Trend</a>
        <nav class="main-nav">
          ${nav.map(([href,label]) => `<a href="${href}">${label}</a>`).join('')}
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" data-search-trigger aria-label="Search">${ICONS.search}</button>
          <a href="login.html" class="icon-btn" aria-label="Account">${ICONS.user}</a>
          <a href="cart.html" class="icon-btn" aria-label="Wishlist" style="display:none"></a>
          <a href="cart.html#wishlist" class="icon-btn" aria-label="Wishlist">${ICONS.heart}<span class="badge" data-wish-count>0</span></a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">${ICONS.bag}<span class="badge" data-cart-count>0</span></a>
          <button class="icon-btn burger" aria-label="Menu">${ICONS.burger}</button>
        </div>
      </div>
    </header>

    <div class="drawer-scrim"></div>
    <div class="mobile-drawer">
      <button class="drawer-close" aria-label="Close menu">${ICONS.close}</button>
      ${nav.map(([href,label]) => `<a href="${href}">${label}</a>`).join('')}
      <a href="login.html">Login / Signup</a>
      <a href="cart.html">Cart &amp; Wishlist</a>
    </div>

    <div class="search-overlay">
      <div class="search-panel">
        <form>
          <span>${ICONS.search}</span>
          <input type="text" placeholder="Search coats, dresses, accessories…" autocomplete="off"/>
          <button type="button" class="close-search" aria-label="Close search">${ICONS.close}</button>
        </form>
        <div class="search-hints">
          <a href="shop.html?cat=Women">Women</a>
          <a href="shop.html?cat=Men">Men</a>
          <a href="shop.html?cat=Kids">Kids</a>
          <a href="shop.html?cat=Accessories">Accessories</a>
          <a href="shop.html?sort=new">New Arrivals</a>
        </div>
      </div>
    </div>
    `;
  }

  function footerHTML(){
    const year = new Date().getFullYear();
    return `
    <footer class="site">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">Thread<span class="amp">&amp;</span>Trend</a>
            <p>Considered clothing built from natural fibres and cut to last more than one season. Designed in-house, made to be worn for years.</p>
            <div class="social-row">
              <a href="#" aria-label="Instagram">${ICONS.ig}</a>
              <a href="#" aria-label="Facebook">${ICONS.fb}</a>
              <a href="#" aria-label="Twitter">${ICONS.tw}</a>
              <a href="#" aria-label="Pinterest">${ICONS.pin2}</a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="shop.html">Shop All</a></li>
              <li><a href="categories.html">Categories</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Customer Support</h5>
            <ul>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="cart.html">Track Order</a></li>
              <li><a href="return-policy.html">Return Policy</a></li>
              <li><a href="faq.html">Shipping Info</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="privacy-policy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms &amp; Conditions</a></li>
              <li><a href="return-policy.html">Return Policy</a></li>
              <li><a href="faq.html">Size Guide</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Get In Touch</h5>
            <ul class="footer-contact">
              <li>${ICONS.pin}<span>12-B MM Alam Road, Gulberg III, Lahore, Punjab 54660, Pakistan</span></li>
              <li>${ICONS.phone}<span>+92 42 3577 8899</span></li>
              <li>${ICONS.mail}<span>hello@threadandtrend.com</span></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} Thread &amp; Trend. All rights reserved.</p>
          <div class="payments">
            <span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>

    <button id="backtotop" aria-label="Back to top">${ICONS.arrowUp}</button>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const hMount = document.getElementById('site-header');
    const fMount = document.getElementById('site-footer');
    if(hMount) hMount.innerHTML = headerHTML();
    if(fMount) fMount.innerHTML = footerHTML();
    document.dispatchEvent(new CustomEvent('tt:chrome-ready'));
  });

  window.TT_ICONS = ICONS;
})();
