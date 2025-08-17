<?php
use Back\Router;
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require_once '../vendor/autoload.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Servir les fichiers statiques (JS, CSS, images)
if (str_starts_with($path, '/dist/') || str_starts_with($path, '/public/')) {
    $file = __DIR__ . '/../front' . $path;

    if (file_exists($file)) {
        // Détection du type MIME
        $mime = mime_content_type($file);
        header("Content-Type: $mime");
        readfile($file);
        exit;
    } else {
        http_response_code(404);
        echo "Static file not found: $file";
        exit;
    }
}

// 2. Sinon → passer au routage PHP
$routes = Router::init();
Router::resolve($routes);
