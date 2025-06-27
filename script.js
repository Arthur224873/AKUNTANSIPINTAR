// Inisialisasi Feather Icons saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    // Optional: Remove clear localStorage line after initial testing
    // localStorage.clear();
});

// --- DATA APLIKASI (SIMULASI DATABASE LOKAL DENGAN LOCALSTORAGE) ---
let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'admin', password: 'admin123', role: 'admin' }
];
let currentUser = null; // Will store the currently logged-in user

let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

let companyName = localStorage.getItem('companyName') || 'Akuntansi Pintar';

// --- ELEMEN DOM ---
// Menggunakan destructuring assignment untuk kemudahan
const DOMElements = {
    appCompanyNameDisplay: document.getElementById('app-company-name'),
    footerCompanyNameDisplay: document.getElementById('footer-company-name'),
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),

    loginModal: document.getElementById('loginModal'),
    loginUsernameInput: document.getElementById('login-username'),
    loginPasswordInput: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    loginCompanyNameDisplay: document.getElementById('login-company-name-display'),

    // Kasir Tab Barcode Scanner
    barcodeScannerVideoKasir: document.getElementById('barcode-scanner-video-kasir'),
    barcodeScannerOverlayKasir: document.getElementById('barcode-scanner-overlay-kasir'),
    barcodeManualInput: document.getElementById('barcode-manual-input'),
    startScanBtnKasir: document.getElementById('start-scan-btn-kasir'),
    stopScanBtnKasir: document.getElementById('stop-scan-btn-kasir'),
    addByManualCodeBtn: document.getElementById('add-by-manual-code-btn'),

    // Produk Tab Barcode Scanner (New)
    barcodeScannerVideoProduk: document.getElementById('barcode-scanner-video-produk'),
    barcodeScannerOverlayProduk: document.getElementById('barcode-scanner-overlay-produk'),
    startScanBtnProduk: document.getElementById('start-scan-btn-produk'),
    stopScanBtnProduk: document.getElementById('stop-scan-btn-produk'),
    scannedBarcodeProdukInput: document.getElementById('scanned-barcode-produk'), // Input untuk barcode di tab produk
    updateProductBtn: document.getElementById('update-product-btn'), // Tombol update produk

    categoryFilter: document.getElementById('category-filter'),
    productSelect: document.getElementById('product-select'),
    productNameInput: document.getElementById('product-name'),
    productPriceInput: document.getElementById('product-price'),
    productStockDisplay: document.getElementById('product-stock-display'),
    productQuantityInput: document.getElementById('product-quantity'),
    addToCartBtn: document.getElementById('add-to-cart-btn'),
    clearInputBtn: document.getElementById('clear-input-btn'),
    cartItemsContainer: document.getElementById('cart-items'),
    subtotalSpan: document.getElementById('subtotal'),
    discountType: document.getElementById('discount-type'),
    discountValueGroup: document.getElementById('discount-value-group'),
    discountValueInput: document.getElementById('discount-value'),
    discountSpan: document.getElementById('discount'),
    totalPaymentSpan: document.getElementById('total-payment'),
    amountPaidInput: document.getElementById('amount-paid'),
    changeAmountSpan: document.getElementById('change-amount'),
    changeRow: document.getElementById('change-row'),
    processPaymentBtn: document.getElementById('process-payment-btn'),
    clearCartBtn: document.getElementById('clear-cart-btn'),

    newProductNameInput: document.getElementById('new-product-name'),
    newProductCategoryInput: document.getElementById('new-product-category'),
    newProductCostPriceInput: document.getElementById('new-product-cost-price'),
    newProductPriceInput: document.getElementById('new-product-price'),
    newProductMarkupPercentageInput: document.getElementById('new-product-markup-percentage'),
    newProductStockInput: document.getElementById('new-product-stock'),
    newProductMinStockInput: document.getElementById('new-product-min-stock'),
    addNewProductBtn: document.getElementById('add-new-product-btn'),
    productListBody: document.getElementById('product-list-body'),
    productTable: document.getElementById('product-table'),

    expenseDateInput: document.getElementById('expense-date'),
    expenseCategoryInput: document.getElementById('expense-category'),
    expenseDescriptionInput: document.getElementById('expense-description'),
    expenseAmountInput: document.getElementById('expense-amount'),
    addExpenseBtn: document.getElementById('add-expense-btn'),
    expenseListBody: document.getElementById('expense-list-body'),
    expenseTable: document.getElementById('expense-table'),

    reportDateFilter: document.getElementById('report-date-filter'),
    transactionListBody: document.getElementById('transaction-list-body'),
    transactionTable: document.getElementById('transaction-table'),

    recapRevenueSpan: document.getElementById('recap-revenue'),
    recapCostOfGoodsSpan: document.getElementById('recap-cost-of-goods'),
    recapTotalExpenseSpan: document.getElementById('recap-total-expense'),
    recapProfitSpan: document.getElementById('recap-profit'),
    recapSummaryContent: document.getElementById('recap-summary-content'),

    incomeTrendChartCanvas: document.getElementById('incomeTrendChart'),
    chartEmptyMessage: document.getElementById('chart-empty-message'),
    chartFilter: document.getElementById('chart-filter'),

    notificationArea: document.getElementById('notification-area'),

    editProductModal: document.getElementById('editProductModal'),
    modalProductId: document.getElementById('modal-product-id'),
    modalProductName: document.getElementById('modal-product-name'),
    modalProductCategory: document.getElementById('modal-product-category'),
    modalProductCostPrice: document.getElementById('modal-product-cost-price'),
    modalProductPrice: document.getElementById('modal-product-price'),
    modalProductMarkupPercentage: document.getElementById('modal-product-markup-percentage'),
    modalProductStock: document.getElementById('modal-product-stock'),
    modalProductMinStock: document.getElementById('modal-product-min-stock'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    saveProductBtn: document.getElementById('save-product-btn'),

    stockAdjustmentModal: document.getElementById('stockAdjustmentModal'),
    stockModalTitle: document.getElementById('stock-modal-title'),
    stockProductNameDisplay: document.getElementById('stock-product-name-display'),
    stockProductIdDisplay: document.getElementById('stock-product-id-display'),
    currentStockDisplay: document.getElementById('current-stock-display'),
    stockAdjustmentType: document.getElementById('stock-adjustment-type'),
    stockAdjustmentQuantity: document.getElementById('stock-adjustment-quantity'),
    stockAdjustmentReason: document.getElementById('stock-adjustment-reason'),
    cancelStockAdjustmentBtn: document.getElementById('cancel-stock-adjustment-btn'),
    saveStockAdjustmentBtn: document.getElementById('save-stock-adjustment-btn'),

    transactionDetailModal: document.getElementById('transactionDetailModal'),
    detailTransactionId: document.getElementById('detail-transaction-id'),
    detailTransactionDate: document.getElementById('detail-transaction-date'),
    detailTransactionItems: document.getElementById('detail-transaction-items'),
    detailTransactionSubtotal: document.getElementById('detail-transaction-subtotal'),
    detailTransactionDiscount: document.getElementById('detail-transaction-discount'),
    detailTransactionTotal: document.getElementById('detail-transaction-total'),
    detailTransactionPaid: document.getElementById('detail-transaction-paid'),
    detailTransactionChange: document.getElementById('detail-transaction-change'),
    closeDetailModalFooterBtn: document.getElementById('close-detail-modal-btn'),
    printReceiptBtn: document.getElementById('print-receipt-btn'),
    printReceiptContentDiv: document.getElementById('printReceiptContent'),

    editExpenseModal: document.getElementById('editExpenseModal'),
    modalExpenseId: document.getElementById('modal-expense-id'),
    modalExpenseDate: document.getElementById('modal-expense-date'),
    modalExpenseCategory: document.getElementById('modal-expense-category'),
    modalExpenseDescription: document.getElementById('modal-expense-description'),
    modalExpenseAmount: document.getElementById('modal-expense-amount'),
    cancelExpenseEditBtn: document.getElementById('cancel-expense-edit-btn'),
    saveExpenseBtn: document.getElementById('save-expense-btn'),

    companyNameInput: document.getElementById('company-name-input'),
    saveCompanyNameBtn: document.getElementById('save-company-name-btn'),
    newUsernameInput: document.getElementById('new-user-username'),
    newPasswordInput: document.getElementById('new-user-password'),
    newUserRoleSelect: document.getElementById('new-user-role'),
    addNewUserBtn: document.getElementById('add-new-user-btn'),
    userListDisplay: document.getElementById('user-list-display'),
    exportProductsPdfBtn: document.getElementById('export-products-pdf-btn'),
    exportTransactionsPdfBtn: document.getElementById('export-transactions-pdf-btn'),
    exportExpensesPdfBtn: document.getElementById('export-expenses-pdf-btn'),
    exportRecapPdfBtn: document.getElementById('export-recap-pdf-btn'),
    exportChartPdfBtn: document.getElementById('export-chart-pdf-btn'),
    clearAllDataBtn: document.getElementById('clear-all-data-btn'),

    aboutUsLink: document.getElementById('about-us-link'),
    aboutUsModal: document.getElementById('aboutUsModal'),
};

// Mengambil referensi tombol close modal yang memerlukan pengecekan opsional
const closeEditModalBtn = DOMElements.editProductModal ? DOMElements.editProductModal.querySelector('.close-button') : null;
const closeStockAdjustmentBtn = DOMElements.stockAdjustmentModal ? DOMElements.stockAdjustmentModal.querySelector('.close-button') : null;
const closeDetailModalBtn = DOMElements.transactionDetailModal ? DOMElements.transactionDetailModal.querySelector('.close-button') : null;
const closeExpenseModalBtn = DOMElements.editExpenseModal ? DOMElements.editExpenseModal.querySelector('.close-button') : null;
const closeAboutUsModalBtn = DOMElements.aboutUsModal ? DOMElements.aboutUsModal.querySelector('.close-button') : null;


let scannerInitialized = false; // Flag untuk melacak status scanner
let currentMode = 'kasir'; // 'kasir' atau 'produk' (sesuai tab aktif)
let currentStockAdjustProductId = null; // Menyimpan ID produk untuk penyesuaian stok
let incomeChartInstance = null; // Menyimpan instansi Chart.js

// --- FUNGSI UTILITY ---

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

function parseRupiah(rupiahString) {
    if (typeof rupiahString !== 'string') return 0;
    return parseFloat(rupiahString.replace(/[Rp.\s]/g, '')) || 0;
}

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('companyName', companyName);
}

