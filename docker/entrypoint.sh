#!/bin/sh
set -e

# Recria os .htaccess de proteção caso os volumes de dados estejam vazios
[ -f /var/www/html/data/.htaccess ]     || cp /opt/seed/data.htaccess     /var/www/html/data/.htaccess
[ -f /var/www/html/uploads/.htaccess ]  || cp /opt/seed/uploads.htaccess  /var/www/html/uploads/.htaccess
[ -f /var/www/html/uploads/index.html ] || cp /opt/seed/uploads.index.html /var/www/html/uploads/index.html

# Garante que o PHP consiga gravar configuração e uploads
chown -R www-data:www-data /var/www/html/data /var/www/html/uploads 2>/dev/null || true

exec "$@"
