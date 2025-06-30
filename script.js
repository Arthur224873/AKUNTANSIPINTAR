// Variabel Global
let products = JSON.parse(localStorage.getItem('products')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [{ username: 'admin', password: 'admin123', role: 'admin' }];
let companyName = localStorage.getItem('companyName') || 'Akuntansi Pintar';
let receiptLogoUrl = localStorage.getItem('receiptLogoUrl') || ''; // New: Store logo URL
let cart = [];
let transactionIdCounter = parseInt(localStorage.getItem('transactionIdCounter')) || 1;
let expenseIdCounter = parseInt(localStorage.getItem('expenseIdCounter')) || 1;
let productIdCounter = parseInt(localStorage.getItem('productIdCounter')) || 101;
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const mainContent = document.getElementById('main-content');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const currentUserNameSpan = document.getElementById('current-user-name');
const currentUserRoleSpan = document.getElementById('current-user-role');
const logoutButton = document.getElementById('logout-button');
const notificationContainer = document.getElementById('notification-container');

// POS Tab Elements
const productSelect = document.getElementById('product-select');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartItemsBody = document.getElementById('cart-items-body');
const subtotalDisplay = document.getElementById('subtotal-display');
const discountInput = document.getElementById('discount-input');
const totalDisplay = document.getElementById('total-display');
const amountPaidInput = document.getElementById('amount-paid-input');
const changeDisplay = document.getElementById('change-display');
const processPaymentBtn = document.getElementById('process-payment-btn');
const printReceiptBtn = document.getElementById('print-receipt-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const receiptModal = document.getElementById('receipt-modal');
const closeReceiptModalBtn = document.getElementById('close-receipt-modal-btn');
const printReceiptContent = document.getElementById('print-receipt-content');
const receiptLogo = document.getElementById('receipt-logo'); // New: Receipt logo element

// Products Tab Elements
const productListBody = document.getElementById('product-list-body');
const addProductForm = document.getElementById('add-product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productCategoryInput = document.getElementById('product-category');
const productStockInput = document.getElementById('product-stock');
const productSearchInput = document.getElementById('product-search');
const productCategoryFilter = document.getElementById('product-category-filter');

// Expenses Tab Elements
const expenseListBody = document.getElementById('expense-list-body');
const addExpenseForm = document.getElementById('add-expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');

// Reports Tab Elements
const reportDateFilter = document.getElementById('report-date-filter');
const transactionListBody = document.getElementById('transaction-list-body');
const recapSales = document.getElementById('recap-sales');
const recapExpenses = document.getElementById('recap-expenses');
const recapProfit = document.getElementById('recap-profit');
const salesChartCanvas = document.getElementById('salesChart');

// Users Tab Elements
const userListBody = document.getElementById('user-list-body');
const addUserForm = document.getElementById('add-user-form');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const newUserRoleInput = document.getElementById('new-user-role');

// Settings Tab Elements
const companyNameInput = document.getElementById('company-name-input');
const saveCompanyNameBtn = document.getElementById('save-company-name-btn');
const clearAllDataBtn = document.getElementById('clear-all-data-btn');
const receiptLogoUrlInput = document.getElementById('receipt-logo-url-input'); // New: Logo URL input
const saveReceiptLogoBtn = document.getElementById('save-receipt-logo-btn'); // New: Save logo button
const clearReceiptLogoBtn = document.getElementById('clear-receipt-logo-btn'); // New: Clear logo button


// --- Fungsi Umum ---

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('receiptLogoUrl', receiptLogoUrl); // New: Save logo URL
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
    updateReceiptLogoDisplay(); // New: Update logo display
    feather.replace(); // Re-render Feather icons
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('hide');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000);
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function updateCompanyNameDisplay() {
    document.querySelectorAll('.company-name-display').forEach(element => {
        element.textContent = companyName;
    });
}

// New: Function to update receipt logo display
function updateReceiptLogoDisplay() {
    if (receiptLogoUrl) {
        receiptLogo.src = receiptLogoUrl;
        receiptLogo.style.display = 'block'; // Tampilkan logo jika ada URL
    } else {
        receiptLogo.src = '';
        receiptLogo.style.display = 'none'; // Sembunyikan logo jika tidak ada URL
    }
}

// --- Login & Authentication ---

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        loginModal.classList.remove('active');
        mainContent.classList.add('active');
        currentUserNameSpan.textContent = currentUser.username;
        currentUserRoleSpan.textContent = currentUser.role;
        showNotification(`Selamat datang, ${currentUser.username}!`, 'success');
        updateUI();
    } else {
        showNotification('Username atau password salah!', 'error');
    }
});

