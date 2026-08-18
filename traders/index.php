<?php
require_once 'auth_helper.php';
startAppSession();

$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>YEGOVA TRADERS — GST Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #141E30, #243B55);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Poppins, sans-serif;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            padding: 35px;
            width: 370px;
            color: white;
        }

        input {
            background: rgba(255, 255, 255, 0.15) !important;
            border: none !important;
            color: white !important;
        }

        input::placeholder {
            color: #ddd !important;
        }

        .btn-custom {
            background: white;
            color: #141E30;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="card shadow-lg">
        <h3 class="text-center mb-4">YEGOVA TRADERS</h3>
        <p class="text-center text-white-50 small mb-3">GST Billing</p>

        <?php if ($error): ?>
            <div class="alert alert-danger p-2 text-center"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form id="loginForm" method="POST" action="section_login.php">
            <div class="mb-3">
                <label>Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password" required autofocus>
            </div>
            <input type="hidden" id="hashed" name="password">
            <button class="btn btn-custom w-100 mt-2">Login</button>
        </form>
        <a href="download_app.php" class="btn btn-outline-light btn-sm w-100 mt-3">📱 Download Android App</a>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            document.getElementById('hashed').value = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
            document.getElementById('password').value = '';
            this.submit();
        });
    </script>
</body>

</html>
