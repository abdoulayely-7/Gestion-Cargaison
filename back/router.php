<?php

$uri = urldecode( parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$file = __DIR__ . '/../front' . $uri;
if ($uri !== '/' && is_file($file)) {
    header("Content-Type: application/javascript");
    readfile($file);
    exit;
}

require_once __DIR__ . '/index.php';