logoutButton.addEventListener('click', () => {
    currentUser = null;
    loginModal.classList.add('active');
    mainContent.classList.remove('active');
    usernameInput.value = '';
    passwordInput.value = '';
    showNotification('Anda telah logout.', 'info');
});

// --- Tab Navigation ---

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const targetTab = document.getElementById(button.dataset.tab);
        targetTab.classList.add('active');

        // Update UI based on active tab
        if (button.dataset.tab === 'pos') {
            updateCartDisplay();
        } else if (button.dataset.tab === 'produk') {
            renderProductList();
            populateCategoryFilter();
        } else if (button.dataset.tab === 'laporan') {
            renderTransactionList();
            updateRecapSummary();
            updateChart();
        } else if (button.dataset.tab === 'pengguna') {
            renderUserList();
        } else if (button.dataset.tab === 'pengaturan') {
            companyNameInput.value = companyName;
            receiptLogoUrlInput.value = receiptLogoUrl; // New: Populate logo URL input
            renderUserList(); // To show user list for role management
        }
    });
});

// --- POS Tab Fungsionalitas ---

function populateProductSelect() {
    productSelect.innerHTML = '<option value="">Pilih Produk</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${formatRupiah(product.price)}) - Stok: ${product.stock}`;
        productSelect.appendChild(option);
    });
}

addToCartBtn.addEventListener('click', () => {
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);

    if (!productId || isNaN(quantity) || quantity <= 0) {
        showNotification('Pilih produk dan masukkan kuantitas yang valid.', 'warning');
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        showNotification('Produk tidak ditemukan.', 'error');
        return;
    }

    if (quantity > product.stock) {
        showNotification(`Stok ${product.name} tidak mencukupi. Tersedia: ${product.stock}`, 'warning');
        return;
    }

    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.total = existingCartItem.quantity * existingCartItem.price;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            total: quantity * product.price
        });
    }

    productSelect.value = '';
    quantityInput.value = 1;
    updateCartDisplay();
    showNotification(`${product.name} ditambahkan ke keranjang.`, 'success');
});

