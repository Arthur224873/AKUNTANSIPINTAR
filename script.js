// Data Storage (using localStorage for simplicity)
let products = JSON.parse(localStorage.getItem('products')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [{ username: 'admin', password: 'admin123', role: 'admin' }];
let companyName = localStorage.getItem('companyName') || 'Akuntansi Pintar';
let currentUser = null; // To store logged-in user

// Cart State
let cart = [];
let transactionIdCounter = parseInt(localStorage.getItem('transactionIdCounter')) || 1;
let expenseIdCounter = parseInt(localStorage.getItem('expenseIdCounter')) || 1;
let productIdCounter = parseInt(localStorage.getItem('productIdCounter')) || 101; // Start product IDs from 101

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const loginCompanyNameDisplay = document.getElementById('login-company-name-display');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const notificationArea = document.getElementById('notification-area');

// Kasir Tab Elements
const productSelect = document.getElementById('product-select');
const categoryFilter = document.getElementById('category-filter');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productStockDisplay = document.getElementById('product-stock-display');
const productQuantityInput = document.getElementById('product-quantity');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const clearInputBtn = document.getElementById('clear-input-btn');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalSpan = document.getElementById('subtotal');
const discountTypeSelect = document.getElementById('discount-type');
const discountValueGroup = document.getElementById('discount-value-group');
const discountValueInput = document.getElementById('discount-value');
const discountSpan = document.getElementById('discount');
const totalPaymentSpan = document.getElementById('total-payment');
const amountPaidInput = document.getElementById('amount-paid');
const changeAmountSpan = document.getElementById('change-amount');
const changeRow = document.getElementById('change-row');
const processPaymentBtn = document.getElementById('process-payment-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Produk Tab Elements
const newProductNameInput = document.getElementById('new-product-name');
// Corrected typo here: was document = document.getElementById...
const newProductCategoryInput = document.getElementById('new-product-category');
const newProductCostPriceInput = document.getElementById('new-product-cost-price');
const newProductPriceInput = document.getElementById('new-product-price');
const newProductMarkupPercentageInput = document.getElementById('new-product-markup-percentage');
const newProductStockInput = document.getElementById('new-product-stock');
const newProductMinStockInput = document.getElementById('new-product-min-stock');
const addNewProductBtn = document.getElementById('add-new-product-btn');
const productListBody = document.getElementById('product-list-body');
const productTable = document.getElementById('product-table');

// Edit Product Modal Elements
const editProductModal = document.getElementById('editProductModal');
const modalProductId = document.getElementById('modal-product-id');
const modalProductName = document.getElementById('modal-product-name');
const modalProductCategory = document.getElementById('modal-product-category');
const modalProductCostPrice = document.getElementById('modal-product-cost-price');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductMarkupPercentage = document.getElementById('modal-product-markup-percentage');
const modalProductStock = document.getElementById('modal-product-stock');
const modalProductMinStock = document.getElementById('modal-product-min-stock');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveProductBtn = document.getElementById('save-product-btn');

// Stock Adjustment Modal Elements
const stockAdjustmentModal = document.getElementById('stockAdjustmentModal');
const stockModalTitle = document.getElementById('stock-modal-title');
const stockProductNameDisplay = document.getElementById('stock-product-name-display');
const stockProductIdDisplay = document.getElementById('stock-product-id-display');
const currentStockDisplay = document.getElementById('current-stock-display');
const stockAdjustmentType = document.getElementById('stock-adjustment-type');
const stockAdjustmentQuantity = document.getElementById('stock-adjustment-quantity');
const stockAdjustmentReason = document.getElementById('stock-adjustment-reason');
const cancelStockAdjustmentBtn = document.getElementById('cancel-stock-adjustment-btn');
const saveStockAdjustmentBtn = document.getElementById('save-stock-adjustment-btn');
let currentProductForStockAdjustment = null;

// Pengeluaran Tab Elements
const expenseDateInput = document.getElementById('expense-date');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseDescriptionInput = document.getElementById('expense-description');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseListBody = document.getElementById('expense-list-body');
const expenseTable = document.getElementById('expense-table');

// Edit Expense Modal Elements
const editExpenseModal = document.getElementById('editExpenseModal');
const modalExpenseId = document.getElementById('modal-expense-id');
const modalExpenseDate = document.getElementById('modal-expense-date');
const modalExpenseCategory = document.getElementById('modal-expense-category');
const modalExpenseDescription = document.getElementById('modal-expense-description');
const modalExpenseAmount = document.getElementById('modal-expense-amount');
const cancelExpenseEditBtn = document.getElementById('cancel-expense-edit-btn');
const saveExpenseBtn = document.getElementById('save-expense-btn');

// Laporan Penjualan Tab Elements
const reportDateFilter = document.getElementById('report-date-filter');
const transactionListBody = document.getElementById('transaction-list-body');

// Transaction Detail Modal Elements
const transactionDetailModal = document.getElementById('transactionDetailModal');
const detailTransactionId = document.getElementById('detail-transaction-id');
const detailTransactionDate = document.getElementById('detail-transaction-date');
const detailTransactionItems = document.getElementById('detail-transaction-items');
const detailTransactionSubtotal = document.getElementById('detail-transaction-subtotal');
const detailTransactionDiscount = document.getElementById('detail-transaction-discount');
const detailTransactionTotal = document.getElementById('detail-transaction-total');
const detailTransactionPaid = document.getElementById('detail-transaction-paid');
const detailTransactionChange = document.getElementById('detail-transaction-change');
const closeDetailModalBtn = document.getElementById('close-detail-modal-btn');
const printReceiptBtn = document.getElementById('print-receipt-btn');
const printReceiptContent = document.getElementById('printReceiptContent');

// Rekapan Keuangan Tab Elements
const recapRevenueSpan = document.getElementById('recap-revenue');
const recapCostOfGoodsSpan = document.getElementById('recap-cost-of-goods');
const recapTotalExpenseSpan = document.getElementById('recap-total-expense');
const recapProfitSpan = document.getElementById('recap-profit');
const incomeTrendChartCanvas = document.getElementById('incomeTrendChart');
const chartFilterSelect = document.getElementById('chart-filter');
const chartEmptyMessage = document.getElementById('chart-empty-message');
let incomeChart = null;

// Pengaturan Tab Elements
const companyNameInput = document.getElementById('company-name-input');
const saveCompanyNameBtn = document.getElementById('save-company-name-btn');
const newUsernameInput = document.getElementById('new-user-username');
const newPasswordInput = document.getElementById('new-user-password');
const newUserRoleSelect = document.getElementById('new-user-role');
const addNewUserBtn = document.getElementById('add-new-user-btn');
const userListDisplay = document.getElementById('user-list-display');
const exportProductsPdfBtn = document.getElementById('export-products-pdf-btn');
const exportTransactionsPdfBtn = document.getElementById('export-transactions-pdf-btn');
const exportExpensesPdfBtn = document.getElementById('export-expenses-pdf-btn');
const exportRecapPdfBtn = document.getElementById('export-recap-pdf-btn');
const exportChartPdfBtn = document.getElementById('export-chart-pdf-btn');
const clearAllDataBtn = document.getElementById('clear-all-data-btn');

const appCompanyNameHeader = document.getElementById('app-company-name');
const footerCompanyName = document.getElementById('footer-company-name');
const aboutUsLink = document.getElementById('about-us-link');
const aboutUsModal = document.getElementById('aboutUsModal');
const closeAboutUsModalBtn = document.getElementById('close-about-us-modal-btn');

// --- Utility Functions ---
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function generateId(prefix, counter) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${prefix}-${year}${month}${day}-${counter}`;
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.setProperty('--notification-duration', `${duration / 1000}s`);

    notificationArea.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration + 500);
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('transactionIdCounter', transactionIdCounter);
    localStorage.setItem('expenseIdCounter', expenseIdCounter);
    localStorage.setItem('productIdCounter', productIdCounter);
    updateUI();
}

function updateUI() {
    renderProductList();
    populateProductSelect();
    populateCategoryFilter();
    updateCartDisplay();
    updateRecapSummary();
    renderTransactionList();
    renderExpenseList();
    renderUserList();
    updateChart();
    updateCompanyNameDisplay();
    feather.replace();
}

function updateCompanyNameDisplay() {
    appCompanyNameHeader.textContent = companyName;
    loginCompanyNameDisplay.textContent = companyName;
    footerCompanyName.textContent = companyName;
}

function clearKasirInputs() {
    productSelect.value = '';
    productNameInput.value = '';
    productPriceInput.value = '';
    productStockDisplay.value = '';
    productQuantityInput.value = '1';
    categoryFilter.value = '';
    populateProductSelect();
}

// --- Login Functionality ---
function handleLogin() {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        loginModal.classList.remove('active');
        loginModal.style.display = 'none'; // Ensure it's fully hidden
        showNotification(`Selamat datang, ${currentUser.username}!`, 'success');
        updateTabVisibility();
        // Manually trigger click on the active tab to load its content
        const activeTabButton = document.querySelector('.tab-button.active');
        if (activeTabButton) {
            activeTabButton.click();
        } else {
            // Fallback if no active tab, activate Kasir tab
            document.querySelector('.tab-button[data-tab="kasir"]').click();
        }
    } else {
        showNotification('Username atau password salah.', 'error');
    }
}

function updateTabVisibility() {
    tabButtons.forEach(button => {
        const tabId = button.dataset.tab;
        if (currentUser.role === 'kasir' && (tabId === 'produk' || tabId === 'pengeluaran' || tabId === 'rekapan' || tabId === 'pengaturan')) {
            button.style.display = 'none';
        } else {
            button.style.display = '';
        }
    });
    // Ensure Kasir tab is active if current tab is hidden for Kasir
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab && activeTab.style.display === 'none') {
        document.querySelector('.tab-button[data-tab="kasir"]').click();
    }
}

// --- Tab Navigation ---
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');

        // Specific actions for each tab when activated
        if (button.dataset.tab === 'produk') {
            renderProductList();
        } else if (button.dataset.tab === 'pengeluaran') {
            renderExpenseList();
            expenseDateInput.valueAsDate = new Date(); // Set default date
        } else if (button.dataset.tab === 'laporan') {
            const today = new Date();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const year = today.getFullYear();
            reportDateFilter.value = `${year}-${month}`;
            renderTransactionList();
        } else if (button.dataset.tab === 'rekapan') {
            updateRecapSummary();
            updateChart();
        } else if (button.dataset.tab === 'pengaturan') {
            companyNameInput.value = companyName;
            renderUserList();
        }
        feather.replace();
    });
});

// --- Kasir Tab Logic ---
function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category.toLowerCase()))];
    categoryFilter.innerHTML = '<option value="">-- Semua Kategori --</option>';
    categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

function populateProductSelect() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category.toLowerCase() === selectedCategory)
        : products;

    productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';
    filteredProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (Stok: ${product.stock})`;
        productSelect.appendChild(option);
    });
}

