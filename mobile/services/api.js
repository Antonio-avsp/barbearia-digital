const API_URL = 'https://barbearia-backend.onrender.com/api';

export async function fetchServicos() {
  const response = await fetch(`${API_URL}/servicos?ativos=true`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar serviços: ${response.status}`);
  }

  return response.json();
}
