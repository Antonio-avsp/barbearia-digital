// Para rodar com backend local, troque pela URL da sua máquina na rede,
// ex.: 'http://192.168.0.10:3000/api' (localhost não funciona no Expo Go).
const API_URL = 'https://barbearia-backend.onrender.com/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    let message = `Erro na requisição: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch (_) {
      // resposta sem corpo JSON, mantém mensagem padrão
    }
    throw new Error(message);
  }

  return response.json();
}

export function fetchServicos() {
  return request('/servicos');
}

export function createServico(dados) {
  return request('/servicos', { method: 'POST', body: JSON.stringify(dados) });
}

export function updateServico(id, dados) {
  return request(`/servicos/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
}

export function deleteServico(id) {
  return request(`/servicos/${id}`, { method: 'DELETE' });
}
