// Global Variables
let companyName = "Akuntansi Pintar"; // Default company name
let currentUser = null;
let products = [];
let transactions = [];
let expenses = [];
let users = [];
let cart = [];
let currentTransactionId = 0; // To keep track of transaction IDs

// DOM Elements
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');
const mainContent = document.getElementById('main-content');
const appHeader = document.getElementById('app-header');
const appLogoHeader = document.getElementById('app-logo-header'); // Assuming header is now an <img>
const loginCompanyNameDisplay = document.getElementById('login-company-name-display');
const footerCompanyName = document.getElementById('footer-company-name');

const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');

// Dashboard Tab
const totalProductsDisplay = document.getElementById('total-products');
const totalTransactionsDisplay = document.getElementById('total-transactions');
const totalExpensesDisplay = document.getElementById('total-expenses');
const dashboardWelcome = document.getElementById('dashboard-welcome');

// Products Tab
const addProductForm = document.getElementById('add-product-form');
const newProductName = document.getElementById('new-product-name');
const newProductPrice = document.getElementById('new-product-price');
const newProductCostPrice = document.getElementById('new-product-cost-price'); // HPP input
const newProductStock = document.getElementById('new-product-stock');
const productsTableBody = document.getElementById('products-table-body');
const productSearchInput = document.getElementById('product-search');

// Cashier Tab
const cashierProductSearch = document.getElementById('cashier-product-search');
const cashierProductList = document.getElementById('cashier-product-list');
const cartTableBody = document.getElementById('cart-table-body');
const subtotalDisplay = document.getElementById('subtotal-display');
const discountInput = document.getElementById('discount-input');
const totalDisplay = document.getElementById('total-display');
const amountPaidInput = document.getElementById('amount-paid');
const changeDisplay = document.getElementById('change-display');
const processPaymentBtn = document.getElementById('process-payment-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Sales Report Tab
const salesReportTableBody = document.getElementById('sales-report-table-body');
const filterDateFrom = document.getElementById('filter-date-from');
const filterDateTo = document.getElementById('filter-date-to');
const filterUser = document.getElementById('filter-user');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');

// Financial Summary Tab
const financialSummaryTableBody = document.getElementById('financial-summary-table-body');
const financialSummaryDateFrom = document.getElementById('financial-summary-date-from');
const financialSummaryDateTo = document.getElementById('financial-summary-date-to');
const applyFinancialSummaryFilterBtn = document.getElementById('apply-financial-summary-filter-btn');
const totalRevenueDisplay = document.getElementById('total-revenue');
const totalHppDisplay = document.getElementById('total-hpp');
const totalGrossProfitDisplay = document.getElementById('total-gross-profit');
const totalExpensesSummaryDisplay = document.getElementById('total-expenses-summary');
const netProfitDisplay = document.getElementById('net-profit');

// Expenses Tab
const addExpenseForm = document.getElementById('add-expense-form');
const newExpenseName = document.getElementById('new-expense-name');
const newExpenseAmount = document.getElementById('new-expense-amount');
const expensesTableBody = document.getElementById('expenses-table-body');
const expenseSearchInput = document.getElementById('expense-search');

// User Management Tab
const addUserForm = document.getElementById('add-user-form');
const newUsername = document.getElementById('new-username');
const newUserPassword = document.getElementById('new-user-password');
const newUserRole = document.getElementById('new-user-role');
const usersTableBody = document.getElementById('users-table-body');

// Settings Tab
const customCompanyNameInput = document.getElementById('custom-company-name-input'); // New element for custom header
const saveCompanyNameBtn = document.getElementById('save-company-name-btn'); // New element for custom header
const changePasswordForm = document.getElementById('change-password-form');
const oldPasswordInput = document.getElementById('old-password');
const newPasswordInput = document.getElementById('new-password');
const confirmNewPasswordInput = document.getElementById('confirm-new-password');
const clearAppDataBtn = document.getElementById('clear-app-data-btn');
const logoutBtn = document.getElementById('logout-btn');

// Receipt Modal
const receiptModal = document.getElementById('receipt-modal');
const printReceiptContent = document.getElementById('print-receipt-content');
const closeReceiptModalBtn = document.getElementById('close-receipt-modal-btn');
const printReceiptBtn = document.getElementById('print-receipt-btn');

// Notification
const notification = document.getElementById('notification');

// --- Utility Functions ---
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function saveToLocalStorage() {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentTransactionId', currentTransactionId);
}

function loadFromLocalStorage() {
    companyName = localStorage.getItem('companyName') || "Akuntansi Pintar";
    products = JSON.parse(localStorage.getItem('products')) || [];
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    users = JSON.parse(localStorage.getItem('users')) || [];
    currentTransactionId = parseInt(localStorage.getItem('currentTransactionId')) || 0;

    // Add default admin user if no users exist
    if (users.length === 0) {
        users.push({ username: 'admin', password: 'adminpassword', role: 'admin' });
        saveToLocalStorage();
    }
}

function updateCompanyNameDisplay() {
    if (appLogoHeader) { // If header is an <img> tag
        appLogoHeader.alt = `${companyName} Logo`; // Update alt text
    } else if (document.getElementById('app-company-name')) { // If header is still an h1
        document.getElementById('app-company-name').textContent = companyName;
    }
    loginCompanyNameDisplay.textContent = companyName;
    footerCompanyName.textContent = companyName;
    if (customCompanyNameInput) { // Update settings input field
        customCompanyNameInput.value = companyName;
    }
}

function renderDashboard() {
    totalProductsDisplay.textContent = products.length;
    totalTransactionsDisplay.textContent = transactions.length;
    totalExpensesDisplay.textContent = expenses.length;
    dashboardWelcome.textContent = `Selamat Datang, ${currentUser.username}!`;
}

// --- Product Management ---
function renderProductsTable(filter = '') {
    productsTableBody.innerHTML = '';
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(filter.toLowerCase())
    );
    filteredProducts.forEach(product => {
        const row = productsTableBody.insertRow();
        row.insertCell(0).textContent = product.name;
        row.insertCell(1).textContent = formatRupiah(product.price);
        row.insertCell(2).textContent = formatRupiah(product.costPrice); // Display HPP
        row.insertCell(3).textContent = product.stock;
        const actionCell = row.insertCell(4);
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn btn-sm btn-info';
        editBtn.onclick = () => editProduct(product.id);
        actionCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.className = 'btn btn-sm btn-danger ml-1';
        deleteBtn.onclick = () => deleteProduct(product.id);
        actionCell.appendChild(deleteBtn);
    });
}

