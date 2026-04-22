💈 Barbearia Digital — Sistema de Gestão Fullstack
Aplicação fullstack PWA para gerenciamento completo de barbearia: clientes, serviços, barbeiros e agendamentos.

📋 Índice

Estrutura do Projeto
Entidades e Relacionamentos

Cliente
Serviço
Barbeiro ⭐
Agendamento


API REST — Endpoints

Clientes
Serviços
Barbeiros
Agendamentos


Como Rodar Localmente

Pré-requisitos
Backend
Frontend


Deploy — Guia Completo

1. MongoDB Atlas
2. Backend — Render
3. Frontend — Vercel
4. CORS em Produção


PWA — Instalação
Bugs Corrigidos do Projeto Original


🗂️ Estrutura do Projeto
barbearia/
├── backend/
│   ├── controllers/
│   │   ├── agendamentoController.js
│   │   ├── barbeiroController.js
│   │   ├── clienteController.js
│   │   └── servicoController.js
│   ├── models/
│   │   ├── Agendamento.js
│   │   ├── Barbeiro.js       ← Nova entidade obrigatória
│   │   ├── Cliente.js
│   │   └── Servico.js
│   ├── routes/
│   │   ├── agendamentoRoutes.js
│   │   ├── barbeiroRoutes.js
│   │   ├── clienteRoutes.js
│   │   └── servicoRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── css/
    │   └── style.css
    ├── icons/           ← Adicionar icon-192.png e icon-512.png
    ├── js/
    │   ├── app.js
    │   ├── agendamentos.js
    │   ├── barbeiros.js
    │   ├── clientes.js
    │   └── servicos.js
    ├── index.html
    ├── manifest.json
    └── service-worker.js

🗄️ Entidades e Relacionamentos
Cliente
CampoTipoObrigatórionomeString✅telefoneString✅emailString❌dataNascimentoDate❌observacoesString❌
Serviço
CampoTipoObrigatórionomeString✅descricaoString❌precoNumber✅duracaoMinutosNumber✅ativoBoolean❌ (default true)
Barbeiro ⭐ (Nova entidade)
CampoTipoObrigatórionomeString✅telefoneString❌emailString❌especialidades[String]❌horarioInicioString❌ (default 08:00)horarioFimString❌ (default 18:00)diasTrabalho[Number]❌ (default Seg–Sex)ativoBoolean❌ (default true)fotoString❌ (URL)
Agendamento
CampoTipoObrigatórioclienteObjectId → Cliente✅barbeiroObjectId → Barbeiro✅servicoObjectId → Servico✅dataHoraDate✅statusEnum❌ (default agendado)observacoesString❌

🔌 API REST — Endpoints
Clientes: /api/clientes
MétodoRotaDescriçãoGET/Listar todosGET/:idBuscar por IDPOST/Criar novoPUT/:idAtualizarDELETE/:idRemover
Serviços: /api/servicos
MétodoRotaDescriçãoGET/Listar (query: ?ativos=true)GET/:idBuscar por IDPOST/Criar novoPUT/:idAtualizarDELETE/:idRemover
Barbeiros: /api/barbeiros
MétodoRotaDescriçãoGET/Listar (query: ?ativos=true)GET/:idBuscar por IDPOST/Criar novoPUT/:idAtualizarDELETE/:idRemover
Agendamentos: /api/agendamentos
MétodoRotaDescriçãoGET/Listar (query: ?status=, ?barbeiro=, ?data=)GET/:idBuscar por ID (populado)POST/Criar novoPUT/:idAtualizarDELETE/:idRemover

🚀 Como Rodar Localmente
Pré-requisitos

Node.js 18+
npm
MongoDB local ou conta no MongoDB Atlas

Backend
bashcd backend
npm install
cp .env.example .env
# Edite .env com sua MONGO_URI
npm run dev
# Servidor em http://localhost:3000
Frontend
bash# Opção 1: VS Code Live Server (extensão)
# Opção 2: http-server
cd frontend
npx http-server . -p 8080
# Acesse http://localhost:8080

⚠️ Altere a constante API em frontend/js/app.js para apontar para o backend hospedado em produção.


☁️ Deploy — Guia Completo
A aplicação utiliza a seguinte arquitetura de deploy:
CamadaServiçoURL de exemplo🗄️ BancoMongoDB Atlascluster0.xxxxx.mongodb.net⚙️ BackendRenderhttps://barbearia-backend.onrender.com🌐 FrontendVercelhttps://barbearia-digital.vercel.app

1. Banco de Dados — MongoDB Atlas (gratuito)

Acesse mongodb.com/cloud/atlas e crie uma conta
Crie um cluster gratuito (M0)
Em Database Access, crie um usuário com senha
Em Network Access, adicione 0.0.0.0/0 (acesso de qualquer IP)
Em Connect → Drivers, copie a string de conexão:

   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/barbearia?retryWrites=true&w=majority

2. Backend — Render (gratuito)

Acesse render.com e crie uma conta
Clique em New → Web Service
Conecte o repositório GitHub e defina:

Root Directory: backend
Build Command: npm install
Start Command: node server.js


Em Environment Variables, adicione:

   MONGO_URI = mongodb+srv://...
   PORT      = 3000

Clique em Create Web Service
Copie a URL gerada (ex: https://barbearia-backend.onrender.com)


⚠️ No plano gratuito do Render, o serviço hiberna após 15 minutos de inatividade. A primeira requisição após o período de inatividade pode levar alguns segundos a mais para responder.


3. Frontend — Vercel (gratuito)
⚠️ Antes do deploy, edite frontend/js/app.js e aponte a constante API para a URL do backend no Render:
js// Antes (local):
const API = 'http://localhost:3000/api';

// Depois (produção):
const API = 'https://barbearia-backend.onrender.com/api';
Passos para o deploy:

Acesse vercel.com e crie uma conta
Clique em New Project → Import Git Repository
Selecione o repositório
Em Root Directory, defina frontend
Framework Preset: Other (HTML estático)
Clique em Deploy
A URL pública será gerada automaticamente (ex: https://barbearia-digital.vercel.app)


4. CORS em Produção
No backend/server.js, configure o CORS para aceitar apenas o domínio do frontend em produção:
jsapp.use(cors({
  origin: [
    'https://barbearia-digital.vercel.app',
    'http://localhost:8080'  // desenvolvimento local
  ]
}));

📱 PWA — Instalação
Após o deploy, acesse o frontend pelo navegador e:

Desktop Chrome/Edge: clique no ícone de instalação na barra de endereço
Android: menu do navegador → "Adicionar à tela inicial"
iOS Safari: botão compartilhar → "Adicionar à tela de início"


🐛 Bugs Corrigidos do Projeto Original (pet)
Arquivo OriginalBugCorreção Aplicadamodels/models/Pet.jsCaminho duplicado models/models/Estrutura corrigidamodels/models/Pet.jstype: age (variável inexistente)Substituído por type: Numberroutes/petRouts.jsImportava diaryController em vez de petControllerController correto por entidadeserver.jsrequire('./routes/petRoutes') após o .listen()Todas as rotas registradas antes do listenSem tratamento de errosControllers sem try/catchtry/catch em todos os controllers