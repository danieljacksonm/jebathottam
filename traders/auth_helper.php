<?php

function startAppSession()
{
    if (session_status() === PHP_SESSION_NONE) {
        if (!headers_sent()) {
            session_start();
        }
    }
}

function requireSection($section)
{
    startAppSession();

    if (empty($_SESSION['section']) || $_SESSION['section'] !== $section) {
        header('Location: index.php');
        exit;
    }
}

/** For JSON/API endpoints — return 401 instead of HTML redirect */
function requireSectionApi($section)
{
    startAppSession();

    if (empty($_SESSION['section']) || $_SESSION['section'] !== $section) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Login required']);
        exit;
    }
}

function requireAnySection(array $sections)
{
    startAppSession();

    if (empty($_SESSION['section']) || !in_array($_SESSION['section'], $sections, true)) {
        header('Location: index.php');
        exit;
    }
}

function currentSection()
{
    startAppSession();
    return $_SESSION['section'] ?? null;
}

function sectionHomeUrl()
{
    $section = currentSection();
    if (!$section) {
        return 'index.php';
    }

    $config = require __DIR__ . '/sections_config.php';
    return $config[$section]['redirect'] ?? 'index.php';
}