function addProduct(event) {
    event.preventDefault();
    const name = newProductName.value.trim();
    const price = parseFloat(newProductPrice.value);
    const costPrice = parseFloat(newProductCostPrice.value); // Get HPP
    const stock = parseInt(newProductStock.value);

    if (name && !isNaN(price) && !isNaN(costPrice) && !isNaN(stock) && price >= 0 && costPrice >= 0 && stock >= 0) {
        products.push({ id: generateUniqueId(), name, price, costPrice, stock });
        saveToLocalStorage();
        renderProductsTable();
        addProductForm.reset();
        showNotification('Produk berhasil ditambahkan!');
    } else {
        showNotification('Mohon isi semua kolom dengan benar.', 'error');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const newName = prompt('Masukkan nama produk baru:', product.name);
        const newPrice = prompt('Masukkan harga jual baru:', product.price);
        const newCostPrice = prompt('Masukkan harga beli (HPP) baru:', product.costPrice); // Edit HPP
        const newStock = prompt('Masukkan stok baru:', product.stock);

        if (newName !== null && newPrice !== null && newCostPrice !== null && newStock !== null) {
            const parsedPrice = parseFloat(newPrice);
            const parsedCostPrice = parseFloat(newCostPrice);
            const parsedStock = parseInt(newStock);

            if (newName.trim() && !isNaN(parsedPrice) && !isNaN(parsedCostPrice) && !isNaN(parsedStock) && parsedPrice >= 0 && parsedCostPrice >= 0 && parsedStock >= 0) {
                product.name = newName.trim();
                product.price = parsedPrice;
                product.costPrice = parsedCostPrice; // Update HPP
                product.stock = parsedStock;
                saveToLocalStorage();
                renderProductsTable();
                showNotification('Produk berhasil diupdate!');
            } else {
                showNotification('Input tidak valid. Mohon masukkan angka yang benar.', 'error');
            }
        }
    }
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== productId);
        saveToLocalStorage();
        renderProductsTable();
        showNotification('Produk berhasil dihapus!');
    }
}

