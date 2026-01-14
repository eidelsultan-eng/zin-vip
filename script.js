const products = [];

let cart = [];

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyDjihc5elZenDCAyG3VTeMWN6cuOifd64M",
    authDomain: "vodafone-8b378.firebaseapp.com",
    databaseURL: "https://vodafone-8b378-default-rtdb.firebaseio.com",
    projectId: "vodafone-8b378",
    storageBucket: "vodafone-8b378.firebasestorage.app",
    messagingSenderId: "37799649066",
    appId: "1:37799649066:web:0405ed9987913f903f4853"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const productsRef = db.ref('customProducts');

const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const filterButtons = document.querySelectorAll('.pill');

// Render Products
function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';

    let filteredProducts = products;

    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">عذراً، لا توجد أرقام متاحة في هذا القسم حالياً.</div>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-badge badge-gold">${product.type}</div>
            <div class="number-display">
                <h2>${product.number}</h2>
                ${product.details ? `<p class="number-details">${product.details}</p>` : ''}
            </div>
            <div class="card-info">
                <div class="price">${product.price.toLocaleString()} ج.م</div>
                <div class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Add to Cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!cart.some(item => item.id === productId)) {
        cart.push(product);
        updateCart();
        openCart();
    }
};

// Update Cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.number}</h4>
            </div>
            <i class="fas fa-trash-alt" onclick="removeFromCart(${index})" style="cursor:pointer; color: var(--secondary-color)"></i>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.innerText = `${total.toLocaleString()} ج.م`;
    cartCountElement.innerText = cart.length;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Event Listeners
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);

        // Scroll to products
        document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Initial Render
renderProducts();

// Search Functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const allAvailable = [...products, ...customProducts];
    const filtered = allAvailable.filter(p => p.number.replace(/\s/g, '').replace(/\./g, '').includes(query.replace(/\s/g, '').replace(/\./g, '')));

    productsGrid.innerHTML = '';
    if (filtered.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">لا توجد نتائج بحث مطابقة.</div>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-badge badge-gold">${product.type}</div>
            <div class="number-display">
                <h2 dir="ltr">${product.number}</h2>
                ${product.details ? `<p class="number-details">${product.details}</p>` : ''}
            </div>
            <div class="card-info">
                <div class="add-to-cart" onclick="orderNow(${product.id})" style="width: 100%; border-radius: 12px; background: var(--primary-color); border: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fab fa-whatsapp"></i>
                    <span>تواصل للشراء</span>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
});

// Direct Order via WhatsApp
window.orderNow = (productId) => {
    const allAvailable = [...products, ...customProducts];
    const product = allAvailable.find(p => p.id === productId);
    if (product) {
        const message = `مرحباً زين للأرقام المميزة، أود طلب الرقم التالي:\n\n📌 رقم: ${product.number}`;
        const whatsappUrl = `https://wa.me/201272202020?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
};

// Checkout via WhatsApp
document.querySelector('.cart-footer button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = 'مرحباً زين للأرقام المميزة، أود الاستفسار عن الأرقام التالية:\n\n';
    cart.forEach(item => {
        message += `📌 رقم: ${item.number}\n\n`;
    });
    message += `━━━━━━━━━━━━━━`;

    const whatsappUrl = `https://wa.me/201272202020?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Contact Form Handling
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const phone = e.target.querySelector('input[type="tel"]').value;
    const message = e.target.querySelector('textarea').value;

    const fullMessage = `مرحباً زين للأرقام المميزة،\n\nالاسم: ${name}\nرقم الهاتف: ${phone}\nالرسالة: ${message}`;

    const whatsappUrl = `https://wa.me/201272202020?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
});
// Admin Panel Logic
const adminPanel = document.getElementById('adminPanel');
const openAdmin = document.getElementById('openAdmin');
const adminClose = document.getElementById('adminClose');
const addProductForm = document.getElementById('addProductForm');
const addedProdsList = document.getElementById('addedProdsList');

const ADMIN_PASSWORD = '010qwe';

openAdmin.addEventListener('click', (e) => {
    e.preventDefault();
    const pass = prompt('الرجاء إدخال كلمة السر للدخول لوحة التحكم:');
    if (pass === ADMIN_PASSWORD) {
        adminPanel.classList.add('active');
        overlay.classList.add('active');
        renderAdminList();
    } else if (pass !== null) {
        alert('كلمة السر غير صحيحة!');
    }
});

adminClose.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Load custom products from Firebase (Online)
let customProducts = [];

// Listen for real-time changes
productsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    customProducts = [];
    if (data) {
        // Convert object to array and keep the Firebase key for deletion
        Object.keys(data).forEach(key => {
            customProducts.push({
                firebaseKey: key,
                ...data[key]
            });
        });
    }
    // Re-render everything once data is received
    renderProducts(currentFilter, true);
    if (adminPanel.classList.contains('active')) {
        renderAdminList();
    }
});

function saveProducts(newProd) {
    // Push new product to Firebase
    productsRef.push(newProd);
}

function renderAdminList() {
    addedProdsList.innerHTML = '';
    customProducts.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:2px;">
                <span style="font-weight:bold; color:var(--primary-color)">${p.number}</span>
                <span style="font-size:0.8rem; color:var(--gray-text)">${p.type}${p.details ? ` | ${p.details}` : ''}</span>
            </div>
            <i class="fas fa-trash" onclick="deleteProduct('${p.firebaseKey}')" style="color: var(--secondary-color); cursor: pointer; padding: 10px;"></i>
        `;
        addedProdsList.appendChild(item);
    });
}