productSelect.addEventListener('change', (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(p => p.id === selectedProductId);

    if (selectedProduct) {
        productNameInput.value = selectedProduct.name;
        productPriceInput.value = selectedProduct.price;
        productStockDisplay.value = selectedProduct.stock;
        productQuantityInput.value = 1;
    } else {
        productNameInput.value = '';
        productPriceInput.value = '';
        productStockDisplay.value = '';
        productQuantityInput.value = 1;
    }
});

categoryFilter.addEventListener('change', populateProductSelect);

addToCartBtn.addEventListener('click', () => {
    const productId = productSelect.value;
    const quantity = parseInt(productQuantityInput.value);

    if (!productId) {
        showNotification('Pilih produk terlebih dahulu.', 'warning');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        showNotification('Jumlah produk harus lebih dari 0.', 'warning');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Produk tidak ditemukan.', 'error');
        return;
    }

    if (product.stock < quantity) {
        showNotification(`Stok ${product.name} tidak cukup. Sisa stok: ${product.stock}`, 'error');
        return;
    }

    const existingCartItemIndex = cart.findIndex(item => item.id === productId);

    if (existingCartItemIndex > -1) {
        const newQuantity = cart[existingCartItemIndex].quantity + quantity;
        if (product.stock < newQuantity) {
            showNotification(`Total stok ${product.name} tidak cukup. Hanya bisa menambah ${product.stock - cart[existingCartItemIndex].quantity} lagi.`, 'error');
            return;
        }
        cart[existingCartItemIndex].quantity = newQuantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            costPrice: product.costPrice,
            quantity: quantity
        });
    }

    product.stock -= quantity;

    showNotification(`${quantity}x ${product.name} ditambahkan ke keranjang.`, 'success');
    clearKasirInputs();
    updateCartDisplay();
    saveData();
});