// --- Cashier Functionality ---
function renderCashierProductList(filter = '') {
    cashierProductList.innerHTML = '';
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(filter.toLowerCase()) && product.stock > 0
    );
    if (filteredProducts.length === 0) {
        cashierProductList.innerHTML = '<p class="text-center">Produk tidak ditemukan atau stok habis.</p>';
        return;
    }
    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item card p-2 mb-2';
        productDiv.innerHTML = `
            <h5 class="mb-1">${product.name}</h5>
            <p class="mb-1">Harga: ${formatRupiah(product.price)}</p>
            <p class="mb-1">Stok: ${product.stock}</p>
            <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="${product.id}">Tambah ke Keranjang</button>
        `;
        cashierProductList.appendChild(productDiv);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.onclick = (event) => addToCart(event.target.dataset.productId);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
            cartItem.total = cartItem.quantity * cartItem.price;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                costPrice: product.costPrice, // Include HPP in cart item
                quantity: 1,
                total: product.price
            });
        }
        product.stock--; // Decrease product stock immediately
        saveToLocalStorage(); // Save stock change
        renderCart();
        renderCashierProductList(cashierProductSearch.value); // Update product list display
        showNotification(`${product.name} ditambahkan ke keranjang.`);
    } else if (product && product.stock === 0) {
        showNotification('Stok produk habis.', 'error');
    }
}

function renderCart() {
    cartTableBody.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const row = cartTableBody.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = formatRupiah(item.price);
        row.insertCell(3).textContent = formatRupiah(item.total);
        const actionCell = row.insertCell(4);
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.className = 'btn btn-sm btn-danger';
        removeBtn.onclick = () => removeFromCart(item.id);
        actionCell.appendChild(removeBtn);
        subtotal += item.total;
    });
    subtotalDisplay.textContent = formatRupiah(subtotal);
    calculateTotal();
}

function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    if (cartItemIndex > -1) {
        const cartItem = cart[cartItemIndex];
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += cartItem.quantity; // Return stock
        }
        cart.splice(cartItemIndex, 1);
        saveToLocalStorage(); // Save stock change
        renderCart();
        renderCashierProductList(cashierProductSearch.value); // Update product list display
        showNotification('Item dihapus dari keranjang.');
    }
}

function calculateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discount = parseFloat(discountInput.value) || 0;
    let total = subtotal - discount;
    totalDisplay.textContent = formatRupiah(total);
    calculateChange();
}

function calculateChange() {
    let total = parseFloat(totalDisplay.textContent.replace(/[^0-9,-]+/g, "").replace(',', '.'));
    let amountPaid = parseFloat(amountPaidInput.value) || 0;
    let change = amountPaid - total;
    changeDisplay.textContent = formatRupiah(change);

    if (change < 0) {
        changeDisplay.style.color = 'red';
    } else {
        changeDisplay.style.color = 'green';
    }
}

function processPayment() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'error');
        return;
    }

    let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discountAmount = parseFloat(discountInput.value) || 0;
    let total = subtotal - discountAmount;
    let amountPaid = parseFloat(amountPaidInput.value) || 0;
    let change = amountPaid - total;

    if (amountPaid < total) {
        showNotification('Jumlah pembayaran kurang!', 'error');
        return;
    }

    currentTransactionId++;
    const newTransaction = {
        id: `TRX-${currentTransactionId}`,
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID'), // Added time
        userId: currentUser.username,
        items: JSON.parse(JSON.stringify(cart)), // Deep copy cart items
        subtotal: subtotal,
        discountAmount: discountAmount,
        total: total,
        amountPaid: amountPaid,
        change: change
    };

    transactions.push(newTransaction);
    saveToLocalStorage();
    showNotification('Pembayaran berhasil diproses!');

    // Show receipt
    generateReceiptContent(newTransaction);
    receiptModal.style.display = 'block';

    // Clear cart and reset cashier
    cart = [];
    renderCart();
    discountInput.value = '';
    amountPaidInput.value = '';
    totalDisplay.textContent = formatRupiah(0);
    changeDisplay.textContent = formatRupiah(0);
    renderCashierProductList(cashierProductSearch.value); // Re-render to show updated stock
    renderDashboard(); // Update dashboard counts
}

function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang? Stok akan dikembalikan.')) {
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                product.stock += cartItem.quantity; // Return stock for all items
            }
        });
        cart = [];
        saveToLocalStorage(); // Save stock changes
        renderCart();
        renderCashierProductList(cashierProductSearch.value); // Update product list display
        showNotification('Keranjang berhasil dikosongkan. Stok dikembalikan.');
    }
}

