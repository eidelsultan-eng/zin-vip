const products = [
    { id: 1, number: '0100 0000 000', price: 50000, category: 'top-vip', type: 'VIP' },
    { id: 2, number: '010 1111 1111', price: 25000, category: 'hexa', type: 'سداسي' },
    { id: 3, number: '010 666 666 10', price: 4500, category: '2000to5000', type: 'مميز' },
    { id: 4, number: '0100 100 1000', price: 15000, category: '0100100', type: 'زيرو مية مية' },
    { id: 5, number: '010 123 456 78', price: 1500, category: 'under2000', type: 'تسلسل' },
    { id: 6, number: '010 999 888 77', price: 8500, category: '5000to10000', type: 'تكرارات' },
    { id: 7, number: '01000 1000 10', price: 12000, category: 'over10000', type: 'خماسية' },
    { id: 8, number: '010 22 33 44 55', price: 3500, category: 'repeated', type: 'تكرارات' },
    { id: 9, number: '010 0000 5555', price: 20000, category: 'quad', type: 'رباعي' },
    { id: 10, number: '010 1212 1212', price: 7000, category: 'mirror', type: 'مرايا' },
    { id: 11, number: '01000 000 000', price: 100000, category: 'top-vip', type: 'الملك' },
    { id: 12, number: '01000 555 000', price: 1500, category: 'under2000', type: 'اقتصادي' },
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
                <span>${item.price.toLocaleString()} ج.م</span>
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
        document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
    });
});

// Initial Render
renderProducts();

// Search Functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const filtered = products.filter(p => p.number.replace(/\s/g, '').includes(query.replace(/\s/g, '')));

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
});

// Checkout via WhatsApp
document.querySelector('.cart-footer button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let message = 'مرحباً زين للأرقام المميزة، أود الاستفسار عن الأرقام التالية:\n\n';
    cart.forEach(item => {
        message += `📌 رقم: ${item.number}\n💰 السعر: ${item.price.toLocaleString()} ج.م\n\n`;
    });
    message += `━━━━━━━━━━━━━━\nTotal: ${cartTotalElement.innerText}`;

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
                <span style="font-size:0.8rem; color:var(--gray-text)">${p.price} ج.م - ${p.type}</span>
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
        price: parseInt(document.getElementById('prodPrice').value),
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
    let filteredProducts = filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter);

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
};

// Re-render initially to catch custom products
renderProducts();