clearInputBtn.addEventListener('click', clearKasirInputs);

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Keranjang kosong. Pilih produk dari daftar.</p>';
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">${item.quantity} x ${formatRupiah(item.price)}</div>
                </div>
                <div class="cart-item-total-price">${formatRupiah(item.quantity * item.price)}</div>
                <div class="cart-item-actions">
                    <button class="danger" data-product-id="${item.id}" data-action="remove"><i data-feather="trash-2"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }
    calculateCartTotals();
    feather.replace();
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        const button = e.target.closest('button');
        const productId = button.dataset.productId;
        const action = button.dataset.action;

        if (action === 'remove') {
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex > -1) {
                const item = cart[itemIndex];
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.stock += item.quantity;
                }
                cart.splice(itemIndex, 1);
                showNotification(`${item.name} dihapus dari keranjang.`, 'info');
                updateCartDisplay();
                saveData();
            }
        }
    }
});

function calculateCartTotals() {
    let currentSubtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    subtotalSpan.textContent = formatRupiah(currentSubtotal);

    let discountAmount = 0;
    const discountType = discountTypeSelect.value;
    const discountValue = parseFloat(discountValueInput.value) || 0;

    if (discountType === 'percentage' && discountValue > 0) {
        discountAmount = currentSubtotal * (discountValue / 100);
    } else if (discountType === 'nominal' && discountValue > 0) {
        discountAmount = discountValue;
    }
    discountAmount = Math.min(discountAmount, currentSubtotal);

    discountSpan.textContent = formatRupiah(discountAmount);

    let currentTotal = currentSubtotal - discountAmount;
    totalPaymentSpan.textContent = formatRupiah(currentTotal);

    const amountPaid = parseFloat(amountPaidInput.value) || 0;
    let change = amountPaid - currentTotal;
    changeAmountSpan.textContent = formatRupiah(change);

    if (change < 0) {
        changeRow.classList.remove('change-positive');
        changeRow.classList.add('change-negative');
        changeAmountSpan.textContent = `Kurang: ${formatRupiah(Math.abs(change))}`;
    } else {
        changeRow.classList.remove('change-negative');
        changeRow.classList.add('change-positive');
    }

    processPaymentBtn.disabled = cart.length === 0 || amountPaid < currentTotal;
}

discountTypeSelect.addEventListener('change', () => {
    if (discountTypeSelect.value === 'none') {
        discountValueGroup.style.display = 'none';
        discountValueInput.value = 0;
    } else {
        discountValueGroup.style.display = 'block';
    }
    calculateCartTotals();
});

discountValueInput.addEventListener('input', calculateCartTotals);
amountPaidInput.addEventListener('input', calculateCartTotals);

processPaymentBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong.', 'warning');
        return;
    }

    const totalAmount = parseFloat(totalPaymentSpan.textContent.replace(/[^0-9,-]+/g, "").replace(",", "."));
    const amountPaid = parseFloat(amountPaidInput.value);

    if (amountPaid < totalAmount) {
        showNotification('Jumlah dibayar kurang dari total pembayaran!', 'error');
        return;
    }

    const transactionDetails = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        costPrice: item.costPrice,
        total: item.quantity * item.price
    }));

    const newTransaction = {
        id: generateId('TRX', transactionIdCounter++),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID'),
        items: transactionDetails,
        subtotal: cart.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        discountType: discountTypeSelect.value,
        discountValue: parseFloat(discountValueInput.value) || 0,
        discountAmount: parseFloat(discountSpan.textContent.replace(/[^0-9,-]+/g, "").replace(",", ".")),
        total: totalAmount,
        amountPaid: amountPaid,
        change: amountPaid - totalAmount
    };

    transactions.push(newTransaction);
    saveData();
    showNotification('Pembayaran berhasil diproses!', 'success');
    clearCart();
    updateRecapSummary();
    updateChart();
    renderTransactionList();
    clearKasirInputs();

    showTransactionDetailModal(newTransaction);
});

clearCartBtn.addEventListener('click', () => {
    if (confirm('Anda yakin ingin mengosongkan keranjang? Stok produk akan dikembalikan.')) {
        clearCart();
        showNotification('Keranjang telah dikosongkan.', 'info');
        saveData();
    }
});

function clearCart() {
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock += cartItem.quantity;
        }
    });
    cart = [];
    discountTypeSelect.value = 'none';
    discountValueInput.value = '0';
    discountValueGroup.style.display = 'none';
    amountPaidInput.value = '0';
    updateCartDisplay();
    saveData();
}

// --- Produk Tab Logic ---
newProductCostPriceInput.addEventListener('input', calculateMarkup);
newProductPriceInput.addEventListener('input', calculateMarkup);
modalProductCostPrice.addEventListener('input', calculateModalMarkup);
modalProductPrice.addEventListener('input', calculateModalMarkup);

function calculateMarkup() {
    const costPrice = parseFloat(newProductCostPriceInput.value);
    const sellPrice = parseFloat(newProductPriceInput.value);
    if (costPrice > 0 && sellPrice >= costPrice) {
        const markup = ((sellPrice - costPrice) / costPrice) * 100;
        newProductMarkupPercentageInput.value = markup.toFixed(2);
    } else {
        newProductMarkupPercentageInput.value = '0.00';
    }
}

function calculateModalMarkup() {
    const costPrice = parseFloat(modalProductCostPrice.value);
    const sellPrice = parseFloat(modalProductPrice.value);
    if (costPrice > 0 && sellPrice >= costPrice) {
        const markup = ((sellPrice - costPrice) / costPrice) * 100;
        modalProductMarkupPercentage.value = markup.toFixed(2);
    } else {
        modalProductMarkupPercentage.value = '0.00';
    }
}

