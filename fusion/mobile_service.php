<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customer_name = $conn->real_escape_string($_POST['customer_name']);
    $customer_phone = $conn->real_escape_string($_POST['customer_phone']);
    $mobile_brand = $conn->real_escape_string($_POST['mobile_brand']);
    $mobile_model = $conn->real_escape_string($_POST['mobile_model']);
    $mobile_imei = $conn->real_escape_string($_POST['mobile_imei']);
    $problem_description = $conn->real_escape_string($_POST['problem_description']);
    $estimated_cost = floatval($_POST['estimated_cost']);
    $status = $conn->real_escape_string($_POST['status']);

    $sql = "INSERT INTO mobile_service_jobs 
            (customer_name, customer_phone, mobile_brand, mobile_model, mobile_imei, problem_description, estimated_cost, status) 
            VALUES ('$customer_name', '$customer_phone', '$mobile_brand', '$mobile_model', '$mobile_imei', '$problem_description', $estimated_cost, '$status')";

    if ($conn->query($sql)) {
        $service_id = $conn->insert_id;
        header("Location: print_mobile_service.php?service_id=$service_id");
        exit;
    } else {
        $error = "Failed to create service job: " . $conn->error;
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Mobile Service</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #f5576c; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .form-control { margin-bottom: 0.5rem; border-radius: 8px; border: 2px solid #e0e0e0; transition: all 0.3s; }
        .form-control:focus { border-color: #f5576c; box-shadow: 0 0 0 0.2rem rgba(245,87,108,0.25); }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .row { margin-bottom: 0.5rem; }
        .alert { margin-bottom: 1rem; border-radius: 12px; }
        .section-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .section-title { color: #f5576c; font-weight: 700; margin-bottom: 1rem; }
        .input-group-text { background: #f5576c; color: white; border: none; }
        .submit-btn { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; font-size: 1.1rem; padding: 15px; }
        .submit-btn:hover { background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%); }
    </style>
</head>

<body class="container py-4">

    <div class="card p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center card-header-style gap-2">
            <h2 class="mb-0">🔧 Mobile Service Entry</h2>
            <a href="dashboard_mobile.php" class="btn btn-success btn-sm">⬅ Back to Dashboard</a>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>❌</strong> <?= $error ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="section-card">
                <h5 class="section-title">👤 Customer Information</h5>
                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold text-muted">Customer Name *</label>
                        <div class="input-group">
                            <span class="input-group-text">👤</span>
                            <input type="text" name="customer_name" class="form-control" placeholder="Enter customer name" required autofocus>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold text-muted">Customer Phone *</label>
                        <div class="input-group">
                            <span class="input-group-text">📱</span>
                            <input type="text" name="customer_phone" class="form-control" placeholder="Enter phone number" required>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h5 class="section-title">📱 Mobile Device Details</h5>
                <div class="row g-3">
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold text-muted">Mobile Brand *</label>
                        <div class="input-group">
                            <span class="input-group-text">🏭</span>
                            <input type="text" name="mobile_brand" class="form-control" placeholder="e.g., Samsung, Apple, Xiaomi" required>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold text-muted">Mobile Model *</label>
                        <div class="input-group">
                            <span class="input-group-text">📱</span>
                            <input type="text" name="mobile_model" class="form-control" placeholder="e.g., Galaxy S21, iPhone 13" required>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold text-muted">IMEI Number</label>
                        <div class="input-group">
                            <span class="input-group-text">🔢</span>
                            <input type="text" name="mobile_imei" class="form-control" placeholder="15-digit IMEI" maxlength="15">
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h5 class="section-title">🔍 Service Details</h5>
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label fw-bold text-muted">Problem Description *</label>
                        <textarea name="problem_description" class="form-control" rows="4" placeholder="Describe the issue with the mobile in detail" required></textarea>
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold text-muted">Estimated Cost (₹)</label>
                        <div class="input-group">
                            <span class="input-group-text">💰</span>
                            <input type="number" name="estimated_cost" class="form-control" step="0.01" value="0" min="0">
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold text-muted">Service Status</label>
                        <div class="input-group">
                            <span class="input-group-text">📊</span>
                            <select name="status" class="form-control">
                                <option value="Pending">⏳ Pending</option>
                                <option value="In Progress">🔧 In Progress</option>
                                <option value="Completed">✅ Completed</option>
                                <option value="Delivered">📦 Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn submit-btn w-100 text-white fw-bold">💾 Save & Print Service Receipt</button>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
