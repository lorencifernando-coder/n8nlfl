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
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); } catch (e) {}
  var cfg = {};
  for (var k in DEFAULTS) cfg[k] = (stored[k] !== undefined && stored[k] !== null) ? stored[k] : DEFAULTS[k];
  return cfg;
}

function setConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

function resetConfigStore() {
  localStorage.removeItem(CONFIG_KEY);
}

/* Exporta a configuração como arquivo JSON para backup / publicação */
function exportConfig() {
  var cfg = getConfig();
  var blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'lfl-config-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Importa configuração de um arquivo JSON */
function importConfig(file, done) {
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var data = JSON.parse(reader.result);
      var cfg = getConfig();
      for (var k in DEFAULTS) if (data[k] !== undefined) cfg[k] = data[k];
      setConfig(cfg);
      done && done(true);
    } catch (e) {
      done && done(false);
    }
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