addNewProductBtn.addEventListener('click', () => {
    const name = newProductNameInput.value.trim();
    const category = newProductCategoryInput.value.trim();
    const costPrice = parseFloat(newProductCostPriceInput.value);
    const price = parseFloat(newProductPriceInput.value);
    const stock = parseInt(newProductStockInput.value);
    const minStock = parseInt(newProductMinStockInput.value);

    if (!name || !category || isNaN(costPrice) || costPrice < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || isNaN(minStock) || minStock < 0) {
        showNotification('Harap isi semua kolom produk dengan benar.', 'warning');
        return;
    }
    if (price < costPrice) {
        showNotification('Harga jual tidak boleh lebih rendah dari harga beli.', 'error');
        return;
    }

    const productId = generateId('PRD', productIdCounter++);
    const newProduct = {
        id: productId,
        name: name,
        category: category,
        costPrice: costPrice,
        price: price,
        stock: stock,
        minStock: minStock
    };

    products.push(newProduct);
    saveData();
    showNotification(`Produk "${name}" berhasil ditambahkan!`, 'success');
    clearNewProductInputs();
});

function clearNewProductInputs() {
    newProductNameInput.value = '';
    newProductCategoryInput.value = '';
    newProductCostPriceInput.value = '0';
    newProductPriceInput.value = '0';
    newProductMarkupPercentageInput.value = '0.00';
    newProductStockInput.value = '0';
    newProductMinStockInput.value = '0';
}

function renderProductList() {
    productListBody.innerHTML = '';
    if (products.length === 0) {
        productListBody.innerHTML = '<tr><td colspan="9" class="empty-table-message">Belum ada produk yang tercatat.</td></tr>';
        return;
    }
    products.forEach(product => {
        const markupPercentage = product.costPrice > 0 ? (((product.price - product.costPrice) / product.costPrice) * 100).toFixed(2) : '0.00';
        const row = productListBody.insertRow();
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatRupiah(product.costPrice)}</td>
            <td>${formatRupiah(product.price)}</td>
            <td>${markupPercentage}%</td>
            <td>${product.stock}</td>
            <td>${product.minStock}</td>
            <td class="table-actions">
                <button class="info" data-id="${product.id}" data-action="adjust-stock"><i data-feather="repeat"></i> Stok</button>
                <button class="secondary" data-id="${product.id}" data-action="edit"><i data-feather="edit"></i> Edit</button>
                <button class="danger" data-id="${product.id}" data-action="delete"><i data-feather="trash"></i> Hapus</button>
            </td>
        `;
    });
    feather.replace();
}

productListBody.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        const productId = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'edit') {
            openEditProductModal(productId);
        } else if (action === 'delete') {
            deleteProduct(productId);
        } else if (action === 'adjust-stock') {
            openStockAdjustmentModal(productId);
        }
    }
});

function openEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        modalProductId.value = product.id;
        modalProductName.value = product.name;
        modalProductCategory.value = product.category;
        modalProductCostPrice.value = product.costPrice;
        modalProductPrice.value = product.price;
        modalProductStock.value = product.stock;
        modalProductMinStock.value = product.minStock;
        calculateModalMarkup();
        editProductModal.classList.add('active');
    }
}

editProductModal.querySelector('.close-button').addEventListener('click', () => {
    editProductModal.classList.remove('active');
});
cancelEditBtn.addEventListener('click', () => {
    editProductModal.classList.remove('active');
});

saveProductBtn.addEventListener('click', () => {
    const id = modalProductId.value;
    const name = modalProductName.value.trim();
    const category = modalProductCategory.value.trim();
    const costPrice = parseFloat(modalProductCostPrice.value);
    const price = parseFloat(modalProductPrice.value);
    const stock = parseInt(modalProductStock.value);
    const minStock = parseInt(modalProductMinStock.value);

    if (!name || !category || isNaN(costPrice) || costPrice < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || isNaN(minStock) || minStock < 0) {
        showNotification('Harap isi semua kolom dengan benar.', 'warning');
        return;
    }
    if (price < costPrice) {
        showNotification('Harga jual tidak boleh lebih rendah dari harga beli.', 'error');
        return;
    }

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex > -1) {
        products[productIndex] = { ...products[productIndex], name, category, costPrice, price, stock, minStock };
        saveData();
        showNotification(`Produk "${name}" berhasil diperbarui.`, 'success');
        editProductModal.classList.remove('active');
    } else {
        showNotification('Produk tidak ditemukan.', 'error');
    }
});

function deleteProduct(productId) {
    if (confirm('Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== productId);
        saveData();
        showNotification('Produk berhasil dihapus.', 'info');
    }
}

// --- Stock Adjustment Modal Logic ---
function openStockAdjustmentModal(productId) {
    currentProductForStockAdjustment = products.find(p => p.id === productId);
    if (currentProductForStockAdjustment) {
        stockProductNameDisplay.textContent = currentProductForStockAdjustment.name;
        stockProductIdDisplay.textContent = currentProductForStockAdjustment.id;
        currentStockDisplay.textContent = currentProductForStockAdjustment.stock;
        stockAdjustmentQuantity.value = 1;
        stockAdjustmentReason.value = '';
        stockAdjustmentType.value = 'in'; // Default to 'in'
        stockAdjustmentModal.classList.add('active');
    }
}

stockAdjustmentModal.querySelector('.close-button').addEventListener('click', () => {
    stockAdjustmentModal.classList.remove('active');
});
cancelStockAdjustmentBtn.addEventListener('click', () => {
    stockAdjustmentModal.classList.remove('active');
});

saveStockAdjustmentBtn.addEventListener('click', () => {
    if (!currentProductForStockAdjustment) return;

    const quantity = parseInt(stockAdjustmentQuantity.value);
    const type = stockAdjustmentType.value;
    const reason = stockAdjustmentReason.value.trim();

    if (isNaN(quantity) || quantity <= 0) {
        showNotification('Jumlah penyesuaian harus lebih dari 0.', 'warning');
        return;
    }

    const productIndex = products.findIndex(p => p.id === currentProductForStockAdjustment.id);
    if (productIndex === -1) {
        showNotification('Produk tidak ditemukan.', 'error');
        return;
    }

    if (type === 'in') {
        products[productIndex].stock += quantity;
        showNotification(`Stok ${currentProductForStockAdjustment.name} ditambahkan sebanyak ${quantity}.`, 'success');
    } else if (type === 'out') {
        if (products[productIndex].stock < quantity) {
            showNotification(`Stok ${currentProductForStockAdjustment.name} tidak cukup untuk dikurangi sebanyak ${quantity}. Stok saat ini: ${products[productIndex].stock}`, 'error');
            return;
        }
        products[productIndex].stock -= quantity;
        showNotification(`Stok ${currentProductForStockAdjustment.name} dikurangi sebanyak ${quantity}.`, 'warning');
    }

    saveData();
    stockAdjustmentModal.classList.remove('active');
    currentProductForStockAdjustment = null;
});


// --- Pengeluaran Tab Logic ---
addExpenseBtn.addEventListener('click', () => {
    const date = expenseDateInput.value;
    const category = expenseCategoryInput.value.trim();
    const description = expenseDescriptionInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (!date || !category || isNaN(amount) || amount <= 0) {
        showNotification('Harap isi tanggal, kategori, dan jumlah pengeluaran dengan benar.', 'warning');
        return;
    }

    const newExpense = {
        id: generateId('EXP', expenseIdCounter++),
        date: date,
        category: category,
        description: description,
        amount: amount
    };

    expenses.push(newExpense);
    saveData();
    showNotification(`Pengeluaran "${category}" sejumlah ${formatRupiah(amount)} berhasil ditambahkan.`, 'success');
    clearExpenseInputs();
    updateRecapSummary();
});

function clearExpenseInputs() {
    expenseDateInput.valueAsDate = new Date(); // Set to current date
    expenseCategoryInput.value = '';
    expenseDescriptionInput.value = '';
    expenseAmountInput.value = '0';
}

function renderExpenseList() {
    expenseListBody.innerHTML = '';
    if (expenses.length === 0) {
        expenseListBody.innerHTML = '<tr><td colspan="6" class="empty-table-message">Belum ada pengeluaran yang tercatat.</td></tr>';
        return;
    }
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
        const row = expenseListBody.insertRow();
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${formatRupiah(expense.amount)}</td>
            <td class="table-actions">
                <button class="secondary" data-id="${expense.id}" data-action="edit"><i data-feather="edit"></i> Edit</button>
                <button class="danger" data-id="${expense.id}" data-action="delete"><i data-feather="trash"></i> Hapus</button>
            </td>
        `;
    });
    feather.replace();
}

