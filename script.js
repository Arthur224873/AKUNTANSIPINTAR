document.addEventListener('DOMContentLoaded', () => {
    // --- Data Storage (Local Storage) ---
    const STORAGE_KEYS = {
        PRODUCTS: 'products',
        TRANSACTIONS: 'transactions',
        EXPENSES: 'expenses',
        USERS: 'users',
        COMPANY_NAME: 'companyName',
        RECEIPT_LOGO_URL: 'receiptLogoUrl',
        CURRENT_USER: 'currentUser'
    };

    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    let transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
    let expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || [];
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [
        { username: 'admin', password: 'admin123', role: 'admin' }
    ];
    let companyName = localStorage.getItem(STORAGE_KEYS.COMPANY_NAME) || 'Akuntansi Pintar';
    let receiptLogoUrl = localStorage.getItem(STORAGE_KEYS.RECEIPT_LOGO_URL) || '';
    let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));

    let cart = [];
    let editingProductId = null;
    let editingExpenseId = null;
    let currentChart = null; // To store the Chart.js instance

    // --- Helper Functions ---
    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const showNotification = (message, type = 'info', duration = 3000) => {
        const notificationArea = document.getElementById('notification-area');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.setProperty('--notification-duration', `${duration / 1000}s`);

        notificationArea.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10); // Small delay for animation to start

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.addEventListener('transitionend', () => {
                notification.remove();
            }, { once: true });
        }, duration - 500); // Start fading out before full duration
    };

    const generateUniqueId = (prefix) => {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const calculateMarkupPercentage = (costPrice, sellingPrice) => {
        if (costPrice <= 0) return 0;
        return ((sellingPrice - costPrice) / costPrice) * 100;
    };

    // --- Login/Logout Logic ---
    const loginModal = document.getElementById('loginModal');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');
    const loginCompanyNameDisplay = document.getElementById('login-company-name-display');

    const updateCompanyNameDisplay = () => {
        document.getElementById('app-company-name').textContent = companyName;
        document.getElementById('footer-company-name').textContent = companyName;
        loginCompanyNameDisplay.textContent = companyName;
    };

    const updateTabVisibility = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            const tabId = button.dataset.tab;
            if (currentUser && currentUser.role === 'kasir') {
                if (tabId === 'produk' || tabId === 'pengeluaran' || tabId === 'laporan' || tabId === 'rekapan' || tabId === 'pengaturan') {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'flex';
                }
            } else { // Admin or not logged in (should be hidden by modal)
                button.style.display = 'flex';
            }
        });

        // Hide main content if not logged in
        const mainContainer = document.querySelector('main.container');
        if (!currentUser) {
            mainContainer.style.display = 'none';
        } else {
            mainContainer.style.display = 'flex';
            // If kasir is logged in and current tab is restricted, switch to kasir tab
            const activeTabButton = document.querySelector('.tab-button.active');
            if (currentUser.role === 'kasir' && activeTabButton && (activeTabButton.dataset.tab === 'produk' || activeTabButton.dataset.tab === 'pengeluaran' || activeTabButton.dataset.tab === 'laporan' || activeTabButton.dataset.tab === 'rekapan' || activeTabButton.dataset.tab === 'pengaturan')) {
                document.querySelector('.tab-button[data-tab="kasir"]').click();
            }
        }
    };

    const handleLogin = () => {
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
            loginModal.classList.remove('active');
            showNotification(`Selamat datang, ${currentUser.username}!`, 'success');
            updateTabVisibility();
            updateUserInfoDisplay();
            // Re-render relevant sections after login
            renderProductList();
            renderExpenseList();
            renderTransactionList();
            updateRecapSummary();
            renderIncomeTrendChart();
            renderUserList(); // Render user list for admin
        } else {
            showNotification('Username atau password salah!', 'error');
        }
    };

    const handleLogout = () => {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        showNotification('Anda telah logout.', 'info');
        loginModal.classList.add('active'); // Show login modal
        updateTabVisibility();
        updateUserInfoDisplay();
        // Clear sensitive data on logout if necessary (e.g., cart)
        cart = [];
        renderCart();
    };

    // User Info Display (for logout button and current user)
    const userInfoDiv = document.createElement('div');
    userInfoDiv.id = 'user-info';
    userInfoDiv.style.cssText = 'position: absolute; top: 20px; right: 30px; display: flex; align-items: center; gap: 10px; color: white; z-index: 10;';
    userInfoDiv.innerHTML = `
        <span id="current-user-name" style="font-weight: 600;"></span>
        <button id="logout-btn" class="danger" style="padding: 8px 15px; font-size: 0.9em; border-radius: 8px; box-shadow: none; transform: none; background: rgba(255,255,255,0.2); color: white;">
            <i data-feather="log-out"></i> Logout
        </button>
    `;
    document.querySelector('header').appendChild(userInfoDiv);
    feather.replace(); // Re-render icons for newly added element

    const updateUserInfoDisplay = () => {
        const currentUserSpan = document.getElementById('current-user-name');
        const logoutBtn = document.getElementById('logout-btn');

        if (currentUser) {
            currentUserSpan.textContent = `Login sebagai: ${currentUser.username} (${currentUser.role})`;
            userInfoDiv.style.display = 'flex';
            logoutBtn.addEventListener('click', handleLogout); // Attach listener here
        } else {
            currentUserSpan.textContent = '';
            userInfoDiv.style.display = 'none';
            logoutBtn.removeEventListener('click', handleLogout); // Remove listener if not logged in
        }
    };

    // --- Tab Navigation ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Check role access
            if (currentUser && currentUser.role === 'kasir') {
                if (tabId === 'produk' || tabId === 'pengeluaran' || tabId === 'laporan' || tabId === 'rekapan' || tabId === 'pengaturan') {
                    showNotification('Anda tidak memiliki akses ke tab ini.', 'warning');
                    return;
                }
            }

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Re-render specific content when tab is activated
            if (tabId === 'produk') {
                renderProductList();
            } else if (tabId === 'pengeluaran') {
                renderExpenseList();
            } else if (tabId === 'laporan') {
                renderTransactionList();
            } else if (tabId === 'rekapan') {
                updateRecapSummary();
                renderIncomeTrendChart();
            } else if (tabId === 'pengaturan') {
                renderUserList();
            }
            feather.replace(); // Re-render icons
        });
    });

    // --- Kasir Tab Logic ---
    const productSelect = document.getElementById('product-select');
    const categoryFilter = document.getElementById('category-filter');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productStockDisplay = document.getElementById('product-stock-display');
    const productQuantityInput = document.getElementById('product-quantity');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
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
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    const populateProductSelect = (filterCategory = '') => {
        productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';
        const uniqueCategories = new Set();

        products.forEach(product => {
            uniqueCategories.add(product.category);
            if (!filterCategory || product.category === filterCategory) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (Stok: ${product.stock})`;
                productSelect.appendChild(option);
            }
        });

        // Populate category filter if not already done
        if (categoryFilter.options.length <= 1) {
            categoryFilter.innerHTML = '<option value="">-- Semua Kategori --</option>';
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    };

    productSelect.addEventListener('change', () => {
        const selectedProductId = productSelect.value;
        const selectedProduct = products.find(p => p.id === selectedProductId);

        if (selectedProduct) {
            productNameInput.value = selectedProduct.name;
            productPriceInput.value = selectedProduct.price;
            productStockDisplay.value = selectedProduct.stock;
            productQuantityInput.value = 1; // Reset quantity
            productQuantityInput.max = selectedProduct.stock; // Set max quantity based on stock
        } else {
            productNameInput.value = '';
            productPriceInput.value = '';
            productStockDisplay.value = '';
            productQuantityInput.value = 1;
            productQuantityInput.max = '';
        }
    });

    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        populateProductSelect(selectedCategory);
        // Clear product selection when category filter changes
        productSelect.value = '';
        productNameInput.value = '';
        productPriceInput.value = '';
        productStockDisplay.value = '';
        productQuantityInput.value = 1;
        productQuantityInput.max = '';
    });

    addToCartBtn.addEventListener('click', () => {
        const selectedProductId = productSelect.value;
        const quantity = parseInt(productQuantityInput.value);

        if (!selectedProductId || isNaN(quantity) || quantity <= 0) {
            showNotification('Pilih produk dan masukkan jumlah yang valid.', 'warning');
            return;
        }

        const productToAdd = products.find(p => p.id === selectedProductId);

        if (!productToAdd) {
            showNotification('Produk tidak ditemukan.', 'error');
            return;
        }

        if (productToAdd.stock < quantity) {
            showNotification(`Stok ${productToAdd.name} tidak mencukupi. Tersedia: ${productToAdd.stock}`, 'warning');
            return;
        }

        const existingCartItem = cart.find(item => item.id === selectedProductId);

        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity;
            if (productToAdd.stock < newQuantity) {
                showNotification(`Penambahan melebihi stok. Stok ${productToAdd.name} tersisa: ${productToAdd.stock}`, 'warning');
                return;
            }
            existingCartItem.quantity = newQuantity;
        } else {
            cart.push({
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                costPrice: productToAdd.costPrice, // Include cost price for HPP calculation
                quantity: quantity
            });
        }

        productToAdd.stock -= quantity; // Deduct stock immediately
        saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);

        renderCart();
        clearKasirInput();
        showNotification(`${quantity}x ${productToAdd.name} ditambahkan ke keranjang.`, 'success');
        populateProductSelect(categoryFilter.value); // Update stock display in select
    });

    clearInputBtn.addEventListener('click', clearKasirInput);

    function clearKasirInput() {
        productSelect.value = '';
        productNameInput.value = '';
        productPriceInput.value = '';
        productStockDisplay.value = '';
        productQuantityInput.value = 1;
        productQuantityInput.max = '';
        categoryFilter.value = ''; // Reset category filter too
        populateProductSelect(); // Repopulate product select without filter
    }

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-quantity">${item.quantity} x ${formatCurrency(item.price)}</div>
                    </div>
                    <div class="cart-item-total-price">${formatCurrency(item.quantity * item.price)}</div>
                    <div class="cart-item-actions">
                        <button class="danger" data-id="${item.id}" data-action="remove"><i data-feather="trash-2"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        feather.replace(); // Re-render icons for newly added elements
        calculateSummary();
    };

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.closest('button[data-action="remove"]')) {
            const productId = event.target.closest('button').dataset.id;
            const itemIndex = cart.findIndex(item => item.id === productId);

            if (itemIndex > -1) {
                const removedItem = cart[itemIndex];
                const productInStock = products.find(p => p.id === removedItem.id);
                if (productInStock) {
                    productInStock.stock += removedItem.quantity; // Return stock
                }
                cart.splice(itemIndex, 1);
                saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
                renderCart();
                populateProductSelect(categoryFilter.value); // Update stock display in select
                showNotification(`${removedItem.name} dihapus dari keranjang.`, 'info');
            }
        }
    });

    discountTypeSelect.addEventListener('change', () => {
        if (discountTypeSelect.value === 'none') {
            discountValueGroup.style.display = 'none';
            discountValueInput.value = 0;
        } else {
            discountValueGroup.style.display = 'block';
            discountValueInput.value = 0;
        }
        calculateSummary();
    });

    discountValueInput.addEventListener('input', calculateSummary);
    amountPaidInput.addEventListener('input', calculateSummary);

    const calculateSummary = () => {
        let subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        let discountAmount = 0;
        const discountType = discountTypeSelect.value;
        let discountValue = parseFloat(discountValueInput.value) || 0;

        if (discountType === 'percentage') {
            discountAmount = subtotal * (discountValue / 100);
        } else if (discountType === 'nominal') {
            discountAmount = discountValue;
        }

        let total = subtotal - discountAmount;
        if (total < 0) total = 0; // Prevent negative total

        let amountPaid = parseFloat(amountPaidInput.value) || 0;
        let change = amountPaid - total;

        subtotalSpan.textContent = formatCurrency(subtotal);
        discountSpan.textContent = formatCurrency(discountAmount);
        totalPaymentSpan.textContent = formatCurrency(total);
        changeAmountSpan.textContent = formatCurrency(change);

        if (change < 0) {
            changeRow.classList.add('change-negative');
            changeRow.classList.remove('change-positive');
        } else {
            changeRow.classList.remove('change-negative');
            changeRow.classList.add('change-positive');
        }
    };

    processPaymentBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang belanja kosong!', 'warning');
            return;
        }

        const total = parseFloat(totalPaymentSpan.textContent.replace(/[^0-9,-]+/g, "").replace(',', '.'));
        const amountPaid = parseFloat(amountPaidInput.value);

        if (isNaN(amountPaid) || amountPaid < total) {
            showNotification('Jumlah dibayar tidak mencukupi!', 'warning');
            return;
        }

        const transactionId = generateUniqueId('TRX');
        const transactionDate = new Date().toISOString();
        const transactionItems = cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice // Store cost price at time of transaction
        }));
        const transactionSubtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const transactionDiscount = parseFloat(discountSpan.textContent.replace(/[^0-9,-]+/g, "").replace(',', '.'));
        const transactionTotal = total;
        const transactionPaid = amountPaid;
        const transactionChange = amountPaid - total;

        const newTransaction = {
            id: transactionId,
            date: transactionDate,
            items: transactionItems,
            subtotal: transactionSubtotal,
            discount: transactionDiscount,
            total: transactionTotal,
            paid: transactionPaid,
            change: transactionChange
        };

        transactions.push(newTransaction);
        saveToLocalStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

        showNotification('Pembayaran berhasil!', 'success');
        showTransactionDetailModal(newTransaction); // Show detail and print receipt option
        cart = []; // Clear cart after successful payment
        renderCart();
        clearKasirInput();
        populateProductSelect(); // Update product stock display
        updateRecapSummary(); // Update recap summary
        renderIncomeTrendChart(); // Update chart
    });

    clearCartBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin membersihkan seluruh keranjang? Stok produk akan dikembalikan.')) {
            cart.forEach(item => {
                const productInStock = products.find(p => p.id === item.id);
                if (productInStock) {
                    productInStock.stock += item.quantity; // Return stock
                }
            });
            cart = [];
            saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
            renderCart();
            clearKasirInput();
            populateProductSelect(); // Update stock display in select
            showNotification('Keranjang telah dibersihkan.', 'info');
        }
    });

    // --- Produk Tab Logic ---
    const newProductNameInput = document.getElementById('new-product-name');
    const newProductCategoryInput = document.getElementById('new-product-category');
    const newProductCostPriceInput = document.getElementById('new-product-cost-price');
    const newProductPriceInput = document.getElementById('new-product-price');
    const newProductMarkupPercentageInput = document.getElementById('new-product-markup-percentage');
    const newProductStockInput = document.getElementById('new-product-stock');
    const newProductMinStockInput = document.getElementById('new-product-min-stock');
    const addNewProductBtn = document.getElementById('add-new-product-btn');
    const productListBody = document.getElementById('product-list-body');

    // Calculate markup percentage on input change
    newProductCostPriceInput.addEventListener('input', () => {
        const cost = parseFloat(newProductCostPriceInput.value);
        const price = parseFloat(newProductPriceInput.value);
        newProductMarkupPercentageInput.value = calculateMarkupPercentage(cost, price).toFixed(2);
    });

    newProductPriceInput.addEventListener('input', () => {
        const cost = parseFloat(newProductCostPriceInput.value);
        const price = parseFloat(newProductPriceInput.value);
        newProductMarkupPercentageInput.value = calculateMarkupPercentage(cost, price).toFixed(2);
    });

    addNewProductBtn.addEventListener('click', () => {
        const name = newProductNameInput.value.trim();
        const category = newProductCategoryInput.value.trim();
        const costPrice = parseFloat(newProductCostPriceInput.value);
        const price = parseFloat(newProductPriceInput.value);
        const stock = parseInt(newProductStockInput.value);
        const minStock = parseInt(newProductMinStockInput.value);

        if (!name || !category || isNaN(costPrice) || costPrice < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0 || isNaN(minStock) || minStock < 0) {
            showNotification('Mohon lengkapi semua data produk dengan benar.', 'warning');
            return;
        }

        if (price < costPrice) {
            showNotification('Harga jual tidak boleh lebih rendah dari harga beli.', 'warning');
            return;
        }

        const newProduct = {
            id: generateUniqueId('PROD'),
            name,
            category,
            costPrice,
            price,
            stock,
            minStock
        };

        products.push(newProduct);
        saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
        renderProductList();
        populateProductSelect(); // Update product select in Kasir tab
        showNotification(`${name} berhasil ditambahkan!`, 'success');
        clearProductForm();
    });

    function clearProductForm() {
        newProductNameInput.value = '';
        newProductCategoryInput.value = '';
        newProductCostPriceInput.value = 0;
        newProductPriceInput.value = 0;
        newProductMarkupPercentageInput.value = 0;
        newProductStockInput.value = 0;
        newProductMinStockInput.value = 0;
    }

    const renderProductList = () => {
        productListBody.innerHTML = '';
        if (products.length === 0) {
            productListBody.innerHTML = `<tr><td colspan="9" class="empty-table-message">Belum ada produk yang tercatat.</td></tr>`;
            return;
        }
        products.forEach(product => {
            const markup = calculateMarkupPercentage(product.costPrice, product.price);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.costPrice)}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${markup.toFixed(2)}%</td>
                <td style="color: ${product.stock <= product.minStock ? 'var(--danger-color)' : 'inherit'}; font-weight: ${product.stock <= product.minStock ? 'bold' : 'normal'};">
                    ${product.stock} ${product.stock <= product.minStock ? '<i data-feather="alert-triangle" title="Stok rendah!"></i>' : ''}
                </td>
                <td>${product.minStock}</td>
                <td class="table-actions">
                    <button class="primary" data-id="${product.id}" data-action="edit"><i data-feather="edit"></i> Edit</button>
                    <button class="info" data-id="${product.id}" data-action="adjust-stock"><i data-feather="package"></i> Stok</button>
                    <button class="danger" data-id="${product.id}" data-action="delete"><i data-feather="trash-2"></i> Hapus</button>
                </td>
            `;
            productListBody.appendChild(row);
        });
        feather.replace(); // Re-render icons
    };

    productListBody.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const productId = targetButton.dataset.id;
        const action = targetButton.dataset.action;

        if (action === 'edit') {
            openEditProductModal(productId);
        } else if (action === 'adjust-stock') {
            openStockAdjustmentModal(productId);
        } else if (action === 'delete') {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                products = products.filter(p => p.id !== productId);
                saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
                renderProductList();
                populateProductSelect(); // Update product select in Kasir tab
                showNotification('Produk berhasil dihapus.', 'info');
            }
        }
    });

    // --- Edit Product Modal Logic ---
    const editProductModal = document.getElementById('editProductModal');
    const modalProductId = document.getElementById('modal-product-id');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductCategory = document.getElementById('modal-product-category');
    const modalProductCostPrice = document.getElementById('modal-product-cost-price');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductMarkupPercentage = document.getElementById('modal-product-markup-percentage');
    const modalProductStock = document.getElementById('modal-product-stock');
    const modalProductMinStock = document.getElementById('modal-product-min-stock');
    const saveProductBtn = document.getElementById('save-product-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    modalProductCostPrice.addEventListener('input', () => {
        const cost = parseFloat(modalProductCostPrice.value);
        const price = parseFloat(modalProductPrice.value);
        modalProductMarkupPercentage.value = calculateMarkupPercentage(cost, price).toFixed(2);
    });

    modalProductPrice.addEventListener('input', () => {
        const cost = parseFloat(modalProductCostPrice.value);
        const price = parseFloat(modalProductPrice.value);
        modalProductMarkupPercentage.value = calculateMarkupPercentage(cost, price).toFixed(2);
    });

    const openEditProductModal = (productId) => {
        editingProductId = productId;
        const product = products.find(p => p.id === productId);
        if (product) {
            modalProductId.value = product.id;
            modalProductName.value = product.name;
            modalProductCategory.value = product.category;
            modalProductCostPrice.value = product.costPrice;
            modalProductPrice.value = product.price;
            modalProductMarkupPercentage.value = calculateMarkupPercentage(product.costPrice, product.price).toFixed(2);
            modalProductStock.value = product.stock;
            modalProductMinStock.value = product.minStock;
            editProductModal.classList.add('active');
        }
    };

    saveProductBtn.addEventListener('click', () => {
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex > -1) {
            const updatedProduct = {
                ...products[productIndex],
                name: modalProductName.value.trim(),
                category: modalProductCategory.value.trim(),
                costPrice: parseFloat(modalProductCostPrice.value),
                price: parseFloat(modalProductPrice.value),
                stock: parseInt(modalProductStock.value),
                minStock: parseInt(modalProductMinStock.value)
            };

            if (!updatedProduct.name || !updatedProduct.category || isNaN(updatedProduct.costPrice) || updatedProduct.costPrice < 0 || isNaN(updatedProduct.price) || updatedProduct.price < 0 || isNaN(updatedProduct.stock) || updatedProduct.stock < 0 || isNaN(updatedProduct.minStock) || updatedProduct.minStock < 0) {
                showNotification('Mohon lengkapi semua data produk dengan benar.', 'warning');
                return;
            }
            if (updatedProduct.price < updatedProduct.costPrice) {
                showNotification('Harga jual tidak boleh lebih rendah dari harga beli.', 'warning');
                return;
            }

            products[productIndex] = updatedProduct;
            saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
            renderProductList();
            populateProductSelect(); // Update product select in Kasir tab
            editProductModal.classList.remove('active');
            showNotification('Produk berhasil diperbarui.', 'success');
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editProductModal.classList.remove('active');
        editingProductId = null;
    });

    // --- Stock Adjustment Modal Logic ---
    const stockAdjustmentModal = document.getElementById('stockAdjustmentModal');
    const stockModalTitle = document.getElementById('stock-modal-title');
    const stockProductNameDisplay = document.getElementById('stock-product-name-display');
    const stockProductIdDisplay = document.getElementById('stock-product-id-display');
    const currentStockDisplay = document.getElementById('current-stock-display');
    const stockAdjustmentType = document.getElementById('stock-adjustment-type');
    const stockAdjustmentQuantity = document.getElementById('stock-adjustment-quantity');
    const stockAdjustmentReason = document.getElementById('stock-adjustment-reason');
    const saveStockAdjustmentBtn = document.getElementById('save-stock-adjustment-btn');
    const cancelStockAdjustmentBtn = document.getElementById('cancel-stock-adjustment-btn');

    const openStockAdjustmentModal = (productId) => {
        editingProductId = productId; // Use editingProductId for stock adjustment too
        const product = products.find(p => p.id === productId);
        if (product) {
            stockProductNameDisplay.textContent = product.name;
            stockProductIdDisplay.textContent = product.id;
            currentStockDisplay.textContent = product.stock;
            stockAdjustmentQuantity.value = 1;
            stockAdjustmentReason.value = '';
            stockAdjustmentType.value = 'in'; // Default to 'in'
            stockAdjustmentModal.classList.add('active');
        }
    };

    saveStockAdjustmentBtn.addEventListener('click', () => {
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex > -1) {
            const product = products[productIndex];
            const type = stockAdjustmentType.value;
            const quantity = parseInt(stockAdjustmentQuantity.value);
            const reason = stockAdjustmentReason.value.trim();

            if (isNaN(quantity) || quantity <= 0) {
                showNotification('Jumlah penyesuaian harus angka positif.', 'warning');
                return;
            }

            if (type === 'in') {
                product.stock += quantity;
                showNotification(`Stok ${product.name} ditambahkan ${quantity}.`, 'success');
            } else if (type === 'out') {
                if (product.stock < quantity) {
                    showNotification(`Stok ${product.name} tidak cukup untuk dikurangi ${quantity}. Stok saat ini: ${product.stock}`, 'warning');
                    return;
                }
                product.stock -= quantity;
                showNotification(`Stok ${product.name} dikurangi ${quantity}.`, 'info');
            }

            // Optionally, you could log stock adjustments as expenses or separate records
            // For simplicity, we just update stock and notify.

            saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products);
            renderProductList();
            populateProductSelect(); // Update product select in Kasir tab
            stockAdjustmentModal.classList.remove('active');
            editingProductId = null;
        }
    });

    cancelStockAdjustmentBtn.addEventListener('click', () => {
        stockAdjustmentModal.classList.remove('active');
        editingProductId = null;
    });


    // --- Pengeluaran Tab Logic ---
    const expenseDateInput = document.getElementById('expense-date');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseAmountInput = document.getElementById('expense-amount');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const expenseListBody = document.getElementById('expense-list-body');

    // Set default date to today
    expenseDateInput.valueAsDate = new Date();

    addExpenseBtn.addEventListener('click', () => {
        const date = expenseDateInput.value;
        const category = expenseCategoryInput.value.trim();
        const description = expenseDescriptionInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        if (!date || !category || isNaN(amount) || amount <= 0) {
            showNotification('Mohon lengkapi tanggal, kategori, dan jumlah pengeluaran dengan benar.', 'warning');
            return;
        }

        const newExpense = {
            id: generateUniqueId('EXP'),
            date,
            category,
            description,
            amount
        };

        expenses.push(newExpense);
        saveToLocalStorage(STORAGE_KEYS.EXPENSES, expenses);
        renderExpenseList();
        updateRecapSummary(); // Update recap summary
        showNotification('Pengeluaran berhasil ditambahkan!', 'success');
        clearExpenseForm();
    });

    function clearExpenseForm() {
        expenseDateInput.valueAsDate = new Date(); // Reset to today
        expenseCategoryInput.value = '';
        expenseDescriptionInput.value = '';
        expenseAmountInput.value = 0;
    }

    const renderExpenseList = () => {
        expenseListBody.innerHTML = '';
        if (expenses.length === 0) {
            expenseListBody.innerHTML = `<tr><td colspan="6" class="empty-table-message">Belum ada pengeluaran yang tercatat.</td></tr>`;
            return;
        }
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.id}</td>
                <td>${new Date(expense.date).toLocaleDateString('id-ID')}</td>
                <td>${expense.category}</td>
                <td>${expense.description || '-'}</td>
                <td>${formatCurrency(expense.amount)}</td>
                <td class="table-actions">
                    <button class="primary" data-id="${expense.id}" data-action="edit-expense"><i data-feather="edit"></i> Edit</button>
                    <button class="danger" data-id="${expense.id}" data-action="delete-expense"><i data-feather="trash-2"></i> Hapus</button>
                </td>
            `;
            expenseListBody.appendChild(row);
        });
        feather.replace(); // Re-render icons
    };

    expenseListBody.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const expenseId = targetButton.dataset.id;
        const action = targetButton.dataset.action;

        if (action === 'edit-expense') {
            openEditExpenseModal(expenseId);
        } else if (action === 'delete-expense') {
            if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
                expenses = expenses.filter(e => e.id !== expenseId);
                saveToLocalStorage(STORAGE_KEYS.EXPENSES, expenses);
                renderExpenseList();
                updateRecapSummary(); // Update recap summary
                showNotification('Pengeluaran berhasil dihapus.', 'info');
            }
        }
    });

    // --- Edit Expense Modal Logic ---
    const editExpenseModal = document.getElementById('editExpenseModal');
    const modalExpenseId = document.getElementById('modal-expense-id');
    const modalExpenseDate = document.getElementById('modal-expense-date');
    const modalExpenseCategory = document.getElementById('modal-expense-category');
    const modalExpenseDescription = document.getElementById('modal-expense-description');
    const modalExpenseAmount = document.getElementById('modal-expense-amount');
    const saveExpenseBtn = document.getElementById('save-expense-btn');
    const cancelExpenseEditBtn = document.getElementById('cancel-expense-edit-btn');

    const openEditExpenseModal = (expenseId) => {
        editingExpenseId = expenseId;
        const expense = expenses.find(e => e.id === expenseId);
        if (expense) {
            modalExpenseId.value = expense.id;
            modalExpenseDate.value = expense.date;
            modalExpenseCategory.value = expense.category;
            modalExpenseDescription.value = expense.description;
            modalExpenseAmount.value = expense.amount;
            editExpenseModal.classList.add('active');
        }
    };

    saveExpenseBtn.addEventListener('click', () => {
        const expenseIndex = expenses.findIndex(e => e.id === editingExpenseId);
        if (expenseIndex > -1) {
            const updatedExpense = {
                ...expenses[expenseIndex],
                date: modalExpenseDate.value,
                category: modalExpenseCategory.value.trim(),
                description: modalExpenseDescription.value.trim(),
                amount: parseFloat(modalExpenseAmount.value)
            };

            if (!updatedExpense.date || !updatedExpense.category || isNaN(updatedExpense.amount) || updatedExpense.amount <= 0) {
                showNotification('Mohon lengkapi semua data pengeluaran dengan benar.', 'warning');
                return;
            }

            expenses[expenseIndex] = updatedExpense;
            saveToLocalStorage(STORAGE_KEYS.EXPENSES, expenses);
            renderExpenseList();
            updateRecapSummary(); // Update recap summary
            editExpenseModal.classList.remove('active');
            showNotification('Pengeluaran berhasil diperbarui.', 'success');
        }
    });

    cancelExpenseEditBtn.addEventListener('click', () => {
        editExpenseModal.classList.remove('active');
        editingExpenseId = null;
    });


    // --- Laporan Penjualan Tab Logic ---
    const reportDateFilter = document.getElementById('report-date-filter');
    const transactionTableBody = document.getElementById('transaction-list-body');

    reportDateFilter.addEventListener('change', renderTransactionList);

    const renderTransactionList = () => {
        transactionTableBody.innerHTML = '';
        const filterMonth = reportDateFilter.value; // Format: YYYY-MM

        const filteredTransactions = transactions.filter(trx => {
            if (!filterMonth) return true; // No filter
            return trx.date.startsWith(filterMonth);
        });

        if (filteredTransactions.length === 0) {
            transactionTableBody.innerHTML = `<tr><td colspan="5" class="empty-table-message">Belum ada transaksi yang tercatat untuk periode ini.</td></tr>`;
            return;
        }

        // Sort by date descending
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredTransactions.forEach(trx => {
            const row = document.createElement('tr');
            const transactionDate = new Date(trx.date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            row.innerHTML = `
                <td>${trx.id}</td>
                <td>${transactionDate}</td>
                <td>${formatCurrency(trx.total)}</td>
                <td>${formatCurrency(trx.discount)}</td>
                <td class="table-actions">
                    <button class="info" data-id="${trx.id}" data-action="view-detail"><i data-feather="eye"></i> Detail</button>
                    <button class="danger" data-id="${trx.id}" data-action="delete-transaction"><i data-feather="trash-2"></i> Hapus</button>
                </td>
            `;
            transactionTableBody.appendChild(row);
        });
        feather.replace(); // Re-render icons
    };

    transactionTableBody.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const transactionId = targetButton.dataset.id;
        const action = targetButton.dataset.action;

        if (action === 'view-detail') {
            const transaction = transactions.find(t => t.id === transactionId);
            if (transaction) {
                showTransactionDetailModal(transaction);
            }
        } else if (action === 'delete-transaction') {
            if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.')) {
                transactions = transactions.filter(t => t.id !== transactionId);
                saveToLocalStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
                renderTransactionList();
                updateRecapSummary(); // Update recap summary
                renderIncomeTrendChart(); // Update chart
                showNotification('Transaksi berhasil dihapus.', 'info');
            }
        }
    });

    // --- Transaction Detail Modal Logic ---
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

    let currentTransactionForPrint = null; // To store transaction data for printing

    const showTransactionDetailModal = (transaction) => {
        currentTransactionForPrint = transaction; // Store for printing
        detailTransactionId.textContent = transaction.id;
        detailTransactionDate.textContent = new Date(transaction.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        detailTransactionItems.innerHTML = '';
        transaction.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} (${item.quantity} x ${formatCurrency(item.price)}) - ${formatCurrency(item.quantity * item.price)}`;
            detailTransactionItems.appendChild(li);
        });
        detailTransactionSubtotal.textContent = formatCurrency(transaction.subtotal);
        detailTransactionDiscount.textContent = formatCurrency(transaction.discount);
        detailTransactionTotal.textContent = formatCurrency(transaction.total);
        detailTransactionPaid.textContent = formatCurrency(transaction.paid);
        detailTransactionChange.textContent = formatCurrency(transaction.change);
        transactionDetailModal.classList.add('active');
    };

    closeDetailModalBtn.addEventListener('click', () => {
        transactionDetailModal.classList.remove('active');
        currentTransactionForPrint = null;
    });

    printReceiptBtn.addEventListener('click', () => {
        if (!currentTransactionForPrint) {
            showNotification('Tidak ada transaksi untuk dicetak.', 'warning');
            return;
        }
        printReceipt(currentTransactionForPrint);
    });

    const printReceiptContentDiv = document.getElementById('printReceiptContent');
    const receiptLogoImg = document.getElementById('receipt-logo');

    const printReceipt = (transaction) => {
        printReceiptContentDiv.innerHTML = ''; // Clear previous content

        // Add logo if available
        if (receiptLogoUrl) {
            receiptLogoImg.src = receiptLogoUrl;
            receiptLogoImg.style.display = 'block';
            printReceiptContentDiv.appendChild(receiptLogoImg.parentNode.cloneNode(true)); // Clone parent div to include container styles
        } else {
            receiptLogoImg.style.display = 'none';
        }

        const companyNameEl = document.createElement('div');
        companyNameEl.className = 'header';
        companyNameEl.innerHTML = `<h3>${companyName}</h3>`;
        printReceiptContentDiv.appendChild(companyNameEl);

        const trxInfo = document.createElement('div');
        trxInfo.className = 'header';
        trxInfo.innerHTML = `
            <p><strong>ID Transaksi:</strong> ${transaction.id}</p>
            <p><strong>Tanggal:</strong> ${new Date(transaction.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        `;
        printReceiptContentDiv.appendChild(trxInfo);

        const separator1 = document.createElement('div');
        separator1.className = 'separator';
        printReceiptContentDiv.appendChild(separator1);

        const itemsHeader = document.createElement('div');
        itemsHeader.className = 'item-row';
        itemsHeader.innerHTML = `<span class="item-name"><strong>Deskripsi</strong></span><span class="item-qty-price"><strong>Qty x Harga</strong></span><span class="text-right"><strong>Total</strong></span>`;
        printReceiptContentDiv.appendChild(itemsHeader);

        transaction.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-qty-price">${item.quantity} x ${formatCurrency(item.price)}</span>
                <span class="text-right">${formatCurrency(item.quantity * item.price)}</span>
            `;
            printReceiptContentDiv.appendChild(itemRow);
        });

        const separator2 = document.createElement('div');
        separator2.className = 'separator';
        printReceiptContentDiv.appendChild(separator2);

        const summaryDiv = document.createElement('div');
        summaryDiv.innerHTML = `
            <div class="summary-row"><span>Subtotal:</span><span class="text-right">${formatCurrency(transaction.subtotal)}</span></div>
            <div class="summary-row"><span>Diskon:</span><span class="text-right">${formatCurrency(transaction.discount)}</span></div>
            <div class="summary-row total"><span>Total:</span><span class="text-right">${formatCurrency(transaction.total)}</span></div>
            <div class="summary-row"><span>Dibayar:</span><span class="text-right">${formatCurrency(transaction.paid)}</span></div>
            <div class="summary-row"><span>Kembalian:</span><span class="text-right">${formatCurrency(transaction.change)}</span></div>
        `;
        printReceiptContentDiv.appendChild(summaryDiv);

        const separator3 = document.createElement('div');
        separator3.className = 'separator';
        printReceiptContentDiv.appendChild(separator3);

        const footerDiv = document.createElement('div');
        footerDiv.className = 'footer';
        footerDiv.innerHTML = `
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Powered by Akuntansi Pintar</p>
        `;
        printReceiptContentDiv.appendChild(footerDiv);

        // Use html2pdf for better print control and PDF generation
        html2pdf().from(printReceiptContentDiv).set({
            margin: [10, 10, 10, 10],
            filename: `Struk_Transaksi_${transaction.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a7', orientation: 'portrait' } // A7 is a common receipt size
        }).save();

        // Fallback to browser print if html2pdf fails or for direct print
        // window.print();
    };


    // --- Rekapan Keuangan Tab Logic ---
    const recapRevenueSpan = document.getElementById('recap-revenue');
    const recapCostOfGoodsSpan = document.getElementById('recap-cost-of-goods');
    const recapTotalExpenseSpan = document.getElementById('recap-total-expense');
    const recapProfitSpan = document.getElementById('recap-profit');
    const incomeTrendChartCanvas = document.getElementById('incomeTrendChart');
    const chartFilterSelect = document.getElementById('chart-filter');
    const chartEmptyMessage = document.getElementById('chart-empty-message');

    const updateRecapSummary = () => {
        let totalRevenue = 0;
        let totalCostOfGoodsSold = 0;
        let totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        transactions.forEach(trx => {
            totalRevenue += trx.total;
            trx.items.forEach(item => {
                totalCostOfGoodsSold += item.quantity * item.costPrice;
            });
        });

        const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses;

        recapRevenueSpan.textContent = formatCurrency(totalRevenue);
        recapCostOfGoodsSpan.textContent = formatCurrency(totalCostOfGoodsSold);
        recapTotalExpenseSpan.textContent = formatCurrency(totalExpenses);
        recapProfitSpan.textContent = formatCurrency(netProfit);

        if (netProfit < 0) {
            recapProfitSpan.style.color = 'var(--danger-color)';
        } else {
            recapProfitSpan.style.color = 'var(--success-color)';
        }
    };

    chartFilterSelect.addEventListener('change', renderIncomeTrendChart);

    const renderIncomeTrendChart = () => {
        if (currentChart) {
            currentChart.destroy(); // Destroy existing chart instance
        }

        if (transactions.length === 0) {
            incomeTrendChartCanvas.style.display = 'none';
            chartEmptyMessage.style.display = 'block';
            return;
        } else {
            incomeTrendChartCanvas.style.display = 'block';
            chartEmptyMessage.style.display = 'none';
        }

        const filterType = chartFilterSelect.value;
        const dataMap = new Map();

        transactions.forEach(trx => {
            const date = new Date(trx.date);
            let key;

            if (filterType === 'daily') {
                key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (filterType === 'weekly') {
                // Get week number and year
                const year = date.getFullYear();
                const firstDayOfYear = new Date(year, 0, 1);
                const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
                const weekNumber = Math.ceil(days / 7);
                key = `${year}-W${weekNumber < 10 ? '0' : ''}${weekNumber}`;
            } else if (filterType === 'monthly') {
                key = date.toISOString().substring(0, 7); // YYYY-MM
            } else if (filterType === 'yearly') {
                key = date.getFullYear().toString(); // YYYY
            }

            dataMap.set(key, (dataMap.get(key) || 0) + trx.total);
        });

        let labels = Array.from(dataMap.keys()).sort();
        let data = labels.map(key => dataMap.get(key));

        // Fill missing dates for daily/weekly/monthly for better trend visualization
        if (filterType === 'daily') {
            const last30Days = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last30Days.push(d.toISOString().split('T')[0]);
            }
            labels = last30Days;
            data = last30Days.map(dateKey => dataMap.get(dateKey) || 0);
        } else if (filterType === 'weekly') {
            const last12Weeks = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - (i * 7)); // Go back by weeks
                const year = d.getFullYear();
                const firstDayOfYear = new Date(year, 0, 1);
                const days = Math.floor((d - firstDayOfYear) / (24 * 60 * 60 * 1000));
                const weekNumber = Math.ceil(days / 7);
                last12Weeks.push(`${year}-W${weekNumber < 10 ? '0' : ''}${weekNumber}`);
            }
            labels = last12Weeks;
            data = last12Weeks.map(weekKey => dataMap.get(weekKey) || 0);
        } else if (filterType === 'monthly') {
             const last12Months = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                last12Months.push(d.toISOString().substring(0, 7));
            }
            labels = last12Months;
            data = last12Months.map(monthKey => dataMap.get(monthKey) || 0);
        }


        const ctx = incomeTrendChartCanvas.getContext('2d');
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pendapatan',
                    data: data,
                    borderColor: 'var(--primary-gold)',
                    backgroundColor: 'rgba(184, 134, 11, 0.2)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointBackgroundColor: 'var(--primary-dark-gold)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'var(--primary-gold)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: filterType.charAt(0).toUpperCase() + filterType.slice(1)
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Pendapatan (Rp)'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
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
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };

    // --- Pengaturan Tab Logic ---
    const companyNameInput = document.getElementById('company-name-input');
    const saveCompanyNameBtn = document.getElementById('save-company-name-btn');
    const receiptLogoUrlInput = document.getElementById('receipt-logo-url-input');
    const saveReceiptLogoBtn = document.getElementById('save-receipt-logo-btn');
    const clearReceiptLogoBtn = document.getElementById('clear-receipt-logo-btn');
    const newUserNameInput = document.getElementById('new-user-username');
    const newUserPasswordInput = document.getElementById('new-user-password');
    const newUserRoleSelect = document.getElementById('new-user-role');
    const addNewUserBtn = document.getElementById('add-new-user-btn');
    const userListDisplay = document.getElementById('user-list-display');
    const exportProductsPdfBtn = document.getElementById('export-products-pdf-btn');
    const exportTransactionsPdfBtn = document.getElementById('export-transactions-pdf-btn');
    const exportExpensesPdfBtn = document.getElementById('export-expenses-pdf-btn');
    const exportRecapPdfBtn = document.getElementById('export-recap-pdf-btn');
    const exportChartPdfBtn = document.getElementById('export-chart-pdf-btn');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');
    const aboutUsLink = document.getElementById('about-us-link');
    const aboutUsModal = document.getElementById('aboutUsModal');
    const closeAboutUsModalBtn = document.getElementById('close-about-us-modal-btn');


    companyNameInput.value = companyName;
    receiptLogoUrlInput.value = receiptLogoUrl;

    saveCompanyNameBtn.addEventListener('click', () => {
        const newName = companyNameInput.value.trim();
        if (newName) {
            companyName = newName;
            localStorage.setItem(STORAGE_KEYS.COMPANY_NAME, companyName);
            updateCompanyNameDisplay();
            showNotification('Nama perusahaan berhasil disimpan!', 'success');
        } else {
            showNotification('Nama perusahaan tidak boleh kosong.', 'warning');
        }
    });

    saveReceiptLogoBtn.addEventListener('click', () => {
        const newUrl = receiptLogoUrlInput.value.trim();
        receiptLogoUrl = newUrl;
        localStorage.setItem(STORAGE_KEYS.RECEIPT_LOGO_URL, receiptLogoUrl);
        showNotification('URL logo struk berhasil disimpan!', 'success');
    });

    clearReceiptLogoBtn.addEventListener('click', () => {
        receiptLogoUrl = '';
        localStorage.removeItem(STORAGE_KEYS.RECEIPT_LOGO_URL);
        receiptLogoUrlInput.value = '';
        showNotification('Logo struk berhasil dihapus.', 'info');
    });

    // User Management
    addNewUserBtn.addEventListener('click', () => {
        if (currentUser && currentUser.role !== 'admin') {
            showNotification('Hanya admin yang bisa menambah pengguna.', 'error');
            return;
        }

        const username = newUserNameInput.value.trim();
        const password = newUserPasswordInput.value.trim();
        const role = newUserRoleSelect.value;

        if (!username || !password) {
            showNotification('Username dan password tidak boleh kosong.', 'warning');
            return;
        }
        if (users.some(u => u.username === username)) {
            showNotification('Username sudah ada. Pilih username lain.', 'warning');
            return;
        }

        users.push({ username, password, role });
        saveToLocalStorage(STORAGE_KEYS.USERS, users);
        renderUserList();
        showNotification(`Pengguna ${username} (${role}) berhasil ditambahkan.`, 'success');
        newUserNameInput.value = '';
        newUserPasswordInput.value = '';
        newUserRoleSelect.value = 'kasir';
    });

    const renderUserList = () => {
        userListDisplay.innerHTML = '';
        if (users.length <= 1 && users[0].username === 'admin') { // Only default admin
            userListDisplay.innerHTML = `<p class="empty-table-message">Tidak ada pengguna lain. Admin default selalu ada.</p>`;
            return;
        }

        const userTable = document.createElement('table');
        userTable.innerHTML = `
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Peran</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = userTable.querySelector('tbody');

        users.forEach(user => {
            if (user.username === 'admin' && user.role === 'admin') return; // Don't allow deleting default admin

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td class="table-actions">
                    <button class="danger" data-username="${user.username}" data-action="delete-user"><i data-feather="trash-2"></i> Hapus</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        userListDisplay.appendChild(userTable);
        feather.replace(); // Re-render icons
    };

    userListDisplay.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const usernameToDelete = targetButton.dataset.username;
        const action = targetButton.dataset.action;

        if (action === 'delete-user') {
            if (currentUser && currentUser.role !== 'admin') {
                showNotification('Hanya admin yang bisa menghapus pengguna.', 'error');
                return;
            }
            if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${usernameToDelete}?`)) {
                users = users.filter(u => u.username !== usernameToDelete);
                saveToLocalStorage(STORAGE_KEYS.USERS, users);
                renderUserList();
                showNotification(`Pengguna ${usernameToDelete} berhasil dihapus.`, 'info');
            }
        }
    });


    // Export to PDF functions
    exportProductsPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('product-table');
        if (!element || products.length === 0) {
            showNotification('Tidak ada data produk untuk diekspor.', 'warning');
            return;
        }
        html2pdf().from(element).set({
            margin: [10, 10, 10, 10],
            filename: 'Laporan_Produk.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).save();
        showNotification('Laporan produk berhasil diunduh.', 'info');
    });

    exportTransactionsPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('transaction-table');
        if (!element || transactions.length === 0) {
            showNotification('Tidak ada data transaksi untuk diekspor.', 'warning');
            return;
        }
        html2pdf().from(element).set({
            margin: [10, 10, 10, 10],
            filename: 'Laporan_Penjualan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } // Landscape for wider table
        }).save();
        showNotification('Laporan penjualan berhasil diunduh.', 'info');
    });

    exportExpensesPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('expense-table');
        if (!element || expenses.length === 0) {
            showNotification('Tidak ada data pengeluaran untuk diekspor.', 'warning');
            return;
        }
        html2pdf().from(element).set({
            margin: [10, 10, 10, 10],
            filename: 'Laporan_Pengeluaran.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).save();
        showNotification('Laporan pengeluaran berhasil diunduh.', 'info');
    });

    exportRecapPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('recap-summary-content');
        if (!element) {
            showNotification('Tidak ada data rekapan untuk diekspor.', 'warning');
            return;
        }
        html2pdf().from(element).set({
            margin: [10, 10, 10, 10],
            filename: 'Rekapan_Keuangan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).save();
        showNotification('Rekapan keuangan berhasil diunduh.', 'info');
    });

    exportChartPdfBtn.addEventListener('click', () => {
        const chartCanvas = document.getElementById('incomeTrendChart');
        if (!chartCanvas || transactions.length === 0) {
            showNotification('Tidak ada data grafik untuk diekspor.', 'warning');
            return;
        }

        // Get the image from the canvas
        const imageData = chartCanvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape', // or 'portrait'
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 280; // A4 landscape width approx 297mm - 17mm margin
        const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width;

        pdf.addImage(imageData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('Grafik_Pendapatan.pdf');
        showNotification('Grafik pendapatan berhasil diunduh.', 'info');
    });


    // Clear All Data
    clearAllDataBtn.addEventListener('click', () => {
        if (currentUser && currentUser.role !== 'admin') {
            showNotification('Hanya admin yang bisa menghapus semua data.', 'error');
            return;
        }
        if (confirm('PERINGATAN: Ini akan menghapus SEMUA data aplikasi Anda (produk, transaksi, pengeluaran, pengguna lain, pengaturan) dan tidak dapat dibatalkan. Lanjutkan?')) {
            localStorage.clear();
            // Reinitialize default admin user
            users = [{ username: 'admin', password: 'admin123', role: 'admin' }];
            saveToLocalStorage(STORAGE_KEYS.USERS, users);
            // Clear other data in memory
            products = [];
            transactions = [];
            expenses = [];
            cart = [];
            companyName = 'Akuntansi Pintar';
            receiptLogoUrl = '';
            currentUser = null; // Force re-login

            showNotification('Semua data aplikasi berhasil dihapus. Silakan login ulang.', 'success', 5000);
            // Reload page to reflect changes and show login modal
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    });

    // About Us Modal
    aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutUsModal.classList.add('active');
    });

    closeAboutUsModalBtn.addEventListener('click', () => {
        aboutUsModal.classList.remove('active');
    });

    // Close modals when clicking outside or on close button
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Only close if clicking on the backdrop
                modal.classList.remove('active');
            }
        });
    });

    // --- Drag to Scroll for Tab Navigation and Cart Items ---
    const scrollableContainers = document.querySelectorAll('.scrollable-container');

    scrollableContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active-drag');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active-drag');
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active-drag');
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1; // Adjust scroll speed
            container.scrollLeft = scrollLeft - walk;
        });
    });


    // --- Initializations on Load ---
    const initializeApp = () => {
        updateCompanyNameDisplay();
        updateUserInfoDisplay();
        populateProductSelect();
        renderCart();
        renderProductList();
        renderExpenseList();
        renderTransactionList();
        updateRecapSummary();
        renderIncomeTrendChart(); // Initial chart render
        renderUserList(); // Render user list for admin

        // Check login status
        if (currentUser) {
            loginModal.classList.remove('active');
            updateTabVisibility();
        } else {
            loginModal.classList.add('active');
            updateTabVisibility();
        }
        feather.replace(); // Replace all feather icons on initial load
    };

    // Event listener for login button
    loginBtn.addEventListener('click', handleLogin);

    // Initial app setup
    initializeApp();
});
