<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akuntansi Pintar</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js"></script>
    <style>
        /* --- Variabel Warna Emas Modern & Professional --- */
        :root {
            --primary-gold: #B8860B; /* Dark Goldenrod */
            --primary-dark-gold: #8B6914; /* Darker Gold */
            --light-gold: #FFD700; /* Gold */
            --accent-gold: #FFC107; /* Amber Gold */
            --text-color: #4A4A4A; /* Dark Gray for text */
            --light-text-color: #8C8C8C; /* Lighter Gray for subtle text */
            --light-bg: #F8F8F8; /* Very light gray for backgrounds */
            --dark-bg: #EAEAEA; /* Slightly darker gray for subtle accents */
            --card-bg: #FFFFFF; /* White for cards */
            --border-color: #D3D3D3; /* Light gray for borders */
            --danger-color: #E74C3C; /* Red */
            --success-color: #27AE60; /* Green */
            --info-color: #3498DB; /* Blue */
            --warning-color: #F1C40F; /* Yellow */
            --shadow-light: rgba(0, 0, 0, 0.08);
            --shadow-medium: rgba(0, 0, 0, 0.15);
            --shadow-dark: rgba(0, 0, 0, 0.25);

            /* Gradients (Updated for Gold) */
            --header-gradient: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-dark-gold) 100%);
            --button-primary-gradient: linear-gradient(45deg, var(--light-gold), var(--primary-gold));
            --button-success-gradient: linear-gradient(45deg, var(--success-color), #208b4e);
            --button-danger-gradient: linear-gradient(45deg, var(--danger-color), #c0392b);
            --button-secondary-gradient: linear-gradient(45deg, var(--accent-gold), #e0a300); /* Adjusted secondary */
        }

        /* --- Reset & Base Styles --- */
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--light-bg);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* --- Header --- */
        header {
            background: var(--header-gradient);
            color: white;
            padding: 40px 0;
            text-align: center;
            box-shadow: 0 8px 16px var(--shadow-dark);
            position: relative;
            overflow: hidden;
        }
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"><path d="M0 60V0h60v60zM30 0L0 30l30 30L60 30z" fill-rule="nonzero"/></g></svg>');
            opacity: 0.2;
            pointer-events: none;
            z-index: 1;
        }

        header h1 {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            font-size: 4.5em; /* Diperbesar */
            font-weight: 800;
            letter-spacing: 0.12em; /* Diperjelas */
            /* Updated for shiny gold gradient */
            background: linear-gradient(
                45deg,
                #FFD700 0%,     /* Bright Gold */
                #DAA520 25%,    /* Goldenrod */
                #B8860B 50%,    /* Dark Goldenrod */
                #DAA520 75%,    /* Goldenrod */
                #FFD700 100%    /* Bright Gold */
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent; /* Fallback for browsers that don't support -webkit-text-fill-color */
            text-shadow: 2px 2px 5px var(--shadow-dark);
            position: relative;
            z-index: 2;
        }

        .app-creator { /* This class is now unused in HTML but kept in CSS for completeness */
            font-size: 1em;
            font-weight: 400;
            margin-top: 10px;
            opacity: 0.8;
            position: relative;
            z-index: 2;
        }

        /* --- Main Container --- */
        .container {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 30px;
            max-width: 1400px;
            margin: 30px auto;
            background-color: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 10px 30px var(--shadow-medium);
        }

        /* --- Tab Navigation --- */
        .tab-navigation {
            display: flex;
            border-bottom: 3px solid var(--border-color);
            margin-bottom: 30px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            background-color: var(--dark-bg);
            border-radius: 8px;
            padding: 5px;
        }
        .tab-navigation::-webkit-scrollbar { display: none; }

        .tab-button {
            background-color: transparent;
            border: none;
            padding: 18px 30px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 600;
            color: var(--light-text-color);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .tab-button:hover {
            color: var(--primary-gold);
            background-color: rgba(184, 134, 11, 0.08); /* RGB of primary-gold */
        }

        .tab-button.active {
            color: var(--text-color); /* Changed to dark text for gold background */
            background: var(--button-primary-gradient);
            box-shadow: 0 4px 10px var(--shadow-light);
            transform: translateY(-2px);
        }
        .tab-button.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: var(--accent-gold);
        }

        /* --- Tab Content --- */
        .tab-content {
            display: none;
            padding: 20px 0;
            flex-direction: column;
            flex: 1;
            animation: fadeIn 0.5s ease-out;
        }
        .tab-content.active { display: flex; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* --- Section Titles (H2) --- */
        h2 {
            color: var(--primary-dark-gold); /* Darker gold for headers */
            margin-top: 0;
            margin-bottom: 30px;
            font-size: 2.2em;
            font-weight: 700;
            border-bottom: 4px solid var(--border-color);
            padding-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        h2 svg {
            color: var(--accent-gold);
            font-size: 1.3em;
        }

        /* --- Kasir Layout --- */
        .kasir-layout {
            display: grid;
            grid-template-columns: 2fr 3fr;
            gap: 35px;
            flex: 1;
        }

        .left-panel, .right-panel {
            padding: 30px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            background-color: var(--light-bg);
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
        }

        /* --- Form Elements --- */
        .form-group {
            margin-bottom: 22px;
        }

        label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: var(--text-color);
            font-size: 1em;
        }

        input[type="text"],
        input[type="number"],
        input[type="password"], /* Added for user management */
        input[type="date"], /* For expense and potentially other date inputs */
        select,
        textarea {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 1.05em;
            box-sizing: border-box;
            background-color: var(--card-bg);
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="password"]:focus,
        input[type="date"]:focus,
        select:focus,
        textarea:focus {
            border-color: var(--primary-gold); /* Gold focus */
            box-shadow: 0 0 0 4px rgba(184, 134, 11, 0.25); /* Gold focus ring */
            outline: none;
        }
        input[readonly] {
            background-color: var(--dark-bg);
            cursor: not-allowed;
            opacity: 0.8;
        }
        textarea {
            resize: vertical;
            min-height: 100px;
        }

        /* --- Button Group --- */
        .button-group {
            display: flex;
            gap: 18px;
            margin-top: 25px;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .modal .button-group, .transaction-detail .button-group {
            justify-content: center;
        }
        .login-modal-content .button-group {
            justify-content: center;
            margin-top: 30px;
        }

        button {
            padding: 14px 25px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.05em;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 4px 8px var(--shadow-light);
            color: white; /* Default to white text for most buttons */
        }

        button.primary { background: var(--button-primary-gradient); color: var(--text-color); } /* Dark text on gold */
        button.primary:hover { transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        button.secondary { background: var(--button-secondary-gradient); color: var(--text-color); } /* Dark text on amber gold */
        button.secondary:hover { transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        button.danger { background: var(--button-danger-gradient); }
        button.danger:hover { transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        button.success { background: var(--button-success-gradient); }
        button.success:hover { transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        button.info { background-color: var(--info-color); }
        button.info:hover { background-color: #217dbb; transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        button.warning { background-color: var(--warning-color); color: var(--text-color); } /* Dark text on yellow */
        button.warning:hover { background-color: #d8af11; transform: translateY(-3px); box-shadow: 0 6px 12px var(--shadow-medium); }

        /* --- Cart Items Display --- */
        .cart-items {
            flex: 1;
            margin-bottom: 30px;
            overflow-y: auto;
            max-height: 400px;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            background-color: var(--card-bg);
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid var(--dark-bg);
            transition: background-color 0.2s ease;
        }
        .cart-item:last-child { border-bottom: none; }
        .cart-item:hover { background-color: var(--dark-bg); }

        .cart-item-info { flex-grow: 1; margin-right: 20px; }
        .cart-item-name { font-weight: 700; color: var(--primary-gold); font-size: 1.1em; } /* Gold product name */
        .cart-item-quantity, .cart-item-price-per-item { font-size: 0.9em; color: var(--light-text-color); }
        .cart-item-total-price { font-weight: 700; color: var(--success-color); white-space: nowrap; font-size: 1.2em; }
        .cart-item-actions button {
            padding: 8px 12px;
            font-size: 0.85em;
            border-radius: 6px;
            box-shadow: none;
            transform: none;
        }
        .cart-item-actions button:hover { opacity: 0.8; }
        .empty-cart-message, .empty-table-message, .empty-chart-message {
            text-align: center;
            color: var(--light-text-color);
            padding: 40px;
            font-style: italic;
            font-size: 1.1em;
        }

        /* --- Cart Summary --- */
        .cart-summary {
            margin-top: auto;
            border-top: 3px solid var(--primary-gold); /* Gold border top */
            padding-top: 25px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 1.15em;
            color: var(--text-color);
            font-weight: 500;
        }
        .summary-row.total {
            font-weight: 700;
            font-size: 1.8em;
            color: var(--primary-dark-gold); /* Darker gold for total */
            padding-top: 15px;
            border-top: 1px dashed var(--border-color);
            margin-top: 20px;
        }
        .summary-row.change-negative { color: var(--danger-color); }
        .summary-row.change-positive { color: var(--success-color); }


        /* --- Table Styles --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            background-color: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px var(--shadow-light);
        }

        table thead th {
            background: var(--header-gradient);
            color: white;
            padding: 16px 20px;
            text-align: left;
            border-bottom: 2px solid var(--primary-dark-gold); /* Darker gold border */
            font-weight: 600;
            font-size: 1em;
        }

        table tbody td {
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-color);
            font-size: 0.95em;
        }

        table tbody tr:nth-child(even) { background-color: var(--light-bg); }
        table tbody tr:hover { background-color: var(--dark-bg); transition: background-color 0.2s ease; }

        .table-actions { display: flex; gap: 10px; }
        .table-actions button {
            padding: 9px 15px;
            font-size: 0.85em;
            box-shadow: none;
            transform: none;
        }
        .table-actions button:hover { opacity: 0.8; }

        /* --- Notification Area --- */
        #notification-area {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 350px;
        }

        .notification {
            background-color: #333;
            color: white;
            padding: 16px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 15px var(--shadow-dark);
            opacity: 0;
            transform: translateX(100%);
            animation: slideIn 0.5s forwards, fadeOut var(--notification-duration) forwards;
            animation-delay: 0s, calc(var(--notification-duration) - 0.5s);
            position: relative;
            overflow: hidden;
            font-weight: 500;
        }
        .notification::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.4);
            animation: progressBar var(--notification-duration) linear forwards;
        }
        @keyframes progressBar { from { width: 100%; } to { width: 0%; } }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }

        .notification.success { background-color: var(--success-color); }
        .notification.error   { background-color: var(--danger-color); }
        .notification.info    { background-color: var(--info-color); }
        .notification.warning { background-color: var(--warning-color); color: var(--text-color); }

        /* --- Footer --- */
        footer {
            background-color: var(--text-color);
            color: white;
            text-align: center;
            padding: 25px 0;
            margin-top: 50px;
            font-size: 0.95em;
            box-shadow: 0 -5px 15px var(--shadow-medium);
            flex-shrink: 0;
        }
        footer a {
            color: var(--light-gold); /* Warna emas untuk link di footer */
            text-decoration: none;
            transition: color 0.2s ease;
        }
        footer a:hover {
            color: var(--accent-gold);
            text-decoration: underline;
        }


        /* --- Modal Styles --- */
        .modal {
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .modal.active { opacity: 1; visibility: visible; }

        .modal-content {
            background-color: var(--card-bg);
            padding: 40px;
            border-radius: 16px;
            width: 95%;
            max-width: 600px;
            box-shadow: 0 15px 40px var(--shadow-dark);
            position: relative;
            transform: translateY(-30px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .modal.active .modal-content { transform: translateY(0); opacity: 1; }

        .close-button {
            color: var(--light-text-color);
            font-size: 35px;
            font-weight: bold;
            position: absolute;
            top: 20px;
            right: 25px;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .close-button:hover { color: var(--danger-color); }

        .modal-content h3 {
            color: var(--primary-gold); /* Gold modal header */
            margin-top: 0;
            margin-bottom: 30px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 15px;
            font-size: 2em;
        }
        .modal-content ul {
            list-style: none;
            padding: 0;
            margin-top: 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            background-color: var(--light-bg);
        }
        .modal-content ul li {
            padding: 10px 15px;
            border-bottom: 1px dashed var(--dark-bg);
            font-size: 0.95em;
            color: var(--text-color);
        }
        .modal-content ul li:last-child { border-bottom: none; }

        .modal-content .summary-row {
            font-size: 1.1em;
            margin-bottom: 10px;
        }
        .modal-content .summary-row.total {
            font-size: 1.4em;
        }

        /* --- Rekapan Section Styles --- */
        .recap-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Adjusted for more cards */
            gap: 30px;
            margin-top: 30px;
            padding: 25px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            background-color: var(--light-bg);
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .recap-card {
            background-color: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 15px var(--shadow-light);
            text-align: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .recap-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 25px var(--shadow-medium);
        }

        .recap-card h3 {
            color: var(--light-text-color);
            font-size: 1.4em;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
            text-align: center;
        }

        .recap-card .amount {
            font-size: 3.2em;
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            color: var(--primary-gold); /* Gold amount */
            margin-bottom: 0;
            line-height: 1.2;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .recap-card.expense .amount { color: var(--danger-color); }
        .recap-card.profit .amount { color: var(--success-color); }

        .chart-container {
            margin-top: 40px;
            background-color: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 15px var(--shadow-light);
            max-width: 100%;
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .chart-container canvas {
            max-width: 100% !important;
            max-height: 100% !important;
        }
        .chart-message {
            text-align: center;
            color: var(--light-text-color);
            padding: 20px;
            font-style: italic;
        }

        /* Pengaturan tab specific styles */
        .settings-section {
            background-color: var(--light-bg);
            padding: 25px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 30px;
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.03);
        }
        .settings-section h3 {
            color: var(--primary-dark-gold);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 10px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .settings-info {
            font-size: 0.95em;
            color: var(--light-text-color);
            margin-top: -15px;
            margin-bottom: 20px;
        }
        .settings-section .button-group {
            margin-top: 20px;
            justify-content: flex-start;
        }

        /* Login Modal specific styles */
        .login-modal-content {
            max-width: 450px;
            text-align: center;
        }
        .login-modal-content h3 {
            font-size: 2.5em;
            color: var(--primary-dark-gold);
            border-bottom: none;
            margin-bottom: 10px;
        }
        .login-modal-content .company-name {
            font-size: 1.1em;
            color: var(--light-text-color);
            margin-bottom: 30px;
        }
        .login-modal-content .form-group {
            text-align: left;
        }
        .login-modal-content label {
            font-size: 1em;
        }
        .login-modal-content input {
            padding: 16px 20px;
            font-size: 1.1em;
            border-radius: 10px;
        }
        .login-modal-content button {
            width: 100%;
            padding: 16px;
            font-size: 1.2em;
        }
        .login-modal-content .info-text {
            font-size: 0.9em;
            color: var(--light-text-color);
            margin-top: 25px;
        }


        /* Print Receipt Style */
        @media print {
            body { background-color: white; margin: 0; padding: 0; color: #000; }
            header, footer, .container, .tab-navigation, #notification-area, .modal, button, .button-group, .settings-section { display: none !important; }
            .print-receipt-content {
                display: block !important;
                font-family: 'Consolas', 'Monospace', monospace;
                font-size: 12px;
                line-height: 1.4;
                width: 300px;
                margin: 0 auto;
                padding: 10px;
                box-sizing: border-box;
            }
            .print-receipt-content .header, .print-receipt-content .footer { text-align: center; margin-bottom: 10px; }
            .print-receipt-content .separator { border-top: 1px dashed #000; margin: 8px 0; }
            .print-receipt-content .item-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .print-receipt-content .item-name { flex-grow: 1; padding-right: 5px; }
            .print-receipt-content .item-qty-price { white-space: nowrap; text-align: right; }
            .print-receipt-content .summary-row { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; }
            .print-receipt-content .total-row { font-size: 1.1em; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px; }
            .print-receipt-content .text-right { text-align: right; }
        }

        /* NEW: Styling for Barcode Scanner */
        #barcode-scanner-video {
            transform: scaleX(-1); /* Mirror effect for selfie camera, remove if using back camera */
        }
        #barcode-scanner-overlay {
            background-color: rgba(0,0,0,0.6);
            color: white;
            font-size: 1.1em;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5; /* Ensure it's above the video */
            pointer-events: none; /* Allows clicks to pass through to video/controls below */
        }


        /* --- Media Queries (Responsive Design) --- */
        @media (max-width: 1024px) {
            .kasir-layout { grid-template-columns: 1fr; }
            .left-panel, .right-panel { margin-bottom: 25px; }
            .tab-button { padding: 15px 25px; font-size: 1em; }
            header h1 { font-size: 3.8em; } /* Penyesuaian responsif */
            h2 { font-size: 2em; }
            .recap-summary { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            .recap-card .amount { font-size: 2.8em; }
        }

        @media (max-width: 768px) {
            .container { margin: 20px; padding: 20px; }
            header h1 { font-size: 3em; } /* Penyesuaian responsif */
            .app-creator { font-size: 0.9em; }
            h2 { font-size: 1.8em; margin-bottom: 25px; }
            .tab-navigation { flex-wrap: wrap; justify-content: center; padding: 3px; }
            .tab-button { flex-basis: 49%; margin: 2px; padding: 12px 20px; font-size: 0.95em; }
            input[type="text"], input[type="number"], select, textarea { padding: 12px 15px; font-size: 0.95em; }
            button { padding: 12px 20px; font-size: 0.95em; }
            .button-group { gap: 12px; margin-top: 20px; }
            .recap-summary { grid-template-columns: 1fr; }
            .recap-card .amount { font-size: 2.5em; }
            .recap-card h3 { font-size: 1.2em; }
            .cart-item { flex-wrap: wrap; gap: 8px; padding: 12px 15px; }
            .cart-item-name { flex-basis: 100%; }
            .cart-item-info, .cart-item-total-price, .cart-item-actions { flex-grow: 1; flex-basis: auto; }
            .cart-item-actions { justify-content: flex-end; }
            .summary-row { font-size: 1em; }
            .summary-row.total { font-size: 1.5em; }
            .modal-content { padding: 30px; }
            .modal-content h3 { font-size: 1.6em; }
        }

        @media (max-width: 480px) {
            header h1 { font-size: 2.5em; } /* Penyesuaian responsif */
            .container { margin: 10px; padding: 15px; }
            h2 { font-size: 1.6em; }
            .tab-button { flex-basis: 100%; }
            .notification { max-width: 90%; right: 5%; left: 5%; }
            .recap-card .amount { font-size: 2em; }
            .recap-card h3 { font-size: 1.2em; }
        }
    </style>
</head>
<body>
    <header>
        <h1 id="app-company-name">Akuntansi Pintar</h1>
    </header>

    <main class="container">
        <nav class="tab-navigation">
            <button class="tab-button active" data-tab="kasir">
                <i data-feather="shopping-cart"></i> Kasir
            </button>
            <button class="tab-button" data-tab="produk">
                <i data-feather="box"></i> Produk
            </button>
            <button class="tab-button" data-tab="pengeluaran">
                <i data-feather="dollar-sign"></i> Pengeluaran
            </button>
            <button class="tab-button" data-tab="laporan">
                <i data-feather="file-text"></i> Laporan Penjualan
            </button>
            <button class="tab-button" data-tab="rekapan">
                <i data-feather="pie-chart"></i> Rekapan Keuangan
            </button>
            <button class="tab-button" data-tab="pengaturan">
                <i data-feather="settings"></i> Pengaturan
            </button>
        </nav>

        <div id="kasir" class="tab-content active">
            <div class="kasir-layout">
                <div class="left-panel">
                    <h2><i data-feather="tag"></i> Input Produk</h2>

                    <div class="form-group">
                        <label for="barcode-scanner-input">Scan Barcode / Kode Produk:</label>
                        <div style="position: relative; width: 100%; height: 200px; border: 2px solid var(--border-color); border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
                            <video id="barcode-scanner-video" style="width: 100%; height: 100%; object-fit: cover;"></video>
                            <div id="barcode-scanner-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: rgba(0,0,0,0.5); color: white; font-size: 1.1em; text-align: center;">
                                Memuat kamera... Pastikan izin diberikan.
                            </div>
                        </div>
                        <input type="text" id="barcode-manual-input" placeholder="Atau masukkan kode produk manual di sini">
                    </div>
                    <div class="button-group">
                        <button class="info" id="start-scan-btn"><i data-feather="camera"></i> Mulai Scan</button>
                        <button class="secondary" id="stop-scan-btn" style="display:none;"><i data-feather="stop-circle"></i> Berhenti Scan</button>
                        <button class="primary" id="add-by-manual-code-btn"><i data-feather="chevrons-right"></i> Tambah via Kode Manual</button>
                    </div>
                    <div class="form-group">
                        <label for="category-filter">Filter Kategori:</label>
                        <select id="category-filter">
                            <option value="">-- Semua Kategori --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="product-select">Pilih Produk:</label>
                        <select id="product-select">
                            <option value="">-- Pilih Produk --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="product-name">Nama Produk:</label>
                        <input type="text" id="product-name" readonly placeholder="Akan terisi otomatis">
                    </div>
                    <div class="form-group">
                        <label for="product-price">Harga (Rp):</label>
                        <input type="number" id="product-price" readonly placeholder="Akan terisi otomatis">
                    </div>
                    <div class="form-group">
                        <label for="product-stock-display">Sisa Stok:</label>
                        <input type="text" id="product-stock-display" readonly placeholder="Akan terisi otomatis">
                    </div>
                    <div class="form-group">
                        <label for="product-quantity">Jumlah:</label>
                        <input type="number" id="product-quantity" value="1" min="1" placeholder="Jumlah produk">
                    </div>
                    <div class="button-group">
                        <button class="primary" id="add-to-cart-btn"><i data-feather="plus-circle"></i> Tambah ke Keranjang</button>
                        <button class="secondary" id="clear-input-btn"><i data-feather="refresh-cw"></i> Bersihkan Input</button>
                    </div>
                </div>

                <div class="right-panel">
                    <h2><i data-feather="shopping-bag"></i> Keranjang Belanja</h2>
                    <div class="cart-items" id="cart-items">
                        <p class="empty-cart-message">Keranjang kosong. Pilih produk dari daftar.</p>
                    </div>
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="subtotal">Rp 0</span>
                        </div>
                        <div class="form-group">
                            <label for="discount-type">Jenis Diskon:</label>
                            <select id="discount-type">
                                <option value="none">Tidak Ada Diskon</option>
                                <option value="percentage">Persentase (%)</option>
                                <option value="nominal">Nominal (Rp)</option>
                            </select>
                        </div>
                        <div class="form-group" id="discount-value-group" style="display:none;">
                            <label for="discount-value">Nilai Diskon:</label>
                            <input type="number" id="discount-value" value="0" min="0" placeholder="Masukkan nilai diskon">
                        </div>
                        <div class="summary-row">
                            <span>Diskon:</span>
                            <span id="discount">Rp 0</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total Pembayaran:</span>
                            <span id="total-payment">Rp 0</span>
                        </div>
                        <div class="form-group">
                            <label for="amount-paid">Jumlah Dibayar (Rp):</label>
                            <input type="number" id="amount-paid" value="0" min="0" placeholder="Masukkan jumlah uang dibayar">
                        </div>
                        <div class="summary-row total" id="change-row">
                            <span>Kembalian:</span>
                            <span id="change-amount">Rp 0</span>
                        </div>
                        <div class="button-group">
                            <button class="success" id="process-payment-btn"><i data-feather="dollar-sign"></i> Proses Pembayaran</button>
                            <button class="danger" id="clear-cart-btn"><i data-feather="trash-2"></i> Bersihkan Keranjang</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="produk" class="tab-content">
            <h2><i data-feather="database"></i> Manajemen Produk</h2>
            <div class="product-form-container">
                <div class="form-group">
                    <label for="new-product-name">Nama Produk Baru:</label>
                    <input type="text" id="new-product-name" placeholder="Contoh: Kopi Americano">
                </div>
                <div class="form-group">
                    <label for="new-product-category">Kategori:</label>
                    <input type="text" id="new-product-category" placeholder="Contoh: Minuman, Makanan">
                </div>
                <div class="form-group">
                    <label for="new-product-cost-price">Harga Beli (Rp):</label>
                    <input type="number" id="new-product-cost-price" min="0" value="0" placeholder="Harga beli produk">
                </div>
                <div class="form-group">
                    <label for="new-product-price">Harga Jual (Rp):</label>
                    <input type="number" id="new-product-price" min="0" value="0" placeholder="Harga jual produk">
                </div>
                <div class="form-group">
                    <label for="new-product-markup-percentage">Markup (%):</label>
                    <input type="number" id="new-product-markup-percentage" min="0" max="1000" step="0.01" readonly title="Markup dihitung otomatis (Harga Jual - Harga Beli) / Harga Beli * 100">
                </div>
                <div class="form-group">
                    <label for="new-product-stock">Stok Awal:</label>
                    <input type="number" id="new-product-stock" min="0" value="0" placeholder="Jumlah stok awal">
                </div>
                <div class="form-group">
                    <label for="new-product-min-stock">Min. Stok untuk Peringatan:</label>
                    <input type="number" id="new-product-min-stock" min="0" value="0" placeholder="Stok minimum untuk peringatan">
                </div>
                <div class="button-group">
                    <button class="primary" id="add-new-product-btn"><i data-feather="plus"></i> Tambah Produk Baru</button>
                </div>
            </div>

            <table id="product-table">
                <thead>
                    <tr>
                        <th>ID Produk</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                        <th>Markup (%)</th>
                        <th>Stok</th>
                        <th>Min. Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="product-list-body">
                    </tbody>
            </table>
        </div>

        <div id="pengeluaran" class="tab-content">
            <h2><i data-feather="minus-circle"></i> Manajemen Pengeluaran</h2>
            <div class="form-group">
                <label for="expense-date">Tanggal Pengeluaran:</label>
                <input type="date" id="expense-date" required>
            </div>
            <div class="form-group">
                <label for="expense-category">Kategori Pengeluaran:</label>
                <input type="text" id="expense-category" placeholder="Contoh: Sewa, Gaji, Listrik" required>
            </div>
            <div class="form-group">
                <label for="expense-description">Deskripsi:</label>
                <textarea id="expense-description" placeholder="Deskripsi detail pengeluaran" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="expense-amount">Jumlah (Rp):</label>
                <input type="number" id="expense-amount" min="0" value="0" required placeholder="Jumlah pengeluaran">
            </div>
            <div class="button-group">
                <button class="danger" id="add-expense-btn"><i data-feather="plus"></i> Tambah Pengeluaran</button>
            </div>

            <table id="expense-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tanggal</th>
                        <th>Kategori</th>
                        <th>Deskripsi</th>
                        <th>Jumlah (Rp)</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="expense-list-body">
                    <p class="empty-table-message">Belum ada pengeluaran yang tercatat.</p>
                </tbody>
            </table>
        </div>

        <div id="laporan" class="tab-content">
            <h2><i data-feather="clipboard"></i> Laporan Penjualan</h2>
            <div class="form-group">
                <label for="report-date-filter">Filter Tanggal:</label>
                <input type="month" id="report-date-filter" title="Filter laporan berdasarkan bulan dan tahun">
            </div>
            <table id="transaction-table">
                <thead>
                    <tr>
                        <th>ID Transaksi</th>
                        <th>Tanggal</th>
                        <th>Total</th>
                        <th>Diskon</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="transaction-list-body">
                    </tbody>
            </table>
        </div>

        <div id="rekapan" class="tab-content">
            <h2><i data-feather="pie-chart"></i> Rekapan Keuangan Keseluruhan</h2>
            <div class="recap-summary" id="recap-summary-content">
                <div class="recap-card">
                    <h3>Total Pendapatan</h3>
                    <div class="amount" id="recap-revenue">Rp 0</div>
                </div>
                <div class="recap-card expense">
                    <h3>Total HPP</h3>
                    <div class="amount" id="recap-cost-of-goods">Rp 0</div>
                </div>
                 <div class="recap-card expense">
                    <h3>Total Pengeluaran</h3>
                    <div class="amount" id="recap-total-expense">Rp 0</div>
                </div>
                <div class="recap-card profit">
                    <h3>Laba Bersih</h3>
                    <div class="amount" id="recap-profit">Rp 0</div>
                </div>
            </div>

            <div class="chart-container">
                <h3 style="color: var(--primary-dark-gold); margin-bottom: 20px;">Grafik Pendapatan</h3>
                <div class="form-group" style="width: 100%; max-width: 300px; text-align: center;">
                    <label for="chart-filter">Tampilan Grafik:</label>
                    <select id="chart-filter">
                        <option value="daily">Harian (30 Hari Terakhir)</option>
                        <option value="weekly">Mingguan (12 Minggu Terakhir)</option>
                        <option value="monthly">Bulanan (12 Bulan Terakhir)</option>
                        <option value="yearly">Tahunan</option>
                    </select>
                </div>
                <canvas id="incomeTrendChart" aria-label="Grafik Tren Pendapatan" role="img"></canvas>
                <p id="chart-empty-message" class="empty-chart-message" style="display:none;">Tidak ada data transaksi untuk menampilkan grafik.</p>
            </div>
            </div>

        <div id="pengaturan" class="tab-content">
            <h2><i data-feather="settings"></i> Pengaturan Aplikasi</h2>

            <div class="settings-section">
                <h3>Nama Perusahaan</h3>
                <div class="form-group">
                    <label for="company-name-input">Nama Perusahaan/Toko:</label>
                    <input type="text" id="company-name-input" placeholder="Masukkan nama perusahaan Anda">
                </div>
                <div class="button-group">
                    <button class="primary" id="save-company-name-btn"><i data-feather="save"></i> Simpan Nama Perusahaan</button>
                </div>
            </div>

            <div class="settings-section">
                <h3>Manajemen Pengguna <span style="font-weight: normal; font-size: 0.8em; color: var(--info-color);">(Admin Only)</span></h3>
                <p class="settings-info">Tambahkan pengguna baru atau lihat daftar pengguna. Untuk keamanan, aplikasi ini hanya menyimpan data di browser Anda.</p>
                <div class="form-group">
                    <label for="new-user-username">Username:</label>
                    <input type="text" id="new-user-username" placeholder="Masukkan username baru">
                </div>
                <div class="form-group">
                    <label for="new-user-password">Password:</label>
                    <input type="password" id="new-user-password" placeholder="Masukkan password">
                </div>
                <div class="form-group">
                    <label for="new-user-role">Peran:</label>
                    <select id="new-user-role">
                        <option value="kasir">Kasir</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="button-group">
                    <button class="success" id="add-new-user-btn"><i data-feather="user-plus"></i> Tambah Pengguna Baru</button>
                </div>

                <h4 style="margin-top: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; color: var(--text-color);">Daftar Pengguna</h4>
                <div id="user-list-display">
                    <p class="empty-table-message">Tidak ada pengguna lain. Admin default selalu ada.</p>
                </div>
            </div>

            <div class="settings-section">
                <h3>Ekspor Data ke PDF</h3>
                <p class="settings-info">Unduh data produk, laporan penjualan, atau daftar pengeluaran Anda dalam format PDF.</p>
                <div class="button-group">
                    <button class="info" id="export-products-pdf-btn"><i data-feather="download"></i> Produk (PDF)</button>
                    <button class="info" id="export-transactions-pdf-btn"><i data-feather="download"></i> Laporan Penjualan (PDF)</button>
                    <button class="info" id="export-expenses-pdf-btn"><i data-feather="download"></i> Pengeluaran (PDF)</button>
                    <button class="info" id="export-recap-pdf-btn"><i data-feather="download"></i> Rekapan Keuangan (PDF)</button>
                     <button class="info" id="export-chart-pdf-btn"><i data-feather="download"></i> Grafik Pendapatan (PDF)</button>
                </div>
            </div>

            <div class="settings-section">
                <h3>Hapus Semua Data Aplikasi</h3>
                <p class="settings-info" style="color: var(--danger-color); font-weight: 600;">
                    PERINGATAN: Tindakan ini akan menghapus SEMUA data aplikasi (produk, keranjang, transaksi, pengeluaran, dan pengguna lain) yang tersimpan di browser Anda. Tindakan ini TIDAK DAPAT DIBATALKAN!
                </p>
                <div class="button-group">
                    <button class="danger" id="clear-all-data-btn"><i data-feather="alert-triangle"></i> Hapus Semua Data Aplikasi</button>
                </div>
            </div>
        </div>

    </main>

    <div id="notification-area">
    </div>

    <div id="loginModal" class="modal active">
        <div class="modal-content login-modal-content">
            <h3>Selamat Datang di <span id="login-company-name-display">Akuntansi Pintar</span></h3>
            <p class="company-name">Sistem Keuangan Anda</p>
            <div class="form-group">
                <label for="login-username">Username:</label>
                <input type="text" id="login-username" placeholder="Username Anda">
            </div>
            <div class="form-group">
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" placeholder="Password Anda">
            </div>
            <div class="button-group">
                <button class="primary" id="login-btn"><i data-feather="log-in"></i> Login</button>
            </div>
            <p class="info-text">Default Admin: username `admin`, password `admin123`</p>
        </div>
    </div>


    <div id="editProductModal" class="modal">
        <div class="modal-content">
            <span class="close-button" title="Tutup Modal">&times;</span>
            <h3>Edit Produk</h3>
            <div class="form-group">
                <label for="modal-product-id">ID Produk:</label>
                <input type="text" id="modal-product-id" readonly>
            </div>
            <div class="form-group">
                <label for="modal-product-name">Nama Produk:</label>
                <input type="text" id="modal-product-name">
            </div>
            <div class="form-group">
                <label for="modal-product-category">Kategori:</label>
                <input type="text" id="modal-product-category">
            </div>
            <div class="form-group">
                <label for="modal-product-cost-price">Harga Beli (Rp):</label>
                <input type="number" id="modal-product-cost-price" min="0">
            </div>
            <div class="form-group">
                <label for="modal-product-price">Harga Jual (Rp):</label>
                <input type="number" id="modal-product-price" min="0">
            </div>
            <div class="form-group">
                <label for="modal-product-markup-percentage">Markup (%):</label>
                <input type="number" id="modal-product-markup-percentage" min="0" max="1000" step="0.01" readonly title="Markup dihitung otomatis (Harga Jual - Harga Beli) / Harga Beli * 100">
            </div>
            <div class="form-group">
                <label for="modal-product-stock">Stok:</label>
                <input type="number" id="modal-product-stock" min="0">
            </div>
            <div class="form-group">
                <label for="modal-product-min-stock">Min. Stok untuk Peringatan:</label>
                <input type="number" id="modal-product-min-stock" min="0">
            </div>
            <div class="button-group">
                <button class="secondary" id="cancel-edit-btn"><i data-feather="x-circle"></i> Batal</button>
                <button class="primary" id="save-product-btn"><i data-feather="save"></i> Simpan Perubahan</button>
            </div>
        </div>
    </div>

    <div id="stockAdjustmentModal" class="modal">
        <div class="modal-content">
            <span class="close-button" title="Tutup Modal">&times;</span>
            <h3 id="stock-modal-title">Penyesuaian Stok</h3>
            <p>Produk: <strong id="stock-product-name-display"></strong> (ID: <span id="stock-product-id-display"></span>)</p>
            <p>Stok Saat Ini: <strong id="current-stock-display"></strong></p>
            <div class="form-group">
                <label for="stock-adjustment-type">Jenis Penyesuaian:</label>
                <select id="stock-adjustment-type">
                    <option value="in">Barang Masuk (Tambah Stok)</option>
                    <option value="out">Barang Keluar (Kurangi Stok)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="stock-adjustment-quantity">Jumlah:</label>
                <input type="number" id="stock-adjustment-quantity" min="1" value="1">
            </div>
            <div class="form-group">
                <label for="stock-adjustment-reason">Alasan (opsional):</label>
                <textarea id="stock-adjustment-reason" rows="2" placeholder="Contoh: Barang baru datang, Rusak, Retur"></textarea>
            </div>
            <div class="button-group">
                <button class="secondary" id="cancel-stock-adjustment-btn"><i data-feather="x-circle"></i> Batal</button>
                <button class="primary" id="save-stock-adjustment-btn"><i data-feather="save"></i> Simpan</button>
            </div>
        </div>
    </div>

    <div id="transactionDetailModal" class="modal">
        <div class="modal-content">
            <span class="close-button" title="Tutup Modal">&times;</span>
            <h3>Detail Transaksi</h3>
            <p><strong>ID Transaksi:</strong> <span id="detail-transaction-id"></span></p>
            <p><strong>Tanggal:</strong> <span id="detail-transaction-date"></span></p>
            <h4>Item:</h4>
            <ul id="detail-transaction-items"></ul>
            <div class="summary-row"><span>Subtotal:</span> <span id="detail-transaction-subtotal"></span></div>
            <div class="summary-row"><span>Diskon:</span> <span id="detail-transaction-discount">Rp 0</span></div>
            <div class="summary-row total"><span>Total:</span> <span id="detail-transaction-total"></span></div>
            <div class="summary-row"><span>Jumlah Dibayar:</span> <span id="detail-transaction-paid"></span></div>
            <div class="summary-row"><span>Kembalian:</span> <span id="detail-transaction-change"></span></div>
            <div class="button-group" style="justify-content: center;">
                <button class="info" id="close-detail-modal-btn"><i data-feather="x"></i> Tutup</button>
                <button class="primary" id="print-receipt-btn"><i data-feather="printer"></i> Cetak Struk</button>
            </div>
        </div>
    </div>

    <div id="editExpenseModal" class="modal">
        <div class="modal-content">
            <span class="close-button" title="Tutup Modal">&times;</span>
            <h3>Edit Pengeluaran</h3>
            <div class="form-group">
                <label for="modal-expense-id">ID Pengeluaran:</label>
                <input type="text" id="modal-expense-id" readonly>
            </div>
            <div class="form-group">
                <label for="modal-expense-date">Tanggal:</label>
                <input type="date" id="modal-expense-date">
            </div>
            <div class="form-group">
                <label for="modal-expense-category">Kategori:</label>
                <input type="text" id="modal-expense-category">
            </div>
            <div class="form-group">
                <label for="modal-expense-description">Deskripsi:</label>
                <textarea id="modal-expense-description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="modal-expense-amount">Jumlah (Rp):</label>
                <input type="number" id="modal-expense-amount" min="0">
            </div>
            <div class="button-group">
                <button class="secondary" id="cancel-expense-edit-btn"><i data-feather="x-circle"></i> Batal</button>
                <button class="primary" id="save-expense-btn"><i data-feather="save"></i> Simpan Perubahan</button>
            </div>
        </div>
    </div>


    <div id="printReceiptContent" class="print-receipt-content" style="display:none;"></div>

    <div id="aboutUsModal" class="modal">
        <div class="modal-content">
            <span class="close-button" title="Tutup Modal">&times;</span>
            <h3><i data-feather="info"></i> Tentang Akuntansi Pintar</h3>
            <p><strong>Akuntansi Pintar</strong> versi 1.0.0</p>
            <p>Aplikasi ini dirancang untuk membantu para UMKM dalam hal pencatatan data keuangan usaha.</p>
            <p><strong>Pengembang Utama:</strong> Bagus Fathur</p>
            <p style="margin-left: 20px;">
                Telp: 087800149808<br>
                Email: <a href="mailto:fathurb100@gmail.com">fathurb100@gmail.com</a><br>
                TikTok: <a href="https://www.tiktok.com/@arcofartur" target="_blank">@arcofartur</a><br>
                Instagram: <a href="https://www.instagram.com/fathur_rc" target="_blank">fathur_Rc</a>
            </p>
            <p><strong>Berkolaborasi dengan:</strong> AI Gemini</p>
            <p><strong>Pengkoreksi:</strong> Yuniar Rachmalita</p>
            <p style="margin-left: 20px;">
                Email: <a href="mailto:yuniarrachmalita711@gmail.com">yuniarrachmalita711@gmail.com</a><br>
                TikTok: <a href="https://www.tiktok.com/@its_niarlt" target="_blank">@its_niarlt</a><br>
                Instagram: <a href="https://www.instagram.com/niarchmlt._" target="_blank">niarchmlt._</a>
            </p>
            <p><strong>Toko Penguji Pertama:</strong> Sinar Photo Copy</p>
            <p style="margin-left: 20px;">
                WhatsApp: <a href="https://wa.me/6285232347655" target="_blank">+62 852-3234-7655</a>
            </p>
            <div class="button-group" style="margin-top: 30px;">
                <button class="info" id="close-about-us-modal-btn"><i data-feather="x"></i> Tutup</button>
            </div>
        </div>
    </div>


    <footer>
        <p>&copy; 2025 <span id="footer-company-name">Akuntansi Pintar</span>. <a href="#" id="about-us-link">Tentang Kami</a>. Hak cipta dilindungi.</p>
    </footer>

    <script>
        // Inisialisasi Feather Icons saat DOM siap
        document.addEventListener('DOMContentLoaded', () => {
            feather.replace();
            // Optional: Remove clear localStorage line after initial testing
            // localStorage.clear();
        });

        // --- DATA APLIKASI (SIMULASI DATABASE LOKAL DENGAN LOCALSTORAGE) ---
        // Data inisial jika localStorage kosong
        let users = JSON.parse(localStorage.getItem('users')) || [
            { username: 'admin', password: 'admin123', role: 'admin' }
        ];
        let currentUser = null; // Will store the currently logged-in user

        // Daftar produk direset menjadi kosong saat inisialisasi
        let products = JSON.parse(localStorage.getItem('products')) || [];

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

        let companyName = localStorage.getItem('companyName') || 'Akuntansi Pintar';

        // --- ELEMEN DOM ---
        const appCompanyNameDisplay = document.getElementById('app-company-name');
        const footerCompanyNameDisplay = document.getElementById('footer-company-name');
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        // Login Modal Elements
        const loginModal = document.getElementById('loginModal');
        const loginUsernameInput = document.getElementById('login-username');
        const loginPasswordInput = document.getElementById('login-password');
        const loginBtn = document.getElementById('login-btn');
        const loginCompanyNameDisplay = document.getElementById('login-company-name-display');

        // Kasir Tab Elements
        // NEW: Barcode Scanner Elements
        const barcodeScannerVideo = document.getElementById('barcode-scanner-video');
        const barcodeScannerOverlay = document.getElementById('barcode-scanner-overlay');
        const barcodeManualInput = document.getElementById('barcode-manual-input');
        const startScanBtn = document.getElementById('start-scan-btn');
        const stopScanBtn = document.getElementById('stop-scan-btn');
        const addByManualCodeBtn = document.getElementById('add-by-manual-code-btn');
        let scannerInitialized = false; // Flag to track scanner state

        const categoryFilter = document.getElementById('category-filter');
        const productSelect = document.getElementById('product-select');
        const productNameInput = document.getElementById('product-name');
        const productPriceInput = document.getElementById('product-price');
        const productStockDisplay = document.getElementById('product-stock-display');
        const productQuantityInput = document.getElementById('product-quantity');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const clearInputBtn = document.getElementById('clear-input-btn');
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalSpan = document.getElementById('subtotal');
        const discountType = document.getElementById('discount-type');
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
        const newProductCategoryInput = document.getElementById('new-product-category');
        const newProductCostPriceInput = document.getElementById('new-product-cost-price');
        const newProductPriceInput = document.getElementById('new-product-price');
        const newProductMarkupPercentageInput = document.getElementById('new-product-markup-percentage');
        const newProductStockInput = document.getElementById('new-product-stock');
        const newProductMinStockInput = document.getElementById('new-product-min-stock'); // New
        const addNewProductBtn = document.getElementById('add-new-product-btn');
        const productListBody = document.getElementById('product-list-body');
        const productTable = document.getElementById('product-table'); // Added ID for export

        // Pengeluaran Tab Elements
        const expenseDateInput = document.getElementById('expense-date');
        const expenseCategoryInput = document.getElementById('expense-category');
        const expenseDescriptionInput = document.getElementById('expense-description');
        const expenseAmountInput = document.getElementById('expense-amount');
        const addExpenseBtn = document.getElementById('add-expense-btn');
        const expenseListBody = document.getElementById('expense-list-body');
        const expenseTable = document.getElementById('expense-table'); // Added ID for export

        // Laporan Tab Elements
        const reportDateFilter = document.getElementById('report-date-filter');
        const transactionListBody = document.getElementById('transaction-list-body');
        const transactionTable = document.getElementById('transaction-table'); // Added ID for export

        // Rekapan Tab Elements
        const recapRevenueSpan = document.getElementById('recap-revenue');
        const recapCostOfGoodsSpan = document.getElementById('recap-cost-of-goods');
        const recapTotalExpenseSpan = document.getElementById('recap-total-expense');
        const recapProfitSpan = document.getElementById('recap-profit');
        const recapSummaryContent = document.getElementById('recap-summary-content'); // Added ID for export

        // Chart Elements (New)
        const incomeTrendChartCanvas = document.getElementById('incomeTrendChart');
        const chartEmptyMessage = document.getElementById('chart-empty-message');
        const chartFilter = document.getElementById('chart-filter');
        let incomeChartInstance = null; // To store the Chart.js instance

        // Notification Area
        const notificationArea = document.getElementById('notification-area');

        // Modal Elements (Edit Product)
        const editProductModal = document.getElementById('editProductModal');
        const closeEditModalBtn = editProductModal ? editProductModal.querySelector('.close-button') : null;
        const modalProductId = document.getElementById('modal-product-id');
        const modalProductName = document.getElementById('modal-product-name');
        const modalProductCategory = document.getElementById('modal-product-category');
        const modalProductCostPrice = document.getElementById('modal-product-cost-price');
        const modalProductPrice = document.getElementById('modal-product-price');
        const modalProductMarkupPercentage = document.getElementById('modal-product-markup-percentage');
        const modalProductStock = document.getElementById('modal-product-stock');
        const modalProductMinStock = document.getElementById('modal-product-min-stock'); // New
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const saveProductBtn = document.getElementById('save-product-btn');

        // Modal Elements (Stock Adjustment) - NEW
        const stockAdjustmentModal = document.getElementById('stockAdjustmentModal');
        const closeStockAdjustmentBtn = stockAdjustmentModal ? stockAdjustmentModal.querySelector('.close-button') : null;
        const stockModalTitle = document.getElementById('stock-modal-title');
        const stockProductNameDisplay = document.getElementById('stock-product-name-display');
        const stockProductIdDisplay = document.getElementById('stock-product-id-display');
        const currentStockDisplay = document.getElementById('current-stock-display');
        const stockAdjustmentType = document.getElementById('stock-adjustment-type');
        const stockAdjustmentQuantity = document.getElementById('stock-adjustment-quantity');
        const stockAdjustmentReason = document.getElementById('stock-adjustment-reason');
        const cancelStockAdjustmentBtn = document.getElementById('cancel-stock-adjustment-btn');
        const saveStockAdjustmentBtn = document.getElementById('save-stock-adjustment-btn');
        let currentStockAdjustProductId = null; // Store product ID for stock adjustment

        // Modal Elements (Transaction Detail)
        const transactionDetailModal = document.getElementById('transactionDetailModal');
        const closeDetailModalBtn = transactionDetailModal ? transactionDetailModal.querySelector('.close-button') : null;
        const detailTransactionId = document.getElementById('detail-transaction-id');
        const detailTransactionDate = document.getElementById('detail-transaction-date');
        const detailTransactionItems = document.getElementById('detail-transaction-items');
        const detailTransactionSubtotal = document.getElementById('detail-transaction-subtotal');
        const detailTransactionDiscount = document.getElementById('detail-transaction-discount');
        const detailTransactionTotal = document.getElementById('detail-transaction-total');
        const detailTransactionPaid = document.getElementById('detail-transaction-paid');
        const detailTransactionChange = document.getElementById('detail-transaction-change');
        const closeDetailModalFooterBtn = document.getElementById('close-detail-modal-btn');
        const printReceiptBtn = document.getElementById('print-receipt-btn');
        const printReceiptContentDiv = document.getElementById('printReceiptContent');

        // Modal Edit Pengeluaran
        const editExpenseModal = document.getElementById('editExpenseModal');
        const closeExpenseModalBtn = editExpenseModal ? editExpenseModal.querySelector('.close-button') : null;
        const modalExpenseId = document.getElementById('modal-expense-id');
        const modalExpenseDate = document.getElementById('modal-expense-date');
        const modalExpenseCategory = document.getElementById('modal-expense-category');
        const modalExpenseDescription = document.getElementById('modal-expense-description');
        const modalExpenseAmount = document.getElementById('modal-expense-amount');
        const cancelExpenseEditBtn = document.getElementById('cancel-expense-edit-btn');
        const saveExpenseBtn = document.getElementById('save-expense-btn');

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

        // About Us Modal Elements (NEW)
        const aboutUsLink = document.getElementById('about-us-link');
        const aboutUsModal = document.getElementById('aboutUsModal');
        const closeAboutUsModalBtn = document.getElementById('close-about-us-modal-btn');


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
            if (!notificationArea) {
                console.warn("Elemen #notification-area tidak ditemukan. Tidak dapat menampilkan notifikasi.");
                return;
            }

            const notificationDiv = document.createElement('div');
            notificationDiv.className = `notification ${type}`;
            notificationDiv.textContent = message;
            notificationDiv.style.setProperty('--notification-duration', `${duration / 1000}s`);

            notificationArea.appendChild(notificationDiv);

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
            if (appCompanyNameDisplay) appCompanyNameDisplay.textContent = companyName;
            if (footerCompanyNameDisplay) footerCompanyNameDisplay.textContent = companyName;
            if (loginCompanyNameDisplay) loginCompanyNameDisplay.textContent = companyName;
        }

        // --- FUNGSI MANAJEMEN TAB & HAK AKSES ---
        function activateTab(tabId) {
            // Check user role before activating tab
            if (!currentUser) {
                showLoginModal();
                return;
            }

            const allowedTabsAdmin = ['kasir', 'produk', 'pengeluaran', 'laporan', 'rekapan', 'pengaturan'];
            const allowedTabsKasir = ['kasir', 'produk'];

            const allowedTabs = currentUser.role === 'admin' ? allowedTabsAdmin : allowedTabsKasir;

            // Handle unauthorized access attempt by kasir
            if (!allowedTabs.includes(tabId) && currentUser.role === 'kasir') {
                showNotification(`Akses ditolak: Peran ${currentUser.role} tidak diizinkan mengakses tab ini.`, 'error', 4000);
                // Redirect kasir to a permitted tab if they try to access a forbidden one
                if (!tabButtons[0].classList.contains('active')) { // If kasir is not on kasir tab
                    activateTab('kasir'); // Redirect to kasir tab
                }
                return;
            }

            tabButtons.forEach(button => {
                button.classList.remove('active');
                // Hide tabs not allowed for current role
                if (!allowedTabs.includes(button.dataset.tab)) {
                    button.style.display = 'none';
                } else {
                    button.style.display = '';
                }
            });
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
            const activeContent = document.getElementById(tabId);

            if (activeButton) activeButton.classList.add('active');
            if (activeContent) activeContent.classList.add('active');

            // Detach listeners from previous tab to avoid multiple bindings
            if (newProductCostPriceInput) newProductCostPriceInput.removeEventListener('input', updateNewProductMarkup);
            if (newProductPriceInput) newProductPriceInput.removeEventListener('input', updateNewProductMarkup);
            if (modalProductCostPrice) modalProductCostPrice.removeEventListener('input', updateModalProductMarkup);
            if (modalProductPrice) modalProductPrice.removeEventListener('input', updateModalProductMarkup);

            if (tabId === 'produk') {
                renderProductList();
                if (newProductCostPriceInput) newProductCostPriceInput.addEventListener('input', updateNewProductMarkup);
                if (newProductPriceInput) newProductPriceInput.addEventListener('input', updateNewProductMarkup);
                updateNewProductMarkup();
            } else if (tabId === 'pengeluaran') {
                renderExpenseList();
                if(expenseDateInput) expenseDateInput.valueAsDate = new Date().toISOString().split('T')[0];
            } else if (tabId === 'laporan') {
                const today = new Date();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const year = today.getFullYear();
                if (reportDateFilter) reportDateFilter.value = `${year}-${month}`;
                renderTransactionList();
            } else if (tabId === 'kasir') {
                populateCategoryFilter();
                populateProductSelect();
                renderCartItems();
                calculateSummary();
                clearInput();
                // Opsional: Otomatis mulai scanner saat masuk tab Kasir
                // initializeScanner(); // Komentar: Lebih baik biarkan user klik "Mulai Scan"
                if (productSelect) productSelect.focus();
            } else if (tabId === 'rekapan') {
                renderRecapSummary();
                renderIncomeTrendChart(); // Render chart when recap tab is active
            } else if (tabId === 'pengaturan') {
                renderUserList(); // Render user list when settings is active
                if (currentUser && currentUser.role !== 'admin') { // Disable elements if not admin
                    disableSettingsInputs(true);
                    showNotification('Anda harus login sebagai Admin untuk mengelola pengaturan.', 'warning', 4000);
                } else {
                     disableSettingsInputs(false);
                }
                 if (companyNameInput) companyNameInput.value = companyName; // Load current company name
            }

            // NEW: Kontrol Scanner saat berpindah tab
            if (tabId !== 'kasir') {
                stopScanner(); // Pastikan scanner berhenti saat keluar dari tab Kasir
            }

            feather.replace();
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                activateTab(tabId);
            });
        });

        function disableSettingsInputs(disable) {
            if (companyNameInput) companyNameInput.disabled = disable;
            if (saveCompanyNameBtn) saveCompanyNameBtn.disabled = disable;
            if (newUsernameInput) newUsernameInput.disabled = disable;
            if (newPasswordInput) newPasswordInput.disabled = disable;
            if (newUserRoleSelect) newUserRoleSelect.disabled = disable;
            if (addNewUserBtn) addNewUserBtn.disabled = disable;
            if (exportProductsPdfBtn) exportProductsPdfBtn.disabled = disable; // Disable PDF export buttons
            if (exportTransactionsPdfBtn) exportTransactionsPdfBtn.disabled = disable;
            if (exportExpensesPdfBtn) exportExpensesPdfBtn.disabled = disable;
            if (exportRecapPdfBtn) exportRecapPdfBtn.disabled = disable;
            if (exportChartPdfBtn) exportChartPdfBtn.disabled = disable;
            if (clearAllDataBtn) clearAllDataBtn.disabled = disable;
        }

        // --- AUTENTIKASI PENGGUNA ---
        function showLoginModal() {
            if (loginModal) {
                loginModal.classList.add('active');
                loginUsernameInput.focus();
            }
        }

        function hideLoginModal() {
            if (loginModal) {
                loginModal.classList.remove('active');
            }
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const username = loginUsernameInput.value.trim();
                const password = loginPasswordInput.value;

                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    currentUser = user;
                    showNotification(`Selamat datang, ${currentUser.username}! Anda login sebagai ${currentUser.role}.`, 'success');
                    hideLoginModal();
                    activateTab('kasir'); // Auto-activate kasir tab after login
                } else {
                    showNotification('Username atau password salah.', 'error');
                }
            });
        }

        // --- NEW: FUNGSI BARCODE SCANNER ---
        function initializeScanner() {
            if (scannerInitialized) return;

            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: barcodeScannerVideo, // selector of the video element
                    constraints: {
                        width: 640, // Reduced width for better mobile performance
                        height: 480, // Reduced height
                        facingMode: "environment" // Use back camera
                    }
                },
                decoder: {
                    readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader", "code_39_reader"] // Specify barcode types
                },
                locate: true // show AABB-surrounding box
            }, function(err) {
                if (err) {
                    console.error(err);
                    barcodeScannerOverlay.textContent = `Gagal memuat kamera: ${err.message}. Coba refresh atau berikan izin kamera.`;
                    showNotification(`Gagal memuat kamera: ${err.message}. Coba refresh atau berikan izin kamera.`, 'error', 5000);
                    return;
                }
                console.log("Initialization finished. Ready to start");
                barcodeScannerOverlay.style.display = 'none'; // Hide overlay on successful init
                Quagga.start();
                scannerInitialized = true;
                startScanBtn.style.display = 'none';
                stopScanBtn.style.display = 'inline-flex';
                showNotification('Scanner siap! Posisikan barcode di depan kamera.', 'info', 3000);
            });

            Quagga.onDetected(function(result) {
                const code = result.codeResult.code;
                console.log("Barcode detected:", code);
                barcodeManualInput.value = code; // Display detected code
                handleScannedBarcode(code); // Process the scanned barcode
                Quagga.stop(); // Stop scanner after successful detection
                scannerInitialized = false;
                startScanBtn.style.display = 'inline-flex';
                stopScanBtn.style.display = 'none';
                barcodeScannerOverlay.style.display = 'flex'; // Show overlay again
                barcodeScannerOverlay.textContent = 'Scan berhasil! Kode: ' + code;
            });

            Quagga.onProcessed(function(result) {
                const drawingCtx = Quagga.canvas.ctx.overlay;
                const drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.width), parseInt(drawingCanvas.height));
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                        });
                    }
                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                    }
                    if (result.codeResult && result.codeResult.code) {
                         Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                    }
                }
            });
        }

        function stopScanner() {
            if (scannerInitialized) {
                Quagga.stop();
                scannerInitialized = false;
                startScanBtn.style.display = 'inline-flex';
                stopScanBtn.style.display = 'none';
                barcodeScannerOverlay.style.display = 'flex';
                barcodeScannerOverlay.textContent = 'Scanner berhenti.';
                showNotification('Scanner telah dihentikan.', 'info', 2000);
            }
        }

        async function handleScannedBarcode(barcode) {
            const foundProduct = products.find(p => p.id === barcode);

            if (foundProduct) {
                // Automatically select the product in the dropdown and fill fields
                productSelect.value = foundProduct.id;
                productNameInput.value = foundProduct.name;
                productPriceInput.value = foundProduct.price;
                productStockDisplay.value = foundProduct.stock;
                productQuantityInput.value = 1; // Default quantity to 1
                productQuantityInput.max = foundProduct.stock;

                // Automatically add to cart if product is found and in stock
                if (foundProduct.stock > 0) {
                    const quantityToAdd = 1; // Default quantity to add
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
                        populateProductSelect(categoryFilter.value); // Update product list display with new stock
                        saveData();
                        clearInput(); // Clear input fields after auto-add
                    } else {
                        showNotification(`Stok ${foundProduct.name} tidak cukup untuk ditambahkan ke keranjang.`, 'warning');
                    }
                } else {
                     showNotification(`Produk "${foundProduct.name}" sudah habis (Stok 0).`, 'warning');
                }
            } else {
                showNotification(`Produk dengan kode ${barcode} tidak ditemukan.`, 'error', 4000);
                clearInput();
            }
        }

        // --- Event Listeners untuk Barcode Scanner ---
        if (startScanBtn) {
            startScanBtn.addEventListener('click', initializeScanner);
        }

        if (stopScanBtn) {
            stopScanBtn.addEventListener('click', stopScanner);
        }

        if (addByManualCodeBtn) {
            addByManualCodeBtn.addEventListener('click', () => {
                const manualCode = barcodeManualInput.value.trim();
                if (manualCode) {
                    handleScannedBarcode(manualCode);
                } else {
                    showNotification('Masukkan kode produk secara manual.', 'error');
                    barcodeManualInput.focus();
                }
            });
        }

        // Optional: Tambahkan event listener untuk input manual agar bisa pakai Enter
        if (barcodeManualInput) {
            barcodeManualInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const manualCode = barcodeManualInput.value.trim();
                    if (manualCode) {
                        handleScannedBarcode(manualCode);
                    } else {
                        showNotification('Masukkan kode produk secara manual.', 'error');
                    }
                }
            });
        }
        // --- END NEW: FUNGSI BARCODE SCANNER ---

        // --- FUNGSI TAB KASIR ---

        if (discountType) {
            discountType.addEventListener('change', () => {
                if (discountType.value !== 'none') {
                    discountValueGroup.style.display = 'block';
                } else {
                    discountValueGroup.style.display = 'none';
                    discountValueInput.value = '0';
                }
                calculateSummary();
            });
        }

        if (discountValueInput) {
            discountValueInput.addEventListener('input', calculateSummary);
        }

        function populateCategoryFilter() {
            if (!categoryFilter) return;
            const categories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
            const currentFilter = categoryFilter.value;

            categoryFilter.innerHTML = '<option value="">-- Semua Kategori --</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            if (categories.includes(currentFilter)) {
                categoryFilter.value = currentFilter;
            } else {
                categoryFilter.value = "";
            }
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                const selectedCategory = categoryFilter.value;
                populateProductSelect(selectedCategory);
                clearInput();
            });
        }

        function populateProductSelect(filterCategory = '') {
            if (!productSelect) return;
            productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>';

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
                productSelect.appendChild(option);
            });
        }

        if (productSelect) {
            productSelect.addEventListener('change', () => {
                const selectedProductId = productSelect.value;
                const selectedProduct = products.find(p => p.id === selectedProductId);

                if (selectedProduct) {
                    productNameInput.value = selectedProduct.name;
                    productPriceInput.value = selectedProduct.price;
                    productStockDisplay.value = selectedProduct.stock;
                    productQuantityInput.value = 1;
                    productQuantityInput.max = selectedProduct.stock;
                    productQuantityInput.focus();
                } else {
                    clearInput();
                }
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const selectedProductId = productSelect.value;
                const quantity = parseInt(productQuantityInput.value) || 0;

                if (!selectedProductId) {
                    showNotification('Pilih produk terlebih dahulu.', 'error');
                    productSelect.focus();
                    return;
                }
                if (isNaN(quantity) || quantity <= 0) {
                    showNotification('Masukkan jumlah yang valid (lebih dari 0).', 'error');
                    productQuantityInput.focus();
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
                    productQuantityInput.focus();
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
                clearInput();
                populateProductSelect(categoryFilter.value);
                saveData();
                productSelect.focus();
            });
        }

        if (clearInputBtn) {
            clearInputBtn.addEventListener('click', () => {
                clearInput();
                showNotification('Input produk telah dibersihkan.', 'info');
                productSelect.focus();
            });
        }

        function clearInput() {
            productSelect.value = '';
            productNameInput.value = '';
            productPriceInput.value = '';
            productStockDisplay.value = '';
            productQuantityInput.value = 1;
            productQuantityInput.max = 9999;
            barcodeManualInput.value = ''; // NEW: Clear barcode input
            barcodeScannerOverlay.textContent = 'Memuat kamera... Pastikan izin diberikan.'; // NEW: Reset scanner overlay text
        }

        function renderCartItems() {
            if (!cartItemsContainer) return;
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Keranjang kosong. Pilih produk dari daftar.</p>';
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
                cartItemsContainer.appendChild(cartItemDiv);
            });
            feather.replace();
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
                populateProductSelect(categoryFilter.value);
                saveData();
            }
        }

        function calculateSummary() {
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.quantity * item.price;
            });

            let discountAmount = 0;
            const currentDiscountType = discountType ? discountType.value : 'none';
            const currentDiscountValue = discountValueInput ? parseFloat(discountValueInput.value) || 0 : 0;

            if (currentDiscountType === 'percentage') {
                discountAmount = subtotal * (currentDiscountValue / 100);
            } else if (currentDiscountType === 'nominal') {
                discountAmount = currentDiscountValue;
            }
            discountAmount = Math.min(discountAmount, subtotal);


            const total = subtotal - discountAmount;

            if (subtotalSpan) subtotalSpan.textContent = formatRupiah(subtotal);
            if (discountSpan) discountSpan.textContent = formatRupiah(discountAmount);
            if (totalPaymentSpan) totalPaymentSpan.textContent = formatRupiah(total);

            const amountPaid = amountPaidInput ? parseFloat(amountPaidInput.value) || 0 : 0;
            const change = amountPaid - total;
            if (changeAmountSpan) changeAmountSpan.textContent = formatRupiah(change);

            if (changeRow) {
                changeRow.classList.remove('change-negative', 'change-positive');
                if (change < 0) {
                    changeRow.classList.add('change-negative');
                } else {
                    changeRow.classList.add('change-positive');
                }
            }
        }

        if (amountPaidInput) {
            amountPaidInput.addEventListener('input', calculateSummary);
        }

        if (processPaymentBtn) {
            processPaymentBtn.addEventListener('click', () => {
                const totalText = totalPaymentSpan ? totalPaymentSpan.textContent : 'Rp 0';
                const total = parseRupiah(totalText);
                const amountPaid = amountPaidInput ? parseFloat(amountPaidInput.value) || 0 : 0;
                const change = amountPaid - total;
                const currentDiscountAmount = parseRupiah(discountSpan.textContent || 'Rp 0');


                if (cart.length === 0) {
                    showNotification('Keranjang belanja kosong. Tambahkan produk terlebih dahulu.', 'error');
                    return;
                }

                if (amountPaid < total) {
                    showNotification(`Jumlah uang yang dibayarkan kurang. Kurang ${formatRupiah(Math.abs(change))}.`, 'error');
                    amountPaidInput.focus();
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
                if(discountType) discountType.value = 'none';
                if(discountValueInput) discountValueInput.value = '0';
                if(discountValueGroup) discountValueGroup.style.display = 'none';

                calculateSummary();
                if (amountPaidInput) amountPaidInput.value = 0;
                saveData();
                populateProductSelect(categoryFilter.value);
                productSelect.focus();
            });
        }

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
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
                    populateProductSelect(categoryFilter.value);
                    saveData();
                }
            });
        }

        // --- FUNGSI TAB PRODUK ---

        function renderProductList() {
            if (!productListBody) return;
            productListBody.innerHTML = '';

            // Admin can add/edit/delete product
            const productFormContainer = document.querySelector('#produk .product-form-container');
            const productTableActionsHeader = document.querySelector('#produk table thead tr th:last-child');

            if (currentUser && currentUser.role === 'kasir') {
                if (productFormContainer) productFormContainer.style.display = 'none';
                if (productTableActionsHeader) productTableActionsHeader.style.display = 'none';
            } else { // Admin
                if (productFormContainer) productFormContainer.style.display = 'block';
                if (productTableActionsHeader) productTableActionsHeader.style.display = '';
            }

            if (products.length === 0) {
                productListBody.innerHTML = `<tr><td colspan="9" class="empty-table-message">Belum ada produk. Tambahkan produk baru.</td></tr>`;
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

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category || '-'}</td>
                    <td>${formatRupiah(product.costPrice || 0)}</td>
                    <td>${formatRupiah(product.price || 0)}</td>
                    <td>${(product.markupPercentage || 0).toFixed(2)}%</td>
                    <td class="${stockStatusClass}">${stockStatusText}</td>
                    <td>${product.minStock || 0}</td>
                    <td class="table-actions">
                        ${currentUser.role === 'admin' ? `
                        <button class="info" data-id="${product.id}" data-action="edit" title="Edit Produk"><i data-feather="edit-2"></i></button>
                        <button class="secondary" data-id="${product.id}" data-action="stock-in" title="Tambah Stok"><i data-feather="arrow-down-left"></i></button>
                        <button class="secondary" data-id="${product.id}" data-action="stock-out" title="Kurangi Stok"><i data-feather="arrow-up-right"></i></button>
                        <button class="danger" data-id="${product.id}" data-action="delete" title="Hapus Produk"><i data-feather="trash"></i></button>
                        ` : ''}
                    </td>
                `;
                productListBody.appendChild(row);

                // Hide Aksi column for Kasir
                if (currentUser && currentUser.role === 'kasir') {
                    const actionCell = row.querySelector('.table-actions');
                    if (actionCell) actionCell.style.display = 'none';
                }
            });

            // Attach event listeners only if admin
            if (currentUser && currentUser.role === 'admin') {
                productListBody.querySelectorAll('button[data-action="edit"]').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.currentTarget.dataset.id;
                        openEditProductModal(productId);
                    });
                });
                productListBody.querySelectorAll('button[data-action="stock-in"]').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.currentTarget.dataset.id;
                        openStockAdjustmentModal(productId, 'in');
                    });
                });
                productListBody.querySelectorAll('button[data-action="stock-out"]').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.currentTarget.dataset.id;
                        openStockAdjustmentModal(productId, 'out');
                    });
                });
                productListBody.querySelectorAll('button[data-action="delete"]').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.currentTarget.dataset.id;
                        deleteProduct(productId);
                    });
                });
            }
            feather.replace();
        }

        function updateNewProductMarkup() {
            const costPrice = parseFloat(newProductCostPriceInput.value) || 0;
            const sellingPrice = parseFloat(newProductPriceInput.value) || 0;
            const markup = calculateMarkup(costPrice, sellingPrice);
            newProductMarkupPercentageInput.value = markup.toFixed(2);
        }

        if (newProductCostPriceInput) newProductCostPriceInput.addEventListener('input', updateNewProductMarkup);
        if (newProductPriceInput) newProductPriceInput.addEventListener('input', updateNewProductMarkup);

        if (addNewProductBtn) {
            addNewProductBtn.addEventListener('click', () => {
                const name = newProductNameInput.value.trim();
                const category = newProductCategoryInput.value.trim();
                const costPrice = parseFloat(newProductCostPriceInput.value);
                const price = parseFloat(newProductPriceInput.value);
                const markup = parseFloat(newProductMarkupPercentageInput.value);
                const stock = parseInt(newProductStockInput.value);
                const minStock = parseInt(newProductMinStockInput.value) || 0;

                if (!name) { showNotification('Nama produk tidak boleh kosong.', 'error'); newProductNameInput.focus(); return; }
                if (!category) { showNotification('Kategori tidak boleh kosong.', 'error'); newProductCategoryInput.focus(); return; }
                if (isNaN(costPrice) || costPrice < 0) { showNotification('Harga Beli harus angka positif atau nol.', 'error'); newProductCostPriceInput.focus(); return; }
                if (isNaN(price) || price <= 0) { showNotification('Harga Jual harus angka positif.', 'error'); newProductPriceInput.focus(); return; }
                if (price < costPrice) { showNotification('Harga Jual tidak boleh lebih rendah dari Harga Beli.', 'error'); newProductPriceInput.focus(); return; }
                if (isNaN(stock) || stock < 0) { showNotification('Stok harus angka non-negatif.', 'error'); newProductStockInput.focus(); return; }
                if (isNaN(minStock) || minStock < 0) { showNotification('Minimum Stok harus angka non-negatif.', 'error'); newProductMinStockInput.focus(); return; }

                if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                    showNotification(`Produk dengan nama "${name}" sudah ada.`, 'error');
                    newProductNameInput.focus();
                    return;
                }

                // NEW: Use "PROD" + barcode if it's provided in a dedicated input for new product,
                // or generate a simple ID if product has no initial barcode value.
                // For now, let's keep generating an ID for simplicity, assuming a separate barcode generator for physical items.
                // If you want to use the barcode scanner to ADD a new product's ID, that would be a different flow.
                const newProductId = 'PROD' + Date.now().toString().slice(-6);
                products.push({
                    id: newProductId, name: name, costPrice: costPrice, price: price,
                    stock: stock, category: category, markupPercentage: markup, minStock: minStock
                });

                showNotification(`Produk "${name}" berhasil ditambahkan. ID Produk: ${newProductId}`, 'success'); // Show ID
                newProductNameInput.value = '';
                newProductCategoryInput.value = '';
                newProductCostPriceInput.value = '0';
                newProductPriceInput.value = '0';
                newProductMarkupPercentageInput.value = '0.00';
                newProductStockInput.value = '0';
                newProductMinStockInput.value = '0';
                renderProductList();
                populateProductSelect(categoryFilter.value);
                populateCategoryFilter();
                saveData();
                newProductNameInput.focus();
            });
        }

        // --- MODAL PRODUK ---
        function openEditProductModal(productId) {
            const productToEdit = products.find(p => p.id === productId);
            if (productToEdit) {
                modalProductId.value = productToEdit.id;
                modalProductName.value = productToEdit.name;
                modalProductCategory.value = productToEdit.category || '';
                modalProductCostPrice.value = productToEdit.costPrice || 0;
                modalProductPrice.value = productToEdit.price || 0;
                modalProductMarkupPercentage.value = productToEdit.markupPercentage || 0;
                modalProductStock.value = productToEdit.stock || 0;
                modalProductMinStock.value = productToEdit.minStock || 0;

                modalProductCostPrice.removeEventListener('input', updateModalProductMarkup);
                modalProductPrice.removeEventListener('input', updateModalProductMarkup);
                modalProductCostPrice.addEventListener('input', updateModalProductMarkup);
                modalProductPrice.addEventListener('input', updateModalProductMarkup);
                updateModalProductMarkup();

                editProductModal.classList.add('active');
                modalProductName.focus();
            } else {
                showNotification('Produk tidak ditemukan untuk diedit.', 'error');
            }
        }

        function updateModalProductMarkup() {
            const costPrice = parseFloat(modalProductCostPrice.value) || 0;
            const sellingPrice = parseFloat(modalProductPrice.value) || 0;
            const markup = calculateMarkup(costPrice, sellingPrice);
            modalProductMarkupPercentage.value = markup.toFixed(2);
        }

        if (closeEditModalBtn) { closeEditModalBtn.addEventListener('click', () => { editProductModal.classList.remove('active'); }); }
        if (cancelEditBtn) { cancelEditBtn.addEventListener('click', () => { editProductModal.classList.remove('active'); }); }

        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                const id = modalProductId.value;
                const name = modalProductName.value.trim();
                const category = modalProductCategory.value.trim();
                const costPrice = parseFloat(modalProductCostPrice.value);
                const price = parseFloat(modalProductPrice.value);
                const markup = parseFloat(modalProductMarkupPercentage.value);
                const stock = parseInt(modalProductStock.value);
                const minStock = parseInt(modalProductMinStock.value) || 0;


                if (!name) { showNotification('Nama produk tidak boleh kosong.', 'error'); modalProductName.focus(); return; }
                if (!category) { showNotification('Kategori tidak boleh kosong.', 'error'); modalProductCategory.focus(); return; }
                if (isNaN(costPrice) || costPrice < 0) { showNotification('Harga Beli harus angka positif atau nol.', 'error'); modalProductCostPrice.focus(); return; }
                if (isNaN(price) || price <= 0) { showNotification('Harga Jual harus angka positif.', 'error'); modalProductPrice.focus(); return; }
                if (price < costPrice) { showNotification('Harga Jual tidak boleh lebih rendah dari Harga Beli.', 'error'); modalProductPrice.focus(); return; }
                if (isNaN(stock) || stock < 0) { showNotification('Stok harus angka non-negatif.', 'error'); modalProductStock.focus(); return; }
                if (isNaN(minStock) || minStock < 0) { showNotification('Minimum Stok harus angka non-negatif.', 'error'); modalProductMinStock.focus(); return; }


                if (products.some(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== id)) {
                    showNotification(`Produk dengan nama "${name}" sudah ada.`, 'error');
                    modalProductName.focus();
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
                    editProductModal.classList.remove('active');
                    renderProductList();
                    populateProductSelect(categoryFilter.value);
                    populateCategoryFilter();
                    saveData();
                } else {
                    showNotification('Produk gagal diperbarui atau tidak ditemukan.', 'error');
                }
            });
        }

        // --- STOCK ADJUSTMENT MODAL (NEW) ---
        function openStockAdjustmentModal(productId, type) {
            const product = products.find(p => p.id === productId);
            if (!product) {
                showNotification('Produk tidak ditemukan.', 'error');
                return;
            }

            currentStockAdjustProductId = productId;
            stockModalTitle.textContent = type === 'in' ? 'Tambah Stok Produk' : 'Kurangi Stok Produk';
            stockProductNameDisplay.textContent = product.name;
            stockProductIdDisplay.textContent = product.id;
            currentStockDisplay.textContent = product.stock;
            stockAdjustmentType.value = type;
            stockAdjustmentQuantity.value = 1;
            stockAdjustmentQuantity.max = type === 'out' ? product.stock : 99999; // Can't reduce more than current stock
            stockAdjustmentReason.value = '';

            stockAdjustmentModal.classList.add('active');
            stockAdjustmentQuantity.focus();
        }

        if (closeStockAdjustmentBtn) { closeStockAdjustmentBtn.addEventListener('click', () => { stockAdjustmentModal.classList.remove('active'); }); }
        if (cancelStockAdjustmentBtn) { cancelStockAdjustmentBtn.addEventListener('click', () => { stockAdjustmentModal.classList.remove('active'); }); }

        if (saveStockAdjustmentBtn) {
            saveStockAdjustmentBtn.addEventListener('click', () => {
                const productId = currentStockAdjustProductId;
                const type = stockAdjustmentType.value;
                const quantity = parseInt(stockAdjustmentQuantity.value) || 0;
                const reason = stockAdjustmentReason.value.trim();

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
                        stockAdjustmentQuantity.focus();
                        return;
                    }
                    product.stock -= quantity;
                    showNotification(`Stok ${product.name} dikurangi ${quantity}.`, 'info');
                }
                saveData();
                stockAdjustmentModal.classList.remove('active');
                renderProductList(); // Update product list display
                populateProductSelect(categoryFilter.value); // Update product select in kasir tab
            });
        }


        window.addEventListener('click', (event) => {
            // Prevent closing login modal by clicking outside
            if (loginModal && event.target == loginModal && loginModal.classList.contains('active')) {
                // Do nothing, force user to log in
            } else if (editProductModal && event.target == editProductModal) {
                editProductModal.classList.remove('active');
            } else if (stockAdjustmentModal && event.target == stockAdjustmentModal) {
                stockAdjustmentModal.classList.remove('active');
            } else if (transactionDetailModal && event.target == transactionDetailModal) {
                transactionDetailModal.classList.remove('active');
            } else if (editExpenseModal && event.target == editExpenseModal) {
                editExpenseModal.classList.remove('active');
            } else if (aboutUsModal && event.target == aboutUsModal) { // New: Close About Us modal
                aboutUsModal.classList.remove('active');
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
                    renderProductList();
                    populateProductSelect(categoryFilter.value);
                    populateCategoryFilter();
                    saveData();
                } else {
                    showNotification('Produk gagal dihapus atau tidak ditemukan.', 'error');
                }
            }
        }

        // --- FUNGSI TAB PENGELUARAN ---
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                const date = expenseDateInput.value;
                const category = expenseCategoryInput.value.trim();
                const description = expenseDescriptionInput.value.trim();
                const amount = parseFloat(expenseAmountInput.value) || 0;

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
                expenseDateInput.valueAsDate = new Date().toISOString().split('T')[0]; // Reset to today
                expenseCategoryInput.value = '';
                expenseDescriptionInput.value = '';
                expenseAmountInput.value = '0';
                saveData();
                renderExpenseList();
            });
        }

        function renderExpenseList() {
            if (!expenseListBody) return;
            expenseListBody.innerHTML = '';

            // Disable expense actions for Kasir
            const expenseFormContainer = document.querySelector('#pengeluaran > .form-group').closest('.tab-content').children[1]; // Adjust selector if needed
            const expenseTableHead = document.querySelector('#pengeluaran table thead th:last-child');
            if (currentUser && currentUser.role === 'kasir') {
                if (expenseFormContainer) expenseFormContainer.style.display = 'none';
                if (expenseTableHead) expenseTableHead.style.display = 'none'; // Hide Aksi header
            } else {
                if (expenseFormContainer) expenseFormContainer.style.display = 'block';
                if (expenseTableHead) expenseTableHead.style.display = ''; // Show Aksi header
            }


            if (expenses.length === 0) {
                expenseListBody.innerHTML = `<tr><td colspan="6" class="empty-table-message">Belum ada pengeluaran yang tercatat.</p></td></tr>`;
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
                expenseListBody.appendChild(row);

                // Hide Aksi column for Kasir
                if (currentUser && currentUser.role === 'kasir') {
                    const actionCell = row.querySelector('.table-actions');
                    if (actionCell) actionCell.style.display = 'none';
                }
            });
            feather.replace();

            // Attach event listeners only if admin
            if (currentUser && currentUser.role === 'admin') {
                expenseListBody.querySelectorAll('button[data-action="edit-expense"]').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const expenseId = event.currentTarget.dataset.id;
                        openEditExpenseModal(expenseId);
                    });
                });
                expenseListBody.querySelectorAll('button[data-action="delete-expense"]').forEach(button => {
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
                modalExpenseId.value = expenseToEdit.id;
                modalExpenseDate.value = expenseToEdit.date;
                modalExpenseCategory.value = expenseToEdit.category;
                modalExpenseDescription.value = expenseToEdit.description;
                modalExpenseAmount.value = expenseToEdit.amount;

                editExpenseModal.classList.add('active');
            } else {
                showNotification('Pengeluaran tidak ditemukan untuk diedit.', 'error');
            }
        }

        if (closeExpenseModalBtn) { closeExpenseModalBtn.addEventListener('click', () => { editExpenseModal.classList.remove('active'); }); }
        if (cancelExpenseEditBtn) { cancelExpenseEditBtn.addEventListener('click', () => { editExpenseModal.classList.remove('active'); }); }

        if (saveExpenseBtn) {
            saveExpenseBtn.addEventListener('click', () => {
                const id = modalExpenseId.value;
                const date = modalExpenseDate.value;
                const category = modalExpenseCategory.value.trim();
                const description = modalExpenseDescription.value.trim();
                const amount = parseFloat(modalExpenseAmount.value) || 0;

                if (!date || !category || isNaN(amount) || amount <= 0) {
                    showNotification('Mohon lengkapi Tanggal, Kategori, dan Jumlah Pengeluaran dengan benar.', 'error');
                    return;
                }

                const expenseIndex = expenses.findIndex(e => e.id === id);
                if (expenseIndex > -1) {
                    expenses[expenseIndex] = { id: id, date: date, category: category, description: description, amount: amount };
                    showNotification('Pengeluaran berhasil diperbarui.', 'success');
                    editExpenseModal.classList.remove('active');
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

        // --- FUNGSI TAB LAPORAN ---
        if (reportDateFilter) {
            reportDateFilter.addEventListener('change', renderTransactionList);
        }

        function renderTransactionList() {
            if (!transactionListBody) return;
            transactionListBody.innerHTML = '';
            const filterMonthYear = reportDateFilter ? reportDateFilter.value : '';

            // Hide Aksi column for Kasir
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
                transactionListBody.innerHTML = `<tr><td colspan="5" class="empty-table-message">Tidak ada transaksi untuk periode ini.</td></tr>`;
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
                transactionListBody.appendChild(row);

                // Hide Aksi column for Kasir
                if (currentUser && currentUser.role === 'kasir') {
                    const actionCell = row.querySelector('.table-actions');
                    if (actionCell) actionCell.style.display = 'none';
                }
            });
            feather.replace();

            transactionListBody.querySelectorAll('button[data-action="view-details"]').forEach(button => {
                button.addEventListener('click', (event) => {
                    const transactionId = event.currentTarget.dataset.id;
                    viewTransactionDetails(transactionId);
                });
            });
        }

        function viewTransactionDetails(transactionId) {
            const transaction = transactions.find(t => t.id === transactionId);
            if (transaction) {
                detailTransactionId.textContent = transaction.id;
                detailTransactionDate.textContent = transaction.date;
                detailTransactionSubtotal.textContent = formatRupiah(transaction.subtotal);
                detailTransactionDiscount.textContent = formatRupiah(transaction.discount || 0);
                detailTransactionTotal.textContent = formatRupiah(transaction.total);
                detailTransactionPaid.textContent = formatRupiah(transaction.amountPaid);
                detailTransactionChange.textContent = formatRupiah(transaction.change);

                detailTransactionItems.innerHTML = '';
                if (transaction.items && transaction.items.length > 0) {
                    transaction.items.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = `${item.name} x ${item.quantity} (${formatRupiah(item.price)}) = ${formatRupiah(item.quantity * item.price)}`;
                        detailTransactionItems.appendChild(li);
                    });
                } else {
                    detailTransactionItems.innerHTML = '<li>Tidak ada item.</li>';
                }

                transactionDetailModal.classList.add('active');
                feather.replace();
            } else {
                showNotification('Transaksi tidak ditemukan.', 'error');
            }
        }

        if (closeDetailModalBtn) { closeDetailModalBtn.addEventListener('click', () => { transactionDetailModal.classList.remove('active'); }); }
        if (closeDetailModalFooterBtn) { closeDetailModalFooterBtn.addEventListener('click', () => { transactionDetailModal.classList.remove('active'); }); }

        // --- FUNGSI CETAK STRUK ---
        if (printReceiptBtn) {
            printReceiptBtn.addEventListener('click', () => {
                const transactionId = detailTransactionId.textContent;
                printReceipt(transactionId);
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

            printReceiptContentDiv.innerHTML = receiptContent;
            window.print();
        }

        // --- FUNGSI TAB REKAPAN ---

        function renderRecapSummary() {
            let totalRevenue = 0;
            let totalCostOfGoodsSold = 0;
            let totalExpenses = 0;

            transactions.forEach(transaction => {
                totalRevenue += transaction.total;
                totalCostOfGoodsSold += transaction.totalCostPrice;
            });

            expenses.forEach(expense => {
                totalExpenses += expense.amount;
            });


            const netProfit = totalRevenue - totalCostOfGoodsSold - totalExpenses;

            if (recapRevenueSpan) recapRevenueSpan.textContent = formatRupiah(totalRevenue);
            if (recapCostOfGoodsSpan) recapCostOfGoodsSpan.textContent = formatRupiah(totalCostOfGoodsSold);
            if (recapTotalExpenseSpan) recapTotalExpenseSpan.textContent = formatRupiah(totalExpenses);
            if (recapProfitSpan) recapProfitSpan.textContent = formatRupiah(netProfit);

            if (recapProfitSpan && recapProfitSpan.parentElement) {
                recapProfitSpan.parentElement.classList.remove('profit', 'expense');
                if (netProfit >= 0) {
                    recapProfitSpan.parentElement.classList.add('profit');
                } else {
                    recapProfitSpan.parentElement.classList.add('expense');
                }
            }
        }

        // --- FUNGSI CHART.JS ---

        if (chartFilter) {
            chartFilter.addEventListener('change', renderIncomeTrendChart);
        }

        function renderIncomeTrendChart() {
            if (!incomeTrendChartCanvas) return;

            // Destroy existing chart instance if it exists
            if (incomeChartInstance) {
                incomeChartInstance.destroy();
            }

            const chartType = chartFilter.value;
            let labels = [];
            let data = [];
            let chartTitle = '';

            const today = new Date();
            const filteredTransactions = transactions.filter(t => t.total > 0); // Only consider positive total transactions

            if (filteredTransactions.length === 0) {
                incomeTrendChartCanvas.style.display = 'none';
                chartEmptyMessage.style.display = 'block';
                return;
            } else {
                incomeTrendChartCanvas.style.display = 'block';
                chartEmptyMessage.style.display = 'none';
            }

            const dailyData = new Map(); // Date -> Total
            const weeklyData = new Map(); // Week-Year -> Total
            const monthlyData = new Map(); // Month-Year -> Total
            const yearlyData = new Map(); // Year -> Total

            filteredTransactions.forEach(t => {
                const transactionDate = new Date(t.date); // Use the date from transaction data
                const totalAmount = t.total;

                // Daily
                const dateKey = transactionDate.toISOString().split('T')[0];
                dailyData.set(dateKey, (dailyData.get(dateKey) || 0) + totalAmount);

                // Weekly
                const year = transactionDate.getFullYear();
                const startOfWeek = new Date(transactionDate);
                startOfWeek.setDate(transactionDate.getDate() - transactionDate.getDay()); // Sunday as start of week
                const weekKey = `${startOfWeek.toISOString().split('T')[0]}`; // Use start date of week as key
                weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + totalAmount);

                // Monthly
                const monthYearKey = `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}`;
                monthlyData.set(monthYearKey, (monthlyData.get(monthYearKey) || 0) + totalAmount);

                // Yearly
                const yearKey = transactionDate.getFullYear().toString();
                yearlyData.set(yearKey, (yearlyData.get(yearKey) || 0) + totalAmount);
            });

            if (chartType === 'daily') {
                chartTitle = 'Pendapatan Harian (30 Hari Terakhir)';
                // Generate last 30 days
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dateKey = d.toISOString().split('T')[0];
                    labels.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }));
                    data.push(dailyData.get(dateKey) || 0);
                }
            } else if (chartType === 'weekly') {
                chartTitle = 'Pendapatan Mingguan (12 Minggu Terakhir)';
                // Generate last 12 weeks
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - (i * 7) - d.getDay()); // Go back to Sunday of the target week
                    const weekKey = d.toISOString().split('T')[0];
                    labels.push(`Minggu ${d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit'})}`);
                    data.push(weeklyData.get(weekKey) || 0);
                }
            } else if (chartType === 'monthly') {
                chartTitle = 'Pendapatan Bulanan (12 Bulan Terakhir)';
                // Generate last 12 months
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const monthYearKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                    labels.push(d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }));
                    data.push(monthlyData.get(monthYearKey) || 0);
                }
            } else if (chartType === 'yearly') {
                chartTitle = 'Pendapatan Tahunan';
                // Get all years present in data
                const years = Array.from(yearlyData.keys()).sort();
                labels = years;
                data = years.map(year => yearlyData.get(year) || 0);

                if (labels.length === 0) { // If no yearly data, check daily data range to populate labels
                    const minDate = filteredTransactions.length > 0 ? new Date(Math.min(...filteredTransactions.map(t => new Date(t.date)))) : null;
                    const maxDate = filteredTransactions.length > 0 ? new Date(Math.max(...filteredTransactions.map(t => new Date(t.date)))) : null;

                    if (minDate && maxDate) {
                        for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
                            if (!labels.includes(String(year))) {
                                labels.push(String(year));
                                data.push(0); // Add 0 for years with no data
                            }
                        }
                        // Re-sort labels and data to ensure chronological order
                        const combined = labels.map((label, index) => ({ label, value: data[index] }));
                        combined.sort((a, b) => parseInt(a.label) - parseInt(b.label));
                        labels = combined.map(item => item.label);
                        data = combined.map(item => item.value);
                    }
                }
            }

            const ctx = incomeTrendChartCanvas.getContext('2d');
            incomeChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Pendapatan (Rp)',
                        data: data,
                        backgroundColor: 'rgba(184, 134, 11, 0.7)', // primary-gold with opacity
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
                                callback: function(value, index, values) {
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

        // --- FUNGSI PENGATURAN ---
        if (companyNameInput) {
            companyNameInput.addEventListener('input', () => {
                companyName = companyNameInput.value.trim() || 'Akuntansi Pintar';
                updateCompanyNameDisplay();
            });
        }

        if (saveCompanyNameBtn) {
            saveCompanyNameBtn.addEventListener('click', () => {
                companyName = companyNameInput.value.trim() || 'Akuntansi Pintar';
                localStorage.setItem('companyName', companyName);
                updateCompanyNameDisplay();
                showNotification('Nama perusahaan berhasil disimpan!', 'success');
            });
        }

        function renderUserList() {
            if (!userListDisplay) return;
            userListDisplay.innerHTML = '';

            // Filter out the default admin if there are other users
            const nonDefaultUsers = users.filter(user => !(user.username === 'admin' && user.role === 'admin'));

            if (nonDefaultUsers.length === 0) {
                 userListDisplay.innerHTML = `<p class="empty-table-message">Belum ada pengguna lain yang ditambahkan.</p>`;
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

            userListDisplay.appendChild(ul);
            userListDisplay.querySelectorAll('button[data-action="delete-user"]').forEach(button => {
                button.addEventListener('click', (event) => {
                    const usernameToDelete = event.currentTarget.dataset.username;
                    deleteUser(usernameToDelete);
                });
            });
            feather.replace();
        }

        if (addNewUserBtn) {
            addNewUserBtn.addEventListener('click', () => {
                const username = newUsernameInput.value.trim();
                const password = newPasswordInput.value;
                const role = newUserRoleSelect.value;

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
                newUsernameInput.value = '';
                newPasswordInput.value = '';
                newUserRoleSelect.value = 'kasir';
                renderUserList();
            });
        }

        function deleteUser(usernameToDelete) {
            if (usernameToDelete === 'admin') { // Prevents deleting the primary admin
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

        // --- PDF EXPORT FUNCTIONS ---
        async function exportContentToPdf(elementId, filename, title) {
            const currentActiveTab = document.querySelector('.tab-content.active');
            const targetTab = document.getElementById(elementId);
            const targetTabButton = document.querySelector(`[data-tab="${elementId}"]`);

            // Temporarily activate the target tab if it's not active
            if (currentActiveTab && currentActiveTab.id !== elementId) {
                currentActiveTab.classList.remove('active');
                if (document.querySelector('.tab-button.active')) {
                    document.querySelector('.tab-button.active').classList.remove('active');
                }
                targetTab.classList.add('active');
                if (targetTabButton) targetTabButton.classList.add('active');
                // Re-render content if necessary (e.g., tables, recaps, charts) to ensure it's up-to-date
                if (elementId === 'produk') renderProductList();
                else if (elementId === 'laporan') renderTransactionList();
                else if (elementId === 'pengeluaran') renderExpenseList();
                else if (elementId === 'rekapan') {
                    renderRecapSummary();
                    renderIncomeTrendChart(); // Ensure chart is rendered for recap tab export
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
            tempDiv.style.width = '210mm'; // A4 width
            tempDiv.style.padding = '15mm';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.fontFamily = 'Poppins, sans-serif'; // Ensure font is consistent
            tempDiv.style.color = '#333';
            tempDiv.style.position = 'absolute'; // Hide temporarily
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
                // For recap, copy the recap-summary div directly
                const recapHtml = recapSummaryContent.outerHTML;
                pdfContentWrapper.innerHTML = recapHtml;

                // Adjust styles for PDF specific recap cards
                pdfContentWrapper.querySelectorAll('.recap-card').forEach(card => {
                    card.style.boxShadow = 'none';
                    card.style.border = '1px solid #eee';
                    card.style.padding = '20px';
                    card.style.marginBottom = '15px'; // Add margin between cards in PDF
                    card.style.transform = 'none';
                });
                pdfContentWrapper.querySelectorAll('.recap-card h3').forEach(h3 => {
                    h3.style.color = '#4A4A4A';
                    h3.style.borderBottom = '1px solid #D3D3D3';
                    h3.style.paddingBottom = '10px';
                    h3.style.marginBottom = '15px';
                });
                pdfContentWrapper.querySelectorAll('.recap-card .amount').forEach(amount => {
                     amount.style.color = '#B8860B'; // Ensure gold color
                     amount.style.fontSize = '2.5em';
                });
                 // Handle specific colors for expense/profit if the original class names apply
                pdfContentWrapper.querySelectorAll('.recap-card.expense .amount').forEach(amount => {
                     amount.style.color = '#E74C3C';
                });
                pdfContentWrapper.querySelectorAll('.recap-card.profit .amount').forEach(amount => {
                     amount.style.color = '#27AE60';
                });


            } else if (elementId === 'produk' || elementId === 'laporan' || elementId === 'pengeluaran') {
                const originalTable = contentToPrint.querySelector('table');
                if (originalTable) {
                    // Clone the table to avoid modifying the live DOM
                    const clonedTable = originalTable.cloneNode(true);

                    // Remove action columns before exporting
                    const headers = clonedTable.querySelectorAll('thead th');
                    const rows = clonedTable.querySelectorAll('tbody tr');

                    // Find index of 'Aksi' column
                    let actionColIndex = -1;
                    headers.forEach((th, index) => {
                        if (th.textContent.trim() === 'Aksi') {
                            actionColIndex = index;
                        }
                    });

                    if (actionColIndex !== -1) {
                        // Remove 'Aksi' header
                        headers[actionColIndex].remove();
                        // Remove corresponding cells in body rows
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells[actionColIndex]) {
                                cells[actionColIndex].remove();
                            }
                        });
                    }

                    // Apply basic table styles for PDF
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

                    // Handle empty table message for PDF
                    if (clonedTable.querySelector('.empty-table-message')) {
                        const emptyMessageRow = clonedTable.querySelector('.empty-table-message').closest('tr');
                        if (emptyMessageRow) {
                            emptyMessageRow.querySelector('td').colSpan = headers.length - (actionColIndex !== -1 ? 1 : 0); // Adjust colspan
                        }
                    }

                    pdfContentWrapper.appendChild(clonedTable);
                }
            } else {
                // Fallback for other sections if needed, or if an element's innerHTML is sufficient
                pdfContentWrapper.innerHTML = contentToPrint.innerHTML;
            }

            try {
                await html2pdf().from(tempDiv).set(options).save();
                showNotification(`Data ${title} berhasil diekspor ke PDF.`, 'success', 4000);
            } catch (error) {
                console.error("Error generating PDF:", error);
                showNotification(`Gagal mengekspor data ${title} ke PDF.`, 'error', 5000);
            } finally {
                // Remove the temporary div
                document.body.removeChild(tempDiv);
                // Revert to the original active tab if it was changed
                if (currentActiveTab && currentActiveTab.id !== elementId) {
                    targetTab.classList.remove('active');
                    if (targetTabButton) targetTabButton.classList.remove('active');
                    currentActiveTab.classList.add('active');
                    if (document.querySelector(`[data-tab="${currentActiveTab.id}"]`)) {
                        document.querySelector(`[data-tab="${currentActiveTab.id}"]`).classList.add('active');
                    }
                     // Ensure the chart is re-rendered with the correct state if the tab was recap
                     if (currentActiveTab.id === 'rekapan') {
                        renderIncomeTrendChart();
                     }
                }
            }
        }

        // Fungsi khusus untuk ekspor Chart ke PDF
        async function exportChartToPdf() {
            if (!incomeTrendChartCanvas || incomeTrendChartCanvas.style.display === 'none') {
                showNotification('Tidak ada data grafik untuk diekspor atau grafik tidak terlihat.', 'warning');
                return;
            }

            const currentActiveTab = document.querySelector('.tab-content.active');
            const targetTab = document.getElementById('rekapan');
            const targetTabButton = document.querySelector(`[data-tab="rekapan"]`);

            // Temporarily activate the recap tab if it's not active
            if (currentActiveTab && currentActiveTab.id !== 'rekapan') {
                currentActiveTab.classList.remove('active');
                if (document.querySelector('.tab-button.active')) {
                    document.querySelector('.tab-button.active').classList.remove('active');
                }
                targetTab.classList.add('active');
                if (targetTabButton) targetTabButton.classList.add('active');
                renderIncomeTrendChart(); // Ensure chart is rendered
            }

            const date = new Date().toLocaleDateString('id-ID');
            const options = {
                margin: 10,
                filename: `Grafik_Pendapatan_${chartFilter.value}_${date}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true, useCORS: true, backgroundColor: '#FFFFFF' }, // Set background for canvas
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Get the chart canvas as an image Data URL
            const chartImage = incomeTrendChartCanvas.toDataURL('image/png', 1.0);

            const tempDiv = document.createElement('div');
            tempDiv.style.width = '210mm'; // A4 width
            tempDiv.style.padding = '15mm';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.fontFamily = 'Poppins, sans-serif';
            tempDiv.style.color = '#333';
            tempDiv.style.position = 'absolute'; // Hide temporarily
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            document.body.appendChild(tempDiv);

            tempDiv.innerHTML = `
                <h1 style="text-align: center; color: #B8860B; margin-bottom: 5px;">${companyName}</h1>
                <h2 style="text-align: center; color: #8B6914; margin-top: 0; margin-bottom: 20px;">Grafik Pendapatan (${chartFilter.options[chartFilter.selectedIndex].text})</h2>
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
                // Remove the temporary div
                document.body.removeChild(tempDiv);
                // Revert to the original active tab if it was changed
                if (currentActiveTab && currentActiveTab.id !== 'rekapan') {
                    targetTab.classList.remove('active');
                    if (targetTabButton) targetTabButton.classList.remove('active');
                    currentActiveTab.classList.add('active');
                    if (document.querySelector(`[data-tab="${currentActiveTab.id}"]`)) {
                        document.querySelector(`[data-tab="${currentActiveTab.id}"]`).classList.add('active');
                    }
                    // Ensure the chart is re-rendered with the correct state if the tab was recap
                    if (currentActiveTab.id === 'rekapan') {
                        renderIncomeTrendChart();
                    }
                }
            }
        }


        if (exportProductsPdfBtn) {
            exportProductsPdfBtn.addEventListener('click', () => {
                if (products.length === 0) {
                    showNotification('Tidak ada data produk untuk diekspor.', 'warning');
                    return;
                }
                exportContentToPdf('produk', 'Daftar Produk', 'Produk');
            });
        }

        if (exportTransactionsPdfBtn) {
            exportTransactionsPdfBtn.addEventListener('click', () => {
                if (transactions.length === 0) {
                    showNotification('Tidak ada data transaksi untuk diekspor.', 'warning');
                    return;
                }
                exportContentToPdf('laporan', 'Laporan Penjualan', 'Laporan Penjualan');
            });
        }

        if (exportExpensesPdfBtn) {
            exportExpensesPdfBtn.addEventListener('click', () => {
                if (expenses.length === 0) {
                    showNotification('Tidak ada data pengeluaran untuk diekspor.', 'warning');
                    return;
                }
                exportContentToPdf('pengeluaran', 'Daftar Pengeluaran', 'Pengeluaran');
            });
        }

        if (exportRecapPdfBtn) {
            exportRecapPdfBtn.addEventListener('click', () => {
                exportContentToPdf('rekapan', 'Rekapan Keuangan', 'Rekapan Keuangan');
            });
        }

        if (exportChartPdfBtn) {
            exportChartPdfBtn.addEventListener('click', exportChartToPdf);
        }

        function clearAllData() {
            if (confirm('PERINGATAN: Anda yakin ingin menghapus SEMUA data aplikasi? Ini termasuk produk, keranjang, transaksi, pengeluaran, dan pengguna lain. Tindakan ini TIDAK DAPAT DIBATALKAN!')) {
                localStorage.clear();
                // Reset in-memory data
                products = [];
                cart = [];
                transactions = [];
                expenses = [];
                users = [{ username: 'admin', password: 'admin123', role: 'admin' }]; // Reset users to default admin only
                companyName = 'Akuntansi Pintar'; // Reset company name

                showNotification('Semua data aplikasi berhasil dihapus.', 'success', 5000);
                updateCompanyNameDisplay(); // Update company name in UI
                activateTab('kasir'); // Kembali ke tab kasir setelah reset
                showLoginModal(); // Force re-login
            }
        }

        if (clearAllDataBtn) {
            clearAllDataBtn.addEventListener('click', clearAllData);
        }

        // --- ABOUT US MODAL FUNCTIONS (NEW) ---
        if (aboutUsLink) {
            aboutUsLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                aboutUsModal.classList.add('active');
                feather.replace(); // Re-render icons if any in modal
            });
        }

        if (closeAboutUsModalBtn) {
            closeAboutUsModalBtn.addEventListener('click', () => {
                aboutUsModal.classList.remove('active');
            });
        }

        // --- INISIALISASI APLIKASI ---
        document.addEventListener('DOMContentLoaded', () => {
            let needsUpdate = false;

            // Data Migration/Initialization for new properties
            products = products.map(p => {
                if (p.costPrice === undefined || p.costPrice === null || isNaN(p.costPrice)) { p.costPrice = 0; needsUpdate = true; }
                if (p.price === undefined || p.price === null || isNaN(p.price)) { p.price = 0; needsUpdate = true; }
                if (p.markupPercentage === undefined || p.markupPercentage === null || isNaN(p.markupPercentage) || !isFinite(p.markupPercentage)) {
                    p.markupPercentage = calculateMarkup(p.costPrice, p.price); needsUpdate = true; }
                if (p.category === undefined || p.category === null || p.category.trim() === '') { p.category = 'Umum'; needsUpdate = true; }
                if (p.minStock === undefined || p.minStock === null || isNaN(p.minStock)) { p.minStock = 0; needsUpdate = true; } // New default for minStock
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

            // Users migration: ensure default admin exists and other users have role
            let adminExists = users.some(u => u.username === 'admin' && u.role === 'admin');
            if (!adminExists) {
                users.push({ username: 'admin', password: 'admin123', role: 'admin' });
                needsUpdate = true;
            }
            users = users.map(u => {
                if (!u.role) { u.role = 'kasir'; needsUpdate = true; } // Default role if not set
                return u;
            });


            if (needsUpdate) { saveData(); }

            updateCompanyNameDisplay(); // Initialize company name in header/footer/login modal
            showLoginModal(); // Always start with the login modal
        });
    </script>
</body>
</html>
