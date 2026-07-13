<?php
/* ══════════════════════════════════════════════════════════
   Backend LFL Cuidado e Saúde — biblioteca compartilhada
   Persistência: arquivo JSON no servidor (data/config.json)
   Auth: senha com hash bcrypt + sessão PHP
   ══════════════════════════════════════════════════════════ */

declare(strict_types=1);

// ── Sessão segura ──
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
  'lifetime' => 0,
  'path'     => '/',
  'httponly' => true,
  'samesite' => 'Lax',
  'secure'   => $secure,
]);
session_name('LFLADMIN');
session_start();

// ── Caminhos ──
// O store é um .php que se auto-protege: se alguém abrir pela web, o próprio
// PHP responde 403 e sai antes de revelar o conteúdo (defesa além do .htaccess).
define('DATA_DIR',   __DIR__ . '/../data');
define('STORE_FILE', DATA_DIR . '/config.php');
define('STORE_GUARD', "<?php http_response_code(403); exit('Forbidden'); ?>\n");
define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('UPLOAD_URL', 'uploads'); // relativo à raiz do site

// Senha padrão de fábrica (usada só na criação do store)
define('DEFAULT_PASSWORD', 'admin123');

// ── Saída JSON ──
function json_out($data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

// ── Garante que o store exista (cria com senha padrão) ──
function ensure_store(): array {
  if (!is_dir(DATA_DIR)) { @mkdir(DATA_DIR, 0755, true); }
  if (!is_file(STORE_FILE)) {
    $seed = [
      'password_hash' => password_hash(DEFAULT_PASSWORD, PASSWORD_DEFAULT),
      'config'        => [],
    ];
    save_store($seed);
    return $seed;
  }
  $raw = @file_get_contents(STORE_FILE);
  // remove o prefixo de proteção do PHP antes de ler o JSON
  $raw = preg_replace('/^<\?php.*?\?>\s*/s', '', (string)$raw);
  $data = json_decode($raw ?: 'null', true);
  if (!is_array($data)) {
    $data = ['password_hash' => password_hash(DEFAULT_PASSWORD, PASSWORD_DEFAULT), 'config' => []];
  }
  if (empty($data['password_hash'])) {
    $data['password_hash'] = password_hash(DEFAULT_PASSWORD, PASSWORD_DEFAULT);
  }
  if (!isset($data['config']) || !is_array($data['config'])) {
    $data['config'] = [];
  }
  return $data;
}

function save_store(array $data): bool {
  if (!is_dir(DATA_DIR)) { @mkdir(DATA_DIR, 0755, true); }
  $ok = @file_put_contents(
    STORE_FILE,
    STORE_GUARD . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
    LOCK_EX
  );
  return $ok !== false;
}

// ── Config público (sem segredos) ──
function public_config(array $store): array {
  $cfg = $store['config'] ?? [];
  if (is_array($cfg)) {
    unset($cfg['admin_password'], $cfg['password_hash'], $cfg['new_password']);
  }
  return is_array($cfg) ? $cfg : [];
}

function require_auth(): void {
  if (empty($_SESSION['admin'])) {
    json_out(['ok' => false, 'error' => 'não autenticado'], 401);
  }
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: 'null', true);
  return is_array($data) ? $data : [];
}
