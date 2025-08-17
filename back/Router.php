<?php

namespace Back;

class Router
{
    private string $layout;

    public static function init(): array
    {
        return [
            '/' => "connexion/connexion",
            '/dashboard' => "dashboard/dashboard",
            '/tableau' => "tableau/tableau",
            '/recherche' => 'client/recherche',
            '/statistiques' => 'rapport/rapport',
            '/parametres' => 'parametre/parametre',
            '/newcargaison' => 'cargaison/newcargaison',
            '/listecargaison' => 'cargaison/listecargaisons',
        ];
    }

    public function render(string $view): void
    {
        $chemin  = "../front/templates/$view.html";
        $uri = $_SERVER["REQUEST_URI"];
        ob_start();
        if (!file_exists($chemin)) {
            throw new \Exception("View file not found: $view");
        }
        require_once $chemin;
        $containForLayout = ob_get_clean();
        if ($uri == '/' || $uri == '/recherche') {
            $this->layout = 'base.Nolayout.html';
        } else {
            $this->layout = 'base.layout.html';
        }
        require_once "../front/templates/layout/$this->layout";
    }

    public static function resolve(array $routes): void
    {
        $uri = $_SERVER['REQUEST_URI'];
        if (array_key_exists($uri, $routes)) {
            $view = $routes[$uri];
            $router = new self();
            $router->render($view);
        } else {
            http_response_code(404);
            echo "404 Not Found";
        }
    }
}