function showNotification(message, type = 'info', duration = 3000) {
    if (!DOMElements.notificationArea) {
        console.warn("Elemen #notification-area tidak ditemukan. Tidak dapat menampilkan notifikasi.");
        return;
    }

    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification ${type}`;
    notificationDiv.textContent = message;
    notificationDiv.style.setProperty('--notification-duration', `${duration / 1000}s`);

    DOMElements.notificationArea.appendChild(notificationDiv);

    setTimeout(() => {
        notificationDiv.remove();
    }, duration);
}

function calculateMarkup(costPrice, sellingPrice) {
    costPrice = parseFloat(costPrice);
    sellingPrice = parseFloat(sellingPrice);
    if (isNaN(costPrice) || isNaN(sellingPrice) || costPrice <= 0) return 0;
    return ((sellingPrice - costPrice) / costPrice) * 100;
}

function updateCompanyNameDisplay() {
    if (DOMElements.appCompanyNameDisplay) DOMElements.appCompanyNameDisplay.textContent = companyName;
    if (DOMElements.footerCompanyNameDisplay) DOMElements.footerCompanyNameDisplay.textContent = companyName;
    if (DOMElements.loginCompanyNameDisplay) DOMElements.loginCompanyNameDisplay.textContent = companyName;
}

---

## Fungsi Manajemen Tab & Hak Akses

```javascript
function activateTab(tabId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    const allowedTabsAdmin = ['kasir', 'produk', 'pengeluaran', 'laporan', 'rekapan', 'pengaturan'];
    const allowedTabsKasir = ['kasir', 'produk'];

    const allowedTabs = currentUser.role === 'admin' ? allowedTabsAdmin : allowedTabsKasir;

    if (!allowedTabs.includes(tabId) && currentUser.role === 'kasir') {
        showNotification(`Akses ditolak: Peran ${currentUser.role} tidak diizinkan mengakses tab ini.`, 'error', 4000);
        if (DOMElements.tabButtons[0] && !DOMElements.tabButtons[0].classList.contains('active')) {
            activateTab('kasir');
        }
        return;
    }

    // Stop all scanners when switching tabs
    stopScanner('kasir');
    stopScanner('produk');

    DOMElements.tabButtons.forEach(button => {
        button.classList.remove('active');
        if (!allowedTabs.includes(button.dataset.tab)) {
            button.style.display = 'none';
        } else {
            button.style.display = '';
        }
    });
    DOMElements.tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeButton) activeButton.classList.add('active');
    if (activeContent) activeContent.classList.add('active');

    // Detach listeners from previous tab to avoid multiple bindings
    if (DOMElements.newProductCostPriceInput) DOMElements.newProductCostPriceInput.removeEventListener('input', updateNewProductMarkup);
    if (DOMElements.newProductPriceInput) DOMElements.newProductPriceInput.removeEventListener('input', updateNewProductMarkup);
    if (DOMElements.modalProductCostPrice) DOMElements.modalProductCostPrice.removeEventListener('input', updateModalProductMarkup);
    if (DOMElements.modalProductPrice) DOMElements.modalProductPrice.removeEventListener('input', updateModalProductMarkup);

    currentMode = tabId; // Update current mode based on active tab

    switch (tabId) {
        case 'produk':
            renderProductList();
            if (DOMElements.newProductCostPriceInput) DOMElements.newProductCostPriceInput.addEventListener('input', updateNewProductMarkup);
            if (DOMElements.newProductPriceInput) DOMElements.newProductPriceInput.addEventListener('input', updateNewProductMarkup);
            updateNewProductMarkup();
            // Reset produk form & buttons
            clearNewProductForm();
            DOMElements.addNewProductBtn.style.display = 'block';
            DOMElements.updateProductBtn.style.display = 'none';
            break;
        case 'pengeluaran':
            renderExpenseList();
            if(DOMElements.expenseDateInput) DOMElements.expenseDateInput.valueAsDate = new Date();
            break;
        case 'laporan':
            const today = new Date();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const year = today.getFullYear();
            if (DOMElements.reportDateFilter) DOMElements.reportDateFilter.value = `${year}-${month}`;
            renderTransactionList();
            break;
        case 'kasir':
            populateCategoryFilter();
            populateProductSelect();
            renderCartItems();
            calculateSummary();
            clearKasirInputs();
            if (DOMElements.productSelect) DOMElements.productSelect.focus();
            break;
        case 'rekapan':
            renderRecapSummary();
            renderIncomeTrendChart();
            break;
        case 'pengaturan':
            renderUserList();
            disableSettingsInputs(currentUser.role !== 'admin');
            if (currentUser.role !== 'admin') {
                showNotification('Anda harus login sebagai Admin untuk mengelola pengaturan.', 'warning', 4000);
            }
            if (DOMElements.companyNameInput) DOMElements.companyNameInput.value = companyName;
            break;
    }

    feather.replace();
}

DOMElements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        activateTab(tabId);
    });
});

function disableSettingsInputs(disable) {
    if (DOMElements.companyNameInput) DOMElements.companyNameInput.disabled = disable;
    if (DOMElements.saveCompanyNameBtn) DOMElements.saveCompanyNameBtn.disabled = disable;
    if (DOMElements.newUsernameInput) DOMElements.newUsernameInput.disabled = disable;
    if (DOMElements.newPasswordInput) DOMElements.newPasswordInput.disabled = disable;
    if (DOMElements.newUserRoleSelect) DOMElements.newUserRoleSelect.disabled = disable;
    if (DOMElements.addNewUserBtn) DOMElements.addNewUserBtn.disabled = disable;
    if (DOMElements.exportProductsPdfBtn) DOMElements.exportProductsPdfBtn.disabled = disable;
    if (DOMElements.exportTransactionsPdfBtn) DOMElements.exportTransactionsPdfBtn.disabled = disable;
    if (DOMElements.exportExpensesPdfBtn) DOMElements.exportExpensesPdfBtn.disabled = disable;
    if (DOMElements.exportRecapPdfBtn) DOMElements.exportRecapPdfBtn.disabled = disable;
    if (DOMElements.exportChartPdfBtn) DOMElements.exportChartPdfBtn.disabled = disable;
    if (DOMElements.clearAllDataBtn) DOMElements.clearAllDataBtn.disabled = disable;
}

---

## Otentikasi Pengguna

```javascript
function showLoginModal() {
    if (DOMElements.loginModal) {
        DOMElements.loginModal.classList.add('active');
        DOMElements.loginUsernameInput?.focus();
    }
}

function hideLoginModal() {
    if (DOMElements.loginModal) {
        DOMElements.loginModal.classList.remove('active');
    }
}

if (DOMElements.loginBtn) {
    DOMElements.loginBtn.addEventListener('click', () => {
        const username = DOMElements.loginUsernameInput.value.trim();
        const password = DOMElements.loginPasswordInput.value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            showNotification(`Selamat datang, ${currentUser.username}! Anda login sebagai ${currentUser.role}.`, 'success');
            hideLoginModal();
            activateTab('kasir');
        } else {
            showNotification('Username atau password salah.', 'error');
        }
    });
}
// Fungsi ini menerima parameter 'targetVideo' dan 'targetOverlay' untuk membedakan scanner
function initializeScanner(targetVideoElement, targetOverlayElement, startButton, stopButton, mode) {
    if (!targetVideoElement || !targetOverlayElement) {
        console.error("Elemen video scanner atau overlay tidak ditemukan untuk mode:", mode);
        showNotification("Error: Elemen scanner tidak ditemukan. Pastikan HTML sudah benar.", "error");
        return;
    }

    if (scannerInitialized) {
        showNotification('Scanner sudah berjalan. Hentikan dulu.', 'info');
        return;
    }

    targetVideoElement.style.display = 'block';
    targetOverlayElement.style.display = 'flex'; // Pastikan ini tetap flex saat memuat
    targetOverlayElement.textContent = 'Memuat kamera... Pastikan izin diberikan.';


    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: targetVideoElement,
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "i2of5_reader", "2of5_reader", "code_93_reader"]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("Quagga Init Error for mode " + mode + ":", err);
            targetOverlayElement.textContent = `Gagal memuat kamera: ${err.message}. Coba refresh atau berikan izin kamera.`;
            showNotification(`Gagal memuat kamera (${mode}): ${err.message}. Coba refresh atau berikan izin kamera.`, 'error', 5000);
            targetVideoElement.style.display = 'none';
            return;
        }
        console.log("Initialization finished. Ready to start for mode:", mode);
        
        // --- BARIS YANG DIUBAH/DITAMBAHKAN ---
        // Menambahkan kelas 'hidden' untuk menyembunyikan overlay
        targetOverlayElement.classList.add('hidden'); 
        // --- AKHIR BARIS YANG DIUBAH/DITAMBAHKAN ---

        Quagga.start();
        scannerInitialized = true;
        if (startButton) startButton.style.display = 'none';
        if (stopButton) stopButton.style.display = 'inline-flex';
        showNotification('Scanner siap! Posisikan barcode di depan kamera.', 'info', 3000);
    });

    Quagga.onDetected(function (result) {
        const code = result.codeResult.code;
        console.log("Barcode detected:", code);

        // Hanya proses jika scanner masih aktif dan belum ada deteksi sebelumnya
        if (scannerInitialized) {
            if (currentMode === 'kasir') {
                if (DOMElements.barcodeManualInput) DOMElements.barcodeManualInput.value = code;
                handleScannedBarcodeKasir(code);
            } else if (currentMode === 'produk') {
                if (DOMElements.scannedBarcodeProdukInput) DOMElements.scannedBarcodeProdukInput.value = code;
                handleScannedBarcodeProduk(code);
            }
            // Hentikan scanner setelah deteksi
            stopScanner(currentMode);
        }
    });

    Quagga.onProcessed(function(result) {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result && result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.width), parseInt(drawingCanvas.height));
            result.boxes.filter(box => box !== result.box).forEach(box => {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }
        if (result && result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }
        if (result && result.codeResult && result.codeResult.code) {
             Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
    });
}

function stopScanner(mode) {
    if (scannerInitialized) {
        Quagga.stop();
        scannerInitialized = false;
        if (mode === 'kasir') {
            if (DOMElements.startScanBtnKasir) DOMElements.startScanBtnKasir.style.display = 'inline-flex';
            if (DOMElements.stopScanBtnKasir) DOMElements.stopScanBtnKasir.style.display = 'none';
            if (DOMElements.barcodeScannerOverlayKasir) DOMElements.barcodeScannerOverlayKasir.style.display = 'flex';
            if (DOMElements.barcodeScannerVideoKasir) DOMElements.barcodeScannerVideoKasir.style.display = 'none';
            // --- BARIS YANG DIUBAH/DITAMBAHKAN ---
            // Menghapus kelas 'hidden' agar overlay kembali terlihat saat scanner berhenti
            if (DOMElements.barcodeScannerOverlayKasir) DOMElements.barcodeScannerOverlayKasir.classList.remove('hidden');
            // --- AKHIR BARIS YANG DIUBAH/DITAMBAHKAN ---
            DOMElements.barcodeScannerOverlayKasir.textContent = 'Scanner berhenti. Klik "Mulai Scan" untuk memulai.';
        } else if (mode === 'produk') {
            if (DOMElements.startScanBtnProduk) DOMElements.startScanBtnProduk.style.display = 'inline-flex';
            if (DOMElements.stopScanBtnProduk) DOMElements.stopScanBtnProduk.style.display = 'none';
            if (DOMElements.barcodeScannerOverlayProduk) DOMElements.barcodeScannerOverlayProduk.style.display = 'flex';
            if (DOMElements.barcodeScannerVideoProduk) DOMElements.barcodeScannerVideoProduk.style.display = 'none';
            // --- BARIS YANG DIUBAH/DITAMBAHKAN ---
            // Menghapus kelas 'hidden' agar overlay kembali terlihat saat scanner berhenti
            if (DOMElements.barcodeScannerOverlayProduk) DOMElements.barcodeScannerOverlayProduk.classList.remove('hidden');
            // --- AKHIR BARIS YANG DIUBAH/DITAMBAHKAN ---
            DOMElements.barcodeScannerOverlayProduk.textContent = 'Scanner berhenti. Klik "Mulai Scan Produk" untuk memulai.';
        }
        showNotification('Scanner telah dihentikan.', 'info', 2000);
    }
}
if (DOMElements.startScanBtnKasir) {
    DOMElements.startScanBtnKasir.addEventListener('click', () => {
        initializeScanner(DOMElements.barcodeScannerVideoKasir, DOMElements.barcodeScannerOverlayKasir, DOMElements.startScanBtnKasir, DOMElements.stopScanBtnKasir, 'kasir');
    });
}

if (DOMElements.stopScanBtnKasir) {
    DOMElements.stopScanBtnKasir.addEventListener('click', () => stopScanner('kasir'));
}

if (DOMElements.addByManualCodeBtn) {
    DOMElements.addByManualCodeBtn.addEventListener('click', () => {
        const manualCode = DOMElements.barcodeManualInput?.value.trim();
        if (manualCode) {
            handleScannedBarcodeKasir(manualCode);
        } else {
            showNotification('Masukkan kode produk secara manual.', 'error');
            DOMElements.barcodeManualInput?.focus();
        }
    });
}

if (DOMElements.barcodeManualInput) {
    DOMElements.barcodeManualInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const manualCode = DOMElements.barcodeManualInput.value.trim();
            if (manualCode) {
                handleScannedBarcodeKasir(manualCode);
            } else {
                showNotification('Masukkan kode produk secara manual.', 'error');
            }
        }
    });
}
async function handleScannedBarcodeKasir(barcode) {
    const foundProduct = products.find(p => p.id === barcode);

    if (foundProduct) {
        if (DOMElements.productSelect) DOMElements.productSelect.value = foundProduct.id;
        if (DOMElements.productNameInput) DOMElements.productNameInput.value = foundProduct.name;
        if (DOMElements.productPriceInput) DOMElements.productPriceInput.value = foundProduct.price;
        if (DOMElements.productStockDisplay) DOMElements.productStockDisplay.value = foundProduct.stock;
        if (DOMElements.productQuantityInput) {
            DOMElements.productQuantityInput.value = 1;
            DOMElements.productQuantityInput.max = foundProduct.stock;
        }

        if (foundProduct.stock > 0) {
            const quantityToAdd = 1;
            const existingCartItem = cart.find(item => item.id === foundProduct.id);
            const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

            if ((currentQuantityInCart + quantityToAdd) <= foundProduct.stock) {
                if (existingCartItem) {
                    existingCartItem.quantity += quantityToAdd;
                } else {
                    cart.push({
                        id: foundProduct.id,
                        name: foundProduct.name,
                        price: foundProduct.price,
                        costPrice: foundProduct.costPrice,
                        quantity: quantityToAdd
                    });
                }
                foundProduct.stock -= quantityToAdd;
                showNotification(`${foundProduct.name} sejumlah ${quantityToAdd} ditambahkan ke keranjang.`, 'success');
                renderCartItems();
                calculateSummary();
                populateProductSelect(DOMElements.categoryFilter.value);
                saveData();
                clearKasirInputs();
            } else {
                showNotification(`Stok ${foundProduct.name} tidak cukup untuk ditambahkan ke keranjang.`, 'warning');
            }
        } else {
             showNotification(`Produk "${foundProduct.name}" sudah habis (Stok 0).`, 'warning');
        }
    } else {
        showNotification(`Produk dengan kode ${barcode} tidak ditemukan.`, 'error', 4000);
        clearKasirInputs();
    }
}
if (DOMElements.startScanBtnProduk) {
    DOMElements.startScanBtnProduk.addEventListener('click', () => {
        initializeScanner(DOMElements.barcodeScannerVideoProduk, DOMElements.barcodeScannerOverlayProduk, DOMElements.startScanBtnProduk, DOMElements.stopScanBtnProduk, 'produk');
    });
}

if (DOMElements.stopScanBtnProduk) {
    DOMElements.stopScanBtnProduk.addEventListener('click', () => stopScanner('produk'));
}
async function handleScannedBarcodeProduk(barcode) {
    const foundProduct = products.find(p => p.id === barcode);

    if (foundProduct) {
        // Jika produk ditemukan, isi formulir untuk edit
        if (DOMElements.newProductNameInput) DOMElements.newProductNameInput.value = foundProduct.name;
        if (DOMElements.newProductCategoryInput) DOMElements.newProductCategoryInput.value = foundProduct.category || '';
        if (DOMElements.newProductCostPriceInput) DOMElements.newProductCostPriceInput.value = foundProduct.costPrice || 0;
        if (DOMElements.newProductPriceInput) DOMElements.newProductPriceInput.value = foundProduct.price || 0;
        if (DOMElements.newProductStockInput) DOMElements.newProductStockInput.value = foundProduct.stock; // Stok saat ini
        if (DOMElements.newProductMinStockInput) DOMElements.newProductMinStockInput.value = foundProduct.minStock || 0;
        
        updateNewProductMarkup(); // Hitung markup
        
        // Sembunyikan tombol "Tambah Produk Baru", tampilkan "Perbarui Produk"
        if (DOMElements.addNewProductBtn) DOMElements.addNewProductBtn.style.display = 'none';
        if (DOMElements.updateProductBtn) DOMElements.updateProductBtn.style.display = 'block';
        showNotification(`Produk "${foundProduct.name}" ditemukan. Anda dapat memperbarui detailnya.`, 'info');
    } else {
        // Jika produk tidak ditemukan, kosongkan formulir dan tampilkan "Tambah Produk Baru"
        clearNewProductForm();
        if (DOMElements.addNewProductBtn) DOMElements.addNewProductBtn.style.display = 'block';
        if (DOMElements.updateProductBtn) DOMElements.updateProductBtn.style.display = 'none';
        showNotification(`Barcode ${barcode} belum terdaftar. Masukkan detail produk baru.`, 'warning');
    }
    // Set barcode yang discan ke input di tab produk
    if (DOMElements.scannedBarcodeProdukInput) DOMElements.scannedBarcodeProdukInput.value = barcode;
}
if (DOMElements.discountType) {
    DOMElements.discountType.addEventListener('change', () => {
        if (DOMElements.discountType.value !== 'none') {
            DOMElements.discountValueGroup.style.display = 'block';
        } else {
            DOMElements.discountValueGroup.style.display = 'none';
            DOMElements.discountValueInput.value = '0';
        }
        calculateSummary();
    });
}

if (DOMElements.discountValueInput) {
    DOMElements.discountValueInput.addEventListener('input', calculateSummary);
}

function populateCategoryFilter() {
    if (!DOMElements.categoryFilter) return;
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
    const currentFilter = DOMElements.categoryFilter.value;

    DOMElements.categoryFilter.innerHTML = '<option value="">-- Semua Kategori --</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        DOMElements.categoryFilter.appendChild(option);
    });

    if (categories.includes(currentFilter)) {
        DOMElements.categoryFilter.value = currentFilter;
    } else {
        DOMElements.categoryFilter.value = "";
    }
}

if (DOMElements.categoryFilter) {
    DOMElements.categoryFilter.addEventListener('change', () => {
        const selectedCategory = DOMElements.categoryFilter.value;
        populateProductSelect(selectedCategory);
        clearKasirInputs();
    });
}

function populateProductSelect(filterCategory = '') {
    if (!DOMElements.productSelect) return;
    DOMElements.productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';

    const filteredProducts = filterCategory
        ? products.filter(p => p.category === filterCategory)
        : products;

    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

    filteredProducts.forEach(product => {
        let stockWarning = '';
        if (product.stock <= product.minStock && product.stock > 0) {
            stockWarning = ' (Stok Rendah!)';
        } else if (product.stock === 0) {
            stockWarning = ' (Habis)';
        }

        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${formatRupiah(product.price)}) - Stok: ${product.stock}${stockWarning}`;
        option.disabled = product.stock <= 0;
        DOMElements.productSelect.appendChild(option);
    });
}