window.deleteProduct = (firebaseKey) => {
    if (confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
        productsRef.child(firebaseKey).remove();
        alert('تم حذف الرقم بنجاح');
    }
};

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        number: document.getElementById('prodNumber').value,
        price: 0,
        category: document.getElementById('prodCategory').value,
        type: document.getElementById('prodType').value,
        details: document.getElementById('prodDetails').value || ''
    };

    saveProducts(newProd);
    addProductForm.reset();
    alert('تم إضافة الرقم بنجاح للموقع وتظهر الآن للكل الحاضرين أونلاين!');
});

// Update renderProducts to include custom products and persistence
const originalRenderProducts = renderProducts;
let currentFilter = 'all';

renderProducts = function (filter = 'all', showAll = false) {
    currentFilter = filter;
    productsGrid.innerHTML = '';

    const allProducts = [...products, ...customProducts];
    let filteredProducts;

    if (filter === 'all') {
        filteredProducts = allProducts;
    } else if (filter === 'vodafone-010') {
        filteredProducts = allProducts.filter(p => p.category === filter || p.number.replace(/\D/g, '').startsWith('010'));
    } else if (filter === 'etisalat-011') {
        filteredProducts = allProducts.filter(p => p.category === filter || p.number.replace(/\D/g, '').startsWith('011'));
    } else if (filter === 'orange-012') {
        filteredProducts = allProducts.filter(p => p.category === filter || p.number.replace(/\D/g, '').startsWith('012'));
    } else if (filter === 'we-015') {
        filteredProducts = allProducts.filter(p => p.category === filter || p.number.replace(/\D/g, '').startsWith('015'));
    } else {
        filteredProducts = allProducts.filter(p => p.category === filter);
    }

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">عذراً، لا توجد أرقام متاحة في هذا القسم حالياً. سنقوم بإظهار أقرب النتائج المتاحة لك:</div>';
        // Fallback: Show all products or something similar?
        // Let's just show a few recent ones for now or stay at the message.
        return;
    }

    const productsToDisplay = showAll ? filteredProducts : filteredProducts.slice(0, 5);

    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-badge badge-gold">${product.type}</div>
            <div class="number-display">
                <h2 dir="ltr">${product.number}</h2>
                ${product.details ? `<p class="number-details">${product.details}</p>` : ''}
            </div>
            <div class="card-info">
                <div class="add-to-cart" onclick="orderNow(${product.id})" style="width: 100%; border-radius: 12px; background: var(--primary-color); border: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fab fa-whatsapp"></i>
                    <span>تواصل للشراء</span>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });

    // Add "Show More" button if needed
    if (!showAll && filteredProducts.length > 5) {
        const showMoreContainer = document.createElement('div');
        showMoreContainer.style.cssText = 'grid-column: 1/-1; text-align: center; margin-top: 30px;';
        showMoreContainer.innerHTML = `
            <button class="btn btn-primary" onclick="renderProducts('${filter}', true)" style="padding: 12px 40px; border-radius: 50px;">
                عرض المزيد
                <i class="fas fa-chevron-down" style="margin-right: 8px;"></i>
            </button>
        `;
        productsGrid.appendChild(showMoreContainer);
    }
};

// Re-render initially to catch custom products
renderProducts();