function updateCartDisplay() {
    cartItemsBody.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsBody.innerHTML = '<tr><td colspan="5" class="text-center">Keranjang kosong</td></tr>';
    } else {
        cart.forEach(item => {
            const row = cartItemsBody.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${formatRupiah(item.price)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="btn btn-sm btn-secondary decrease-qty-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary increase-qty-btn" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>${formatRupiah(item.total)}</td>
                <td><button class="btn btn-danger btn-sm remove-from-cart-btn" data-id="${item.id}"><i data-feather="trash"></i></button></td>
            `;
            subtotal += item.total;
        });
    }

    subtotalDisplay.textContent = formatRupiah(subtotal);
    calculateTotal();
    feather.replace(); // Re-render Feather icons for new buttons
}

cartItemsBody.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;

    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;

    if (e.target.classList.contains('increase-qty-btn')) {
        const product = products.find(p => p.id === id);
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
            cartItem.total = cartItem.quantity * cartItem.price;
            updateCartDisplay();
        } else {
            showNotification(`Stok ${product.name} tidak mencukupi.`, 'warning');
        }
    } else if (e.target.classList.contains('decrease-qty-btn')) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            cartItem.total = cartItem.quantity * cartItem.price;
            updateCartDisplay();
        } else {
            // If quantity becomes 0, remove from cart
            cart = cart.filter(item => item.id !== id);
            updateCartDisplay();
        }
    } else if (e.target.classList.contains('remove-from-cart-btn')) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
        showNotification('Item dihapus dari keranjang.', 'info');
    }
});

discountInput.addEventListener('input', calculateTotal);
amountPaidInput.addEventListener('input', calculateChange);

function calculateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discount = parseFloat(discountInput.value) || 0;
    let total = subtotal - discount;
    if (total < 0) total = 0; // Prevent negative total
    totalDisplay.textContent = formatRupiah(total);
    calculateChange();
}

function calculateChange() {
    let total = parseFloat(totalDisplay.textContent.replace(/[^0-9,-]+/g, "").replace(',', '.')); // Parse formatted rupiah
    let amountPaid = parseFloat(amountPaidInput.value) || 0;
    let change = amountPaid - total;
    changeDisplay.textContent = formatRupiah(change);
}

processPaymentBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong.', 'warning');
        return;
    }

    let total = parseFloat(totalDisplay.textContent.replace(/[^0-9,-]+/g, "").replace(',', '.'));
    let amountPaid = parseFloat(amountPaidInput.value) || 0;
    let change = amountPaid - total;

    if (amountPaid < total) {
        showNotification('Jumlah yang dibayar kurang dari total belanja.', 'error');
        return;
    }

    // Update product stock
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });

    const now = new Date();
    const transaction = {
        id: transactionIdCounter++,
        date: now.toLocaleDateString('id-ID'),
        time: now.toLocaleTimeString('id-ID'),
        items: [...cart], // Copy cart items
        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
        discountAmount: parseFloat(discountInput.value) || 0,
        total: total,
        amountPaid: amountPaid,
        change: change
    };
    transactions.push(transaction);

    saveData();
    showNotification('Pembayaran berhasil diproses!', 'success');
    generateReceiptContent(transaction);
    receiptModal.classList.add('active');

    // Reset POS
    cart = [];
    discountInput.value = '';
    amountPaidInput.value = '';
    updateCartDisplay();
});

clearCartBtn.addEventListener('click', () => {
    cart = [];
    discountInput.value = '';
    amountPaidInput.value = '';
    updateCartDisplay();
    showNotification('Keranjang belanja telah dikosongkan.', 'info');
});

closeReceiptModalBtn.addEventListener('click', () => {
    receiptModal.classList.remove('active');
});

printReceiptBtn.addEventListener('click', () => {
    const printContent = document.getElementById('print-receipt-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Struk Penjualan</title>
            <style>
                body { font-family: 'monospace', monospace; font-size: 12px; margin: 0; padding: 10px; }
                .receipt-logo-container { text-align: center; margin-bottom: 10px; }
                #receipt-logo-print { max-width: 100px; max-height: 80px; display: block; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 10px; }
                .header h3 { margin: 0; font-size: 14px; }
                .header p { margin: 2px 0; font-size: 11px; }
                .separator { border-top: 1px dashed #000; margin: 10px 0; }
                .item-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                .item-name { flex: 2; }
                .item-qty-price { flex: 1; text-align: right; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                .summary-row.total { font-weight: bold; font-size: 13px; }
                .text-right { text-align: right; }
                .footer { text-align: center; margin-top: 15px; font-size: 11px; }
            </style>
        </head>
        <body>
            ${printContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
});

function generateReceiptContent(transaction) {
    let logoHtml = '';
    if (receiptLogoUrl) {
        logoHtml = `
            <div class="receipt-logo-container">
                <img id="receipt-logo-print" src="${receiptLogoUrl}" alt="Company Logo">
            </div>
        `;
    }

    let receiptHtml = `
        ${logoHtml}
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

    // Optional: Add an onload/onerror handler for the print logo
    const printLogo = printReceiptContent.querySelector('#receipt-logo-print');
    if (printLogo) {
        printLogo.onload = () => {
            // Logo loaded successfully for print. No specific action needed here unless you have complex layouts.
        };
        printLogo.onerror = () => {
            // If the image fails to load, hide it for printing.
            printLogo.style.display = 'none';
            console.error("Failed to load receipt logo for printing.");
        };
    }
}


// --- Products Tab Fungsionalitas ---

function renderProductList() {
    productListBody.innerHTML = '';
    const searchTerm = productSearchInput.value.toLowerCase();
    const filterCategory = productCategoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredProducts.length === 0) {
        productListBody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada produk ditemukan.</td></tr>';
    } else {
        filteredProducts.forEach(product => {
            const row = productListBody.insertRow();
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${formatRupiah(product.price)}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-product-btn" data-id="${product.id}"><i data-feather="edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-product-btn" data-id="${product.id}"><i data-feather="trash"></i></button>
                </td>
            `;
        });
    }
    feather.replace();
}

function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category))];
    productCategoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        productCategoryFilter.appendChild(option);
    });
}

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const category = productCategoryInput.value.trim();
    const stock = parseInt(productStockInput.value);

    if (!name || isNaN(price) || price <= 0 || !category || isNaN(stock) || stock < 0) {
        showNotification('Mohon lengkapi semua bidang produk dengan benar.', 'warning');
        return;
    }

    const productId = productIdCounter++;
    products.push({ id: productId, name, price, category, stock });
    saveData();
    addProductForm.reset();
    showNotification('Produk berhasil ditambahkan!', 'success');
});

productListBody.addEventListener('click', (e) => {
    const id = parseInt(e.target.closest('button').dataset.id);
    if (!id) return;

    if (e.target.closest('button').classList.contains('edit-product-btn')) {
        const product = products.find(p => p.id === id);
        if (product) {
            const newName = prompt('Masukkan nama baru:', product.name);
            const newPrice = parseFloat(prompt('Masukkan harga baru:', product.price));
            const newCategory = prompt('Masukkan kategori baru:', product.category);
            const newStock = parseInt(prompt('Masukkan stok baru:', product.stock));

            if (newName !== null && newName.trim() !== '' &&
                !isNaN(newPrice) && newPrice > 0 &&
                newCategory !== null && newCategory.trim() !== '' &&
                !isNaN(newStock) && newStock >= 0) {
                product.name = newName.trim();
                product.price = newPrice;
                product.category = newCategory.trim();
                product.stock = newStock;
                saveData();
                showNotification('Produk berhasil diperbarui!', 'success');
            } else {
                showNotification('Input tidak valid atau dibatalkan.', 'warning');
            }
        }
    } else if (e.target.closest('button').classList.contains('delete-product-btn')) {
        if (confirm('Anda yakin ingin menghapus produk ini?')) {
            products = products.filter(p => p.id !== id);
            saveData();
            showNotification('Produk berhasil dihapus!', 'info');
        }
    }
});

productSearchInput.addEventListener('input', renderProductList);
productCategoryFilter.addEventListener('change', renderProductList);


// --- Expenses Tab Fungsionalitas ---

function renderExpenseList() {
    expenseListBody.innerHTML = '';
    if (expenses.length === 0) {
        expenseListBody.innerHTML = '<tr><td colspan="4" class="text-center">Tidak ada pengeluaran.</td></tr>';
    } else {
        expenses.forEach(expense => {
            const row = expenseListBody.insertRow();
            row.innerHTML = `
                <td>${expense.id}</td>
                <td>${expense.name}</td>
                <td>${formatRupiah(expense.amount)}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-expense-btn" data-id="${expense.id}"><i data-feather="trash"></i></button>
                </td>
            `;
        });
    }
    feather.replace();
}

addExpenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        showNotification('Mohon lengkapi semua bidang pengeluaran dengan benar.', 'warning');
        return;
    }

    const expenseId = expenseIdCounter++;
    expenses.push({ id: expenseId, name, amount, date: new Date().toLocaleDateString('id-ID') });
    saveData();
    addExpenseForm.reset();
    showNotification('Pengeluaran berhasil ditambahkan!', 'success');
});

expenseListBody.addEventListener('click', (e) => {
    if (e.target.closest('button')?.classList.contains('delete-expense-btn')) {
        const id = parseInt(e.target.closest('button').dataset.id);
        if (confirm('Anda yakin ingin menghapus pengeluaran ini?')) {
            expenses = expenses.filter(exp => exp.id !== id);
            saveData();
            showNotification('Pengeluaran berhasil dihapus!', 'info');
        }
    }
});

// --- Reports Tab Fungsionalitas ---

function renderTransactionList() {
    transactionListBody.innerHTML = '';
    const filterValue = reportDateFilter.value;
    let filteredTransactions = [];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayDateString = `${dd}/${mm}/${yyyy}`;

    if (filterValue === 'today') {
        filteredTransactions = transactions.filter(t => t.date === todayDateString);
    } else if (filterValue === 'all') {
        filteredTransactions = transactions;
    } else {
        // For specific month/year, assuming filterValue is 'YYYY-MM'
        filteredTransactions = transactions.filter(t => {
            const [d, m, y] = t.date.split('/');
            return `${y}-${m}` === filterValue;
        });
    }

    if (filteredTransactions.length === 0) {
        transactionListBody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada transaksi ditemukan untuk filter ini.</td></tr>';
    } else {
        filteredTransactions.forEach(transaction => {
            const row = transactionListBody.insertRow();
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.date} ${transaction.time}</td>
                <td>${formatRupiah(transaction.total)}</td>
                <td>${transaction.items.length}</td>
                <td>
                    <button class="btn btn-info btn-sm view-transaction-btn" data-id="${transaction.id}"><i data-feather="eye"></i></button>
                    <button class="btn btn-danger btn-sm delete-transaction-btn" data-id="${transaction.id}"><i data-feather="trash"></i></button>
                </td>
            `;
        });
    }
    feather.replace();
}

reportDateFilter.addEventListener('change', () => {
    renderTransactionList();
    updateRecapSummary();
    updateChart();
});

function updateRecapSummary() {
    const filterValue = reportDateFilter.value;
    let filteredTransactions = [];
    let filteredExpenses = [];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayDateString = `${dd}/${mm}/${yyyy}`;

    if (filterValue === 'today') {
        filteredTransactions = transactions.filter(t => t.date === todayDateString);
        filteredExpenses = expenses.filter(e => e.date === todayDateString);
    } else if (filterValue === 'all') {
        filteredTransactions = transactions;
        filteredExpenses = expenses;
    } else {
        // For specific month/year, assuming filterValue is 'YYYY-MM'
        filteredTransactions = transactions.filter(t => {
            const [d, m, y] = t.date.split('/');
            return `${y}-${m}` === filterValue;
        });
        filteredExpenses = expenses.filter(e => {
            const [d, m, y] = e.date.split('/');
            return `${y}-${m}` === filterValue;
        });
    }

    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalSales - totalExpenses;

    recapSales.textContent = formatRupiah(totalSales);
    recapExpenses.textContent = formatRupiah(totalExpenses);
    recapProfit.textContent = formatRupiah(totalProfit);
}

transactionListBody.addEventListener('click', (e) => {
    const id = parseInt(e.target.closest('button').dataset.id);
    if (!id) return;

    if (e.target.closest('button').classList.contains('view-transaction-btn')) {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            generateReceiptContent(transaction); // Use existing receipt generation
            receiptModal.classList.add('active');
        }
    } else if (e.target.closest('button').classList.contains('delete-transaction-btn')) {
        if (confirm('Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.')) {
            transactions = transactions.filter(t => t.id !== id);
            saveData();
            showNotification('Transaksi berhasil dihapus!', 'info');
        }
    }
});

// Chart.js
let salesChart;

function updateChart() {
    const filterValue = reportDateFilter.value;
    let chartData = {};

    let transactionsToChart = [];
    let expensesToChart = [];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const todayDateString = `${dd}/${mm}/${yyyy}`;

    if (filterValue === 'today') {
        transactionsToChart = transactions.filter(t => t.date === todayDateString);
        expensesToChart = expenses.filter(e => e.date === todayDateString);
    } else if (filterValue === 'all') {
        transactionsToChart = transactions;
        expensesToChart = expenses;
    } else {
        transactionsToChart = transactions.filter(t => {
            const [d, m, y] = t.date.split('/');
            return `${y}-${m}` === filterValue;
        });
        expensesToChart = expenses.filter(e => {
            const [d, m, y] = e.date.split('/');
            return `${y}-${m}` === filterValue;
        });
    }

    // Aggregate data by date
    transactionsToChart.forEach(t => {
        chartData[t.date] = chartData[t.date] || { sales: 0, expenses: 0 };
        chartData[t.date].sales += t.total;
    });
    expensesToChart.forEach(e => {
        chartData[e.date] = chartData[e.date] || { sales: 0, expenses: 0 };
        chartData[e.date].expenses += e.amount;
    });

    const labels = Object.keys(chartData).sort((a, b) => {
        const [da, ma, ya] = a.split('/');
        const [db, mb, yb] = b.split('/');
        return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
    });
    const salesData = labels.map(label => chartData[label].sales || 0);
    const expensesData = labels.map(label => chartData[label].expenses || 0);

    const ctx = salesChartCanvas.getContext('2d');

    if (salesChart) {
        salesChart.destroy(); // Destroy previous chart instance
    }

    salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Penjualan',
                data: salesData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Pengeluaran',
                data: expensesData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return formatRupiah(value);
                        }
                    }
                }
            },
            plugins: {
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
            }
        }
    });
}


