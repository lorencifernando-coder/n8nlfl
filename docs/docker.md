# Rodar o site em container (Docker)

O site + backend PHP + Apache empacotados em um container. Configuração e
fotos persistem em volumes (sobrevivem a reinícios e atualizações da imagem).

## Subir (2 comandos)

```bash
docker compose up -d --build
```

Acesse:
- Site:   http://localhost:8080
- Painel: http://localhost:8080/admin  (senha padrão: `admin123`)

Parar:
```bash
docker compose down          # mantém os dados (volumes)
docker compose down -v       # apaga também os dados (config + fotos)
```

## O que persiste

Dois volumes nomeados guardam o estado, então rebuilds não apagam nada:

| Volume            | Caminho no container        | Conteúdo                    |
|-------------------|-----------------------------|-----------------------------|
| `lfl_data`        | `/var/www/html/data`        | `config.php` (configuração) |
| `lfl_uploads`     | `/var/www/html/uploads`     | fotos enviadas pelo painel  |

## Atualizar o site

```bash
git pull
docker compose up -d --build   # rebuild; os volumes de dados são preservados
```

## Rodar sem compose (só docker)

```bash
docker build -t lfl-cuidado-e-saude .
docker run -d --name lfl-site -p 8080:80 \
  -v lfl_data:/var/www/html/data \
  -v lfl_uploads:/var/www/html/uploads \
  lfl-cuidado-e-saude
```

## Colocar em produção (VPS)

1. Suba o container num servidor (porta 8080 ou a que preferir).
2. Ponha um **reverse proxy com HTTPS** na frente (Nginx, Caddy ou Traefik)
   apontando `clinicalorenci.com.br` → `http://127.0.0.1:8080`.
   - Caddy resolve o SSL sozinho; exemplo de `Caddyfile`:
     ```
     clinicalorenci.com.br {
         reverse_proxy 127.0.0.1:8080
     }
     ```
3. Aponte o DNS do domínio para o IP do servidor.

## Observações

- A imagem base é `php:8.2-apache`; os `.htaccess` de proteção são
  recriados automaticamente pelo entrypoint caso os volumes iniciem vazios.
- Troque a senha padrão no painel (aba **Segurança**) — ela é salva como
  hash no volume `lfl_data`, não no código.
- Este container é uma alternativa à hospedagem compartilhada (Hostinger).
  Use um **ou** o outro para o mesmo domínio, não os dois ao mesmo tempo.