expenseListBody.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        const expenseId = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'edit') {
            openEditExpenseModal(expenseId);
        } else if (action === 'delete') {
            deleteExpense(expenseId);
        }
    }
});

function openEditExpenseModal(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
        modalExpenseId.value = expense.id;
        modalExpenseDate.value = expense.date;
        modalExpenseCategory.value = expense.category;
        modalExpenseDescription.value = expense.description;
        modalExpenseAmount.value = expense.amount;
        editExpenseModal.classList.add('active');
    }
}

editExpenseModal.querySelector('.close-button').addEventListener('click', () => {
    editExpenseModal.classList.remove('active');
});
cancelExpenseEditBtn.addEventListener('click', () => {
    editExpenseModal.classList.remove('active');
});

saveExpenseBtn.addEventListener('click', () => {
    const id = modalExpenseId.value;
    const date = modalExpenseDate.value;
    const category = modalExpenseCategory.value.trim();
    const description = modalExpenseDescription.value.trim();
    const amount = parseFloat(modalExpenseAmount.value);

    if (!date || !category || isNaN(amount) || amount <= 0) {
        showNotification('Harap isi semua kolom dengan benar.', 'warning');
        return;
    }

    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex > -1) {
        expenses[expenseIndex] = { ...expenses[expenseIndex], date, category, description, amount };
        saveData();
        showNotification(`Pengeluaran ID ${id} berhasil diperbarui.`, 'success');
        editExpenseModal.classList.remove('active');
    } else {
        showNotification('Pengeluaran tidak ditemukan.', 'error');
    }
});

function deleteExpense(expenseId) {
    if (confirm('Anda yakin ingin menghapus pengeluaran ini?')) {
        expenses = expenses.filter(e => e.id !== expenseId);
        saveData();
        showNotification('Pengeluaran berhasil dihapus.', 'info');
    }
}

// --- Laporan Penjualan Tab Logic ---
reportDateFilter.addEventListener('change', renderTransactionList);

function renderTransactionList() {
    transactionListBody.innerHTML = '';
    const filterDate = reportDateFilter.value; // Format YYYY-MM

    const filteredTransactions = transactions.filter(t => {
        if (!filterDate) return true;
        return t.date.startsWith(filterDate);
    });

    if (filteredTransactions.length === 0) {
        transactionListBody.innerHTML = '<tr><td colspan="5" class="empty-table-message">Tidak ada transaksi untuk periode ini.</td></tr>';
        return;
    }

    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(transaction => {
        const row = transactionListBody.insertRow();
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${formatRupiah(transaction.total)}</td>
            <td>${formatRupiah(transaction.discountAmount)}</td>
            <td class="table-actions">
                <button class="info" data-id="${transaction.id}" data-action="view-detail"><i data-feather="eye"></i> Detail</button>
                <button class="danger" data-id="${transaction.id}" data-action="delete-transaction"><i data-feather="trash"></i> Hapus</button>
            </td>
        `;
    });
    feather.replace();
}

transactionListBody.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        const transactionId = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'view-detail') {
            showTransactionDetailModal(transactions.find(t => t.id === transactionId));
        } else if (action === 'delete-transaction') {
            deleteTransaction(transactionId);
        }
    }
});

function showTransactionDetailModal(transaction) {
    if (!transaction) return;

    detailTransactionId.textContent = transaction.id;
    detailTransactionDate.textContent = transaction.date;
    detailTransactionSubtotal.textContent = formatRupiah(transaction.subtotal);
    detailTransactionDiscount.textContent = formatRupiah(transaction.discountAmount);
    detailTransactionTotal.textContent = formatRupiah(transaction.total);
    detailTransactionPaid.textContent = formatRupiah(transaction.amountPaid);
    detailTransactionChange.textContent = formatRupiah(transaction.change);

    detailTransactionItems.innerHTML = '';
    transaction.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.quantity} x ${formatRupiah(item.price)}) = ${formatRupiah(item.total)}`;
        detailTransactionItems.appendChild(li);
    });

    transactionDetailModal.classList.add('active');
}