if (DOMElements.productSelect) {
    DOMElements.productSelect.addEventListener('change', () => {
        const selectedProductId = DOMElements.productSelect.value;
        const selectedProduct = products.find(p => p.id === selectedProductId);

        if (selectedProduct) {
            if (DOMElements.productNameInput) DOMElements.productNameInput.value = selectedProduct.name;
            if (DOMElements.productPriceInput) DOMElements.productPriceInput.value = selectedProduct.price;
            if (DOMElements.productStockDisplay) DOMElements.productStockDisplay.value = selectedProduct.stock;
            if (DOMElements.productQuantityInput) {
                DOMElements.productQuantityInput.value = 1;
                DOMElements.productQuantityInput.max = selectedProduct.stock;
                DOMElements.productQuantityInput.focus();
            }
        } else {
            clearKasirInputs();
        }
    });
}

if (DOMElements.addToCartBtn) {
    DOMElements.addToCartBtn.addEventListener('click', () => {
        const selectedProductId = DOMElements.productSelect?.value;
        const quantity = parseInt(DOMElements.productQuantityInput?.value) || 0;

        if (!selectedProductId) {
            showNotification('Pilih produk terlebih dahulu.', 'error');
            DOMElements.productSelect?.focus();
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showNotification('Masukkan jumlah yang valid (lebih dari 0).', 'error');
            DOMElements.productQuantityInput?.focus();
            return;
        }

        const product = products.find(p => p.id === selectedProductId);

        if (!product) {
            showNotification('Produk tidak ditemukan.', 'error');
            return;
        }

        const existingCartItem = cart.find(item => item.id === product.id);
        const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

        if ((currentQuantityInCart + quantity) > product.stock) {
            showNotification(`Penambahan ${quantity} ${product.name} melebihi stok yang tersedia (${product.stock - currentQuantityInCart} tersisa untuk ditambahkan).`, 'error');
            DOMElements.productQuantityInput?.focus();
            return;
        }

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
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
        showNotification(`${product.name} sejumlah ${quantity} ditambahkan ke keranjang.`, 'success');
        renderCartItems();
        calculateSummary();
        clearKasirInputs();
        populateProductSelect(DOMElements.categoryFilter.value);
        saveData();
        DOMElements.productSelect?.focus();
    });
}

if (DOMElements.clearInputBtn) {
    DOMElements.clearInputBtn.addEventListener('click', () => {
        clearKasirInputs();
        showNotification('Input produk telah dibersihkan.', 'info');
        DOMElements.productSelect?.focus();
    });
}

function clearKasirInputs() {
    if (DOMElements.productSelect) DOMElements.productSelect.value = '';
    if (DOMElements.productNameInput) DOMElements.productNameInput.value = '';
    if (DOMElements.productPriceInput) DOMElements.productPriceInput.value = '';
    if (DOMElements.productStockDisplay) DOMElements.productStockDisplay.value = '';
    if (DOMElements.productQuantityInput) {
        DOMElements.productQuantityInput.value = 1;
        DOMElements.productQuantityInput.max = 9999;
    }
    if (DOMElements.barcodeManualInput) DOMElements.barcodeManualInput.value = '';
    if (DOMElements.barcodeScannerOverlayKasir) DOMElements.barcodeScannerOverlayKasir.textContent = 'Memuat kamera... Pastikan izin diberikan.';
    if (DOMElements.barcodeScannerVideoKasir) DOMElements.barcodeScannerVideoKasir.style.display = 'none';
}

