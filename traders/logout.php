<?php
require_once 'auth_helper.php';
startAppSession();
session_destroy();
header('Location: index.php');
exit;
