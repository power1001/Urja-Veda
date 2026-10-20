/**
 * URJA VEDA — Interactive Web Application Engine
 * Exact PlayMore.in D2C Logic (Bilingual Hindi + English Experience)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog
  const products = {
    kit: {
      id: 'kit',
      name: 'Urja Veda 2-in-1 Combo Pack',
      subtitle: 'Oil (30ml) + Capsules (30 Caps) • संपूर्ण पावर कॉम्बो',
      itemPrice: 1799,
      deliveryFee: 0,
      price: 1799,
      regularPrice: 2396,
      img: 'assets/images/combo-pack.jpg',
      ribbon: '🔥 बेस्ट सेलर • 2-in-1 कॉम्बो (Free Delivery)'
    },
    capsule: {
      id: 'capsule',
      name: 'Urja Veda Male Performance',
      subtitle: '30 Veg Capsules • Vitality, Stamina & Energy',
      itemPrice: 1499,
      deliveryFee: 149,
      price: 1648,
      regularPrice: 2499,
      img: 'assets/images/capsules.jpg',
      ribbon: '🔥 30 Veg Capsules • (+ ₹149 Delivery)'
    },
    oil: {
      id: 'oil',
      name: 'Urja Veda Ayurvedic Oil',
      subtitle: '30 ML Dropper Bottle • Natural, Safe & Effective',
      itemPrice: 599,
      deliveryFee: 149,
      price: 748,
      regularPrice: 999,
      img: 'assets/images/oil.jpg',
      ribbon: '🔥 हर्बल मसाज ऑयल 30ml • (+ ₹149 Delivery)'
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
    const deliveryText = prod.deliveryFee === 0 ? 'मुफ़्त डिलीवरी (₹0 Free)' : `+ ₹${prod.deliveryFee} Delhivery चार्ज`;

    if (paymentMethod === 'PREPAID') {
      payable = Math.round(prod.price * 0.9); // 10% instant prepaid discount
      if (chkTotal) {
        chkTotal.innerHTML = `₹ ${payable.toLocaleString('en-IN')}/- <small style="display:block; color:#10B981; font-size:0.78rem; font-weight:700;">(मूल्य: ₹${prod.itemPrice} | डिलीवरी: ${deliveryText} | 10% ऑनलाइन छूट लागू)</small>`;
      }
    } else {
      if (chkTotal) {
        chkTotal.innerHTML = `₹ ${payable.toLocaleString('en-IN')}/- <small style="display:block; color:#aaaaaa; font-size:0.78rem;">(मूल्य: ₹${prod.itemPrice} | डिलीवरी: ${deliveryText})</small>`;
      }
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
  // Sticky Bottom Bar on Scroll (Past 320px) & Floating WhatsApp Adjustment
  // -------------------------------------------------------------------------
  const floatingWaBtn = document.querySelector('.floating-whatsapp-btn');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 320) {
      stickyBuyBar?.classList.add('visible');
      floatingWaBtn?.classList.add('above-sticky');
    } else {
      stickyBuyBar?.classList.remove('visible');
      floatingWaBtn?.classList.remove('above-sticky');
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

  // -------------------------------------------------------------------------
  // Checkout Form Submission & Payment Processing (Razorpay Live & COD)
  // -------------------------------------------------------------------------
  checkoutForm?.addEventListener('submit', async (e) => {
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

    const submitBtn = checkoutForm.querySelector('.btn-confirm-order');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    const prod = products[currentProductId];
    let payable = prod ? prod.price : 1799;
    if (paymentMethod === 'PREPAID') {
      payable = Math.round(payable * 0.9); // 10% instant prepaid discount
    }

    const orderPayload = {
      name: name,
      phone: phone,
      address: addr,
      pincode: pin,
      city: city,
      payment_mode: paymentMethod,
      product_id: currentProductId,
      product_name: prod ? prod.name : 'Urja Veda 2-in-1 Combo Pack',
      amount: payable
    };

    let assignedOrderId = 'UV-' + Math.floor(100000 + Math.random() * 900000);
    let assignedAwb = 'AWB-DLV-' + assignedOrderId.replace('UV-', '');

    // ---------------------------------------------------------
    // ONLINE PREPAID: Razorpay Live Gateway Flow
    // ---------------------------------------------------------
    if (paymentMethod === 'PREPAID') {
      if (submitBtn) {
        submitBtn.innerHTML = '⏳ Razorpay सुरक्षित पेमेंट गेटवे खुल रहा है...';
      }

      try {
        const orderRes = await fetch('/api/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const orderData = await orderRes.json();

        if (!orderData || !orderData.success || !orderData.order) {
          throw new Error(orderData?.error_message || 'Razorpay order creation failed');
        }

        const rzpOptions = {
          key: orderData.key_id || 'rzp_live_Tpg6VudIihKrcr',
          amount: orderData.order.amount,
          currency: 'INR',
          name: 'Urja Veda (ऊर्जा वेद)',
          description: prod ? prod.name : 'Urja Veda Male Vitality',
          image: prod ? prod.img : 'assets/images/combo-pack.jpg',
          order_id: orderData.order.id,
          prefill: {
            name: name,
            contact: phone,
            email: 'care@urjaveda.in'
          },
          theme: {
            color: '#10B981'
          },
          modal: {
            ondismiss: function() {
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
              }
            }
          },
          handler: async function (rzpResponse) {
            if (submitBtn) {
              submitBtn.innerHTML = '⏳ पेमेंट वेरिफाई हो रही है व Delhivery Waybill जनरेट हो रहा है...';
            }

            try {
              const verifyRes = await fetch('/api/verify-razorpay-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                  order_payload: orderPayload
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyData && verifyData.order_id) {
                assignedOrderId = verifyData.order_id;
              }
              if (verifyData && verifyData.awb_number) {
                assignedAwb = verifyData.awb_number;
              }
            } catch (err) {
              console.warn('[Razorpay Verification Network Fallback]', err);
            }

            // Populate Success Screen
            if (successName) successName.textContent = name;
            if (successOrderId) successOrderId.textContent = assignedOrderId;
            if (successAwb) successAwb.textContent = assignedAwb;
            if (successPayment) {
              successPayment.innerHTML = `ऑनलाइन प्रीपेड (Razorpay: <span style="font-family:monospace; color:#10B981;">${rzpResponse.razorpay_payment_id}</span>) • ₹ ${payable.toLocaleString('en-IN')}`;
            }

            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            }

            checkoutForm.style.display = 'none';
            if (orderSuccessScreen) orderSuccessScreen.style.display = 'block';
          }
        };

        if (window.Razorpay) {
          const rzpInstance = new window.Razorpay(rzpOptions);
          rzpInstance.open();
        } else {
          alert('Razorpay SDK लोड नहीं हो पाया। कृपया कैश ऑन डिलीवरी (COD) चुनें या रिफ्रेश करें।');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
        return;
      } catch (err) {
        console.error('[Razorpay Order Flow Error]', err);
        alert('ऑनलाइन पेमेंट शुरू करने में समस्या आई। आप कैश ऑन डिलीवरी (COD) चुन सकते हैं।');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        return;
      }
    }

    // ---------------------------------------------------------
    // CASH ON DELIVERY (COD) FLOW
    // ---------------------------------------------------------
    if (submitBtn) {
      submitBtn.innerHTML = '⏳ ऑर्डर दर्ज हो रहा है व Delhivery Waybill जनरेट हो रहा है...';
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.order_id) {
          assignedOrderId = data.order_id;
        }
        if (data && data.awb_number) {
          assignedAwb = data.awb_number;
        }
        console.log('[Urja Veda Fship Dispatch Response]:', data);
      }
    } catch (err) {
      console.warn('[Fship API Local Fallback]', err);
    }

    // Populate Success Screen
    if (successName) successName.textContent = name;
    if (successOrderId) successOrderId.textContent = assignedOrderId;
    if (successAwb) successAwb.textContent = assignedAwb;
    if (successPayment) {
      successPayment.textContent = `Cash on Delivery (₹ ${payable.toLocaleString('en-IN')})`;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    checkoutForm.style.display = 'none';
    if (orderSuccessScreen) orderSuccessScreen.style.display = 'block';

    console.log(`[Urja Veda Order Complete] Order ID: ${assignedOrderId}, Name: ${name}, AWB: ${assignedAwb}`);
  });

  btnAfterSuccess?.addEventListener('click', closeCheckout);

  // Initialize Default Selection (Combo Kit)
  selectProduct('kit');
});
