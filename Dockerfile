# ══════════════════════════════════════════════════════════
#  LFL Cuidado e Saúde — site + backend PHP em um container
#  Apache + PHP 8.2 (suporta .htaccess). Dados persistem em volumes.
# ══════════════════════════════════════════════════════════
FROM php:8.2-apache

# Módulos do Apache necessários para os .htaccess (rewrite/headers/authz)
RUN a2enmod rewrite headers

# Copia o site para o docroot do Apache
COPY . /var/www/html/

# Remove artefatos internos que não devem ir para a imagem
RUN rm -rf /var/www/html/.git /var/www/html/.github /var/www/html/docs \
           /var/www/html/.devcontainer /var/www/html/Dockerfile \
           /var/www/html/docker-compose.yml /var/www/html/.dockerignore \
           /var/www/html/docker 2>/dev/null || true

# Guarda os .htaccess padrão para o entrypoint recriar em volumes vazios
RUN mkdir -p /opt/seed \
 && cp /var/www/html/data/.htaccess       /opt/seed/data.htaccess \
 && cp /var/www/html/uploads/.htaccess    /opt/seed/uploads.htaccess \
 && cp /var/www/html/uploads/index.html   /opt/seed/uploads.index.html

# O PHP (www-data) precisa gravar em data/ e uploads/
RUN chown -R www-data:www-data /var/www/html/data /var/www/html/uploads

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
