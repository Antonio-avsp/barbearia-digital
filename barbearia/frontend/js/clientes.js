// ── CLIENTES ─────────────────────────────────────────
const clientes = (() => {
  let todos = [];
  let editId = null;

  const formCard  = document.getElementById('form-clientes');
  const tbody     = document.getElementById('tbody-clientes');
  const searchEl  = document.getElementById('search-clientes');

  // Abrir / fechar form
  document.getElementById('btn-novo-cliente').addEventListener('click', () => {
    editId = null;
    clearForm();
    formCard.classList.toggle('open');
    if (formCard.classList.contains('open'))
      document.getElementById('form-clientes-title').textContent = 'Novo Cliente';
  });

  document.getElementById('btn-cancelar-cliente').addEventListener('click', () => {
    formCard.classList.remove('open');
    editId = null;
  });

  // Submit
  document.getElementById('form-clientes-el').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      nome:          document.getElementById('cli-nome').value.trim(),
      telefone:      document.getElementById('cli-telefone').value.trim(),
      email:         document.getElementById('cli-email').value.trim(),
      dataNascimento:document.getElementById('cli-nasc').value || undefined,
      observacoes:   document.getElementById('cli-obs').value.trim()
    };
    try {
      if (editId) {
        await api('PUT', `/clientes/${editId}`, body);
        toast('Cliente atualizado!');
      } else {
        await api('POST', '/clientes', body);
        toast('Cliente cadastrado!');
      }
      formCard.classList.remove('open');
      editId = null;
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  // Busca local
  searchEl.addEventListener('input', () => render(filtrar()));

  // Carregar
  async function load() {
    try {
      todos = await api('GET', '/clientes');
      render(filtrar());
    } catch (e) {
      toast('Erro ao carregar clientes', 'error');
    }
  }

  function filtrar() {
    const q = searchEl.value.toLowerCase();
    if (!q) return todos;
    return todos.filter(c =>
      c.nome.toLowerCase().includes(q) ||
      (c.telefone || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }

  function render(lista) {
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state"><div class="empty-icon">👤</div><p>Nenhum cliente encontrado</p></div>
      </td></tr>`;
      return;
    }
    tbody.innerHTML = lista.map(c => `
      <tr>
        <td class="td-name">${escHtml(c.nome)}</td>
        <td>${escHtml(c.telefone)}</td>
        <td>${escHtml(c.email || '—')}</td>
        <td>${c.dataNascimento ? fmtData(c.dataNascimento) : '—'}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="clientes.editar('${c._id}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm"  onclick="clientes.deletar('${c._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function editar(id) {
    const c = todos.find(x => x._id === id);
    if (!c) return;
    editId = id;
    document.getElementById('cli-nome').value     = c.nome || '';
    document.getElementById('cli-telefone').value = c.telefone || '';
    document.getElementById('cli-email').value    = c.email || '';
    document.getElementById('cli-nasc').value     = c.dataNascimento ? c.dataNascimento.slice(0,10) : '';
    document.getElementById('cli-obs').value      = c.observacoes || '';
    document.getElementById('form-clientes-title').textContent = 'Editar Cliente';
    formCard.classList.add('open');
    formCard.scrollIntoView({ behavior: 'smooth' });
  }

  async function deletar(id) {
    if (!confirm('Confirmar exclusão do cliente?')) return;
    try {
      await api('DELETE', `/clientes/${id}`);
      toast('Cliente removido');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  function clearForm() {
    document.getElementById('form-clientes-el').reset();
  }

  return { load, editar, deletar };
})();
