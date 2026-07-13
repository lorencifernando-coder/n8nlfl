<?php
/* POST (multipart, campo "file") → salva imagem em /uploads e devolve a URL.
   Requer sessão de admin. Valida tipo/tamanho e gera nome único. */
require __DIR__ . '/_lib.php';
require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  json_out(['ok' => false, 'error' => 'método não suportado'], 405);
}
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
  json_out(['ok' => false, 'error' => 'nenhum arquivo recebido'], 400);
}

$file = $_FILES['file'];
if ($file['size'] > 6 * 1024 * 1024) {
  json_out(['ok' => false, 'error' => 'imagem acima de 6 MB'], 413);
}

// Valida que é realmente uma imagem
$info = @getimagesize($file['tmp_name']);
if ($info === false) {
  json_out(['ok' => false, 'error' => 'arquivo não é uma imagem válida'], 415);
}
$allowed = [
  IMAGETYPE_JPEG => 'jpg',
  IMAGETYPE_PNG  => 'png',
  IMAGETYPE_WEBP => 'webp',
  IMAGETYPE_GIF  => 'gif',
];
$type = $info[2] ?? 0;
if (!isset($allowed[$type])) {
  json_out(['ok' => false, 'error' => 'formato não suportado (use JPG, PNG, WEBP ou GIF)'], 415);
}
$ext = $allowed[$type];

if (!is_dir(UPLOAD_DIR)) { @mkdir(UPLOAD_DIR, 0755, true); }
$name = 'img_' . date('Ymd') . '_' . bin2hex(random_bytes(5)) . '.' . $ext;
$dest = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
  json_out(['ok' => false, 'error' => 'falha ao salvar (permissão de escrita em /uploads?)'], 500);
}
@chmod($dest, 0644);

json_out(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);
