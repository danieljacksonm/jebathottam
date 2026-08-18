<?php
/**
 * Fusion Android app download page (public — no login).
 */
$apkRel = 'downloads/yegova-fusion.apk';
$apkPath = __DIR__ . '/' . $apkRel;
$hasApk = is_file($apkPath) && filesize($apkPath) > 1000;
$sizeMb = $hasApk ? number_format(filesize($apkPath) / 1048576, 1) : '0';
$mtime = $hasApk ? date('d-M-Y H:i', filemtime($apkPath)) : '';

if (isset($_GET['file']) && $_GET['file'] === '1' && $hasApk) {
    header('Content-Type: application/vnd.android.package-archive');
    header('Content-Disposition: attachment; filename="Yegova-Fusion.apk"');
    header('Content-Length: ' . filesize($apkPath));
    header('Cache-Control: no-cache');
    readfile($apkPath);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Download Yegova Fusion App</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #0f766e; min-height: 100vh; }
        .card { border-radius: 16px; max-width: 420px; margin: 0 auto; }
    </style>
</head>
<body class="d-flex align-items-center py-4">
    <div class="container">
        <div class="card shadow p-4 text-center">
            <div class="display-6 mb-2">📱</div>
            <h1 class="h3">Yegova Fusion</h1>
            <p class="text-muted mb-3">Android app for Fusion Corner billing (opens the website).</p>

            <?php if ($hasApk): ?>
                <a href="download_app.php?file=1" class="btn btn-success btn-lg w-100 mb-2">
                    ⬇ Download APK (<?= htmlspecialchars($sizeMb) ?> MB)
                </a>
                <p class="small text-muted mb-0">Updated: <?= htmlspecialchars($mtime) ?></p>
                <hr>
                <ol class="text-start small text-muted">
                    <li>Download the APK on your phone</li>
                    <li>Allow “Install unknown apps” for Chrome/Files</li>
                    <li>Open the APK and Install</li>
                    <li>Open <strong>Yegova Fusion</strong> icon</li>
                </ol>
            <?php else: ?>
                <div class="alert alert-warning text-start mb-0">
                    <strong>APK not uploaded yet.</strong><br>
                    Build the app in Android Studio from folder
                    <code>mobile-apps/fusion</code>, then copy
                    <code>app-debug.apk</code> to
                    <code>downloads/yegova-fusion.apk</code> on this server.
                </div>
            <?php endif; ?>

            <a href="index.php" class="btn btn-outline-secondary mt-3 w-100">← Back to Login</a>
        </div>
    </div>
</body>
</html>
