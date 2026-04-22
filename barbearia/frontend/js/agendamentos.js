// ── AGENDAMENTOS ─────────────────────────────────────
const agendamentos = (() => {
  let todos = [];
  let editId = null;

  const formCard  = document.getElementById('form-agendamentos');
  const tbody     = document.getElementById('tbody-agendamentos');
  const searchEl  = document.getElementById('search-agendamentos');
  const filtroSts = document.getElementById('filtro-status');

  document.getElementById('btn-novo-agendamento').addEventListener('click', async () => {
    editId = null;
    document.getElementById('form-agendamentos-el').reset();
    document.getElementById('form-agendamentos-title').textContent = 'Novo Agendamento';
    await preencherSelects();
    formCard.classList.toggle('open');
  });

  document.getElementById('btn-cancelar-agendamento').addEventListener('click', () => {
    formCard.classList.remove('open');
    editId = null;
  });

  document.getElementById('form-agendamentos-el').addEventListener('submit', async e => {
    e.preventDefault();
    const body = {
      cliente:     document.getElementById('ag-cliente').value,
      barbeiro:    document.getElementById('ag-barbeiro').value,
      servico:     document.getElementById('ag-servico').value,
      dataHora:    document.getElementById('ag-dataHora').value,
      status:      document.getElementById('ag-status').value,
      observacoes: document.getElementById('ag-obs').value.trim()
    };
    try {
      if (editId) {
        await api('PUT', `/agendamentos/${editId}`, body);
        toast('Agendamento atualizado!');
      } else {
        await api('POST', '/agendamentos', body);
        toast('Agendamento criado!');
      }
      formCard.classList.remove('open');
      editId = null;
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  // Filtros
  searchEl.addEventListener('input',  () => render(filtrar()));
  filtroSts.addEventListener('change',() => render(filtrar()));

  async function preencherSelects() {
    try {
      const [clts, barbs, svcs] = await Promise.all([
        api('GET', '/clientes'),
        api('GET', '/barbeiros?ativos=true'),
        api('GET', '/servicos?ativos=true')
      ]);

      const selCli  = document.getElementById('ag-cliente');
      const selBarb = document.getElementById('ag-barbeiro');
      const selSvc  = document.getElementById('ag-servico');

      selCli.innerHTML  = '<option value="">Selecione o cliente</option>'  + clts.map(c  => `<option value="${c._id}">${escHtml(c.nome)} – ${escHtml(c.telefone)}</option>`).join('');
      selBarb.innerHTML = '<option value="">Selecione o barbeiro</option>' + barbs.map(b => `<option value="${b._id}">${escHtml(b.nome)}</option>`).join('');
      selSvc.innerHTML  = '<option value="">Selecione o serviço</option>'  + svcs.map(s  => `<option value="${s._id}">${escHtml(s.nome)} – ${fmtMoeda(s.preco)}</option>`).join('');
    } catch (e) {
      toast('Erro ao carregar dados para o formulário', 'error');
    }
  }

  async function load() {
    try {
      todos = await api('GET', '/agendamentos');
      render(filtrar());
    } catch (e) {
      toast('Erro ao carregar agendamentos', 'error');
    }
  }

  function filtrar() {
    let lista = [...todos];
    const q   = searchEl.value.toLowerCase();
    const sts = filtroSts.value;
    if (sts)  lista = lista.filter(a => a.status === sts);
    if (q)    lista = lista.filter(a =>
      (a.cliente?.nome  || '').toLowerCase().includes(q) ||
      (a.barbeiro?.nome || '').toLowerCase().includes(q) ||
      (a.servico?.nome  || '').toLowerCase().includes(q)
    );
    return lista.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
  }

  function render(lista) {
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="6">
        <div class="empty-state"><div class="empty-icon">📅</div><p>Nenhum agendamento encontrado</p></div>
      </td></tr>`;
      return;
    }
    tbody.innerHTML = lista.map(a => `
      <tr>
        <td>${fmtDataHora(a.dataHora)}</td>
        <td class="td-name">${escHtml(a.cliente?.nome ?? '—')}</td>
        <td>${escHtml(a.barbeiro?.nome ?? '—')}</td>
        <td>${escHtml(a.servico?.nome ?? '—')}</td>
        <td class="td-gold">${fmtMoeda(a.servico?.preco)}</td>
        <td><span class="status-badge status-${a.status}">${a.status}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="agendamentos.editar('${a._id}')">✏️</button>
            <button class="btn btn-danger btn-sm"  onclick="agendamentos.deletar('${a._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function editar(id) {
    const a = todos.find(x => x._id === id);
    if (!a) return;
    editId = id;
    await preencherSelects();
    document.getElementById('ag-cliente').value  = a.cliente?._id  || '';
    document.getElementById('ag-barbeiro').value = a.barbeiro?._id || '';
    document.getElementById('ag-servico').value  = a.servico?._id  || '';
    document.getElementById('ag-dataHora').value = a.dataHora ? new Date(a.dataHora).toISOString().slice(0,16) : '';
    document.getElementById('ag-status').value   = a.status || 'agendado';
    document.getElementById('ag-obs').value      = a.observacoes || '';
    document.getElementById('form-agendamentos-title').textContent = 'Editar Agendamento';
    formCard.classList.add('open');
    formCard.scrollIntoView({ behavior: 'smooth' });
  }

  async function deletar(id) {
    if (!confirm('Confirmar exclusão do agendamento?')) return;
    try {
      await api('DELETE', `/agendamentos/${id}`);
      toast('Agendamento removido');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return { load, editar, deletar };
})();