// --- Users Tab Fungsionalitas ---

function renderUserList() {
    userListBody.innerHTML = '';
    if (users.length === 0) {
        userListBody.innerHTML = '<tr><td colspan="4" class="text-center">Tidak ada pengguna.</td></tr>';
    } else {
        users.forEach(user => {
            const row = userListBody.insertRow();
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    ${user.username !== 'admin' ? `<button class="btn btn-danger btn-sm delete-user-btn" data-username="${user.username}"><i data-feather="trash"></i></button>` : ''}
                </td>
            `;
        });
    }
    feather.replace();
}

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk menambah pengguna.', 'error');
        return;
    }

    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value.trim();
    const role = newUserRoleInput.value;

    if (!username || !password) {
        showNotification('Username dan password tidak boleh kosong.', 'warning');
        return;
    }

    if (users.some(u => u.username === username)) {
        showNotification('Username sudah ada.', 'warning');
        return;
    }

    users.push({ username, password, role });
    saveData();
    addUserForm.reset();
    showNotification('Pengguna berhasil ditambahkan!', 'success');
});

userListBody.addEventListener('click', (e) => {
    if (e.target.closest('button')?.classList.contains('delete-user-btn')) {
        if (currentUser.role !== 'admin') {
            showNotification('Anda tidak memiliki izin untuk menghapus pengguna.', 'error');
            return;
        }
        const usernameToDelete = e.target.closest('button').dataset.username;
        if (usernameToDelete === 'admin') {
            showNotification('Pengguna "admin" tidak bisa dihapus.', 'error');
            return;
        }
        if (confirm(`Anda yakin ingin menghapus pengguna ${usernameToDelete}?`)) {
            users = users.filter(u => u.username !== usernameToDelete);
            saveData();
            showNotification('Pengguna berhasil dihapus!', 'info');
        }
    }
});


// --- Settings Tab Fungsionalitas ---

saveCompanyNameBtn.addEventListener('click', () => {
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk mengubah nama perusahaan.', 'error');
        return;
    }
    const newCompanyName = companyNameInput.value.trim();
    if (newCompanyName) {
        companyName = newCompanyName;
        saveData();
        showNotification('Nama perusahaan berhasil disimpan!', 'success');
    } else {
        showNotification('Nama perusahaan tidak boleh kosong.', 'warning');
    }
});

// New: Save Receipt Logo functionality
saveReceiptLogoBtn.addEventListener('click', () => {
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk mengubah logo struk.', 'error');
        return;
    }
    const url = receiptLogoUrlInput.value.trim();
    if (url) {
        // Basic URL validation
        try {
            new URL(url); // Throws an error if not a valid URL
            receiptLogoUrl = url;
            saveData();
            showNotification('URL Logo struk berhasil disimpan!', 'success');
        } catch (e) {
            showNotification('URL yang dimasukkan tidak valid.', 'error');
        }
    } else {
        showNotification('URL logo tidak boleh kosong.', 'warning');
    }
});

// New: Clear Receipt Logo functionality
clearReceiptLogoBtn.addEventListener('click', () => {
    if (currentUser.role !== 'admin') {
        showNotification('Anda tidak memiliki izin untuk menghapus logo struk.', 'error');
        return;
    }
    receiptLogoUrl = '';
    receiptLogoUrlInput.value = '';
    saveData();
    showNotification('Logo struk berhasil dihapus!', 'info');
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
        receiptLogoUrl = ''; // New: Clear logo URL on full data clear
        cart = [];
        transactionIdCounter = 1;
        expenseIdCounter = 1;
        productIdCounter = 101;
        currentUser = null; // Force re-login
        showNotification('Semua data aplikasi telah dihapus. Harap login kembali.', 'success');
        loginModal.classList.add('active');
        updateUI(); // Refresh UI after clearing data
    }
});


// --- Inisialisasi Aplikasi ---

document.addEventListener('DOMContentLoaded', () => {
    // Set default date filter to current month
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentYear = today.getFullYear();
    reportDateFilter.value = `${currentYear}-${currentMonth}`;

    if (!currentUser) {
        loginModal.classList.add('active');
    } else {
        mainContent.classList.add('active');
        currentUserNameSpan.textContent = currentUser.username;
        currentUserRoleSpan.textContent = currentUser.role;
        updateUI();
    }
    updateUI(); // Initial UI update
});
// Geser pakai mouse (horizontal dan vertikal)
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainers = document.querySelectorAll('.scrollable-container');
  scrollContainers.forEach(container => {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      startY = e.pageY - container.offsetTop;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    });
  });
});