// --- Sales Report ---
function renderSalesReport(transactionsToRender = transactions) {
    salesReportTableBody.innerHTML = '';
    transactionsToRender.forEach(trans => {
        const row = salesReportTableBody.insertRow();
        row.insertCell(0).textContent = trans.id;
        row.insertCell(1).textContent = trans.date;
        row.insertCell(2).textContent = trans.userId;
        row.insertCell(3).textContent = trans.items.map(item => `${item.name} (${item.quantity})`).join(', ');
        row.insertCell(4).textContent = formatRupiah(trans.total);
        const actionCell = row.insertCell(5);
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'Lihat Struk';
        viewBtn.className = 'btn btn-sm btn-info';
        viewBtn.onclick = () => {
            generateReceiptContent(trans);
            receiptModal.style.display = 'block';
        };
        actionCell.appendChild(viewBtn);
    });
}

function applySalesReportFilter() {
    const fromDate = filterDateFrom.value ? new Date(filterDateFrom.value) : null;
    const toDate = filterDateTo.value ? new Date(filterDateTo.value) : null;
    const userFilter = filterUser.value.toLowerCase();

    const filteredTransactions = transactions.filter(trans => {
        const transDate = new Date(trans.date.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD for Date object
        const matchesDate = (!fromDate || transDate >= fromDate) && (!toDate || transDate <= toDate);
        const matchesUser = !userFilter || trans.userId.toLowerCase().includes(userFilter);
        return matchesDate && matchesUser;
    });
    renderSalesReport(filteredTransactions);
}

function exportSalesReportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${companyName} - Laporan Penjualan`, 10, 10);
    doc.setFontSize(10);
    doc.text(`Dicetak oleh: ${currentUser.username} pada ${new Date().toLocaleDateString('id-ID')}`, 10, 17);

    const tableData = [];
    salesReportTableBody.querySelectorAll('tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach((cell, index) => {
            if (index < 5) { // Exclude the 'Lihat Struk' button column
                rowData.push(cell.textContent);
            }
        });
        tableData.push(rowData);
    });

    doc.autoTable({
        head: [['ID Transaksi', 'Tanggal', 'Kasir', 'Item', 'Total']],
        body: tableData,
        startY: 25,
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 20 }
    });

    doc.save('laporan_penjualan.pdf');
    showNotification('Laporan penjualan diekspor sebagai PDF.');
}

// --- Financial Summary ---
function renderFinancialSummary() {
    financialSummaryTableBody.innerHTML = '';
    const fromDate = financialSummaryDateFrom.value ? new Date(financialSummaryDateFrom.value) : null;
    const toDate = financialSummaryDateTo.value ? new Date(financialSummaryDateTo.value) : null;

    let totalRevenue = 0;
    let totalHPP = 0;
    let totalExpensesSum = 0;

    const filteredTransactions = transactions.filter(trans => {
        const transDate = new Date(trans.date.split('/').reverse().join('-'));
        return (!fromDate || transDate >= fromDate) && (!toDate || transDate <= toDate);
    });

    filteredTransactions.forEach(trans => {
        totalRevenue += trans.total;
        trans.items.forEach(item => {
            totalHPP += item.costPrice * item.quantity; // Calculate HPP from each item in transaction
        });
    });

    const filteredExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date.split('/').reverse().join('-'));
        return (!fromDate || expDate >= fromDate) && (!toDate || expDate <= toDate);
    });

    filteredExpenses.forEach(exp => {
        totalExpensesSum += exp.amount;
        const row = financialSummaryTableBody.insertRow();
        row.insertCell(0).textContent = exp.date;
        row.insertCell(1).textContent = exp.name;
        row.insertCell(2).textContent = formatRupiah(exp.amount);
    });

    const grossProfit = totalRevenue - totalHPP;
    const netProfit = grossProfit - totalExpensesSum;

    totalRevenueDisplay.textContent = formatRupiah(totalRevenue);
    totalHppDisplay.textContent = formatRupiah(totalHPP);
    totalGrossProfitDisplay.textContent = formatRupiah(grossProfit);
    totalExpensesSummaryDisplay.textContent = formatRupiah(totalExpensesSum);
    netProfitDisplay.textContent = formatRupiah(netProfit);
}

// --- Expenses Management ---
function renderExpensesTable(filter = '') {
    expensesTableBody.innerHTML = '';
    const filteredExpenses = expenses.filter(expense =>
        expense.name.toLowerCase().includes(filter.toLowerCase())
    );
    filteredExpenses.forEach(expense => {
        const row = expensesTableBody.insertRow();
        row.insertCell(0).textContent = expense.date;
        row.insertCell(1).textContent = expense.name;
        row.insertCell(2).textContent = formatRupiah(expense.amount);
        const actionCell = row.insertCell(3);
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn btn-sm btn-info';
        editBtn.onclick = () => editExpense(expense.id);
        actionCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.className = 'btn btn-sm btn-danger ml-1';
        deleteBtn.onclick = () => deleteExpense(expense.id);
        actionCell.appendChild(deleteBtn);
    });
}

function addExpense(event) {
    event.preventDefault();
    const name = newExpenseName.value.trim();
    const amount = parseFloat(newExpenseAmount.value);
    const date = new Date().toLocaleDateString('id-ID'); // Auto-set current date

    if (name && !isNaN(amount) && amount >= 0) {
        expenses.push({ id: generateUniqueId(), date, name, amount });
        saveToLocalStorage();
        renderExpensesTable();
        addExpenseForm.reset();
        showNotification('Pengeluaran berhasil ditambahkan!');
    } else {
        showNotification('Mohon isi semua kolom dengan benar.', 'error');
    }
}

function editExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
        const newName = prompt('Masukkan nama pengeluaran baru:', expense.name);
        const newAmount = prompt('Masukkan jumlah pengeluaran baru:', expense.amount);

        if (newName !== null && newAmount !== null) {
            const parsedAmount = parseFloat(newAmount);

            if (newName.trim() && !isNaN(parsedAmount) && parsedAmount >= 0) {
                expense.name = newName.trim();
                expense.amount = parsedAmount;
                saveToLocalStorage();
                renderExpensesTable();
                showNotification('Pengeluaran berhasil diupdate!');
            } else {
                showNotification('Input tidak valid. Mohon masukkan angka yang benar.', 'error');
            }
        }
    }
}

function deleteExpense(expenseId) {
    if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
        expenses = expenses.filter(e => e.id !== expenseId);
        saveToLocalStorage();
        renderExpensesTable();
        showNotification('Pengeluaran berhasil dihapus!');
    }
}

// --- User Management ---
function renderUsersTable() {
    usersTableBody.innerHTML = '';
    users.forEach(user => {
        const row = usersTableBody.insertRow();
        row.insertCell(0).textContent = user.username;
        row.insertCell(1).textContent = user.role;
        const actionCell = row.insertCell(2);
        if (user.username !== 'admin') { // Prevent deleting default admin
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.onclick = () => deleteUser(user.username);
            actionCell.appendChild(deleteBtn);
        }
    });
}

function addUser(event) {
    event.preventDefault();
    const username = newUsername.value.trim();
    const password = newUserPassword.value;
    const role = newUserRole.value;

    if (username && password && users.every(u => u.username !== username)) {
        users.push({ username, password, role });
        saveToLocalStorage();
        renderUsersTable();
        addUserForm.reset();
        showNotification('Pengguna berhasil ditambahkan!');
    } else {
        showNotification('Username sudah ada atau input tidak valid.', 'error');
    }
}

function deleteUser(usernameToDelete) {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${usernameToDelete}?`)) {
        users = users.filter(u => u.username !== usernameToDelete);
        saveToLocalStorage();
        renderUsersTable();
        showNotification('Pengguna berhasil dihapus!');
    }
}