function renderCartItems() {
    if (!DOMElements.cartItemsContainer) return;
    DOMElements.cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        DOMElements.cartItemsContainer.innerHTML = '<p class="empty-cart-message">Keranjang kosong. Pilih produk dari daftar.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-quantity">${item.quantity} x <span class="cart-item-price-per-item">${formatRupiah(item.price)}</span></div>
            </div>
            <div class="cart-item-total-price">${formatRupiah(item.quantity * item.price)}</div>
            <div class="cart-item-actions">
                <button class="danger" data-id="${item.id}" title="Hapus Item"><i data-feather="x"></i></button>
            </div>
        `;
        DOMElements.cartItemsContainer.appendChild(cartItemDiv);
    });
    feather.replace();

    DOMElements.cartItemsContainer.querySelectorAll('button[data-id]').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.currentTarget.dataset.id;
            removeItemFromCart(productId);
        });
    });
}

function removeItemFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const itemToRemove = cart[index];
        const productInStock = products.find(p => p.id === productId);
        if (productInStock) {
            productInStock.stock += itemToRemove.quantity;
        }
        cart.splice(index, 1);
        showNotification(`${itemToRemove.name} dihapus dari keranjang.`, 'info');
        renderCartItems();
        calculateSummary();
        populateProductSelect(DOMElements.categoryFilter.value);
        saveData();
    }
}

function calculateSummary() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.quantity * item.price;
    });

    let discountAmount = 0;
    const currentDiscountType = DOMElements.discountType?.value || 'none';
    const currentDiscountValue = DOMElements.discountValueInput ? parseFloat(DOMElements.discountValueInput.value) || 0 : 0;

    if (currentDiscountType === 'percentage') {
        discountAmount = subtotal * (currentDiscountValue / 100);
    } else if (currentDiscountType === 'nominal') {
        discountAmount = currentDiscountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);


    const total = subtotal - discountAmount;

    if (DOMElements.subtotalSpan) DOMElements.subtotalSpan.textContent = formatRupiah(subtotal);
    if (DOMElements.discountSpan) DOMElements.discountSpan.textContent = formatRupiah(discountAmount);
    if (DOMElements.totalPaymentSpan) DOMElements.totalPaymentSpan.textContent = formatRupiah(total);

    const amountPaid = DOMElements.amountPaidInput ? parseFloat(DOMElements.amountPaidInput.value) || 0 : 0;
    const change = amountPaid - total;
    if (DOMElements.changeAmountSpan) DOMElements.changeAmountSpan.textContent = formatRupiah(change);

    if (DOMElements.changeRow) {
        DOMElements.changeRow.classList.remove('change-negative', 'change-positive');
        if (change < 0) {
            DOMElements.changeRow.classList.add('change-negative');
        } else {
            DOMElements.changeRow.classList.add('change-positive');
        }
    }
}

if (DOMElements.amountPaidInput) {
    DOMElements.amountPaidInput.addEventListener('input', calculateSummary);
}

if (DOMElements.processPaymentBtn) {
    DOMElements.processPaymentBtn.addEventListener('click', () => {
        const totalText = DOMElements.totalPaymentSpan?.textContent || 'Rp 0';
        const total = parseRupiah(totalText);
        const amountPaid = DOMElements.amountPaidInput ? parseFloat(DOMElements.amountPaidInput.value) || 0 : 0;
        const change = amountPaid - total;
        const currentDiscountAmount = parseRupiah(DOMElements.discountSpan?.textContent || 'Rp 0');


        if (cart.length === 0) {
            showNotification('Keranjang belanja kosong. Tambahkan produk terlebih dahulu.', 'error');
            return;
        }

        if (amountPaid < total) {
            showNotification(`Jumlah uang yang dibayarkan kurang. Kurang ${formatRupiah(Math.abs(change))}.`, 'error');
            DOMElements.amountPaidInput?.focus();
            return;
        }

        const transactionId = `TRX${Date.now()}`;
        let actualSubtotal = 0;
        let totalCostPriceForTransaction = 0;
        cart.forEach(item => {
            actualSubtotal += item.quantity * item.price;
            totalCostPriceForTransaction += item.quantity * (item.costPrice || 0);
        });

        transactions.push({
            id: transactionId,
            date: new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            items: JSON.parse(JSON.stringify(cart)),
            subtotal: actualSubtotal,
            total: total,
            amountPaid: amountPaid,
            change: change,
            totalCostPrice: totalCostPriceForTransaction,
            discount: currentDiscountAmount
        });

        showNotification('Pembayaran berhasil! Stok produk diperbarui.', 'success');
        cart = [];
        renderCartItems();
        if(DOMElements.discountType) DOMElements.discountType.value = 'none';
        if(DOMElements.discountValueInput) DOMElements.discountValueInput.value = '0';
        if(DOMElements.discountValueGroup) DOMElements.discountValueGroup.style.display = 'none';

        calculateSummary();
        if (DOMElements.amountPaidInput) DOMElements.amountPaidInput.value = '';
        saveData();
        populateProductSelect(DOMElements.categoryFilter.value);
        DOMElements.productSelect?.focus();
    });
}

if (DOMElements.clearCartBtn) {
    DOMElements.clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang sudah kosong.', 'info');
            return;
        }
        if (confirm('Anda yakin ingin membersihkan keranjang? Stok produk akan dikembalikan.')) {
            cart.forEach(itemInCart => {
                const productInStock = products.find(p => p.id === itemInCart.id);
                if (productInStock) {
                    productInStock.stock += itemInCart.quantity;
                }
            });
            cart = [];
            showNotification('Keranjang telah dibersihkan. Stok produk dikembalikan.', 'info');
            renderCartItems();
            calculateSummary();
            populateProductSelect(DOMElements.categoryFilter.value);
            saveData();
        }
    });
}
function renderProductList() {
    if (!DOMElements.productListBody) return;
    DOMElements.productListBody.innerHTML = '';

    const productFormContainer = document.querySelector('#produk .product-form-container');
    const productTableActionsHeader = document.querySelector('#produk table thead tr th:last-child');

    // Menampilkan/menyembunyikan form tambah produk & kolom Aksi berdasarkan peran
    if (currentUser && currentUser.role === 'kasir') {
        if (productFormContainer) productFormContainer.style.display = 'none';
        if (productTableActionsHeader) productTableActionsHeader.style.display = 'none';
    } else { // Admin
        if (productFormContainer) productFormContainer.style.display = 'block';
        if (productTableActionsHeader) productTableActionsHeader.style.display = '';
    }

    if (products.length === 0) {
        DOMElements.productListBody.innerHTML = `<tr><td colspan="9" class="empty-table-message">Belum ada produk. Tambahkan produk baru.</td></tr>`;
        return;
    }

    const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

    sortedProducts.forEach(product => {
        let stockStatusClass = '';
        let stockStatusText = product.stock;
        if (product.stock <= product.minStock && product.stock > 0) {
            stockStatusClass = 'text-warning-color font-semibold';
            stockStatusText = `${product.stock} (Rendah!)`;
        } else if (product.stock === 0) {
            stockStatusClass = 'text-danger-color font-semibold';
            stockStatusText = `0 (Habis!)`;
        } else if (product.stock > product.minStock) {
            stockStatusClass = 'text-success-color';
        }
        // Pastikan markupPercentage dihitung ulang jika perlu atau sudah ada
        const markupPercentage = typeof product.markupPercentage === 'number' ? product.markupPercentage.toFixed(2) : calculateMarkup(product.costPrice, product.price).toFixed(2);


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category || '-'}</td>
            <td>${formatRupiah(product.costPrice || 0)}</td>
            <td>${formatRupiah(product.price || 0)}</td>
            <td>${markupPercentage}%</td>
            <td class="${stockStatusClass}">${stockStatusText}</td>
            <td>${product.minStock || 0}</td>
            <td class="table-actions">
                ${currentUser.role === 'admin' ? `
                <button class="info" data-id="${product.id}" data-action="adjust-stock" title="Sesuaikan Stok"><i data-feather="repeat"></i> Stok</button>
                <button class="secondary" data-id="${product.id}" data-action="edit" title="Edit Produk"><i data-feather="edit-2"></i></button>
                <button class="danger" data-id="${product.id}" data-action="delete" title="Hapus Produk"><i data-feather="trash"></i></button>
                ` : ''}
            </td>
        `;
        DOMElements.productListBody.appendChild(row);

        // Hide Aksi column for Kasir (sudah diatur di atas untuk productTableActionsHeader)
        if (currentUser && currentUser.role === 'kasir') {
            const actionCell = row.querySelector('.table-actions');
            if (actionCell) actionCell.style.display = 'none';
        }
    });

    if (currentUser && currentUser.role === 'admin') {
        DOMElements.productListBody.querySelectorAll('button[data-action="edit"]').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.dataset.id;
                openEditProductModal(productId);
            });
        });
        DOMElements.productListBody.querySelectorAll('button[data-action="adjust-stock"]').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.dataset.id;
                openStockAdjustmentModal(productId, 'in'); // Default type 'in'
            });
        });
        DOMElements.productListBody.querySelectorAll('button[data-action="delete"]').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.currentTarget.dataset.id;
                deleteProduct(productId);
            });
        });
    }
    feather.replace();
}

function updateNewProductMarkup() {
    const costPrice = parseFloat(DOMElements.newProductCostPriceInput?.value) || 0;
    const sellingPrice = parseFloat(DOMElements.newProductPriceInput?.value) || 0;
    const markup = calculateMarkup(costPrice, sellingPrice);
    if (DOMElements.newProductMarkupPercentageInput) DOMElements.newProductMarkupPercentageInput.value = markup.toFixed(2);
}

if (DOMElements.newProductCostPriceInput) DOMElements.newProductCostPriceInput.addEventListener('input', updateNewProductMarkup);
if (DOMElements.newProductPriceInput) DOMElements.newProductPriceInput.addEventListener('input', updateNewProductMarkup);
if (DOMElements.addNewProductBtn) {
    DOMElements.addNewProductBtn.addEventListener('click', () => {
        const id = DOMElements.scannedBarcodeProdukInput?.value.trim(); // Gunakan barcode sebagai ID
        const name = DOMElements.newProductNameInput?.value.trim();
        const category = DOMElements.newProductCategoryInput?.value.trim();
        const costPrice = parseFloat(DOMElements.newProductCostPriceInput?.value);
        const price = parseFloat(DOMElements.newProductPriceInput?.value);
        const markup = parseFloat(DOMElements.newProductMarkupPercentageInput?.value);
        const stock = parseInt(DOMElements.newProductStockInput?.value);
        const minStock = parseInt(DOMElements.newProductMinStockInput?.value) || 0;

        if (!id) { showNotification('Kode Barcode harus diisi (scan atau manual).', 'error'); DOMElements.scannedBarcodeProdukInput?.focus(); return; }
        if (!name) { showNotification('Nama produk tidak boleh kosong.', 'error'); DOMElements.newProductNameInput?.focus(); return; }
        if (!category) { showNotification('Kategori tidak boleh kosong.', 'error'); DOMElements.newProductCategoryInput?.focus(); return; }
        if (isNaN(costPrice) || costPrice < 0) { showNotification('Harga Beli harus angka positif atau nol.', 'error'); DOMElements.newProductCostPriceInput?.focus(); return; }
        if (isNaN(price) || price <= 0) { showNotification('Harga Jual harus angka positif.', 'error'); DOMElements.newProductPriceInput?.focus(); return; }
        if (price < costPrice) { showNotification('Harga Jual tidak boleh lebih rendah dari Harga Beli.', 'error'); DOMElements.newProductPriceInput?.focus(); return; }
        if (isNaN(stock) || stock < 0) { showNotification('Stok harus angka non-negatif.', 'error'); DOMElements.newProductStockInput?.focus(); return; }
        if (isNaN(minStock) || minStock < 0) { showNotification('Minimum Stok harus angka non-negatif.', 'error'); DOMElements.newProductMinStockInput?.focus(); return; }

        if (products.some(p => p.id === id)) { // Cek ID/Barcode, bukan nama
            showNotification(`Produk dengan barcode/ID "${id}" sudah ada. Gunakan tombol 'Perbarui Produk' untuk mengedit.`, 'error');
            DOMElements.scannedBarcodeProdukInput?.focus();
            return;
        }

        products.push({
            id: id, name: name, costPrice: costPrice, price: price,
            stock: stock, category: category, markupPercentage: markup, minStock: minStock
        });

        showNotification(`Produk "${name}" berhasil ditambahkan. ID Produk: ${id}`, 'success');
        clearNewProductForm();
        renderProductList();
        populateProductSelect(DOMElements.categoryFilter.value);
        populateCategoryFilter();
        saveData();
        DOMElements.newProductNameInput?.focus();
    });
}

// Event listener untuk tombol "Perbarui Produk"
if (DOMElements.updateProductBtn) {
    DOMElements.updateProductBtn.addEventListener('click', () => {
        const id = DOMElements.scannedBarcodeProdukInput?.value.trim(); // Gunakan barcode sebagai ID
        const name = DOMElements.newProductNameInput?.value.trim();
        const category = DOMElements.newProductCategoryInput?.value.trim();
        const costPrice = parseFloat(DOMElements.newProductCostPriceInput?.value);
        const price = parseFloat(DOMElements.newProductPriceInput?.value);
        const markup = parseFloat(DOMElements.newProductMarkupPercentageInput?.value);
        const stock = parseInt(DOMElements.newProductStockInput?.value); // Stok yang dimasukkan saat ini
        const minStock = parseInt(DOMElements.newProductMinStockInput?.value) || 0;

        if (!id) { showNotification('Kode Barcode harus diisi (scan atau manual).', 'error'); DOMElements.scannedBarcodeProdukInput?.focus(); return; }
        if (!name) { showNotification('Nama produk tidak boleh kosong.', 'error'); DOMElements.newProductNameInput?.focus(); return; }
        if (!category) { showNotification('Kategori tidak boleh kosong.', 'error'); DOMElements.newProductCategoryInput?.focus(); return; }
        if (isNaN(costPrice) || costPrice < 0) { showNotification('Harga Beli harus angka positif atau nol.', 'error'); DOMElements.newProductCostPriceInput?.focus(); return; }
        if (isNaN(price) || price <= 0) { showNotification('Harga Jual harus angka positif.', 'error'); DOMElements.newProductPriceInput?.focus(); return; }
        if (price < costPrice) { showNotification('Harga Jual tidak boleh lebih rendah dari Harga Beli.', 'error'); DOMElements.newProductPriceInput?.focus(); return; }
        if (isNaN(stock) || stock < 0) { showNotification('Stok harus angka non-negatif.', 'error'); DOMElements.newProductStockInput?.focus(); return; }
        if (isNaN(minStock) || minStock < 0) { showNotification('Minimum Stok harus angka non-negatif.', 'error'); DOMElements.newProductMinStockInput?.focus(); return; }

        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex > -1) {
            products[productIndex].name = name;
            products[productIndex].category = category;
            products[productIndex].costPrice = costPrice;
            products[productIndex].markupPercentage = markup;
            products[productIndex].price = price;
            products[productIndex].stock = stock; // Update stok dengan nilai input
            products[productIndex].minStock = minStock;

            showNotification(`Produk "${name}" berhasil diperbarui.`, 'success');
            clearNewProductForm();
            DOMElements.addNewProductBtn.style.display = 'block';
            DOMElements.updateProductBtn.style.display = 'none';
            renderProductList();
            populateProductSelect(DOMElements.categoryFilter.value);
            populateCategoryFilter();
            saveData();
        } else {
            showNotification('Produk gagal diperbarui atau tidak ditemukan.', 'error');
        }
    });
}

function clearNewProductForm() {
    if (DOMElements.scannedBarcodeProdukInput) DOMElements.scannedBarcodeProdukInput.value = '';
    if (DOMElements.newProductNameInput) DOMElements.newProductNameInput.value = '';
    if (DOMElements.newProductCategoryInput) DOMElements.newProductCategoryInput.value = '';
    if (DOMElements.newProductCostPriceInput) DOMElements.newProductCostPriceInput.value = '0';
    if (DOMElements.newProductPriceInput) DOMElements.newProductPriceInput.value = '0';
    if (DOMElements.newProductMarkupPercentageInput) DOMElements.newProductMarkupPercentageInput.value = '0.00';
    if (DOMElements.newProductStockInput) DOMElements.newProductStockInput.value = '0';
    if (DOMElements.newProductMinStockInput) DOMElements.newProductMinStockInput.value = '0';
}
function openEditProductModal(productId) {
    const productToEdit = products.find(p => p.id === productId);
    if (productToEdit) {
        if (DOMElements.modalProductId) DOMElements.modalProductId.value = productToEdit.id;
        if (DOMElements.modalProductName) DOMElements.modalProductName.value = productToEdit.name;
        if (DOMElements.modalProductCategory) DOMElements.modalProductCategory.value = productToEdit.category || '';
        if (DOMElements.modalProductCostPrice) DOMElements.modalProductCostPrice.value = productToEdit.costPrice || 0;
        if (DOMElements.modalProductPrice) DOMElements.modalProductPrice.value = productToEdit.price || 0;
        if (DOMElements.modalProductMarkupPercentage) DOMElements.modalProductMarkupPercentage.value = productToEdit.markupPercentage || 0;
        if (DOMElements.modalProductStock) DOMElements.modalProductStock.value = productToEdit.stock || 0;
        if (DOMElements.modalProductMinStock) DOMElements.modalProductMinStock.value = productToEdit.minStock || 0;

        if (DOMElements.modalProductCostPrice) DOMElements.modalProductCostPrice.removeEventListener('input', updateModalProductMarkup);
        if (DOMElements.modalProductPrice) DOMElements.modalProductPrice.removeEventListener('input', updateModalProductMarkup);
        if (DOMElements.modalProductCostPrice) DOMElements.modalProductCostPrice.addEventListener('input', updateModalProductMarkup);
        if (DOMElements.modalProductPrice) DOMElements.modalProductPrice.addEventListener('input', updateModalProductMarkup);
        updateModalProductMarkup();

        if (DOMElements.editProductModal) DOMElements.editProductModal.classList.add('active');
        DOMElements.modalProductName?.focus();
    } else {
        showNotification('Produk tidak ditemukan untuk diedit.', 'error');
    }
}