transactionDetailModal.querySelector('.close-button').addEventListener('click', () => {
    transactionDetailModal.classList.remove('active');
});
closeDetailModalBtn.addEventListener('click', () => {
    transactionDetailModal.classList.remove('active');
});

printReceiptBtn.addEventListener('click', () => {
    const transactionId = detailTransactionId.textContent;
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        generateReceiptContent(transaction);
        window.print();
    }
});

function generateReceiptContent(transaction) {
    let receiptHtml = `
        <div class="header">
            <h3>${companyName}</h3>
            <p>Struk Penjualan</p>
            <p>Tanggal: ${transaction.date} ${transaction.time}</p>
            <p>ID Transaksi: ${transaction.id}</p>
        </div>
        <div class="separator"></div>
        <h4>Detail Item:</h4>
    `;
    transaction.items.forEach(item => {
        receiptHtml += `
            <div class="item-row">
                <span class="item-name">${item.name}</span>
                <span class="item-qty-price">${item.quantity} x ${formatRupiah(item.price)}</span>
            </div>
            <div class="item-row text-right">Total: ${formatRupiah(item.total)}</div>
        `;
    });

    receiptHtml += `
        <div class="separator"></div>
        <div class="summary-row"><span>Subtotal:</span> <span class="text-right">${formatRupiah(transaction.subtotal)}</span></div>
        <div class="summary-row"><span>Diskon:</span> <span class="text-right">${formatRupiah(transaction.discountAmount)}</span></div>
        <div class="separator"></div>
        <div class="summary-row total"><span>TOTAL:</span> <span class="text-right">${formatRupiah(transaction.total)}</span></div>
        <div class="summary-row"><span>Dibayar:</span> <span class="text-right">${formatRupiah(transaction.amountPaid)}</span></div>
        <div class="summary-row"><span>Kembalian:</span> <span class="text-right">${formatRupiah(transaction.change)}</span></div>
        <div class="separator"></div>
        <div class="footer">
            <p>Terima Kasih Atas Kunjungan Anda!</p>
        </div>
    `;
    printReceiptContent.innerHTML = receiptHtml;
}

function deleteTransaction(transactionId) {
    if (confirm('Anda yakin ingin menghapus transaksi ini? Stok produk yang terjual pada transaksi ini tidak akan dikembalikan secara otomatis. Pastikan Anda mengelola stok secara manual jika diperlukan.')) {
        transactions = transactions.filter(t => t.id !== transactionId);
        saveData();
        showNotification('Transaksi berhasil dihapus.', 'info');
        updateRecapSummary();
        updateChart();
    }
}


// --- Rekapan Keuangan Tab Logic ---
function updateRecapSummary() {
    let totalRevenue = 0;
    let totalCostOfGoodsSold = 0; // HPP (Harga Pokok Penjualan)
    let totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    transactions.forEach(transaction => {
        totalRevenue += transaction.total;
        transaction.items.forEach(item => {
            totalCostOfGoodsSold += item.quantity * item.costPrice;
        });
    });

    const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses;

    recapRevenueSpan.textContent = formatRupiah(totalRevenue);
    recapCostOfGoodsSpan.textContent = formatRupiah(totalCostOfGoodsSold);
    recapTotalExpenseSpan.textContent = formatRupiah(totalExpenses);
    recapProfitSpan.textContent = formatRupiah(netProfit);

    if (netProfit < 0) {
        recapProfitSpan.parentElement.classList.remove('profit');
        recapProfitSpan.parentElement.classList.add('expense'); // Use expense styling for negative profit
    } else {
        recapProfitSpan.parentElement.classList.remove('expense');
        recapProfitSpan.parentElement.classList.add('profit');
    }
}

// Chart Logic
chartFilterSelect.addEventListener('change', updateChart);

function getDatesForChart(filter) {
    const now = new Date();
    let labels = [];

    switch (filter) {
        case 'daily':
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                labels.push(d.toISOString().split('T')[0]);
            }
            break;
        case 'weekly':
            // Last 12 weeks
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - (i * 7)); // Go back by weeks
                // Get the start of the week (e.g., Monday or Sunday)
                const dayOfWeek = d.getDay(); // 0 for Sunday, 1 for Monday
                const startOfWeek = new Date(d);
                // Adjust to Monday for consistency (if Sunday, go back 6 days; otherwise, go back to previous Monday)
                startOfWeek.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
                labels.push(`Minggu ${startOfWeek.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`);
            }
            break;
        case 'monthly':
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now);
                d.setMonth(now.getMonth() - i);
                labels.push(d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }));
            }
            break;
        case 'yearly':
            // Last 5 years (adjust as needed)
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                labels.push(year.toString());
            }
            break;
    }
    return labels;
}