// --- Settings ---
function changePassword(event) {
    event.preventDefault();
    const oldPass = oldPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmNewPass = confirmNewPasswordInput.value;

    if (currentUser.password !== oldPass) {
        showNotification('Kata sandi lama salah!', 'error');
        return;
    }
    if (newPass !== confirmNewPass) {
        showNotification('Konfirmasi kata sandi baru tidak cocok!', 'error');
        return;
    }
    if (newPass.length < 6) {
        showNotification('Kata sandi baru minimal 6 karakter!', 'error');
        return;
    }

    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex > -1) {
        users[userIndex].password = newPass;
        currentUser.password = newPass; // Update current session user
        saveToLocalStorage();
        changePasswordForm.reset();
        showNotification('Kata sandi berhasil diubah!');
    }
}

function clearAppData() {
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA data aplikasi? Ini tidak bisa dibatalkan!')) {
        localStorage.clear();
        location.reload(); // Reload the page to reset everything
    }
}

// --- Login & Logout ---
function handleLogin(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        loginModal.style.display = 'none';
        mainContent.style.display = 'block';
        appHeader.style.display = 'flex'; // Show header after login
        updateCompanyNameDisplay(); // Update company name on login
        setActiveTab('dashboard'); // Default to dashboard after login
    } else {
        loginMessage.textContent = 'Username atau password salah!';
        showNotification('Username atau password salah!', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    loginModal.style.display = 'flex'; // Show login modal
    mainContent.style.display = 'none';
    appHeader.style.display = 'none'; // Hide header on logout
    usernameInput.value = '';
    passwordInput.value = '';
    loginMessage.textContent = '';
    showNotification('Anda telah logout.');
}

// --- Navigation ---
function setActiveTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.nav-link[data-tab="${tabId}"]`).classList.add('active');

    // Render content based on active tab
    switch (tabId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'products':
            renderProductsTable();
            productSearchInput.value = ''; // Clear search
            break;
        case 'cashier':
            cart = []; // Clear cart on tab switch
            renderCart();
            renderCashierProductList();
            cashierProductSearch.value = ''; // Clear search
            discountInput.value = '';
            amountPaidInput.value = '';
            totalDisplay.textContent = formatRupiah(0);
            changeDisplay.textContent = formatRupiah(0);
            break;
        case 'sales-report':
            renderSalesReport();
            filterDateFrom.value = ''; // Clear filters
            filterDateTo.value = '';
            filterUser.value = '';
            break;
        case 'financial-summary':
            renderFinancialSummary();
            financialSummaryDateFrom.value = ''; // Clear filters
            financialSummaryDateTo.value = '';
            break;
        case 'expenses':
            renderExpensesTable();
            expenseSearchInput.value = ''; // Clear search
            break;
        case 'user-management':
            if (currentUser.role !== 'admin') {
                showNotification('Anda tidak memiliki akses ke manajemen pengguna.', 'error');
                setActiveTab('dashboard'); // Redirect if not admin
                return;
            }
            renderUsersTable();
            break;
        case 'settings':
            // No specific render needed, just update company name input
            if (customCompanyNameInput) {
                customCompanyNameInput.value = companyName;
            }
            break;
    }

    // Role-based access for navigation
    navLinks.forEach(link => {
        const roleRequired = link.dataset.role;
        if (roleRequired && currentUser.role !== 'admin' && roleRequired !== currentUser.role) {
            link.style.display = 'none';
        } else {
            link.style.display = ''; // Show if role matches or no role required
        }
    });

    // Specific access for user management
    const userManagementLink = document.querySelector('.nav-link[data-tab="user-management"]');
    if (userManagementLink) {
        if (currentUser.role !== 'admin') {
            userManagementLink.style.display = 'none';
        } else {
            userManagementLink.style.display = '';
        }
    }
}

// --- Receipt Generation ---
function generateReceiptContent(transaction) {
    const now = new Date();
    const receiptTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let receiptHtml = `
        <div class="header" style="text-align: center; margin-bottom: 10px;">
            <img src="image.png" alt="${companyName} Logo" style="max-width: 120px; height: auto; display: block; margin: 0 auto 10px;">
            <h3>${companyName}</h3>
            <p>Struk Penjualan</p>
            <p>Tanggal: ${transaction.date} Pukul: ${receiptTime}</p>
            <p>ID Transaksi: ${transaction.id}</p>
        </div>
        <div class="separator" style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <h4 style="margin: 5px 0;">Detail Item:</h4>
    `;
    transaction.items.forEach(item => {
        receiptHtml += `
            <div class="item-row" style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span class="item-name" style="flex-grow: 1; padding-right: 5px;">${item.name}</span>
                <span class="item-qty-price" style="white-space: nowrap; text-align: right;">${item.quantity} x ${formatRupiah(item.price)}</span>
            </div>
            <div class="item-row text-right" style="text-align: right;">Total: ${formatRupiah(item.total)}</div>
        `;
    });

    receiptHtml += `
        <div class="separator" style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold;"><span>Subtotal:</span> <span class="text-right" style="text-align: right;">${formatRupiah(transaction.subtotal)}</span></div>
        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold;"><span>Diskon:</span> <span class="text-right" style="text-align: right;">${formatRupiah(transaction.discountAmount)}</span></div>
        <div class="separator" style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div class="summary-row total" style="display: flex; justify-content: space-between; font-size: 1.1em; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px; font-weight: bold;"><span>TOTAL:</span> <span class="text-right" style="text-align: right;">${formatRupiah(transaction.total)}</span></div>
        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold;"><span>Dibayar:</span> <span class="text-right" style="text-align: right;">${formatRupiah(transaction.amountPaid)}</span></div>
        <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold;"><span>Kembalian:</span> <span class="text-right" style="text-align: right;">${formatRupiah(transaction.change)}</span></div>
        <div class="separator" style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div class="footer" style="text-align: center; margin-bottom: 10px;">
            <p>Terima Kasih Atas Kunjungan Anda!</p>
        </div>
    `;
    printReceiptContent.innerHTML = receiptHtml;
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateCompanyNameDisplay(); // Initial update of company name
    loginModal.style.display = 'flex'; // Show login modal by default
    mainContent.style.display = 'none';
    appHeader.style.display = 'none'; // Hide header until logged in

    // Check if jspdf and jspdf-autotable are loaded
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.AutoTable === 'undefined') {
        console.error('jsPDF or jspdf-autotable not loaded. PDF export will not work.');
        if (exportPdfBtn) {
            exportPdfBtn.disabled = true;
            exportPdfBtn.textContent = 'PDF Export (Error)';
            exportPdfBtn.title = 'Pastikan jspdf dan jspdf-autotable dimuat.';
        }
    }
});

// Login Form
loginForm.addEventListener('submit', handleLogin);

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        setActiveTab(event.target.dataset.tab);
    });
});

// Products Tab
addProductForm.addEventListener('submit', addProduct);
productSearchInput.addEventListener('input', (event) => renderProductsTable(event.target.value));

// Cashier Tab
cashierProductSearch.addEventListener('input', (event) => renderCashierProductList(event.target.value));
discountInput.addEventListener('input', calculateTotal);
amountPaidInput.addEventListener('input', calculateChange);
processPaymentBtn.addEventListener('click', processPayment);
clearCartBtn.addEventListener('click', clearCart);

// Sales Report Tab
applyFilterBtn.addEventListener('click', applySalesReportFilter);
if (exportPdfBtn) { // Check if button exists before adding listener
    exportPdfBtn.addEventListener('click', exportSalesReportToPdf);
}

// Financial Summary Tab
applyFinancialSummaryFilterBtn.addEventListener('click', renderFinancialSummary);

// Expenses Tab
addExpenseForm.addEventListener('submit', addExpense);
expenseSearchInput.addEventListener('input', (event) => renderExpensesTable(event.target.value));

// User Management Tab
addUserForm.addEventListener('submit', addUser);

// Settings Tab
if (saveCompanyNameBtn) { // New: Check if button exists
    saveCompanyNameBtn.addEventListener('click', () => {
        const newName = customCompanyNameInput.value.trim();
        if (newName) {
            companyName = newName;
            saveToLocalStorage();
            updateCompanyNameDisplay();
            showNotification('Nama perusahaan berhasil diubah!');
        } else {
            showNotification('Nama perusahaan tidak boleh kosong.', 'error');
        }
    });
}
changePasswordForm.addEventListener('submit', changePassword);
clearAppDataBtn.addEventListener('click', clearAppData);
logoutBtn.addEventListener('click', handleLogout);

// Receipt Modal
closeReceiptModalBtn.addEventListener('click', () => {
    receiptModal.style.display = 'none';
});
printReceiptBtn.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Struk Penjualan</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: 'monospace', sans-serif; margin: 0; padding: 10px; font-size: 12px; }
        .header, .footer { text-align: center; margin-bottom: 10px; }
        .separator { border-top: 1px dashed #000; margin: 8px 0; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .item-name { flex-grow: 1; padding-right: 5px; }
        .item-qty-price { white-space: nowrap; text-align: right; }
        .text-right { text-align: right; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
        .summary-row.total { font-size: 1.1em; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px; }
        img { max-width: 100%; height: auto; } /* Ensure image scales within print */
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printReceiptContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});
