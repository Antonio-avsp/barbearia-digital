# 💈 Barbearia Digital — Sistema de Gestão Fullstack

Aplicação fullstack PWA para gerenciamento completo de barbearia: clientes, serviços, barbeiros e agendamentos.

---

## 📋 Índice

- [Estrutura do Projeto](#️-estrutura-do-projeto)
- [Entidades e Relacionamentos](#️-entidades-e-relacionamentos)
  - [Cliente](#cliente)
  - [Serviço](#serviço)
  - [Barbeiro ⭐](#barbeiro--nova-entidade)
  - [Agendamento](#agendamento)
- [API REST — Endpoints](#-api-rest--endpoints)
  - [Clientes](#clientes-apiclientes)
  - [Serviços](#serviços-apiservicos)
  - [Barbeiros](#barbeiros-apibarbeiros)
  - [Agendamentos](#agendamentos-apiagendamentos)
- [Como Rodar Localmente](#-como-rodar-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Deploy — Guia Completo](#️-deploy--guia-completo)
  - [1. MongoDB Atlas](#1-banco-de-dados--mongodb-atlas-gratuito)
  - [2. Backend — Render](#2-backend--render-gratuito)
  - [3. Frontend — Vercel](#3-frontend--vercel-gratuito)
  - [4. CORS em Produção](#4-cors-em-produção)
- [PWA — Instalação](#-pwa--instalação)
- [Bugs Corrigidos do Projeto Original](#-bugs-corrigidos-do-projeto-original-pet)

---

## 🗂️ Estrutura do Projeto

```
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
```

---

## 🗄️ Entidades e Relacionamentos

### Cliente
| Campo          | Tipo   | Obrigatório |
|----------------|--------|-------------|
| nome           | String | ✅ |
| telefone       | String | ✅ |
| email          | String | ❌ |
| dataNascimento | Date   | ❌ |
| observacoes    | String | ❌ |

### Serviço
| Campo          | Tipo    | Obrigatório |
|----------------|---------|-------------|
| nome           | String  | ✅ |
| descricao      | String  | ❌ |
| preco          | Number  | ✅ |
| duracaoMinutos | Number  | ✅ |
| ativo          | Boolean | ❌ (default true) |

### Barbeiro ⭐ (Nova entidade)
| Campo          | Tipo     | Obrigatório |
|----------------|----------|-------------|
| nome           | String   | ✅ |
| telefone       | String   | ❌ |
| email          | String   | ❌ |
| especialidades | [String] | ❌ |
| horarioInicio  | String   | ❌ (default 08:00) |
| horarioFim     | String   | ❌ (default 18:00) |
| diasTrabalho   | [Number] | ❌ (default Seg–Sex) |
| ativo          | Boolean  | ❌ (default true) |
| foto           | String   | ❌ (URL) |

### Agendamento
| Campo       | Tipo     | Obrigatório |
|-------------|----------|-------------|
| cliente     | ObjectId → Cliente  | ✅ |
| barbeiro    | ObjectId → Barbeiro | ✅ |
| servico     | ObjectId → Servico  | ✅ |
| dataHora    | Date     | ✅ |
| status      | Enum     | ❌ (default agendado) |
| observacoes | String   | ❌ |

---

## 🔌 API REST — Endpoints

### Clientes: `/api/clientes`
| Método | Rota           | Descrição             |
|--------|----------------|-----------------------|
| GET    | /              | Listar todos          |
| GET    | /:id           | Buscar por ID         |
| POST   | /              | Criar novo            |
| PUT    | /:id           | Atualizar             |
| DELETE | /:id           | Remover               |

### Serviços: `/api/servicos`
| Método | Rota           | Descrição                      |
|--------|----------------|--------------------------------|
| GET    | /              | Listar (query: `?ativos=true`) |
| GET    | /:id           | Buscar por ID                  |
| POST   | /              | Criar novo                     |
| PUT    | /:id           | Atualizar                      |
| DELETE | /:id           | Remover                        |

### Barbeiros: `/api/barbeiros`
| Método | Rota           | Descrição                      |
|--------|----------------|--------------------------------|
| GET    | /              | Listar (query: `?ativos=true`) |
| GET    | /:id           | Buscar por ID                  |
| POST   | /              | Criar novo                     |
| PUT    | /:id           | Atualizar                      |
| DELETE | /:id           | Remover                        |

### Agendamentos: `/api/agendamentos`
| Método | Rota           | Descrição                                              |
|--------|----------------|--------------------------------------------------------|
| GET    | /              | Listar (query: `?status=`, `?barbeiro=`, `?data=`)     |
| GET    | /:id           | Buscar por ID (populado)                               |
| POST   | /              | Criar novo                                             |
| PUT    | /:id           | Atualizar                                              |
| DELETE | /:id           | Remover                                                |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm
- MongoDB local ou conta no MongoDB Atlas

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com sua MONGO_URI
npm run dev
# Servidor em http://localhost:3000
```

### Frontend

```bash
# Opção 1: VS Code Live Server (extensão)
# Opção 2: http-server
cd frontend
npx http-server . -p 8080
# Acesse http://localhost:8080
```

> ⚠️ Altere a constante `API` em `frontend/js/app.js` para apontar para o backend hospedado em produção.

---

## ☁️ Deploy — Guia Completo

A aplicação utiliza a seguinte arquitetura de deploy:

| Camada        | Serviço           | URL de exemplo                                  |
|---------------|-------------------|-------------------------------------------------|
| 🗄️ Banco      | MongoDB Atlas     | `cluster0.xxxxx.mongodb.net`                    |
| ⚙️ Backend    | Render            | `https://barbearia-backend.onrender.com`        |
| 🌐 Frontend   | Vercel            | `https://barbearia-digital.vercel.app`          |

---

### 1. Banco de Dados — MongoDB Atlas (gratuito)

1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) e crie uma conta
2. Crie um cluster gratuito (M0)
3. Em **Database Access**, crie um usuário com senha
4. Em **Network Access**, adicione `0.0.0.0/0` (acesso de qualquer IP)
5. Em **Connect → Drivers**, copie a string de conexão:
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/barbearia?retryWrites=true&w=majority
   ```

---

### 2. Backend — Render (gratuito)

1. Acesse [render.com](https://render.com) e crie uma conta
2. Clique em **New → Web Service**
3. Conecte o repositório GitHub e defina:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Em **Environment Variables**, adicione:
   ```
   MONGO_URI = mongodb+srv://...
   PORT      = 3000
   ```
5. Clique em **Create Web Service**
6. Copie a URL gerada (ex: `https://barbearia-backend.onrender.com`)

> ⚠️ No plano gratuito do Render, o serviço hiberna após 15 minutos de inatividade. A primeira requisição após o período de inatividade pode levar alguns segundos a mais para responder.

---

### 3. Frontend — Vercel (gratuito)

**⚠️ Antes do deploy**, edite `frontend/js/app.js` e aponte a constante `API` para a URL do backend no Render:

```js
// Antes (local):
const API = 'http://localhost:3000/api';

// Depois (produção):
const API = 'https://barbearia-backend.onrender.com/api';
```

**Passos para o deploy:**

1. Acesse [vercel.com](https://vercel.com) e crie uma conta
2. Clique em **New Project → Import Git Repository**
3. Selecione o repositório
4. Em **Root Directory**, defina `frontend`
5. Framework Preset: **Other** (HTML estático)
6. Clique em **Deploy**
7. A URL pública será gerada automaticamente (ex: `https://barbearia-digital.vercel.app`)

---

### 4. CORS em Produção

No `backend/server.js`, configure o CORS para aceitar apenas o domínio do frontend em produção:

```js
app.use(cors({
  origin: [
    'https://barbearia-digital.vercel.app',
    'http://localhost:8080'  // desenvolvimento local
  ]
}));
```

---

## 📱 PWA — Instalação

Após o deploy, acesse o frontend pelo navegador e:
- **Desktop Chrome/Edge**: clique no ícone de instalação na barra de endereço
- **Android**: menu do navegador → "Adicionar à tela inicial"
- **iOS Safari**: botão compartilhar → "Adicionar à tela de início"

---

## 🐛 Bugs Corrigidos do Projeto Original (pet)

| Arquivo Original           | Bug                                           | Correção Aplicada |
|----------------------------|-----------------------------------------------|-------------------|
| `models/models/Pet.js`     | Caminho duplicado `models/models/`            | Estrutura corrigida |
| `models/models/Pet.js`     | `type: age` (variável inexistente)            | Substituído por `type: Number` |
| `routes/petRouts.js`       | Importava `diaryController` em vez de `petController` | Controller correto por entidade |
| `server.js`                | `require('./routes/petRoutes')` após o `.listen()` | Todas as rotas registradas antes do listen |
| Sem tratamento de erros    | Controllers sem try/catch                     | try/catch em todos os controllers |