function updateModalProductMarkup() {
    const costPrice = parseFloat(DOMElements.modalProductCostPrice?.value) || 0;
    const sellingPrice = parseFloat(DOMElements.modalProductPrice?.value) || 0;
    const markup = calculateMarkup(costPrice, sellingPrice);
    if (DOMElements.modalProductMarkupPercentage) DOMElements.modalProductMarkupPercentage.value = markup.toFixed(2);
}

if (closeEditModalBtn) { closeEditModalBtn.addEventListener('click', () => { DOMElements.editProductModal?.classList.remove('active'); }); }
if (DOMElements.cancelEditBtn) { DOMElements.cancelEditBtn.addEventListener('click', () => { DOMElements.editProductModal?.classList.remove('active'); }); }

if (DOMElements.saveProductBtn) {
    DOMElements.saveProductBtn.addEventListener('click', () => {
        const id = DOMElements.modalProductId?.value;
        const name = DOMElements.modalProductName?.value.trim();
        const category = DOMElements.modalProductCategory?.value.trim();
        const costPrice = parseFloat(DOMElements.modalProductCostPrice?.value);
        const price = parseFloat(DOMElements.modalProductPrice?.value);
        const markup = parseFloat(DOMElements.modalProductMarkupPercentage?.value);
        const stock = parseInt(DOMElements.modalProductStock?.value);
        const minStock = parseInt(DOMElements.modalProductMinStock?.value) || 0;


        if (!name) { showNotification('Nama produk tidak boleh kosong.', 'error'); DOMElements.modalProductName?.focus(); return; }
        if (!category) { showNotification('Kategori tidak boleh kosong.', 'error'); DOMElements.modalProductCategory?.focus(); return; }
        if (isNaN(costPrice) || costPrice < 0) { showNotification('Harga Beli harus angka positif atau nol.', 'error'); DOMElements.modalProductCostPrice?.focus(); return; }
        if (isNaN(price) || price <= 0) { showNotification('Harga Jual harus angka positif.', 'error'); DOMElements.modalProductPrice?.focus(); return; }
        if (price < costPrice) { showNotification('Harga Jual tidak boleh lebih rendah dari Harga Beli.', 'error'); DOMElements.modalProductPrice?.focus(); return; }
        if (isNaN(stock) || stock < 0) { showNotification('Stok harus angka non-negatif.', 'error'); DOMElements.modalProductStock?.focus(); return; }
        if (isNaN(minStock) || minStock < 0) { showNotification('Minimum Stok harus angka non-negatif.', 'error'); DOMElements.modalProductMinStock?.focus(); return; }


        if (products.some(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== id)) {
            showNotification(`Produk dengan nama "${name}" sudah ada.`, 'error');
            DOMElements.modalProductName?.focus();
            return;
        }

        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex > -1) {
            products[productIndex].name = name;
            products[productIndex].category = category;
            products[productIndex].costPrice = costPrice;
            products[productIndex].markupPercentage = markup;
            products[productIndex].price = price;
            products[productIndex].stock = stock;
            products[productIndex].minStock = minStock;

            showNotification(`Produk "${name}" berhasil diperbarui.`, 'success');
            DOMElements.editProductModal?.classList.remove('active');
            renderProductList();
            populateProductSelect(DOMElements.categoryFilter.value);
            populateCategoryFilter();
            saveData();
        } else {
            showNotification('Produk gagal diperbarui atau tidak ditemukan.', 'error');
        }
    });
}
function openStockAdjustmentModal(productId, type) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Produk tidak ditemukan.', 'error');
        return;
    }

    currentStockAdjustProductId = productId;
    if (DOMElements.stockModalTitle) DOMElements.stockModalTitle.textContent = type === 'in' ? 'Tambah Stok Produk' : 'Kurangi Stok Produk';
    if (DOMElements.stockProductNameDisplay) DOMElements.stockProductNameDisplay.textContent = product.name;
    if (DOMElements.stockProductIdDisplay) DOMElements.stockProductIdDisplay.textContent = product.id;
    if (DOMElements.currentStockDisplay) DOMElements.currentStockDisplay.textContent = product.stock;
    if (DOMElements.stockAdjustmentType) DOMElements.stockAdjustmentType.value = type;
    if (DOMElements.stockAdjustmentQuantity) {
        DOMElements.stockAdjustmentQuantity.value = 1;
        DOMElements.stockAdjustmentQuantity.max = type === 'out' ? product.stock : 99999;
    }
    if (DOMElements.stockAdjustmentReason) DOMElements.stockAdjustmentReason.value = '';

    if (DOMElements.stockAdjustmentModal) DOMElements.stockAdjustmentModal.classList.add('active');
    DOMElements.stockAdjustmentQuantity?.focus();
}

if (closeStockAdjustmentBtn) { closeStockAdjustmentBtn.addEventListener('click', () => { DOMElements.stockAdjustmentModal?.classList.remove('active'); }); }
if (DOMElements.cancelStockAdjustmentBtn) { DOMElements.cancelStockAdjustmentBtn.addEventListener('click', () => { DOMElements.stockAdjustmentModal?.classList.remove('active'); }); }

if (DOMElements.saveStockAdjustmentBtn) {
    DOMElements.saveStockAdjustmentBtn.addEventListener('click', () => {
        const productId = currentStockAdjustProductId;
        const type = DOMElements.stockAdjustmentType?.value;
        const quantity = parseInt(DOMElements.stockAdjustmentQuantity?.value) || 0;
        const reason = DOMElements.stockAdjustmentReason?.value.trim();

        if (!productId || isNaN(quantity) || quantity <= 0) {
            showNotification('Jumlah penyesuaian tidak valid.', 'error');
            return;
        }

        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            showNotification('Produk tidak ditemukan.', 'error');
            return;
        }

        const product = products[productIndex];

        if (type === 'in') {
            product.stock += quantity;
            showNotification(`Stok ${product.name} ditambahkan ${quantity}.`, 'success');
        } else if (type === 'out') {
            if (product.stock < quantity) {
                showNotification(`Jumlah yang dikurangi (${quantity}) melebihi stok tersedia (${product.stock}).`, 'error');
                DOMElements.stockAdjustmentQuantity?.focus();
                return;
            }
            product.stock -= quantity;
            showNotification(`Stok ${product.name} dikurangi ${quantity}.`, 'info');
        }
        saveData();
        DOMElements.stockAdjustmentModal?.classList.remove('active');
        renderProductList();
        populateProductSelect(DOMElements.categoryFilter.value);
    });
}


window.addEventListener('click', (event) => {
    if (DOMElements.loginModal && event.target === DOMElements.loginModal && DOMElements.loginModal.classList.contains('active')) {
        // Do nothing, force user to log in
    } else if (DOMElements.editProductModal && event.target === DOMElements.editProductModal) {
        DOMElements.editProductModal.classList.remove('active');
    } else if (DOMElements.stockAdjustmentModal && event.target === DOMElements.stockAdjustmentModal) {
        DOMElements.stockAdjustmentModal.classList.remove('active');
    } else if (DOMElements.transactionDetailModal && event.target === DOMElements.transactionDetailModal) {
        DOMElements.transactionDetailModal.classList.remove('active');
    } else if (DOMElements.editExpenseModal && event.target === DOMElements.editExpenseModal) {
        DOMElements.editExpenseModal.classList.remove('active');
    } else if (DOMElements.aboutUsModal && event.target === DOMElements.aboutUsModal) {
        DOMElements.aboutUsModal.classList.remove('active');
    }
});

function deleteProduct(productId) {
    const isProductInCart = cart.some(item => item.id === productId);
    if (isProductInCart) {
        showNotification('Produk ini ada di keranjang belanja. Hapus dari keranjang terlebih dahulu.', 'error');
        return;
    }
    const isProductInTransactions = transactions.some(t => t.items.some(item => item.id === productId));
    if (isProductInTransactions) {
        showNotification('Produk ini sudah tercatat dalam riwayat transaksi dan tidak dapat dihapus.', 'error');
        return;
    }

    if (confirm('Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
        const initialLength = products.length;
        products = products.filter(p => p.id !== productId);
        if (products.length < initialLength) {
            showNotification('Produk berhasil dihapus.', 'success');
            saveData(); // Save data AFTER filter
        } else {
            showNotification('Produk gagal dihapus atau tidak ditemukan.', 'error');
        }
    }
}
function openStockAdjustmentModal(productId, type) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Produk tidak ditemukan.', 'error');
        return;
    }

    currentStockAdjustProductId = productId;
    if (DOMElements.stockModalTitle) DOMElements.stockModalTitle.textContent = type === 'in' ? 'Tambah Stok Produk' : 'Kurangi Stok Produk';
    if (DOMElements.stockProductNameDisplay) DOMElements.stockProductNameDisplay.textContent = product.name;
    if (DOMElements.stockProductIdDisplay) DOMElements.stockProductIdDisplay.textContent = product.id;
    if (DOMElements.currentStockDisplay) DOMElements.currentStockDisplay.textContent = product.stock;
    if (DOMElements.stockAdjustmentType) DOMElements.stockAdjustmentType.value = type;
    if (DOMElements.stockAdjustmentQuantity) {
        DOMElements.stockAdjustmentQuantity.value = 1;
        DOMElements.stockAdjustmentQuantity.max = type === 'out' ? product.stock : 99999;
    }
    if (DOMElements.stockAdjustmentReason) DOMElements.stockAdjustmentReason.value = '';

    if (DOMElements.stockAdjustmentModal) DOMElements.stockAdjustmentModal.classList.add('active');
    DOMElements.stockAdjustmentQuantity?.focus();
}

if (closeStockAdjustmentBtn) { closeStockAdjustmentBtn.addEventListener('click', () => { DOMElements.stockAdjustmentModal?.classList.remove('active'); }); }
if (DOMElements.cancelStockAdjustmentBtn) { DOMElements.cancelStockAdjustmentBtn.addEventListener('click', () => { DOMElements.stockAdjustmentModal?.classList.remove('active'); }); }

if (DOMElements.saveStockAdjustmentBtn) {
    DOMElements.saveStockAdjustmentBtn.addEventListener('click', () => {
        const productId = currentStockAdjustProductId;
        const type = DOMElements.stockAdjustmentType?.value;
        const quantity = parseInt(DOMElements.stockAdjustmentQuantity?.value) || 0;
        const reason = DOMElements.stockAdjustmentReason?.value.trim();

        if (!productId || isNaN(quantity) || quantity <= 0) {
            showNotification('Jumlah penyesuaian tidak valid.', 'error');
            return;
        }

        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            showNotification('Produk tidak ditemukan.', 'error');
            return;
        }

        const product = products[productIndex];

        if (type === 'in') {
            product.stock += quantity;
            showNotification(`Stok ${product.name} ditambahkan ${quantity}.`, 'success');
        } else if (type === 'out') {
            if (product.stock < quantity) {
                showNotification(`Jumlah yang dikurangi (${quantity}) melebihi stok tersedia (${product.stock}).`, 'error');
                DOMElements.stockAdjustmentQuantity?.focus();
                return;
            }
            product.stock -= quantity;
            showNotification(`Stok ${product.name} dikurangi ${quantity}.`, 'info');
        }
        saveData();
        DOMElements.stockAdjustmentModal?.classList.remove('active');
        renderProductList();
        populateProductSelect(DOMElements.categoryFilter.value);
    });
}


