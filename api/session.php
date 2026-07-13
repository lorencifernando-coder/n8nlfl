<?php
/* GET → informa se o backend existe e se há sessão de admin ativa */
require __DIR__ . '/_lib.php';
ensure_store();
json_out(['backend' => true, 'authenticated' => !empty($_SESSION['admin'])]);
