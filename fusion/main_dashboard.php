<?php
include 'config.php';
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Billing System Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        .dashboard-card {
            transition: transform 0.3s, box-shadow 0.3s;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
        .system-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .card-header-custom {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .regular-billing {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .gst-billing {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        .mobile-billing {
            background: linear-gradient(135deg, #fd7e14 0%, #e67e22 100%);
        }
    </style>
</head>

<body class="container py-4">

    <div class="card p-4">
        <div class="text-center mb-5">
            <h1 class="display-4 fw-bold text-primary mb-3">🧾 Billing System</h1>
            <p class="lead text-muted">Choose your billing system type</p>
        </div>

        <div class="row g-4">
            <!-- Regular Billing System -->
            <div class="col-md-4">
                <div class="card dashboard-card h-100">
                    <div class="card-header regular-billing text-white text-center py-3">
                        <div class="system-icon">💳</div>
                        <h4 class="mb-0">Regular Billing</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Standard Billing System</h5>
                        <p class="card-text flex-grow-1">
                            Use the regular billing system for standard invoices without GST calculations. 
                            Perfect for B2C transactions and basic billing needs.
                        </p>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle text-success"></i> Simple billing interface</li>
                            <li><i class="bi bi-check-circle text-success"></i> Quick invoice generation</li>
                            <li><i class="bi bi-check-circle text-success"></i> Stock management</li>
                            <li><i class="bi bi-check-circle text-success"></i> WhatsApp integration</li>
                        </ul>
                        <div class="d-grid gap-2 mt-3">
                            <a href="dashboard_regular.php" class="btn btn-primary btn-lg">
                                🚀 Open Regular Billing
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GST Billing System -->
            <div class="col-md-4">
                <div class="card dashboard-card h-100">
                    <div class="card-header gst-billing text-white text-center py-3">
                        <div class="system-icon">📋</div>
                        <h4 class="mb-0">GST Billing</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">GST Tax Billing System</h5>
                        <p class="card-text flex-grow-1">
                            Use the GST billing system for tax-compliant invoices with CGST, SGST, and CESS calculations. 
                            Ideal for B2B transactions and GST compliance.
                        </p>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle text-success"></i> GST calculations (CGST/SGST/CESS)</li>
                            <li><i class="bi bi-check-circle text-success"></i> HSN/SAC code support</li>
                            <li><i class="bi bi-check-circle text-success"></i> Tax invoices</li>
                            <li><i class="bi bi-check-circle text-success"></i> GST-compliant reports</li>
                        </ul>
                        <div class="d-grid gap-2 mt-3">
                            <a href="dashboard_gst.php" class="btn btn-success btn-lg">
                                🚀 Open GST Billing
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Shop Billing System -->
            <div class="col-md-4">
                <div class="card dashboard-card h-100">
                    <div class="card-header mobile-billing text-white text-center py-3">
                        <div class="system-icon">📱</div>
                        <h4 class="mb-0">Mobile Shop</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Mobile Shop System</h5>
                        <p class="card-text flex-grow-1">
                            Use the mobile shop system for product sales and mobile services. 
                            Prints on left side of A4 paper for easy tearing.
                        </p>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle text-success"></i> Product sales billing</li>
                            <li><i class="bi bi-check-circle text-success"></i> Mobile service tracking</li>
                            <li><i class="bi bi-check-circle text-success"></i> A4 left-side printing</li>
                            <li><i class="bi bi-check-circle text-success"></i> Service job management</li>
                        </ul>
                        <div class="d-grid gap-2 mt-3">
                            <a href="dashboard_mobile.php" class="btn btn-warning btn-lg">
                                🚀 Open Mobile Shop
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats Section -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">📊 Quick Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-primary" id="regularBillsCount">0</h3>
                                    <p class="mb-0">Regular Bills</p>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-success" id="gstBillsCount">0</h3>
                                    <p class="mb-0">GST Bills</p>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-warning" id="mobileSalesCount">0</h3>
                                    <p class="mb-0">Mobile Sales</p>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-info" id="mobileServiceCount">0</h3>
                                    <p class="mb-0">Mobile Services</p>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-secondary" id="totalProductsCount">0</h3>
                                    <p class="mb-0">Products</p>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="p-3">
                                    <h3 class="text-danger" id="totalStockCount">0</h3>
                                    <p class="mb-0">Total Stock</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Info and Logout -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted">
                        <small>Logged in as: <strong><?= htmlspecialchars($_SESSION['user']) ?></strong></small>
                    </div>
                    <a href="download_app.php" class="btn btn-dark btn-sm me-2">
                        📱 Download App
                    </a>
                    <a href="logout.php" class="btn btn-outline-danger btn-sm">
                        🚪 Logout
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load quick stats
        document.addEventListener('DOMContentLoaded', function() {
            // Fetch regular bills count
            fetch('get_dashboard_stats.php?type=regular_bills')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('regularBillsCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching regular bills count:', error));

            // Fetch GST bills count
            fetch('get_dashboard_stats.php?type=gst_bills')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('gstBillsCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching GST bills count:', error));

            // Fetch mobile sales count
            fetch('get_dashboard_stats.php?type=mobile_sales')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('mobileSalesCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching mobile sales count:', error));

            // Fetch mobile service count
            fetch('get_dashboard_stats.php?type=mobile_services')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('mobileServiceCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching mobile service count:', error));

            // Fetch products count
            fetch('get_dashboard_stats.php?type=products')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('totalProductsCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching products count:', error));

            // Fetch total stock count
            fetch('get_dashboard_stats.php?type=stock')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('totalStockCount').textContent = data.count || 0;
                })
                .catch(error => console.error('Error fetching stock count:', error));
        });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