window.addEventListener('click', (event) => {
    if (DOMElements.loginModal && event.target === DOMElements.loginModal && DOMElements.loginModal.classList.contains('active')) {
        // Do nothing, force user to log in
    } else if (DOMElements.editProductModal && event.target === DOMElements.editProductModal) {
        DOMElements.editProductModal.classList.remove('active');
    } else if (DOMElements.stockAdjustmentModal && event.target === DOMElements.stockAdjustmentModal) {
        DOMElements.stockAdjustmentModal.classList.remove('active');
    } else if (DOMElements.transactionDetailModal && event.target === DOMElements.transactionDetailModal) {
        DOMElements.transactionDetailModal.classList.remove('active');
    } else if (DOMElements.editExpenseModal && event.target === DOMElements.editExpenseModal) {
        DOMElements.editExpenseModal.classList.remove('active');
    } else if (DOMElements.aboutUsModal && event.target === DOMElements.aboutUsModal) {
        DOMElements.aboutUsModal.classList.remove('active');
    }
});

function deleteProduct(productId) {
    const isProductInCart = cart.some(item => item.id === productId);
    if (isProductInCart) {
        showNotification('Produk ini ada di keranjang belanja. Hapus dari keranjang terlebih dahulu.', 'error');
        return;
    }
    const isProductInTransactions = transactions.some(t => t.items.some(item => item.id === productId));
    if (isProductInTransactions) {
        showNotification('Produk ini sudah tercatat dalam riwayat transaksi dan tidak dapat dihapus.', 'error');
        return;
    }

    if (confirm('Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
        const initialLength = products.length;
        products = products.filter(p => p.id !== productId);
        if (products.length < initialLength) {
            showNotification('Produk berhasil dihapus.', 'success');
            saveData(); // Save data AFTER filter
        } else {
            showNotification('Produk gagal dihapus atau tidak ditemukan.', 'error');
        }
    }
}
if (DOMElements.addExpenseBtn) {
    DOMElements.addExpenseBtn.addEventListener('click', () => {
        const date = DOMElements.expenseDateInput?.value;
        const category = DOMElements.expenseCategoryInput?.value.trim();
        const description = DOMElements.expenseDescriptionInput?.value.trim();
        const amount = parseFloat(DOMElements.expenseAmountInput?.value) || 0;

        if (!date || !category || isNaN(amount) || amount <= 0) {
            showNotification('Mohon lengkapi Tanggal, Kategori, dan Jumlah Pengeluaran dengan benar.', 'error');
            return;
        }

        const newExpenseId = 'EXP' + Date.now().toString().slice(-6);
        expenses.push({
            id: newExpenseId,
            date: date,
            category: category,
            description: description,
            amount: amount
        });

        showNotification('Pengeluaran berhasil ditambahkan.', 'success');
        if (DOMElements.expenseDateInput) DOMElements.expenseDateInput.valueAsDate = new Date();
        if (DOMElements.expenseCategoryInput) DOMElements.expenseCategoryInput.value = '';
        if (DOMElements.expenseDescriptionInput) DOMElements.expenseDescriptionInput.value = '';
        if (DOMElements.expenseAmountInput) DOMElements.expenseAmountInput.value = '0';
        saveData();
        renderExpenseList();
    });
}

function renderExpenseList() {
    if (!DOMElements.expenseListBody) return;
    DOMElements.expenseListBody.innerHTML = '';

    const expenseFormContainer = document.querySelector('#pengeluaran > .form-group')?.closest('.tab-content')?.children[1];
    const expenseTableHead = document.querySelector('#pengeluaran table thead th:last-child');
    if (currentUser && currentUser.role === 'kasir') {
        if (expenseFormContainer) expenseFormContainer.style.display = 'none';
        if (expenseTableHead) expenseTableHead.style.display = 'none';
    } else {
        if (expenseFormContainer) expenseFormContainer.style.display = 'block';
        if (expenseTableHead) expenseTableHead.style.display = '';
    }


    if (expenses.length === 0) {
        DOMElements.expenseListBody.innerHTML = `<tr><td colspan="6" class="empty-table-message">Belum ada pengeluaran yang tercatat.</p></td></tr>`;
        return;
    }

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.description || '-'}</td>
            <td>${formatRupiah(expense.amount)}</td>
            <td class="table-actions">
                ${currentUser.role === 'admin' ? `
                <button class="info" data-id="${expense.id}" data-action="edit-expense" title="Edit Pengeluaran"><i data-feather="edit-2"></i></button>
                <button class="danger" data-id="${expense.id}" data-action="delete-expense" title="Hapus Pengeluaran"><i data-feather="trash"></i></button>
                ` : ''}
            </td>
        `;
        DOMElements.expenseListBody.appendChild(row);

        if (currentUser && currentUser.role === 'kasir') {
            const actionCell = row.querySelector('.table-actions');
            if (actionCell) actionCell.style.display = 'none';
        }
    });
    feather.replace();

    if (currentUser && currentUser.role === 'admin') {
        DOMElements.expenseListBody.querySelectorAll('button[data-action="edit-expense"]').forEach(button => {
            button.addEventListener('click', (event) => {
                const expenseId = event.currentTarget.dataset.id;
                openEditExpenseModal(expenseId);
            });
        });
        DOMElements.expenseListBody.querySelectorAll('button[data-action="delete-expense"]').forEach(button => {
            button.addEventListener('click', (event) => {
                const expenseId = event.currentTarget.dataset.id;
                deleteExpense(expenseId);
            });
        });
    }
}

function openEditExpenseModal(expenseId) {
    const expenseToEdit = expenses.find(e => e.id === expenseId);
    if (expenseToEdit) {
        if (DOMElements.modalExpenseId) DOMElements.modalExpenseId.value = expenseToEdit.id;
        if (DOMElements.modalExpenseDate) DOMElements.modalExpenseDate.value = expenseToEdit.date;
        if (DOMElements.modalExpenseCategory) DOMElements.modalExpenseCategory.value = expenseToEdit.category;
        if (DOMElements.modalExpenseDescription) DOMElements.modalExpenseDescription.value = expenseToEdit.description;
        if (DOMElements.modalExpenseAmount) DOMElements.modalExpenseAmount.value = expenseToEdit.amount;

        if (DOMElements.editExpenseModal) DOMElements.editExpenseModal.classList.add('active');
    } else {
        showNotification('Pengeluaran tidak ditemukan untuk diedit.', 'error');
    }
}

if (closeExpenseModalBtn) { closeExpenseModalBtn.addEventListener('click', () => { DOMElements.editExpenseModal?.classList.remove('active'); }); }
if (DOMElements.cancelExpenseEditBtn) { DOMElements.cancelExpenseEditBtn.addEventListener('click', () => { DOMElements.editExpenseModal?.classList.remove('active'); }); }

if (DOMElements.saveExpenseBtn) {
    DOMElements.saveExpenseBtn.addEventListener('click', () => {
        const id = DOMElements.modalExpenseId?.value;
        const date = DOMElements.modalExpenseDate?.value;
        const category = DOMElements.modalExpenseCategory?.value.trim();
        const description = DOMElements.modalExpenseDescription?.value.trim();
        const amount = parseFloat(DOMElements.modalExpenseAmount?.value) || 0;

        if (!date || !category || isNaN(amount) || amount <= 0) {
            showNotification('Mohon lengkapi Tanggal, Kategori, dan Jumlah Pengeluaran dengan benar.', 'error');
            return;
        }

        const expenseIndex = expenses.findIndex(e => e.id === id);
        if (expenseIndex > -1) {
            expenses[expenseIndex] = { id: id, date: date, category: category, description: description, amount: amount };
            showNotification('Pengeluaran berhasil diperbarui.', 'success');
            DOMElements.editExpenseModal?.classList.remove('active');
            saveData();
            renderExpenseList();
        } else {
            showNotification('Pengeluaran gagal diperbarui atau tidak ditemukan.', 'error');
        }
    });
}

function deleteExpense(expenseId) {
    if (confirm('Anda yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.')) {
        const initialLength = expenses.length;
        expenses = expenses.filter(e => e.id !== expenseId);
        if (expenses.length < initialLength) {
            showNotification('Pengeluaran berhasil dihapus.', 'success');
            saveData();
            renderExpenseList();
        } else {
            showNotification('Pengeluaran gagal dihapus atau tidak ditemukan.', 'error');
        }
    }
}
if (DOMElements.reportDateFilter) {
    DOMElements.reportDateFilter.addEventListener('change', renderTransactionList);
}

function renderTransactionList() {
    if (!DOMElements.transactionListBody) return;
    DOMElements.transactionListBody.innerHTML = '';
    const filterMonthYear = DOMElements.reportDateFilter?.value || '';

    const reportTableHead = document.querySelector('#laporan table thead th:last-child');
    if (currentUser && currentUser.role === 'kasir') {
        if (reportTableHead) reportTableHead.style.display = 'none';
    } else {
        if (reportTableHead) reportTableHead.style.display = '';
    }

    const filteredTransactions = transactions.filter(t => {
        if (!filterMonthYear) return true;
        const transactionDate = new Date(t.date);
        const filterDate = new Date(filterMonthYear);
        return transactionDate.getFullYear() === filterDate.getFullYear() && transactionDate.getMonth() === filterDate.getMonth();
    });

    if (filteredTransactions.length === 0) {
        DOMElements.transactionListBody.innerHTML = `<tr><td colspan="5" class="empty-table-message">Tidak ada transaksi untuk periode ini.</td></tr>`;
        return;
    }

    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${formatRupiah(transaction.total)}</td>
            <td>${formatRupiah(transaction.discount || 0)}</td>
            <td class="table-actions">
                <button class="info" data-id="${transaction.id}" data-action="view-details" title="Lihat Detail Transaksi"><i data-feather="eye"></i></button>
            </td>
        `;
        DOMElements.transactionListBody.appendChild(row);

        if (currentUser && currentUser.role === 'kasir') {
            const actionCell = row.querySelector('.table-actions');
            if (actionCell) actionCell.style.display = 'none';
        }
    });
    feather.replace();

    DOMElements.transactionListBody.querySelectorAll('button[data-action="view-details"]').forEach(button => {
        button.addEventListener('click', (event) => {
            const transactionId = event.currentTarget.dataset.id;
            viewTransactionDetails(transactionId);
        });
    });
}

