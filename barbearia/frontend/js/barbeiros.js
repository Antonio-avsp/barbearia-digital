// ── BARBEIROS ────────────────────────────────────────
const barbeiros = (() => {
  let todos = [];
  let editId = null;

  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const formCard = document.getElementById('form-barbeiros');
  const tbody    = document.getElementById('tbody-barbeiros');
  const searchEl = document.getElementById('search-barbeiros');

  document.getElementById('btn-novo-barbeiro').addEventListener('click', () => {
    editId = null;
    document.getElementById('form-barbeiros-el').reset();
    // Marcar dias úteis por padrão
    document.querySelectorAll('.dia-check').forEach((cb, i) => {
      cb.checked = [1,2,3,4,5].includes(i);
    });
    document.getElementById('form-barbeiros-title').textContent = 'Novo Barbeiro';
    formCard.classList.toggle('open');
  });

  document.getElementById('btn-cancelar-barbeiro').addEventListener('click', () => {
    formCard.classList.remove('open');
    editId = null;
  });

  document.getElementById('form-barbeiros-el').addEventListener('submit', async e => {
    e.preventDefault();
    const diasTrabalho = [];
    document.querySelectorAll('.dia-check').forEach((cb, i) => {
      if (cb.checked) diasTrabalho.push(i);
    });

    const espStr = document.getElementById('barb-especialidades').value.trim();
    const especialidades = espStr ? espStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const body = {
      nome:          document.getElementById('barb-nome').value.trim(),
      telefone:      document.getElementById('barb-telefone').value.trim(),
      email:         document.getElementById('barb-email').value.trim(),
      especialidades,
      horarioInicio: document.getElementById('barb-inicio').value,
      horarioFim:    document.getElementById('barb-fim').value,
      diasTrabalho,
      ativo:         document.getElementById('barb-ativo').value === 'true',
      foto:          document.getElementById('barb-foto').value.trim()
    };

    try {
      if (editId) {
        await api('PUT', `/barbeiros/${editId}`, body);
        toast('Barbeiro atualizado!');
      } else {
        await api('POST', '/barbeiros', body);
        toast('Barbeiro cadastrado!');
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
      todos = await api('GET', '/barbeiros');
      render(filtrar());
    } catch (e) {
      toast('Erro ao carregar barbeiros', 'error');
    }
  }

  function filtrar() {
    const q = searchEl.value.toLowerCase();
    if (!q) return todos;
    return todos.filter(b => b.nome.toLowerCase().includes(q));
  }

  function render(lista) {
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state"><div class="empty-icon">💈</div><p>Nenhum barbeiro encontrado</p></div>
      </td></tr>`;
      return;
    }
    tbody.innerHTML = lista.map(b => `
      <tr>
        <td class="td-name">
          ${b.foto ? `<img src="${escHtml(b.foto)}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;margin-right:8px;vertical-align:middle" onerror="this.style.display='none'">` : ''}
          ${escHtml(b.nome)}
        </td>
        <td>${escHtml(b.telefone || '—')}</td>
        <td>${b.especialidades?.length ? b.especialidades.map(e => `<span style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.25);padding:2px 7px;border-radius:4px;font-size:.72rem;color:var(--gold);margin:2px;display:inline-block">${escHtml(e)}</span>`).join('') : '—'}</td>
        <td>${b.horarioInicio || '—'} – ${b.horarioFim || '—'}</td>
        <td><span class="${b.ativo ? 'ativo-sim' : 'ativo-nao'}">${b.ativo ? '● Ativo' : '○ Inativo'}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="barbeiros.editar('${b._id}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm"  onclick="barbeiros.deletar('${b._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function editar(id) {
    const b = todos.find(x => x._id === id);
    if (!b) return;
    editId = id;
    document.getElementById('barb-nome').value           = b.nome || '';
    document.getElementById('barb-telefone').value       = b.telefone || '';
    document.getElementById('barb-email').value          = b.email || '';
    document.getElementById('barb-especialidades').value = (b.especialidades || []).join(', ');
    document.getElementById('barb-inicio').value         = b.horarioInicio || '08:00';
    document.getElementById('barb-fim').value            = b.horarioFim || '18:00';
    document.getElementById('barb-ativo').value          = String(b.ativo);
    document.getElementById('barb-foto').value           = b.foto || '';
    document.querySelectorAll('.dia-check').forEach((cb, i) => {
      cb.checked = (b.diasTrabalho || []).includes(i);
    });
    document.getElementById('form-barbeiros-title').textContent = 'Editar Barbeiro';
    formCard.classList.add('open');
    formCard.scrollIntoView({ behavior: 'smooth' });
  }

  async function deletar(id) {
    if (!confirm('Confirmar exclusão do barbeiro?')) return;
    try {
      await api('DELETE', `/barbeiros/${id}`);
      toast('Barbeiro removido');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  // Expor lista para uso nos selects de agendamento
  function getTodos() { return todos; }

  return { load, editar, deletar, getTodos };
})();
