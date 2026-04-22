// ── SERVIÇOS ─────────────────────────────────────────
const servicos = (() => {
  let todos = [];
  let editId = null;

  const formCard = document.getElementById('form-servicos');
  const tbody    = document.getElementById('tbody-servicos');
  const searchEl = document.getElementById('search-servicos');

  document.getElementById('btn-novo-servico').addEventListener('click', () => {
    editId = null;
    document.getElementById('form-servicos-el').reset();
    document.getElementById('form-servicos-title').textContent = 'Novo Serviço';
    formCard.classList.toggle('open');
  });

  document.getElementById('btn-cancelar-servico').addEventListener('click', () => {
    formCard.classList.remove('open');
    editId = null;
  });

  document.getElementById('form-servicos-el').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nome:           document.getElementById('svc-nome').value.trim(),
      descricao:      document.getElementById('svc-desc').value.trim(),
      preco:          parseFloat(document.getElementById('svc-preco').value),
      duracaoMinutos: parseInt(document.getElementById('svc-duracao').value),
      ativo:          document.getElementById('svc-ativo').value === 'true'
    };
    try {
      if (editId) {
        await api('PUT', `/servicos/${editId}`, body);
        toast('Serviço atualizado!');
      } else {
        await api('POST', '/servicos', body);
        toast('Serviço cadastrado!');
      }
      formCard.classList.remove('open');
      editId = null;
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  searchEl.addEventListener('input', () => render(filtrar()));

  async function load() {
    try {
      todos = await api('GET', '/servicos');
      render(filtrar());
    } catch (e) {
      toast('Erro ao carregar serviços', 'error');
    }
  }

  function filtrar() {
    const q = searchEl.value.toLowerCase();
    if (!q) return todos;
    return todos.filter(s => s.nome.toLowerCase().includes(q));
  }

  function render(lista) {
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state"><div class="empty-icon">✂️</div><p>Nenhum serviço encontrado</p></div>
      </td></tr>`;
      return;
    }
    tbody.innerHTML = lista.map(s => `
      <tr>
        <td class="td-name">${escHtml(s.nome)}</td>
        <td>${escHtml(s.descricao || '—')}</td>
        <td class="td-gold">${fmtMoeda(s.preco)}</td>
        <td>${s.duracaoMinutos} min</td>
        <td><span class="${s.ativo ? 'ativo-sim' : 'ativo-nao'}">${s.ativo ? '● Ativo' : '○ Inativo'}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="servicos.editar('${s._id}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm"  onclick="servicos.deletar('${s._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function editar(id) {
    const s = todos.find(x => x._id === id);
    if (!s) return;
    editId = id;
    document.getElementById('svc-nome').value    = s.nome || '';
    document.getElementById('svc-desc').value    = s.descricao || '';
    document.getElementById('svc-preco').value   = s.preco || '';
    document.getElementById('svc-duracao').value = s.duracaoMinutos || '';
    document.getElementById('svc-ativo').value   = String(s.ativo);
    document.getElementById('form-servicos-title').textContent = 'Editar Serviço';
    formCard.classList.add('open');
    formCard.scrollIntoView({ behavior: 'smooth' });
  }

  async function deletar(id) {
    if (!confirm('Confirmar exclusão do serviço?')) return;
    try {
      await api('DELETE', `/servicos/${id}`);
      toast('Serviço removido');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return { load, editar, deletar };
})();