function viewTransactionDetails(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        if (DOMElements.detailTransactionId) DOMElements.detailTransactionId.textContent = transaction.id;
        if (DOMElements.detailTransactionDate) DOMElements.detailTransactionDate.textContent = transaction.date;
        if (DOMElements.detailTransactionSubtotal) DOMElements.detailTransactionSubtotal.textContent = formatRupiah(transaction.subtotal);
        if (DOMElements.detailTransactionDiscount) DOMElements.detailTransactionDiscount.textContent = formatRupiah(transaction.discount || 0);
        if (DOMElements.detailTransactionTotal) DOMElements.detailTransactionTotal.textContent = formatRupiah(transaction.total);
        if (DOMElements.detailTransactionPaid) DOMElements.detailTransactionPaid.textContent = formatRupiah(transaction.amountPaid);
        if (DOMElements.detailTransactionChange) DOMElements.detailTransactionChange.textContent = formatRupiah(transaction.change);

        if (DOMElements.detailTransactionItems) DOMElements.detailTransactionItems.innerHTML = '';
        if (transaction.items && transaction.items.length > 0) {
            transaction.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} x ${item.quantity} (${formatRupiah(item.price)}) = ${formatRupiah(item.quantity * item.price)}`;
                DOMElements.detailTransactionItems?.appendChild(li);
            });
        } else {
            if (DOMElements.detailTransactionItems) DOMElements.detailTransactionItems.innerHTML = '<li>Tidak ada item.</li>';
        }

        if (DOMElements.transactionDetailModal) DOMElements.transactionDetailModal.classList.add('active');
        feather.replace();
    } else {
        showNotification('Transaksi tidak ditemukan.', 'error');
    }
}

if (closeDetailModalBtn) { closeDetailModalBtn.addEventListener('click', () => { DOMElements.transactionDetailModal?.classList.remove('active'); }); }
if (DOMElements.closeDetailModalFooterBtn) { DOMElements.closeDetailModalFooterBtn.addEventListener('click', () => { DOMElements.transactionDetailModal?.classList.remove('active'); }); }
if (DOMElements.printReceiptBtn) {
    DOMElements.printReceiptBtn.addEventListener('click', () => {
        const transactionId = DOMElements.detailTransactionId?.textContent;
        if (transactionId) printReceipt(transactionId);
    });
}

function printReceipt(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);

    if (!transaction) {
        showNotification('Transaksi tidak ditemukan untuk dicetak.', 'error');
        return;
    }

    let receiptItemsHtml = '';
    transaction.items.forEach(item => {
        receiptItemsHtml += `
            <div class="item-row">
                <span class="item-name">${item.name}</span>
                <span class="item-qty-price">${item.quantity} x ${formatRupiah(item.price)} (${formatRupiah(item.quantity * item.price)})</span>
            </div>
        `;
    });

    const receiptContent = `
        <div class="header">
            <h3>${companyName}</h3>
            <p>Jl. Contoh No. 123, Kota Anda</p>
            <p>Telp: 0812-3456-7890</p>
        </div>
        <div class="separator"></div>
        <p><strong>Transaksi ID:</strong> ${transaction.id}</p>
        <p><strong>Tanggal:</strong> ${transaction.date}</p>
        <div class="separator"></div>
        <div class="item-row">
            <span class="item-name"><strong>Deskripsi</strong></span>
            <span class="item-qty-price"><strong>Qty x Harga (Subtotal)</strong></span>
        </div>
        <div class="separator"></div>
        ${receiptItemsHtml}
        <div class="separator"></div>
        <div class="summary-row">
            <span>Subtotal:</span>
            <span class="text-right">${formatRupiah(transaction.subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Diskon:</span>
            <span class="text-right">${formatRupiah(transaction.discount || 0)}</span>
        </div>
        <div class="summary-row total-row">
            <span>TOTAL:</span>
            <span class="text-right">${formatRupiah(transaction.total)}</span>
        </div>
        <div class="summary-row">
            <span>Tunai:</span>
            <span class="text-right">${formatRupiah(transaction.amountPaid)}</span>
        </div>
        <div class="summary-row">
            <span>Kembalian:</span>
            <span class="text-right">${formatRupiah(transaction.change)}</span>
        </div>
        <div class="separator"></div>
        <div class="footer">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Slogan Perusahaan Anda</p>
        </div>
    `;

    if (DOMElements.printReceiptContentDiv) DOMElements.printReceiptContentDiv.innerHTML = receiptContent;
    window.print();
}
function renderRecapSummary() {
    let totalRevenue = 0;
    let totalCostOfGoodsSold = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        totalRevenue += transaction.total;
        transaction.items.forEach(item => {
            totalCostOfGoodsSold += item.quantity * (item.costPrice || 0); // Pastikan item.costPrice ada
        });
    });

    expenses.forEach(expense => {
        totalExpenses += expense.amount;
    });


    const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses;

    if (DOMElements.recapRevenueSpan) DOMElements.recapRevenueSpan.textContent = formatRupiah(totalRevenue);
    if (DOMElements.recapCostOfGoodsSpan) DOMElements.recapCostOfGoodsSpan.textContent = formatRupiah(totalCostOfGoodsSold);
    if (DOMElements.recapTotalExpenseSpan) DOMElements.recapTotalExpenseSpan.textContent = formatRupiah(totalExpenses);
    if (DOMElements.recapProfitSpan) DOMElements.recapProfitSpan.textContent = formatRupiah(netProfit);

    if (DOMElements.recapProfitSpan && DOMElements.recapProfitSpan.parentElement) {
        DOMElements.recapProfitSpan.parentElement.classList.remove('profit', 'expense');
        if (netProfit >= 0) {
            DOMElements.recapProfitSpan.parentElement.classList.add('profit');
        } else {
            DOMElements.recapProfitSpan.parentElement.classList.add('expense');
        }
    }
}
if (DOMElements.chartFilter) {
    DOMElements.chartFilter.addEventListener('change', renderIncomeTrendChart);
}

function renderIncomeTrendChart() {
    if (!DOMElements.incomeTrendChartCanvas) return;

    if (incomeChartInstance) {
        incomeChartInstance.destroy();
    }

    const chartType = DOMElements.chartFilter.value;
    let labels = [];
    let data = [];
    let chartTitle = '';

    const today = new Date();
    const filteredTransactions = transactions.filter(t => t.total > 0);

    if (filteredTransactions.length === 0) {
        DOMElements.incomeTrendChartCanvas.style.display = 'none';
        if (DOMElements.chartEmptyMessage) DOMElements.chartEmptyMessage.style.display = 'block';
        return;
    } else {
        DOMElements.incomeTrendChartCanvas.style.display = 'block';
        if (DOMElements.chartEmptyMessage) DOMElements.chartEmptyMessage.style.display = 'none';
    }

    const dailyData = new Map();
    const weeklyData = new Map();
    const monthlyData = new Map();
    const yearlyData = new Map();

    filteredTransactions.forEach(t => {
        const transactionDate = new Date(t.date);
        const totalAmount = t.total;

        const dateKey = transactionDate.toISOString().split('T')[0];
        dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + totalAmount);

        const year = transactionDate.getFullYear();
        const startOfWeek = new Date(transactionDate);
        startOfWeek.setDate(transactionDate.getDate() - transactionDate.getDay());
        const weekKey = `${startOfWeek.toISOString().split('T')[0]}`;
        weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + totalAmount);

        const monthYearKey = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyData.set(monthYearKey, (monthlyData.get(monthYearKey) || 0) + totalAmount);

        const yearKey = transactionDate.getFullYear().toString();
        yearlyData.set(yearKey, (yearlyData.get(yearKey) || 0) + totalAmount);
    });

    if (chartType === 'daily') {
        chartTitle = 'Pendapatan Harian (30 Hari Terakhir)';
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            labels.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }));
            data.push(dailyData.get(dateKey) || 0);
        }
    } else if (chartType === 'weekly') {
        chartTitle = 'Pendapatan Mingguan (12 Minggu Terakhir)';
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - (i * 7) - d.getDay());
            const weekKey = d.toISOString().split('T')[0];
            labels.push(`Minggu ${d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit'})}`);
            data.push(weeklyData.get(weekKey) || 0);
        }
    } else if (chartType === 'monthly') {
        chartTitle = 'Pendapatan Bulanan (12 Bulan Terakhir)';
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthYearKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            labels.push(d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }));
            data.push(monthlyData.get(monthYearKey) || 0);
        }
    } else if (chartType === 'yearly') {
        chartTitle = 'Pendapatan Tahunan';
        const years = Array.from(yearlyData.keys()).sort();
        labels = years;
        data = years.map(year => yearlyData.get(year) || 0);

        if (labels.length === 0) {
            const minDate = filteredTransactions.length > 0 ? new Date(Math.min(...filteredTransactions.map(t => new Date(t.date)))) : null;
            const maxDate = filteredTransactions.length > 0 ? new Date(Math.max(...filteredTransactions.map(t => new Date(t.date)))) : null;

            if (minDate && maxDate) {
                for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
                    if (!labels.includes(String(year))) {
                        labels.push(String(year));
                        data.push(0);
                    }
                }
                const combined = labels.map((label, index) => ({ label, value: data[index] }));
                combined.sort((a, b) => parseInt(a.label) - parseInt(b.label));
                labels = combined.map(item => item.label);
                data = combined.map(item => item.value);
            }
        }
    }

    const ctx = DOMElements.incomeTrendChartCanvas.getContext('2d');
    incomeChartInstance = new Chart(ctx, {
        type: 'bar', // Mengubah ke bar chart untuk tampilan rekapan yang lebih jelas
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Pendapatan (Rp)',
                data: data,
                backgroundColor: 'rgba(184, 134, 11, 0.7)',
                borderColor: 'rgba(184, 134, 11, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 18,
                        family: 'Poppins'
                    },
                    color: '#4A4A4A'
                },
                legend: {
                    display: false
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
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Pendapatan (Rp)',
                        font: {
                            family: 'Poppins'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return formatRupiah(value);
                        },
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: chartType === 'daily' ? 'Tanggal' : chartType === 'weekly' ? 'Minggu' : chartType === 'monthly' ? 'Bulan' : 'Tahun',
                        font: {
                            family: 'Poppins'
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            }
        }
    });
}
if (DOMElements.companyNameInput) {
    DOMElements.companyNameInput.addEventListener('input', () => {
        companyName = DOMElements.companyNameInput.value.trim() || 'Akuntansi Pintar';
        updateCompanyNameDisplay();
    });
}

if (DOMElements.saveCompanyNameBtn) {
    DOMElements.saveCompanyNameBtn.addEventListener('click', () => {
        companyName = DOMElements.companyNameInput.value.trim() || 'Akuntansi Pintar';
        localStorage.setItem('companyName', companyName);
        updateCompanyNameDisplay();
        showNotification('Nama perusahaan berhasil disimpan!', 'success');
    });
}

function renderUserList() {
    if (!DOMElements.userListDisplay) return;
    DOMElements.userListDisplay.innerHTML = '';

    const nonDefaultUsers = users.filter(user => !(user.username === 'admin' && user.role === 'admin'));

    if (nonDefaultUsers.length === 0) {
         DOMElements.userListDisplay.innerHTML = `<p class="empty-table-message">Belum ada pengguna lain yang ditambahkan.</p>`;
         return;
    }

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.marginTop = '20px';
    ul.style.border = '1px solid var(--border-color)';
    ul.style.borderRadius = '8px';
    ul.style.maxHeight = '200px';
    ul.style.overflowY = 'auto';
    ul.style.backgroundColor = 'var(--card-bg)';

    nonDefaultUsers.forEach(user => {
        const li = document.createElement('li');
        li.style.padding = '10px 15px';
        li.style.borderBottom = '1px dashed var(--dark-bg)';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.innerHTML = `
            <span><strong>${user.username}</strong> (${user.role})</span>
            <button class="danger small" data-username="${user.username}" data-action="delete-user" style="padding: 5px 10px; font-size: 0.8em;"><i data-feather="trash-2"></i> Hapus</button>
        `;
        ul.appendChild(li);
    });

    DOMElements.userListDisplay.appendChild(ul);
    DOMElements.userListDisplay.querySelectorAll('button[data-action="delete-user"]').forEach(button => {
        button.addEventListener('click', (event) => {
            const usernameToDelete = event.currentTarget.dataset.username;
            deleteUser(usernameToDelete);
        });
    });
    feather.replace();
}

if (DOMElements.addNewUserBtn) {
    DOMElements.addNewUserBtn.addEventListener('click', () => {
        const username = DOMElements.newUsernameInput?.value.trim();
        const password = DOMElements.newPasswordInput?.value;
        const role = DOMElements.newUserRoleSelect?.value;

        if (!username || !password) {
            showNotification('Username dan password tidak boleh kosong.', 'error');
            return;
        }
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            showNotification(`Username "${username}" sudah ada.`, 'error');
            return;
        }

        users.push({ username, password, role });
        saveData();
        showNotification(`Pengguna "${username}" (${role}) berhasil ditambahkan.`, 'success');
        if (DOMElements.newUsernameInput) DOMElements.newUsernameInput.value = '';
        if (DOMElements.newPasswordInput) DOMElements.newPasswordInput.value = '';
        if (DOMElements.newUserRoleSelect) DOMElements.newUserRoleSelect.value = 'kasir';
        renderUserList();
    });
}

