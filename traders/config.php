<?php
// Set timezone to Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

$host = "db5021049561.hosting-data.io";
$user = "dbu5587847";
$pass = "jhghjbhjftghghj";
$dbname = "dbs15956628";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
