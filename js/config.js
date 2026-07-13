/* ══════════════════════════════════════════════════════════
   CONFIG COMPARTILHADO — LFL Cuidado e Saúde
   Usado por index.html, admin.html, atualizacoes.html e privacidade.html
   Persistência: localStorage (chave lp_admin_config) + export/import JSON
   ══════════════════════════════════════════════════════════ */

var DEFAULTS = {
  /* ── Links & Agendamento ── */
  booking_url: 'https://agendaronline.amplimed.com.br/luiz-fernando-lorenci',
  whatsapp: '5549999318583',
  website: 'https://www.clinicalorenci.com.br',
  instagram: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  contact_email: 'contato@lflcuidadoesaude.com.br',

  /* ── Valores ── */
  price: 'R$ 350',
  installments: '12x',

  /* ── Analytics ── */
  ga4_id: '',
  gads_id: '',
  gads_label: '',

  /* ── Textos do Hero / CTA / Médico ── */
  hero_title1: 'Vença o esgotamento crônico',
  hero_title2: 'e recupere sua vitalidade.',
  hero_sub: 'Se você arrasta o corpo para o trabalho, sente que sua energia zerou e a desmotivação começou a afetar até quem você ama dentro de casa, saiba: seu corpo não está falhando, ele só está pedindo socorro. É hora de parar de apenas sobreviver.',
  cta_text: 'Quero Agendar Minha Consulta de Acolhimento',
  cta_sub: 'R$ 350 · Online para todo o Brasil',
  doctor_name: 'Dr. Luiz Fernando Lorenci',
  doctor_crm: 'CRMSC 41906',
  doctor_specs: 'Psiquiatria · Urologia · Medicina Integrativa',

  /* ── Fotos principais (upload via admin → data URI, ou caminho/URL) ── */
  photo_hero: '',    /* foto do topo (hero) */
  photo_doctor: '',  /* foto redonda na seção "Sobre o médico" */

  /* ── Vídeos em pontos-chave (URL YouTube, Vimeo ou .mp4; vazio = oculto) ── */
  video_hero: '',
  video_beneficios: '',
  video_autoridade: '',

  /* ── Carrossel de imagens ──
     Cada item: { img: 'url', caption: 'texto' } */
  carousel_enabled: true,
  carousel_title: 'Um espaço pensado para o seu descanso',
  carousel: [],

  /* ── Atualizações médicas (blog) ──
     Cada item: { id, title, date (YYYY-MM-DD), summary, body, img } */
  updates_enabled: true,
  updates: [],

  /* ── Rodapé legal — LFL Cuidado e Saúde ── */
  legal_company: 'LFL Cuidado e Saúde',
  legal_cnpj: '',
  legal_address: 'Florianópolis — SC',
  legal_responsible: 'Dr. Luiz Fernando Lorenci — CRM SC 41906',
  legal_email: 'contato@lflcuidadoesaude.com.br',
  legal_hours: 'Atendimento online, de segunda a sexta',

  /* ── Segurança ── */
  admin_password: 'admin123'
};

var CONFIG_KEY = 'lp_admin_config';

function getConfig() {
  return mergeDefaults(_cfgCache || safeLocal());
}

/* ══════════════════════════════════════════════════════════
   CAMADA DE PERSISTÊNCIA
   - Se o backend PHP (api/) estiver disponível → servidor (compartilhado).
   - Senão (ex.: preview no GitHub Pages) → localStorage (só o navegador).
   ══════════════════════════════════════════════════════════ */

// Caminho da API relativo à página (admin fica em /admin/, resto na raiz)
var API_BASE = (location.pathname.indexOf('/admin/') > -1) ? '../api/' : 'api/';
var _cfgCache = null;      // config já mesclada em memória
var _hasBackend = false;   // servidor PHP disponível?

function mergeDefaults(stored) {
  stored = stored || {};
  var cfg = {};
  for (var k in DEFAULTS) cfg[k] = (stored[k] !== undefined && stored[k] !== null) ? stored[k] : DEFAULTS[k];
  return cfg;
}
function safeLocal() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); } catch (e) { return {}; }
}
function hasBackend() { return _hasBackend; }

/* Carrega a configuração (do servidor, com fallback local). Chama cb(config). */
function loadConfig(cb) {
  fetch(API_BASE + 'config.php', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (res) {
      _hasBackend = true;
      _cfgCache = mergeDefaults(res && res.config ? res.config : {});
      if (cb) cb(_cfgCache);
    })
    .catch(function () {
      _hasBackend = false;
      _cfgCache = mergeDefaults(safeLocal());
      if (cb) cb(_cfgCache);
    });
}