function deleteUser(usernameToDelete) {
    if (usernameToDelete === 'admin') {
        showNotification('Pengguna Admin utama tidak dapat dihapus.', 'error');
        return;
    }
    if (confirm(`Anda yakin ingin menghapus pengguna "${usernameToDelete}"?`)) {
        users = users.filter(u => u.username !== usernameToDelete);
        saveData();
        showNotification(`Pengguna "${usernameToDelete}" berhasil dihapus.`, 'success');
        renderUserList();
    }
}
async function exportContentToPdf(elementId, filename, title) {
    const currentActiveTab = document.querySelector('.tab-content.active');
    const targetTab = document.getElementById(elementId);
    const targetTabButton = document.querySelector(`[data-tab="${elementId}"]`);

    if (currentActiveTab && currentActiveTab.id !== elementId) {
        currentActiveTab.classList.remove('active');
        document.querySelector('.tab-button.active')?.classList.remove('active');

        if (targetTab) targetTab.classList.add('active');
        if (targetTabButton) targetTabButton.classList.add('active');

        if (elementId === 'produk') renderProductList();
        else if (elementId === 'laporan') renderTransactionList();
        else if (elementId === 'pengeluaran') renderExpenseList();
        else if (elementId === 'rekapan') {
            renderRecapSummary();
            renderIncomeTrendChart();
        }
    }

    const contentToPrint = document.getElementById(elementId);
    if (!contentToPrint) {
        showNotification('Konten untuk ekspor tidak ditemukan.', 'error');
        return;
    }

    const date = new Date().toLocaleDateString('id-ID');
    const options = {
        margin: 10,
        filename: `${filename}_${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '15mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Poppins, sans-serif';
    tempDiv.style.color = '#333';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    tempDiv.innerHTML = `
        <h1 style="text-align: center; color: #B8860B; margin-bottom: 5px;">${companyName}</h1>
        <h2 style="text-align: center; color: #8B6914; margin-top: 0; margin-bottom: 20px;">Laporan ${title}</h2>
        <p style="text-align: center; color: #777; font-size: 0.9em; margin-bottom: 30px;">Tanggal Ekspor: ${date}</p>
        <div id="pdf-content-wrapper"></div>
    `;
    const pdfContentWrapper = tempDiv.querySelector('#pdf-content-wrapper');

    if (elementId === 'rekapan') {
        const recapHtml = DOMElements.recapSummaryContent?.outerHTML || '';
        pdfContentWrapper.innerHTML = recapHtml;

        pdfContentWrapper.querySelectorAll('.recap-card').forEach(card => {
            card.style.boxShadow = 'none';
            card.style.border = '1px solid #eee';
            card.style.padding = '20px';
            card.style.marginBottom = '15px';
            card.style.transform = 'none';
        });
        pdfContentWrapper.querySelectorAll('.recap-card h3').forEach(h3 => {
            h3.style.color = '#4A4A4A';
            h3.style.borderBottom = '1px solid #D3D3D3';
            h3.style.paddingBottom = '10px';
            h3.style.marginBottom = '15px';
        });
        pdfContentWrapper.querySelectorAll('.recap-card .amount').forEach(amount => {
             amount.style.color = '#B8860B';
             amount.style.fontSize = '2.5em';
        });
        pdfContentWrapper.querySelectorAll('.recap-card.expense .amount').forEach(amount => {
             amount.style.color = '#E74C3C';
        });
        pdfContentWrapper.querySelectorAll('.recap-card.profit .amount').forEach(amount => {
             amount.style.color = '#27AE60';
        });

    } else if (elementId === 'produk' || elementId === 'laporan' || elementId === 'pengeluaran') {
        const originalTable = contentToPrint.querySelector('table');
        if (originalTable) {
            const clonedTable = originalTable.cloneNode(true);

            const headers = clonedTable.querySelectorAll('thead th');
            const rows = clonedTable.querySelectorAll('tbody tr');

            let actionColIndex = -1;
            headers.forEach((th, index) => {
                if (th.textContent.trim() === 'Aksi') {
                    actionColIndex = index;
                }
            });

            if (actionColIndex !== -1) {
                headers[actionColIndex].remove();
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells[actionColIndex]) {
                        cells[actionColIndex].remove();
                    }
                });
            }

            clonedTable.style.width = '100%';
            clonedTable.style.borderCollapse = 'collapse';
            clonedTable.style.marginTop = '20px';
            clonedTable.style.backgroundColor = 'white';
            clonedTable.style.boxShadow = 'none';
            clonedTable.style.border = '1px solid #ddd';

            clonedTable.querySelectorAll('th, td').forEach(cell => {
                cell.style.border = '1px solid #ddd';
                cell.style.padding = '10px';
                cell.style.textAlign = 'left';
                cell.style.verticalAlign = 'top';
                cell.style.color = '#333';
                cell.style.fontSize = '0.9em';
            });
            clonedTable.querySelectorAll('thead th').forEach(th => {
                th.style.background = '#f2f2f2';
                th.style.fontWeight = 'bold';
            });
             clonedTable.querySelectorAll('tbody tr:nth-child(even)').forEach(tr => {
                tr.style.backgroundColor = '#f9f9f9';
            });

            if (clonedTable.querySelector('.empty-table-message')) {
                const emptyMessageRow = clonedTable.querySelector('.empty-table-message').closest('tr');
                if (emptyMessageRow) {
                    emptyMessageRow.querySelector('td').colSpan = headers.length - (actionColIndex !== -1 ? 1 : 0);
                }
            }

            pdfContentWrapper.appendChild(clonedTable);
        }
    } else {
        pdfContentWrapper.innerHTML = contentToPrint.innerHTML;
    }

    try {
        await html2pdf().from(tempDiv).set(options).save();
        showNotification(`Data ${title} berhasil diekspor ke PDF.`, 'success', 4000);
    } catch (error) {
        console.error("Error generating PDF:", error);
        showNotification(`Gagal mengekspor data ${title} ke PDF.`, 'error', 5000);
    } finally {
        document.body.removeChild(tempDiv);
        if (currentActiveTab && currentActiveTab.id !== elementId) {
            targetTab?.classList.remove('active');
            targetTabButton?.classList.remove('active');
            currentActiveTab.classList.add('active');
            document.querySelector(`[data-tab="${currentActiveTab.id}"]`)?.classList.add('active');

             if (currentActiveTab.id === 'rekapan') {
                renderIncomeTrendChart();
             }
        }
    }
}

async function exportChartToPdf() {
    if (!DOMElements.incomeTrendChartCanvas || DOMElements.incomeTrendChartCanvas.style.display === 'none') {
        showNotification('Tidak ada data grafik untuk diekspor atau grafik tidak terlihat.', 'warning');
        return;
    }

    const currentActiveTab = document.querySelector('.tab-content.active');
    const targetTab = DOMElements.rekapan;
    const targetTabButton = document.querySelector(`[data-tab="rekapan"]`);

    if (currentActiveTab && currentActiveTab.id !== 'rekapan') {
        currentActiveTab.classList.remove('active');
        document.querySelector('.tab-button.active')?.classList.remove('active');
        targetTab?.classList.add('active');
        targetTabButton?.classList.add('active');
        renderIncomeTrendChart();
    }

    const date = new Date().toLocaleDateString('id-ID');
    const options = {
        margin: 10,
        filename: `Grafik_Pendapatan_${DOMElements.chartFilter?.value || 'data'}_${date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true, useCORS: true, backgroundColor: '#FFFFFF' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const chartImage = DOMElements.incomeTrendChartCanvas.toDataURL('image/png', 1.0);

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '15mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Poppins, sans-serif';
    tempDiv.style.color = '#333';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    tempDiv.innerHTML = `
        <h1 style="text-align: center; color: #B8860B; margin-bottom: 5px;">${companyName}</h1>
        <h2 style="text-align: center; color: #8B6914; margin-top: 0; margin-bottom: 20px;">Grafik Pendapatan (${DOMElements.chartFilter?.options[DOMElements.chartFilter.selectedIndex]?.text || 'Data'})</h2>
        <p style="text-align: center; color: #777; font-size: 0.9em; margin-bottom: 30px;">Tanggal Ekspor: ${date}</p>
        <div style="text-align: center;">
            <img src="${chartImage}" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
        </div>
    `;

    try {
        await html2pdf().from(tempDiv).set(options).save();
        showNotification(`Grafik Pendapatan berhasil diekspor ke PDF.`, 'success', 4000);
    } catch (error) {
        console.error("Error generating Chart PDF:", error);
        showNotification(`Gagal mengekspor Grafik Pendapatan ke PDF.`, 'error', 5000);
    } finally {
        document.body.removeChild(tempDiv);
        if (currentActiveTab && currentActiveTab.id !== 'rekapan') {
            targetTab?.classList.remove('active');
            targetTabButton?.classList.remove('active');
            currentActiveTab.classList.add('active');
            document.querySelector(`[data-tab="${currentActiveTab.id}"]`)?.classList.add('active');
            if (currentActiveTab.id === 'rekapan') {
                renderIncomeTrendChart();
            }
        }
    }
}


if (DOMElements.exportProductsPdfBtn) {
    DOMElements.exportProductsPdfBtn.addEventListener('click', () => {
        if (products.length === 0) {
            showNotification('Tidak ada data produk untuk diekspor.', 'warning');
            return;
        }
        exportContentToPdf('produk', 'Daftar Produk', 'Produk');
    });
}

if (DOMElements.exportTransactionsPdfBtn) {
    DOMElements.exportTransactionsPdfBtn.addEventListener('click', () => {
        if (transactions.length === 0) {
            showNotification('Tidak ada data transaksi untuk diekspor.', 'warning');
            return;
        }
        exportContentToPdf('laporan', 'Laporan Penjualan', 'Laporan Penjualan');
    });
}

if (DOMElements.exportExpensesPdfBtn) {
    DOMElements.exportExpensesPdfBtn.addEventListener('click', () => {
        if (expenses.length === 0) {
            showNotification('Tidak ada data pengeluaran untuk diekspor.', 'warning');
            return;
        }
        exportContentToPdf('pengeluaran', 'Daftar Pengeluaran', 'Pengeluaran');
    });
}

if (DOMElements.exportRecapPdfBtn) {
    DOMElements.exportRecapPdfBtn.addEventListener('click', () => {
        exportContentToPdf('rekapan', 'Rekapan Keuangan', 'Rekapan Keuangan');
    });
}

if (DOMElements.exportChartPdfBtn) {
    DOMElements.exportChartPdfBtn.addEventListener('click', exportChartToPdf);
}

function clearAllData() {
    if (confirm('PERINGATAN: Anda yakin ingin menghapus SEMUA data aplikasi? Ini termasuk produk, keranjang, transaksi, pengeluaran, dan pengguna lain. Tindakan ini TIDAK DAPAT DIBATALKAN!')) {
        localStorage.clear();
        products = [];
        cart = [];
        transactions = [];
        expenses = [];
        users = [{ username: 'admin', password: 'admin123', role: 'admin' }];
        companyName = 'Akuntansi Pintar';

        showNotification('Semua data aplikasi berhasil dihapus.', 'success', 5000);
        updateCompanyNameDisplay();
        activateTab('kasir');
        showLoginModal();
    }
}

if (DOMElements.clearAllDataBtn) {
    DOMElements.clearAllDataBtn.addEventListener('click', clearAllData);
}
if (DOMElements.aboutUsLink) {
    DOMElements.aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        DOMElements.aboutUsModal?.classList.add('active');
        feather.replace();
    });
}

if (closeAboutUsModalBtn) {
    closeAboutUsModalBtn.addEventListener('click', () => {
        DOMElements.aboutUsModal?.classList.remove('active');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    let needsUpdate = false;

    // Data Migration/Initialization for new properties
    products = products.map(p => {
        if (p.costPrice === undefined || p.costPrice === null || isNaN(p.costPrice)) { p.costPrice = 0; needsUpdate = true; }
        if (p.price === undefined || p.price === null || isNaN(p.price)) { p.price = 0; needsUpdate = true; }
        if (p.markupPercentage === undefined || p.markupPercentage === null || isNaN(p.markupPercentage) || !isFinite(p.markupPercentage)) {
            p.markupPercentage = calculateMarkup(p.costPrice, p.price); needsUpdate = true; }
        if (p.category === undefined || p.category === null || p.category.trim() === '') { p.category = 'Umum'; needsUpdate = true; }
        if (p.minStock === undefined || p.minStock === null || isNaN(p.minStock)) { p.minStock = 0; needsUpdate = true; }
        return p;
    });

    transactions = transactions.map(t => {
        if (t.totalCostPrice === undefined || t.totalCostPrice === null || isNaN(t.totalCostPrice)) {
            let calculatedCostPrice = 0;
            if (t.items && Array.isArray(t.items)) {
                t.items.forEach(item => {
                    const itemCostPrice = item.costPrice !== undefined ? item.costPrice : (products.find(p => p.id === item.id) ? products.find(p => p.id === item.id).costPrice : 0);
                    calculatedCostPrice += item.quantity * (itemCostPrice || 0);
                });
            }
            t.totalCostPrice = calculatedCostPrice; needsUpdate = true;
        }
        if (t.discount === undefined || t.discount === null || isNaN(t.discount)) { t.discount = 0; needsUpdate = true; }
        return t;
    });

    expenses = expenses.map(e => {
        if (!e.date) { e.date = new Date().toISOString().split('T')[0]; needsUpdate = true; }
        if (!e.category) { e.category = 'Lain-lain'; needsUpdate = true; }
        if (e.description === undefined || e.description === null) { e.description = ''; needsUpdate = true; }
        if (e.amount === undefined || e.amount === null || isNaN(e.amount)) { e.amount = 0; needsUpdate = true; }
        return e;
    });

    let adminExists = users.some(u => u.username === 'admin' && u.role === 'admin');
    if (!adminExists) {
        users.push({ username: 'admin', password: 'admin123', role: 'admin' });
        needsUpdate = true;
    }
    users = users.map(u => {
        if (!u.role) { u.role = 'kasir'; needsUpdate = true; }
        return u;
    });

    if (needsUpdate) { saveData(); }

    updateCompanyNameDisplay();
    showLoginModal(); // Tampilkan modal login di awal

    // Login Event Listener
    DOMElements.loginBtn.addEventListener('click', () => {
        const username = DOMElements.loginUsernameInput.value.trim();
        const password = DOMElements.loginPasswordInput.value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            showNotification(`Selamat datang, ${currentUser.username}! Anda login sebagai ${currentUser.role}.`, 'success');
            DOMElements.loginModal.classList.remove('active');
            activateTab('kasir'); // Auto-activate kasir tab after login
        } else {
            showNotification('Username atau password salah.', 'error');
        }
    });

    DOMElements.loginPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            DOMElements.loginBtn.click();
        }
    });
});
