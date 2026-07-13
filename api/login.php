<?php
/* POST {password} → valida contra o hash e abre sessão de admin */
require __DIR__ . '/_lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  json_out(['ok' => false, 'error' => 'método não suportado'], 405);
}

$store = ensure_store();
$body = read_json_body();
$pw = isset($body['password']) ? (string)$body['password'] : '';

// Pequeno atraso para dificultar força bruta
usleep(250000);

if ($pw !== '' && password_verify($pw, $store['password_hash'])) {
  session_regenerate_id(true);
  $_SESSION['admin'] = true;
  json_out(['ok' => true]);
}
json_out(['ok' => false, 'error' => 'senha incorreta'], 401);