/* Salva a configuração. Chama done(ok, erro). */
function saveConfig(cfg, done) {
  if (_hasBackend) {
    fetch(API_BASE + 'config.php', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg)
    })
    .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
    .then(function (o) {
      if (o.j && o.j.ok) { _cfgCache = mergeDefaults(o.j.config || cfg); done && done(true); }
      else { done && done(false, (o.j && o.j.error) || ('erro ' + o.s)); }
    })
    .catch(function () { done && done(false, 'sem conexão com o servidor'); });
  } else {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
      _cfgCache = mergeDefaults(cfg);
      done && done(true);
    } catch (e) { done && done(false, 'espaço do navegador cheio'); }
  }
}

/* Envia uma imagem. No backend → arquivo real em /uploads (cb recebe a URL).
   Sem backend → data URI (base64) para o preview local. */
function uploadImage(file, done) {
  processImage(file, 1400, function (blob, dataUri) {
    if (_hasBackend) {
      var fd = new FormData();
      fd.append('file', blob, (file.name || 'foto') + '.jpg');
      fetch(API_BASE + 'upload.php', { method: 'POST', credentials: 'same-origin', body: fd })
        .then(function (r) { return r.json(); })
        .then(function (res) { res && res.ok ? done(res.url) : done(null, (res && res.error) || 'falha no upload'); })
        .catch(function () { done(null, 'sem conexão com o servidor'); });
    } else {
      done(dataUri);
    }
  }, done);
}

/* Redimensiona a imagem no navegador → devolve (blobJPEG, dataURI) */
function processImage(file, maxW, cb, errCb) {
  if (!file || !/^image\//.test(file.type)) { errCb && errCb(null, 'selecione uma imagem'); return; }
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, maxW / img.width);
      var w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      var dataUri = canvas.toDataURL('image/jpeg', 0.82);
      canvas.toBlob(function (blob) { cb(blob || dataURItoBlob(dataUri), dataUri); }, 'image/jpeg', 0.82);
    };
    img.onerror = function () { errCb && errCb(null, 'não consegui ler a imagem'); };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function dataURItoBlob(d) {
  var parts = d.split(','), bstr = atob(parts[1]), n = bstr.length, u8 = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: 'image/jpeg' });
}

/* ── Autenticação (admin) ── */
function apiSession(cb) {
  fetch(API_BASE + 'session.php', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (res) { _hasBackend = !!(res && res.backend); cb(res || { backend: false, authenticated: false }); })
    .catch(function () { _hasBackend = false; cb({ backend: false, authenticated: false }); });
}
function apiLogin(password, cb) {
  fetch(API_BASE + 'login.php', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password })
  }).then(function (r) { return r.json(); })
    .then(function (res) { cb(!!(res && res.ok)); })
    .catch(function () { cb(false); });
}
function apiLogout(cb) {
  fetch(API_BASE + 'logout.php', { method: 'POST', credentials: 'same-origin' })
    .then(function () { cb && cb(); }).catch(function () { cb && cb(); });
}

function resetConfigStore() {
  if (_hasBackend) { return saveConfig({}, function () {}); }
  localStorage.removeItem(CONFIG_KEY);
}

/* Exporta a configuração como arquivo JSON para backup */
function exportConfig() {
  var blob = new Blob([JSON.stringify(getConfig(), null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'lfl-config-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Importa configuração de um arquivo JSON (grava no servidor/local) */
function importConfig(file, done) {
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      var cfg = getConfig();
      for (var k in DEFAULTS) if (data[k] !== undefined) cfg[k] = data[k];
      saveConfig(cfg, function (ok) { done && done(ok); });
    } catch (e) { done && done(false); }
  };
  reader.readAsText(file);
}

/* ── Helper: transforma uma URL de vídeo em HTML incorporável ── */
function videoEmbedHTML(url) {
  if (!url) return '';
  url = url.trim();
  var yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    return '<iframe src="https://www.youtube.com/embed/' + yt[1] + '?rel=0" title="Vídeo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }
  var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return '<iframe src="https://player.vimeo.com/video/' + vm[1] + '" title="Vídeo" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return '<video controls preload="metadata" playsinline><source src="' + escAttr(url) + '"></video>';
  }
  // fallback: link
  return '<a href="' + escAttr(url) + '" target="_blank" rel="noopener">Assistir ao vídeo</a>';
}

/* ── Helpers de escape ── */
function escHTML(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return escHTML(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── Data formatada em pt-BR ── */
function formatDatePt(iso) {
  if (!iso) return '';
  var parts = iso.split('-');
  if (parts.length !== 3) return iso;
  var meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var d = parseInt(parts[2], 10), m = parseInt(parts[1], 10), y = parts[0];
  return d + ' ' + (meses[m - 1] || '') + '. ' + y;
}
