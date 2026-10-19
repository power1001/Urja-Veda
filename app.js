/**
 * URJA VEDA — Interactive Web Application Engine
 * Exact PlayMore.in D2C Logic (Bilingual Hindi + English Experience)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog
  const products = {
    oil: {
      id: 'oil',
      name: 'Urja Veda Oil',
      subtitle: '30 ML Dropper Bottle • हर्बल मसाज ऑयल',
      price: 849,
      regularPrice: 1099,
      img: 'assets/images/oil.jpg',
      ribbon: '🔥 हर्बल ऑयल • 20% छूट'
    },
    powder: {
      id: 'powder',
      name: 'Urja Veda Powder',
      subtitle: '150g Traditional Jar • आयुर्वेदिक चूर्ण',
      price: 899,
      regularPrice: 1999,
      img: 'assets/images/powder.jpg',
      ribbon: '🔥 पारंपरिक चूर्ण • 55% छूट'
    },
    capsule: {
      id: 'capsule',
      name: 'Urja Veda Capsule',
      subtitle: '60 Veg Capsules • 100% शाकाहारी कैप्सूल',
      price: 1069,
      regularPrice: 2199,
      img: 'assets/images/capsules.jpg',
      ribbon: '🔥 प्रीमियम कैप्सूल • 52% छूट'
    },
    kit: {
      id: 'kit',
      name: 'Urja Veda Complete Kit',
      subtitle: 'Oil (30ml) + Capsules (60) + Powder (150g) • संपूर्ण महा पैक',
      price: 1669,
      regularPrice: 4737,
      img: 'assets/images/combo-pack.jpg',
      ribbon: '🔥 बेस्ट सेलर • 3-इन-1 कॉम्बो (66% छूट)'
    }
  };

  let currentProductId = 'kit';
  let paymentMethod = 'COD';

  // DOM Elements
  const cards = document.querySelectorAll('.pmc-card');
  const mainDisplayImg = document.getElementById('mainDisplayImg');
  const galleryRibbon = document.getElementById('galleryRibbon');
  const thumbs = document.querySelectorAll('.gallery-thumb-item');
  const buyBtnPrice = document.getElementById('buyBtnPrice');
  const heroBuyNowBtn = document.getElementById('heroBuyNowBtn');
  const headerCartBtn = document.getElementById('headerCartBtn');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky Bar Elements
  const stickyBuyBar = document.getElementById('stickyBuyBar');
  const stickyThumb = document.getElementById('stickyThumb');
  const stickyTitle = document.getElementById('stickyTitle');
  const stickySubtitle = document.getElementById('stickySubtitle');
  const stickyPrice = document.getElementById('stickyPrice');
  const stickyRegularPrice = document.getElementById('stickyRegularPrice');
  const stickyOrderBtn = document.getElementById('stickyOrderBtn');

  // Checkout Modal Elements
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const chkImg = document.getElementById('chkImg');
  const chkTitle = document.getElementById('chkTitle');
  const chkSubtitle = document.getElementById('chkSubtitle');
  const chkTotal = document.getElementById('chkTotal');
  const finalSubmitPrice = document.getElementById('finalSubmitPrice');
  const optCOD = document.getElementById('optCOD');
  const optPrepaid = document.getElementById('optPrepaid');
  const checkoutForm = document.getElementById('checkoutForm');
  const orderSuccessScreen = document.getElementById('orderSuccessScreen');
  const successName = document.getElementById('successName');
  const successOrderId = document.getElementById('successOrderId');
  const successAwb = document.getElementById('successAwb');
  const successPayment = document.getElementById('successPayment');
  const btnAfterSuccess = document.getElementById('btnAfterSuccess');

  // Mobile Menu Toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '72px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#111111';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid #333';
      }
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = 'none';
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Function: Select Product (Exact PlayMore Snapmint Active State)
  // -------------------------------------------------------------------------
  function selectProduct(productId) {
    const prod = products[productId];
    if (!prod) return;

    currentProductId = productId;

    // Update Cards UI (.selected / .snapmint)
    cards.forEach(card => {
      if (card.dataset.id === productId) {
        card.classList.add('selected', 'snapmint');
      } else {
        card.classList.remove('selected', 'snapmint');
      }
    });

    // Update Thumbnails UI
    thumbs.forEach(thumb => {
      if (thumb.dataset.id === productId) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    // Update Main Image & Ribbon
    if (mainDisplayImg) {
      mainDisplayImg.style.opacity = '0.3';
      setTimeout(() => {
        mainDisplayImg.src = prod.img;
        mainDisplayImg.style.opacity = '1';
      }, 150);
    }
    if (galleryRibbon) galleryRibbon.textContent = prod.ribbon;

    // Update Hero Buy Button Price
    if (buyBtnPrice) buyBtnPrice.textContent = prod.price.toLocaleString('en-IN');

    // Update Sticky Bar
    if (stickyThumb) stickyThumb.src = prod.img;
    if (stickyTitle) stickyTitle.textContent = prod.name;
    if (stickySubtitle) stickySubtitle.textContent = prod.subtitle;
    if (stickyPrice) stickyPrice.textContent = `₹ ${prod.price.toLocaleString('en-IN')}/-`;
    if (stickyRegularPrice) stickyRegularPrice.textContent = `₹ ${prod.regularPrice.toLocaleString('en-IN')}/-`;

    // Update Checkout Modal View
    updateCheckoutView();
  }

  // -------------------------------------------------------------------------
  // Function: Update Checkout Price with Payment Method Discount
  // -------------------------------------------------------------------------
  function updateCheckoutView() {
    const prod = products[currentProductId];
    if (!prod) return;

    if (chkImg) chkImg.src = prod.img;
    if (chkTitle) chkTitle.textContent = prod.name;
    if (chkSubtitle) chkSubtitle.textContent = prod.subtitle;

    let payable = prod.price;
    if (paymentMethod === 'PREPAID') {
      payable = Math.round(prod.price * 0.9); // 10% instant prepaid discount
      if (chkTotal) {
        chkTotal.innerHTML = `₹ ${payable.toLocaleString('en-IN')}/- <small style="display:block; color:#0d8a43; font-size:0.75rem;">(10% ऑनलाइन छूट लागू)</small>`;
      }
    } else {
      if (chkTotal) chkTotal.textContent = `₹ ${payable.toLocaleString('en-IN')}/-`;
    }

    if (finalSubmitPrice) finalSubmitPrice.textContent = payable.toLocaleString('en-IN');
  }

  // Attach card click listeners
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pId = card.dataset.id;
      selectProduct(pId);
    });
  });

  // Attach thumbnail click listeners
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const pId = thumb.dataset.id;
      selectProduct(pId);
    });
  });

  // -------------------------------------------------------------------------
  // Sticky Bottom Bar on Scroll (Past 300px)
  // -------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 320) {
      stickyBuyBar?.classList.add('visible');
    } else {
      stickyBuyBar?.classList.remove('visible');
    }
  });

  // -------------------------------------------------------------------------
  // Open & Close Checkout Modal
  // -------------------------------------------------------------------------
  function openCheckout() {
    updateCheckoutView();
    if (checkoutForm) checkoutForm.style.display = 'block';
    if (orderSuccessScreen) orderSuccessScreen.style.display = 'none';
    checkoutModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  heroBuyNowBtn?.addEventListener('click', openCheckout);
  stickyOrderBtn?.addEventListener('click', openCheckout);
  headerCartBtn?.addEventListener('click', openCheckout);
  closeCheckoutBtn?.addEventListener('click', closeCheckout);

  // Close modal when clicking outside box
  checkoutModal?.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      closeCheckout();
    }
  });

  // Payment Toggle (COD vs Prepaid)
  optCOD?.addEventListener('click', () => {
    paymentMethod = 'COD';
    optCOD.classList.add('selected');
    optPrepaid?.classList.remove('selected');
    updateCheckoutView();
  });

  optPrepaid?.addEventListener('click', () => {
    paymentMethod = 'PREPAID';
    optPrepaid.classList.add('selected');
    optCOD?.classList.remove('selected');
    updateCheckoutView();
  });

  // Checkout Form Submission
  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const addr = document.getElementById('custAddress')?.value.trim();
    const pin = document.getElementById('custPincode')?.value.trim();
    const city = document.getElementById('custCity')?.value.trim();

    if (!name || !phone || !addr || !pin || !city) {
      alert('कृपया डिलीवरी के सभी आवश्यक विवरण सही से भरें। (Please fill all shipping details)');
      return;
    }

    const randomId = 'UV-' + Math.floor(100000 + Math.random() * 900000);
    if (successName) successName.textContent = name;
    if (successOrderId) successOrderId.textContent = randomId;

    checkoutForm.style.display = 'none';
    if (orderSuccessScreen) orderSuccessScreen.style.display = 'block';

    console.log(`[Urja Veda Order Placed] Order ID: ${randomId}, Name: ${name}, Phone: ${phone}, Pack: ${currentProductId}, Payment: ${paymentMethod}`);
  });

  btnAfterSuccess?.addEventListener('click', closeCheckout);

  // Initialize Default Selection (Combo Kit)
  selectProduct('kit');
});
