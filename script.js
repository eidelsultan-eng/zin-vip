const products = [
    { id: 101, number: '010.2003.1338', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 102, number: '010.2002.7274', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 103, number: '010.2003.4018', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 104, number: '010.2006.6070', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 105, number: '010.2007.0190', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 106, number: '010.2008.2060', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 107, number: '010.2009.7787', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 108, number: '010.2010.0446', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 109, number: '010.2013.0900', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 110, number: '010.2015.5004', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 111, number: '010.2018.0073', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 112, number: '010.2018.1007', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 113, number: '010.2019.0028', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 114, number: '010.2019.3700', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 115, number: '010.20.2009.13', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 116, number: '010.202.23006', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 117, number: '010.2024.4900', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 118, number: '010.2027.0034', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 119, number: '010.2027.2002', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 120, number: '010.2030.0194', price: 0, category: 'birthdates', type: 'مميز' },
    { id: 121, number: '010.2029.0011', price: 0, category: 'birthdates', type: 'مميز' }
];

let cart = [];

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

// Load custom products from localStorage
let customProducts = JSON.parse(localStorage.getItem('customZainProducts')) || [];

function saveProducts() {
    localStorage.setItem('customZainProducts', JSON.stringify(customProducts));
}

function renderAdminList() {
    addedProdsList.innerHTML = '';
    customProducts.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:2px;">
                <span style="font-weight:bold; color:var(--primary-color)">${p.number}</span>
                <span style="font-size:0.8rem; color:var(--gray-text)">${p.type}</span>
            </div>
            <i class="fas fa-trash" onclick="deleteProduct(${index})" style="color: var(--secondary-color); cursor: pointer; padding: 10px;"></i>
        `;
        addedProdsList.appendChild(item);
    });
}

window.deleteProduct = (index) => {
    if (confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
        customProducts.splice(index, 1);
        saveProducts();
        renderAdminList();
        renderProducts(document.querySelector('.pill.active').dataset.filter);
    }
};

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        number: document.getElementById('prodNumber').value,
        price: 0,
        category: document.getElementById('prodCategory').value,
        type: document.getElementById('prodType').value
    };

    customProducts.push(newProd);
    saveProducts();
    addProductForm.reset();
    renderAdminList();
    renderProducts(document.querySelector('.pill.active').dataset.filter);
    alert('تم إضافة الرقم بنجاح!');
});

// Update renderProducts to include custom products and persistence
const originalRenderProducts = renderProducts;
renderProducts = function (filter = 'all') {
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

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-badge badge-gold">${product.type}</div>
            <div class="number-display">
                <h2 dir="ltr">${product.number}</h2>
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
};

// Re-render initially to catch custom products
renderProducts();