function calculateChartData(labels, filter) {
    const data = Array(labels.length).fill(0);

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        let labelIndex = -1;

        switch (filter) {
            case 'daily':
                const dateString = transaction.date;
                labelIndex = labels.indexOf(dateString);
                break;
            case 'weekly':
                const dayOfWeek = transactionDate.getDay();
                const startOfWeek = new Date(transactionDate);
                startOfWeek.setDate(transactionDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday
                const weekLabel = `Minggu ${startOfWeek.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;
                labelIndex = labels.indexOf(weekLabel);
                break;
            case 'monthly':
                const monthLabel = transactionDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
                labelIndex = labels.indexOf(monthLabel);
                break;
            case 'yearly':
                const yearLabel = transactionDate.getFullYear().toString();
                labelIndex = labels.indexOf(yearLabel);
                break;
        }

        if (labelIndex !== -1) {
            data[labelIndex] += transaction.total;
        }
    });
    return data;
}

function updateChart() {
    const filter = chartFilterSelect.value;
    const labels = getDatesForChart(filter);
    const data = calculateChartData(labels, filter);

    if (incomeChart) {
        incomeChart.destroy();
    }

    const hasData = data.some(val => val > 0);
    if (!hasData) {
        incomeTrendChartCanvas.style.display = 'none';
        chartEmptyMessage.style.display = 'block';
        return;
    } else {
        incomeTrendChartCanvas.style.display = 'block';
        chartEmptyMessage.style.display = 'none';
    }


    const ctx = incomeTrendChartCanvas.getContext('2d');
    incomeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pendapatan (Rp)',
                data: data,
                backgroundColor: 'rgba(184, 134, 11, 0.4)', // Primary gold with transparency
                borderColor: 'var(--primary-gold)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'var(--accent-gold)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'var(--primary-dark-gold)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'var(--text-color)',
                        font: {
                            size: 14,
                            family: 'Poppins'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatRupiah(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'var(--light-text-color)',
                        font: { family: 'Poppins' }
                    },
                    grid: {
                        color: 'var(--border-color)'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return formatRupiah(value);
                        },
                        color: 'var(--light-text-color)',
                        font: { family: 'Poppins' }
                    },
                    grid: {
                        color: 'var(--border-color)'
                    }
                }
            }
        }
    });
}


// --- Pengaturan Tab Logic ---
saveCompanyNameBtn.addEventListener('click', () => {
    const newName = companyNameInput.value.trim();
    if (newName) {
        companyName = newName;
        saveData();
        showNotification('Nama perusahaan berhasil diperbarui!', 'success');
    } else {
        showNotification('Nama perusahaan tidak boleh kosong.', 'warning');
    }
});

addNewUserBtn.addEventListener('click', () => {
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk menambahkan pengguna.', 'error');
        return;
    }

    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value.trim();
    const role = newUserRoleSelect.value;

    if (!username || !password) {
        showNotification('Username dan password tidak boleh kosong.', 'warning');
        return;
    }
    if (users.some(u => u.username === username)) {
        showNotification('Username sudah ada, pilih username lain.', 'error');
        return;
    }

    users.push({ username, password, role });
    saveData();
    showNotification(`Pengguna "${username}" (${role}) berhasil ditambahkan.`, 'success');
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    newUserRoleSelect.value = 'kasir';
});

function renderUserList() {
    userListDisplay.innerHTML = '';
    if (users.length <= 1 && users.some(u => u.username === 'admin')) { // Only default admin
        userListDisplay.innerHTML = '<p class="empty-table-message">Tidak ada pengguna lain. Admin default selalu ada.</p>';
        return;
    }
    const ul = document.createElement('ul');
    users.filter(u => u.username !== 'admin').forEach(user => { // Don't allow deleting default admin
        const li = document.createElement('li');
        li.innerHTML = `
                    ${user.username} (${user.role})
                    <button class="danger" style="margin-left: 15px; padding: 5px 10px; font-size: 0.8em; border-radius: 5px;" data-username="${user.username}" data-action="delete-user">Hapus</button>
                `;
        ul.appendChild(li);
    });
    userListDisplay.appendChild(ul);
    feather.replace();
}

userListDisplay.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action="delete-user"]');
    if (button) {
        if (currentUser.role !== 'admin') {
            showNotification('Anda tidak memiliki izin untuk menghapus pengguna.', 'error');
            return;
        }
        const usernameToDelete = button.dataset.username;
        if (confirm(`Anda yakin ingin menghapus pengguna "${usernameToDelete}"?`)) {
            users = users.filter(u => u.username !== usernameToDelete);
            saveData();
            showNotification(`Pengguna "${usernameToDelete}" berhasil dihapus.`, 'info');
        }
    }
});

// PDF Export Functions
exportProductsPdfBtn.addEventListener('click', () => {
    const element = document.createElement('div');
    let content = `<h2>Daftar Produk ${companyName}</h2>`;
    if (products.length === 0) {
        content += '<p>Belum ada produk yang tercatat.</p>';
    } else {
        content += `
            <style>
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 10px;}
                th { background-color: #f2f2f2; }
            </style>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                        <th>Markup (%)</th>
                        <th>Stok</th>
                        <th>Min. Stok</th>
                    </tr>
                </thead>
                <tbody>
        `;
        products.forEach(p => {
            const markup = p.costPrice > 0 ? (((p.price - p.costPrice) / p.costPrice) * 100).toFixed(2) : '0.00';
            content += `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.name}</td>
                            <td>${p.category}</td>
                            <td>${formatRupiah(p.costPrice)}</td>
                            <td>${formatRupiah(p.price)}</td>
                            <td>${markup}%</td>
                            <td>${p.stock}</td>
                            <td>${p.minStock}</td>
                        </tr>
                    `;
        });
        content += `</tbody></table>`;
    }
    element.innerHTML = content;
    html2pdf().from(element).save(`Daftar Produk ${companyName}.pdf`);
    showNotification('Mengekspor daftar produk ke PDF...', 'info');
});

exportTransactionsPdfBtn.addEventListener('click', () => {
    const element = document.createElement('div');
    const filterDate = reportDateFilter.value;
    let title = `Laporan Penjualan ${companyName}`;
    if (filterDate) {
        const [year, month] = filterDate.split('-');
        const monthName = new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        title += ` Bulan ${monthName}`;
    }

    const filteredTransactions = transactions.filter(t => {
        if (!filterDate) return true;
        return t.date.startsWith(filterDate);
    });

    let content = `<h2>${title}</h2>`;
    if (filteredTransactions.length === 0) {
        content += '<p>Tidak ada transaksi untuk periode ini.</p>';
    } else {
        content += `
            <style>
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 10px;}
                th { background-color: #f2f2f2; }
            </style>
            <table>
                <thead>
                    <tr>
                        <th>ID Transaksi</th>
                        <th>Tanggal</th>
                        <th>Item</th>
                        <th>Subtotal</th>
                        <th>Diskon</th>
                        <th>Total</th>
                        <th>Dibayar</th>
                        <th>Kembalian</th>
                    </tr>
                </thead>
                <tbody>
        `;
        filteredTransactions.forEach(t => {
            const itemsList = t.items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
            content += `
                        <tr>
                            <td>${t.id}</td>
                            <td>${t.date}</td>
                            <td>${itemsList}</td>
                            <td>${formatRupiah(t.subtotal)}</td>
                            <td>${formatRupiah(t.discountAmount)}</td>
                            <td>${formatRupiah(t.total)}</td>
                            <td>${formatRupiah(t.amountPaid)}</td>
                            <td>${formatRupiah(t.change)}</td>
                        </tr>
                    `;
        });
        content += `</tbody></table>`;
    }
    element.innerHTML = content;
    html2pdf().from(element).save(`${title}.pdf`);
    showNotification('Mengekspor laporan penjualan ke PDF...', 'info');
});

exportExpensesPdfBtn.addEventListener('click', () => {
    const element = document.createElement('div');
    let content = `<h2>Daftar Pengeluaran ${companyName}</h2>`;
    if (expenses.length === 0) {
        content += '<p>Belum ada pengeluaran yang tercatat.</p>';
    } else {
        content += `
            <style>
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 10px;}
                th { background-color: #f2f2f2; }
            </style>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tanggal</th>
                        <th>Kategori</th>
                        <th>Deskripsi</th>
                        <th>Jumlah (Rp)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        expenses.forEach(e => {
            content += `
                        <tr>
                            <td>${e.id}</td>
                            <td>${e.date}</td>
                            <td>${e.category}</td>
                            <td>${e.description}</td>
                            <td>${formatRupiah(e.amount)}</td>
                        </tr>
                    `;
        });
        content += `</tbody></table>`;
    }
    element.innerHTML = content;
    html2pdf().from(element).save(`Daftar Pengeluaran ${companyName}.pdf`);
    showNotification('Mengekspor daftar pengeluaran ke PDF...', 'info');
});

