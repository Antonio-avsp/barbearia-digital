// Para rodar com backend local, troque pela URL da sua máquina na rede,
// ex.: 'http://192.168.0.10:3000/api' (localhost não funciona no Expo Go).
const API_URL = 'https://barbearia-backend.onrender.com/api';

// Timeout alto para tolerar o cold start do Render gratuito (~50s)
const TIMEOUT_MS = 70000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        'O servidor não respondeu. Verifique sua conexão ou se a API está no ar e tente novamente.'
      );
    }
    throw new Error('Falha de rede ao conectar com a API. Verifique sua internet.');
  } finally {
    clearTimeout(timer);
  }

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
