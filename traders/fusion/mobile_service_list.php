<?php
include 'config_mobile.php';
require_once 'auth_helper.php';
requireSection('mobile');

// Handle status update
if (isset($_GET['update_status']) && isset($_GET['service_id'])) {
    $service_id = (int)$_GET['service_id'];
    $new_status = $conn->real_escape_string($_GET['update_status']);
    $conn->query("UPDATE mobile_service_jobs SET status = '$new_status' WHERE id = $service_id");
    header("Location: mobile_service_list.php");
    exit;
}

// Fetch mobile service jobs
$result = $conn->query("SELECT id, customer_name, customer_phone, mobile_brand, mobile_model,
                        problem_description, estimated_cost, status, service_date, pdf_file
                        FROM mobile_service_jobs
                        ORDER BY id DESC");

if (!$result) {
    die("Error fetching services: " . $conn->error);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Mobile Service List</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <style>
        body { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); min-height: 100vh; }
        .card { border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; }
        .card-header-style { border-bottom: 2px solid #fa709a; padding-bottom: 1rem; }
        .card-body { padding: 2rem; }
        .table-responsive { margin-top: 1rem; border-radius: 12px; overflow: hidden; }
        .btn { margin: 0.25rem; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .table thead th { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border: none; }
        .table tbody tr:hover { background-color: #fff5f5; }
        .table td { vertical-align: middle; }
        .stats-card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .stat-item { text-align: center; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #fa709a; }
        .stat-label { color: #6c757d; font-size: 0.9rem; }
        .status-pending { background: #ffc107; color: #000; }
        .status-in-progress { background: #0dcaf0; color: white; }
        .status-completed { background: #198754; color: white; }
        .status-delivered { background: #6c757d; color: white; }
    </style>
</head>
<body class="container py-4">
    <div class="card p-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center card-header-style gap-2">
            <h2 class="mb-0">📋 Mobile Service List</h2>
            <div class="d-flex gap-2">
                <a href="mobile_service.php" class="btn btn-success">➕ New Service</a>
                <a href="dashboard_mobile.php" class="btn btn-secondary">⬅ Back to Dashboard</a>
            </div>
        </div>

        <?php
        $totalServices = 0;
        $pendingCount = 0;
        $inProgressCount = 0;
        $completedCount = 0;
        $totalEstimated = 0;
        $result->data_seek(0);
        while ($row = $result->fetch_assoc()) {
            $totalServices++;
            $totalEstimated += $row['estimated_cost'];
            if ($row['status'] == 'Pending') $pendingCount++;
            if ($row['status'] == 'In Progress') $inProgressCount++;
            if ($row['status'] == 'Completed') $completedCount++;
        }
        $result->data_seek(0);
        ?>

        <div class="stats-card">
            <div class="row">
                <div class="col-12 col-md-3 stat-item">
                    <div class="stat-value"><?= $totalServices ?></div>
                    <div class="stat-label">Total Services</div>
                </div>
                <div class="col-12 col-md-3 stat-item">
                    <div class="stat-value text-warning"><?= $pendingCount ?></div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="col-12 col-md-3 stat-item">
                    <div class="stat-value text-info"><?= $inProgressCount ?></div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="col-12 col-md-3 stat-item">
                    <div class="stat-value text-success">₹<?= number_format($totalEstimated, 2) ?></div>
                    <div class="stat-label">Total Est. Cost</div>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Job No</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Mobile</th>
                        <th>Status</th>
                        <th>Est. Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result->num_rows > 0): ?>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <?php
                            $statusClass = '';
                            switch($row['status']) {
                                case 'Pending': $statusClass = 'status-pending'; break;
                                case 'In Progress': $statusClass = 'status-in-progress'; break;
                                case 'Completed': $statusClass = 'status-completed'; break;
                                case 'Delivered': $statusClass = 'status-delivered'; break;
                            }
                            ?>
                            <tr>
                                <td><span class="badge bg-primary">#<?= $row['id'] ?></span></td>
                                <td><?= date('d-m-Y', strtotime($row['service_date'])) ?></td>
                                <td><strong><?= htmlspecialchars($row['customer_name']) ?></strong></td>
                                <td><?= htmlspecialchars($row['customer_phone']) ?></td>
                                <td>
                                    <small class="text-muted d-block"><?= htmlspecialchars($row['mobile_brand']) ?></small>
                                    <strong><?= htmlspecialchars($row['mobile_model']) ?></strong>
                                </td>
                                <td><span class="badge <?= $statusClass ?>"><?= $row['status'] ?></span></td>
                                <td>₹<?= number_format($row['estimated_cost'], 2) ?></td>
                                <td>
                                    <div class="btn-group-vertical btn-group-sm">
                                        <a href="print_mobile_service.php?service_id=<?= $row['id'] ?>" class="btn btn-primary" target="_blank">🖨 Print</a>
                                        <a href="mobile_service_list.php?update_status=In Progress&service_id=<?= $row['id'] ?>" class="btn btn-info">▶ Start</a>
                                        <a href="mobile_service_list.php?update_status=Completed&service_id=<?= $row['id'] ?>" class="btn btn-success">✓ Done</a>
                                        <a href="mobile_service_list.php?update_status=Delivered&service_id=<?= $row['id'] ?>" class="btn btn-secondary">📤 Deliver</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">
                                <div class="fs-5">📭 No services found</div>
                                <small>Create a service to get started</small>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
