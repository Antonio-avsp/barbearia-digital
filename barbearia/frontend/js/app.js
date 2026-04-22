// ── CONFIG ──────────────────────────────────────────
const API = 'https://barbearia-digital-x4i4.onrender.com/api';

// ── TOAST ────────────────────────────────────────────
function toast(msg, tipo = 'ok') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.toggle('error', tipo === 'error');
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── NAVEGAÇÃO ────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  document.getElementById('topbar-title').textContent = {
    dashboard:    'Dashboard',
    agendamentos: 'Agendamentos',
    clientes:     'Clientes',
    servicos:     'Serviços',
    barbeiros:    'Barbeiros'
  }[pageId] || pageId;
  closeSidebar();
}

// ── SIDEBAR MOBILE ───────────────────────────────────
function openSidebar() {
  document.querySelector('.sidebar').classList.add('open');
  document.querySelector('.sidebar-overlay').classList.add('open');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('open');
}

// ── HELPERS ──────────────────────────────────────────
function fmtData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDataHora(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function fmtHora(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function fmtMoeda(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── API HELPER ───────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erro na requisição');
  }
  return res.status !== 204 ? res.json() : null;
}

// ── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Navegação por links
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigate(link.dataset.page);
      const mod = link.dataset.page;
      if (mod === 'dashboard')    loadDashboard();
      if (mod === 'clientes')     clientes.load();
      if (mod === 'servicos')     servicos.load();
      if (mod === 'barbeiros')    barbeiros.load();
      if (mod === 'agendamentos') agendamentos.load();
    });
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', openSidebar);
  document.querySelector('.sidebar-overlay').addEventListener('click', closeSidebar);

  // Carregar dashboard inicial
  navigate('dashboard');
  loadDashboard();

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.warn('SW:', err));
  }
});

// ── DASHBOARD ────────────────────────────────────────
async function loadDashboard() {
  try {
    const [clts, svcs, barbs, agends] = await Promise.all([
      api('GET', '/clientes'),
      api('GET', '/servicos'),
      api('GET', '/barbeiros'),
      api('GET', '/agendamentos')
    ]);

    document.getElementById('stat-clientes').textContent    = clts.length;
    document.getElementById('stat-servicos').textContent    = svcs.filter(s => s.ativo).length;
    document.getElementById('stat-barbeiros').textContent   = barbs.filter(b => b.ativo).length;
    document.getElementById('stat-agendamentos').textContent = agends.filter(a =>
      ['agendado','confirmado'].includes(a.status)
    ).length;

    // Próximos agendamentos
    const hoje = new Date();
    const proximos = agends
      .filter(a => new Date(a.dataHora) >= hoje && a.status !== 'cancelado')
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
      .slice(0, 6);

    const listEl = document.getElementById('dash-proximos');
    if (!proximos.length) {
      listEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhum agendamento próximo</p></div>';
    } else {
      listEl.innerHTML = proximos.map(a => `
        <div class="agenda-item">
          <div class="agenda-time">${fmtHora(a.dataHora)}</div>
          <div class="agenda-info">
            <strong>${escHtml(a.cliente?.nome ?? '—')}</strong>
            <span>${escHtml(a.servico?.nome ?? '—')} · ${escHtml(a.barbeiro?.nome ?? '—')}</span>
          </div>
          <span class="status-badge status-${a.status}">${a.status}</span>
        </div>
      `).join('');
    }

    // Serviços populares (mais agendados)
    const svcCount = {};
    agends.forEach(a => {
      if (a.servico) {
        const key = a.servico._id;
        svcCount[key] = svcCount[key] || { nome: a.servico.nome, count: 0 };
        svcCount[key].count++;
      }
    });
    const top = Object.values(svcCount).sort((a,b) => b.count - a.count).slice(0, 5);
    const topEl = document.getElementById('dash-servicos');
    if (!top.length) {
      topEl.innerHTML = '<p style="color:var(--gray);font-size:.85rem">Sem dados ainda</p>';
    } else {
      topEl.innerHTML = top.map(s => `
        <div class="agenda-item">
          <div class="agenda-info">
            <strong>${escHtml(s.nome)}</strong>
            <span>${s.count} agendamento${s.count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error(e);
  }
}