exportRecapPdfBtn.addEventListener('click', () => {
    const element = document.createElement('div');

    let totalRevenue = 0;
    let totalCostOfGoodsSold = 0;
    let totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    transactions.forEach(transaction => {
        totalRevenue += transaction.total;
        transaction.items.forEach(item => {
            totalCostOfGoodsSold += item.quantity * item.costPrice;
        });
    });

    const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses;

    let content = `<h2>Rekapan Keuangan ${companyName}</h2>
                <style>
                    .recap-item { margin-bottom: 10px; font-size: 14px; }
                    .recap-item span:first-child { font-weight: bold; display: inline-block; width: 150px; }
                    .recap-profit { color: ${netProfit >= 0 ? 'green' : 'red'}; font-size: 18px; font-weight: bold;}
                </style>
                <div class="recap-item"><span>Total Pendapatan:</span> ${formatRupiah(totalRevenue)}</div>
                <div class="recap-item"><span>Total HPP:</span> ${formatRupiah(totalCostOfGoodsSold)}</div>
                <div class="recap-item"><span>Total Pengeluaran:</span> ${formatRupiah(totalExpenses)}</div>
                <div class="recap-item recap-profit"><span>Laba Bersih:</span> ${formatRupiah(netProfit)}</div>
            `;
    element.innerHTML = content;
    html2pdf().from(element).save(`Rekapan Keuangan ${companyName}.pdf`);
    showNotification('Mengekspor rekapan keuangan ke PDF...', 'info');
});

exportChartPdfBtn.addEventListener('click', () => {
    if (!incomeChart || chartEmptyMessage.style.display === 'block') {
        showNotification('Tidak ada data grafik untuk diekspor.', 'warning');
        return;
    }

    // Get image of the chart
    const chartImage = incomeTrendChartCanvas.toDataURL('image/png');

    const element = document.createElement('div');
    element.innerHTML = `
                <h2>Grafik Pendapatan ${companyName} (${chartFilterSelect.options[chartFilterSelect.selectedIndex].text})</h2>
                <img src="${chartImage}" style="max-width: 100%; height: auto; display: block; margin: 20px auto;">
            `;

    html2pdf().from(element).save(`Grafik Pendapatan ${companyName}.pdf`);
    showNotification('Mengekspor grafik pendapatan ke PDF...', 'info');
});


// Clear All Data
clearAllDataBtn.addEventListener('click', () => {
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk menghapus semua data.', 'error');
        return;
    }
    if (confirm('PERINGATAN: Tindakan ini akan menghapus SEMUA data aplikasi secara permanen! Anda yakin ingin melanjutkan?')) {
        localStorage.clear();
        products = [];
        expenses = [];
        transactions = [];
        users = [{ username: 'admin', password: 'admin123', role: 'admin' }];
        companyName = 'Akuntansi Pintar';
        cart = [];
        transactionIdCounter = 1;
        expenseIdCounter = 1;
        productIdCounter = 101;
        currentUser = null; // Force re-login
        showNotification('Semua data aplikasi telah dihapus. Harap login kembali.', 'success');
        loginModal.classList.add('active');
        loginModal.style.display = 'flex'; // Ensure modal is visible after clearing data
        updateUI(); // Refresh UI after clearing data
    }
});

// About Us Modal
aboutUsLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutUsModal.classList.add('active');
});

aboutUsModal.querySelector('.close-button').addEventListener('click', () => {
    aboutUsModal.classList.remove('active');
});

closeAboutUsModalBtn.addEventListener('click', () => {
    aboutUsModal.classList.remove('active');
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    updateCompanyNameDisplay();

    // Set current date for expense input
    expenseDateInput.valueAsDate = new Date();

    // Initial render of product list, cart, and recap
    updateUI();

    // Check for existing user, otherwise show login modal
    if (!currentUser) {
        loginModal.classList.add('active');
        loginModal.style.display = 'flex'; // Explicitly set display to flex
    } else {
        updateTabVisibility();
        // Manually click the active tab to ensure its content is loaded
        const activeTabButton = document.querySelector('.tab-button.active');
        if (activeTabButton && activeTabButton.style.display !== 'none') {
            activeTabButton.click();
        } else if (document.querySelector('.tab-button[data-tab="kasir"]').style.display !== 'none') {
            // Fallback: If current active tab is hidden, try activating Kasir
            document.querySelector('.tab-button[data-tab="kasir"]').click();
        } else {
            // If Kasir is also hidden (e.g., if roles change), just ensure some content shows
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById('kasir').classList.add('active'); // Default to kasir
        }
    }

    // Set initial month for report filter
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    reportDateFilter.value = `${year}-${month}`;
});

// Login Event Listener
loginBtn.addEventListener('click', handleLogin);
loginPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
});
