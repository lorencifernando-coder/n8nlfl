# LFL Cuidado e Saúde — Site + Painel Administrativo

Landing page do Dr. Luiz Fernando Lorenci (burnout / esgotamento) com painel
administrativo, backend próprio, upload de fotos, página de atualizações,
carrossel, vídeos e rodapé legal.

Site estático (HTML/CSS/JS) + **backend PHP** que guarda tudo no servidor.

---

## 📁 Estrutura dos arquivos

```
index.html            → landing page (raiz do site)
admin/index.html      → painel administrativo (fica em /admin)
atualizacoes.html     → página de atualizações médicas
privacidade.html      → política de privacidade (LGPD)
js/config.js          → lógica compartilhada (lê/grava a configuração)
img/                  → coloque aqui fotos fixas (veja img/LEIA-ME.txt)

api/                  → BACKEND PHP (essencial p/ salvar no servidor)
   config.php           lê/grava a configuração
   login.php            valida a senha (hash bcrypt + sessão)
   logout.php / session.php
   upload.php           recebe as fotos
   _lib.php             biblioteca interna
data/                 → onde a configuração é gravada (data/config.php)
   .htaccess            bloqueia acesso externo ao arquivo de dados
uploads/              → onde as fotos enviadas pelo painel ficam
   .htaccess            impede execução de scripts (segurança)

Dockerfile, docker-compose.yml, docker/  → rodar em container (opcional)
docs/docker.md        → guia do container
docs/plano-crescimento-2026.md → plano de marketing / Google Ads
```

---

## 🔑 Acesso ao painel

- Endereço: **`SEU-SITE/admin`**
- Senha padrão: **`admin123`** → troque na aba **Segurança & Backup**
  (a nova senha é salva com hash no servidor, não no código).

No topo do painel há um selo:
- 🟢 **Salvando no servidor** → backend ativo (dados compartilhados por todos).
- 🟡 **Modo preview (só neste navegador)** → o PHP não está ativo / a pasta
  `api/` não foi enviada. Configurações não persistem para os visitantes.

---

## 🚀 Como publicar (escolha 1 das 3 opções)

### Opção A — Hospedagem com PHP (ex.: Hostinger)  ⭐ recomendado p/ você

1. No painel da hospedagem, abra o **Gerenciador de Arquivos** → pasta
   **`public_html`**.
2. Envie e **extraia todo o conteúdo deste zip dentro de `public_html`**,
   mantendo as pastas. Deve ficar assim:
   ```
   public_html/index.html
   public_html/admin/index.html
   public_html/api/…         (ESSENCIAL — não esqueça esta pasta)
   public_html/data/         (começa só com .htaccess)
   public_html/uploads/
   public_html/js/config.js
   ```
3. Garanta que **`data/`** e **`uploads/`** tenham permissão de escrita
   (**755**). Botão direito → Permissões, se necessário.
4. Ative **SSL/HTTPS** grátis no painel (Let's Encrypt / AutoSSL).
5. Acesse `SEU-DOMINIO/admin` e faça login.

> Não precisa enviar: `Dockerfile`, `docker-compose.yml`, `docker/`,
> `.github/`, `docs/`, `CNAME`, `.gitignore`, `.dockerignore`, este `LEIA-ME.md`.
> Eles não atrapalham se subirem, mas não são usados pelo site.

### Opção B — Container Docker (ex.: num VPS)

```bash
docker compose up -d --build
```
Acesse `http://localhost:8080` (painel em `/admin`).
Configuração e fotos persistem em volumes. Para produção, ponha um reverse
proxy com HTTPS na frente. Detalhes em **`docs/docker.md`**.

### Opção C — GitHub Pages (somente preview)

Não roda PHP, então funciona só em **modo preview** (dados no navegador).
Serve para visualizar o layout, não para uso real com persistência.

---

## 🖼️ Fotos e vídeos

- **Pelo painel** (aba *Vídeos & Carrossel*): botão **Enviar foto** para a
  foto do topo, a foto do médico e cada imagem do carrossel. Com backend, as
  fotos viram arquivos reais em `/uploads`.
- **Vídeos**: cole o link do YouTube/Vimeo nos 3 pontos-chave.
- Fotos fixas podem também ser colocadas manualmente em `img/`
  (veja `img/LEIA-ME.txt`).

---

## 📊 Google Analytics / Google Ads

Na aba **Analytics & Ads** do painel, cole:
- **Measurement ID** do GA4 (`G-XXXXXXXXXX`).
- **Conversion ID** e **Label** do Google Ads (`AW-…`).

O site já dispara os eventos de clique, lead e conversão automaticamente.
Estratégia completa em `docs/plano-crescimento-2026.md`.

---

## 💾 Backup

Aba **Segurança & Backup** → **Exportar JSON** salva toda a configuração.
Use **Importar JSON** para restaurar.

---

## Repositório

Código versionado em: `github.com/lorencifernando-coder/n8nlfl`
(branch `n8nlfl_claude`). Cada atualização enviada ao branch publica sozinha
via GitHub Actions (Pages e, quando o segredo FTP estiver configurado,
também na hospedagem).
