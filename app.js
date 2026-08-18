/* ============================================================
   THREAD & TREND — app.js
   Demo product data + cart / wishlist / filter / UI behaviors.
   No backend — everything persists to localStorage on-device.
   ============================================================ */

const TT = (() => {

  /* ---------------- Demo product catalogue ---------------- */
  const PRODUCTS = [
    { id:1, name:"Wool Tailored Overcoat", category:"Men", price:69400, oldPrice:86800, rating:4.8, reviews:126, sizes:["S","M","L","XL"], colors:[{n:"Camel",h:"#B79063"},{n:"Charcoal",h:"#3A362C"}], badge:"Best Seller",
      img1:"https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
      desc:"A double-breasted overcoat cut from brushed Italian wool, built for the transitional months. Structured shoulders, a fluid drape below the waist, and horn-effect buttons finish the piece." },
    { id:2, name:"Silk Wrap Midi Dress", category:"Women", price:52100, oldPrice:0, rating:4.9, reviews:214, sizes:["S","M","L"], colors:[{n:"Ivory",h:"#F3EEE5"},{n:"Black",h:"#18160F"}], badge:"New",
      img1:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=900&auto=format&fit=crop",
      desc:"Cut on the bias from mulberry silk, this wrap dress skims the body and ties at the waist. A quietly dramatic neckline makes it equally suited to daylight and dinner." },
    { id:3, name:"Relaxed Linen Shirt", category:"Men", price:25800, oldPrice:0, rating:4.6, reviews:88, sizes:["S","M","L","XL"], colors:[{n:"Stone",h:"#C9B896"},{n:"White",h:"#FBF9F5"}], badge:"",
      img1:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=900&auto=format&fit=crop",
      desc:"Washed European linen, cut with a relaxed body and dropped shoulder. Breathes easily and softens further with every wear — the kind of shirt that gets better with age." },
    { id:4, name:"Cashmere Crewneck Sweater", category:"Women", price:58800, oldPrice:74200, rating:4.9, reviews:301, sizes:["S","M","L"], colors:[{n:"Oat",h:"#E4DAC7"},{n:"Taupe",h:"#9C8B6E"},{n:"Black",h:"#18160F"}], badge:"Sale",
      img1:"https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=900&auto=format&fit=crop",
      desc:"Two-ply Grade-A cashmere, knitted fine enough to layer and warm enough not to need to. A rounded neckline and set-in sleeves keep the shape clean wear after wear." },
    { id:5, name:"Pleated Wide-Leg Trouser", category:"Women", price:35800, oldPrice:0, rating:4.7, reviews:97, sizes:["S","M","L","XL"], colors:[{n:"Black",h:"#18160F"},{n:"Camel",h:"#B79063"}], badge:"New",
      img1:"https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=900&auto=format&fit=crop",
      desc:"High-waisted and finished with a fluid pleat, this trouser is tailored to fall straight from hip to hem. Fully lined for a clean silhouette in motion." },
    { id:6, name:"Kids Organic Cotton Set", category:"Kids", price:15100, oldPrice:0, rating:4.8, reviews:63, sizes:["S","M","L"], colors:[{n:"Sky",h:"#C7D3D4"},{n:"Sand",h:"#E4DAC7"}], badge:"New",
      img1:"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=900&auto=format&fit=crop",
      desc:"A two-piece set in GOTS-certified organic cotton, cut roomy for play and washed soft from the first wear. Reinforced knees and flat-lock seams for all-day movement." },
    { id:7, name:"Leather Structured Tote", category:"Accessories", price:46200, oldPrice:0, rating:4.7, reviews:142, sizes:[], colors:[{n:"Cognac",h:"#8A6E3D"},{n:"Black",h:"#18160F"}], badge:"Best Seller",
      img1:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=900&auto=format&fit=crop",
      desc:"Full-grain vegetable-tanned leather, hand-cut and saddle-stitched around a structured base that holds its shape empty or full. Interior slip pocket, magnetic closure." },
    { id:8, name:"Merino Knit Polo", category:"Men", price:33000, oldPrice:40600, rating:4.5, reviews:71, sizes:["S","M","L","XL"], colors:[{n:"Navy",h:"#2B3440"},{n:"Oat",h:"#E4DAC7"}], badge:"Sale",
      img1:"https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=900&auto=format&fit=crop",
      desc:"Fine-gauge merino wool knitted into a polo silhouette — light enough for layering, substantial enough to wear alone. Ribbed collar and placket hold their shape." },
    { id:9, name:"Kids Denim Overalls", category:"Kids", price:17400, oldPrice:0, rating:4.6, reviews:39, sizes:["S","M","L"], colors:[{n:"Indigo",h:"#3B4A5A"}], badge:"",
      img1:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=900&auto=format&fit=crop",
      desc:"Rigid cotton denim, garment-washed for softness, with adjustable straps and triple-stitched seams built to survive a full school term of climbing." },
    { id:10, name:"Gold-Plated Hoop Earrings", category:"Accessories", price:13400, oldPrice:0, rating:4.9, reviews:188, sizes:[], colors:[{n:"Gold",h:"#A3854E"}], badge:"New",
      img1:"https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=900&auto=format&fit=crop",
      desc:"14k gold-plated brass hoops with a hinged snap closure. Lightweight enough for all-day wear, polished to hold its finish with minimal care." },
    { id:11, name:"Tailored Wool Blazer", category:"Women", price:63800, oldPrice:75600, rating:4.8, reviews:156, sizes:["S","M","L","XL"], colors:[{n:"Charcoal",h:"#3A362C"},{n:"Beige",h:"#E4DAC7"}], badge:"Sale",
      img1:"https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=900&auto=format&fit=crop",
      desc:"A single-breasted blazer with a nipped waist and clean notch lapel, cut from an Italian wool-blend that keeps its shape through a full day of wear." },
    { id:12, name:"Suede Chelsea Boots", category:"Men", price:55400, oldPrice:0, rating:4.7, reviews:112, sizes:["S","M","L","XL"], colors:[{n:"Taupe",h:"#9C8B6E"},{n:"Black",h:"#18160F"}], badge:"Best Seller",
      img1:"https://images.unsplash.com/photo-1577387224391-5de31164a0e0?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1614253429340-98120bd6d753?q=80&w=900&auto=format&fit=crop",
      desc:"Built on a leather sole with an elasticated side gusset, these Chelsea boots are cut from brushed suede and finished with a low block heel." },
    { id:13, name:"Ribbed Knit Midi Skirt", category:"Women", price:24100, oldPrice:0, rating:4.5, reviews:54, sizes:["S","M","L"], colors:[{n:"Oat",h:"#E4DAC7"},{n:"Black",h:"#18160F"}], badge:"",
      img1:"https://images.unsplash.com/photo-1601597565151-70c4020dc0e1?q=80&w=900&auto=format&fit=crop",
img2:"https://images.unsplash.com/photo-1559127452-56b800eb2f23?q=80&w=900&auto=format&fit=crop",
      desc:"A body-skimming rib knit that falls to the midi length, finished with a fold-over waistband. Pairs equally well with knitwear or a tucked-in shirt." },
    { id:14, name:"Kids Wool-Blend Duffle Coat", category:"Kids", price:26900, oldPrice:33600, rating:4.8, reviews:47, sizes:["S","M","L"], colors:[{n:"Red",h:"#A8503E"},{n:"Navy",h:"#2B3440"}], badge:"Sale",
      img1:"https://images.unsplash.com/photo-1633107603399-a085b3f38471?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=900&auto=format&fit=crop",
      desc:"A wool-blend duffle coat with toggle fastenings sized for small hands, a warm brushed lining, and a hood built to stand up to the school run in winter." },
    { id:15, name:"Fine Chain Layer Necklace", category:"Accessories", price:15700, oldPrice:0, rating:4.9, reviews:99, sizes:[], colors:[{n:"Gold",h:"#A3854E"},{n:"Silver",h:"#C7C2B6"}], badge:"New",
      img1:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=900&auto=format&fit=crop",
      desc:"Three fine chains in graduated lengths, pre-layered onto a single clasp so they sit correctly every time — no tangling, no second necklace required." },
    { id:16, name:"Cotton Poplin Shirt Dress", category:"Women", price:29100, oldPrice:0, rating:4.6, reviews:81, sizes:["S","M","L","XL"], colors:[{n:"White",h:"#FBF9F5"},{n:"Stone",h:"#C9B896"}], badge:"",
      img1:"https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=900&auto=format&fit=crop",
      img2:"https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=900&auto=format&fit=crop",
      desc:"Crisp cotton poplin cut into a shirt dress with a belted waist and mother-of-pearl buttons throughout. Structured enough for the office, easy enough for a weekend." },
  ];

  const REVIEWS = [
    { name:"Ayesha Khan", role:"Verified Buyer", stars:5, quote:"The overcoat is heavier and better made than anything near this price. It genuinely looks like it cost three times as much.", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
    { name:"Ahmed Raza", role:"Verified Buyer", stars:5, quote:"Ordered the merino polo in two colours after the first one arrived. Sizing was exactly true to the chart, no surprises.", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
    { name:"Fatima Malik", role:"Verified Buyer", stars:5, quote:"The wrap dress photographs beautifully but wears even better — the silk has real weight to it and doesn't crease.", avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop" },
    { name:"Bilal Chaudhry", role:"Verified Buyer", stars:4, quote:"Chelsea boots needed a week to break in properly but now they're the most comfortable pair I own.", avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
    { name:"Sana Tariq", role:"Verified Buyer", stars:5, quote:"Customer support helped me exchange a size within a day, no back and forth. Rare to get service like that online.", avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
    { name:"Usman Farooq", role:"Verified Buyer", stars:5, quote:"Bought the kids duffle coat for my son — still looks new after a full winter of daily wear and washing.", avatar:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
  ];

  /* ---------------- storage helpers ---------------- */
  const read = (k, fallback) => { try{ const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; }catch(e){ return fallback; } };
  const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  const getCart = () => read('tt_cart', []);
  const setCart = (c) => { write('tt_cart', c); updateBadges(); };
  const getWishlist = () => read('tt_wishlist', []);
  const setWishlist = (w) => { write('tt_wishlist', w); updateBadges(); };

  function findProduct(id){ return PRODUCTS.find(p => p.id === Number(id)); }

  function addToCart(id, size, color, qty=1){
    const cart = getCart();
    const key = `${id}-${size}-${color}`;
    const existing = cart.find(i => i.key === key);
    if(existing){ existing.qty += qty; }
    else { cart.push({ key, id:Number(id), size, color, qty }); }
    setCart(cart);
    showToast('Added to your bag');
  }
  function removeFromCart(key){ setCart(getCart().filter(i => i.key !== key)); }
  function updateCartQty(key, qty){
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if(item){ item.qty = Math.max(1, qty); }
    setCart(cart);
  }
  function cartCount(){ return getCart().reduce((s,i)=>s+i.qty,0); }
  function cartTotal(){
    return getCart().reduce((s,i)=>{
      const p = findProduct(i.id); if(!p) return s;
      return s + p.price * i.qty;
    },0);
  }
  function toggleWishlist(id){
    let w = getWishlist();
    if(w.includes(Number(id))) w = w.filter(x=>x!==Number(id));
    else { w.push(Number(id)); showToast('Saved to wishlist'); }
    setWishlist(w);
    return w.includes(Number(id));
  }

  function updateBadges(){
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cartCount());
    document.querySelectorAll('[data-wish-count]').forEach(el => el.textContent = getWishlist().length);
  }

  /* ---------------- toast ---------------- */
  let toastTimer;
  function showToast(msg){
    let toast = document.querySelector('.toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
  }

  /* ---------------- currency ---------------- */
  function formatPrice(n){
    return Math.round(n).toLocaleString('en-PK');
  }

  /* ---------------- stars ---------------- */
  function starString(rating){
    const full = Math.round(rating);
    return '★★★★★☆☆☆☆☆'.slice(5-full,10-full);
  }

  /* ---------------- shared UI wiring ---------------- */
  function initChrome(){
    // preloader
    window.addEventListener('load', () => {
      const pl = document.getElementById('preloader');
      if(pl) setTimeout(()=> pl.classList.add('hide'), 350);
    });
    setTimeout(()=>{ const pl=document.getElementById('preloader'); if(pl) pl.classList.add('hide'); }, 2200);

    // header scroll state
    const header = document.querySelector('header.site');
    if(header){
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
      onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    }

    // mobile drawer
    const burger = document.querySelector('.burger');
    const drawer = document.querySelector('.mobile-drawer');
    const scrim = document.querySelector('.drawer-scrim');
    const drawerClose = document.querySelector('.drawer-close');
    const openDrawer = () => { drawer?.classList.add('open'); scrim?.classList.add('open'); };
    const closeDrawer = () => { drawer?.classList.remove('open'); scrim?.classList.remove('open'); };
    burger?.addEventListener('click', openDrawer);
    scrim?.addEventListener('click', closeDrawer);
    drawerClose?.addEventListener('click', closeDrawer);

    // search overlay
    const searchTrigger = document.querySelectorAll('[data-search-trigger]');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    searchTrigger.forEach(b => b.addEventListener('click', (e)=>{ e.preventDefault(); searchOverlay?.classList.add('open'); searchOverlay?.querySelector('input')?.focus(); }));
    closeSearch?.addEventListener('click', ()=> searchOverlay?.classList.remove('open'));
    searchOverlay?.addEventListener('click', (e)=>{ if(e.target === searchOverlay) searchOverlay.classList.remove('open'); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') searchOverlay?.classList.remove('open'); });
    const searchForm = searchOverlay?.querySelector('form');
    searchForm?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = searchForm.querySelector('input').value.trim();
      window.location.href = 'shop.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });

    // back to top
    const btt = document.getElementById('backtotop');
    if(btt){
      window.addEventListener('scroll', ()=> btt.classList.toggle('show', window.scrollY > 500), {passive:true});
      btt.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
    }

    updateBadges();

    // active nav link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-drawer a').forEach(a=>{
      const href = a.getAttribute('href');
      if(href === path) a.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', initChrome);

  return { PRODUCTS, REVIEWS, getCart, setCart, addToCart, removeFromCart, updateCartQty,
           cartCount, cartTotal, getWishlist, toggleWishlist, findProduct, showToast, starString, updateBadges, formatPrice };
})();
