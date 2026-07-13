<?php
/* GET  → devolve a configuração pública (sem senha)
   POST → salva a configuração (requer sessão de admin) */
require __DIR__ . '/_lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$store = ensure_store();

if ($method === 'GET') {
  json_out(['ok' => true, 'config' => public_config($store), 'backend' => true]);
}

if ($method === 'POST') {
  require_auth();
  $incoming = read_json_body();

  // Nunca aceitar hash/segredos vindos do cliente
  $newpw = isset($incoming['new_password']) ? trim((string)$incoming['new_password']) : '';
  unset($incoming['new_password'], $incoming['admin_password'], $incoming['password_hash']);

  // Limite defensivo de tamanho (ex.: evita payloads absurdos)
  if (strlen(json_encode($incoming)) > 5 * 1024 * 1024) {
    json_out(['ok' => false, 'error' => 'configuração muito grande'], 413);
  }

  $store['config'] = $incoming;
  if ($newpw !== '' && strlen($newpw) >= 4) {
    $store['password_hash'] = password_hash($newpw, PASSWORD_DEFAULT);
  }

  if (!save_store($store)) {
    json_out(['ok' => false, 'error' => 'falha ao gravar no servidor (permissão de escrita?)'], 500);
  }
  json_out(['ok' => true, 'config' => public_config($store)]);
}

json_out(['ok' => false, 'error' => 'método não suportado'], 405);
