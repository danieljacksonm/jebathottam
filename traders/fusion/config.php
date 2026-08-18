<?php
// Set timezone to Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

$host = "db5018892117.hosting-data.io";
$user = "dbu3475989";
$pass = "coco0c0ccolac0la";
$dbname = "dbs14903137";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
