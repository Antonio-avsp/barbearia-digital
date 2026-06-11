# 💈 Barbearia Mobile (React Native + Expo)

Aplicativo mobile desenvolvido com **React Native + Expo** para gerenciar os serviços da Barbearia Digital, consumindo a API REST do backend deste projeto.

O app realiza o **CRUD completo** da entidade Serviço:

- ✅ **Cadastrar** — botão flutuante `+` abre o formulário de novo serviço
- ✅ **Listar** — lista de serviços com pull-to-refresh
- ✅ **Editar** — ícone de lápis no card abre o formulário preenchido
- ✅ **Excluir** — ícone de lixeira no card, com confirmação antes de remover

## Requisitos

- Node.js 18+
- npm
- App **Expo Go** no celular (ou emulador Android/iOS)

## Instalação e execução

```bash
cd mobile
npm install
npm run start
```

Depois:

- pressione `a` para abrir no Android Emulator
- pressione `i` para abrir no iOS Simulator
- ou escaneie o QR Code com o app **Expo Go** no celular

## Configuração da API

Por padrão o app consome a API hospedada no Render:

```js
// services/api.js
const API_URL = 'https://barbearia-digital-x4i4.onrender.com/api';
```

Para usar um backend local, suba o backend (veja o README em `barbearia/backend`) e troque a URL pelo IP da sua máquina na rede local (o `localhost` do celular não enxerga o computador):

```js
const API_URL = 'http://192.168.0.10:3000/api';
```

> ⚠️ No plano gratuito do Render, o backend hiberna após inatividade — a primeira requisição pode demorar alguns segundos.

## Estrutura

```
mobile/
├── components/
│   ├── ServicoCard.js    # card de serviço com ações de editar/excluir
│   ├── ServicoForm.js    # formulário (modal) de cadastro/edição com validação
│   └── StatusView.js     # estados de loading, erro e lista vazia
├── screens/
│   └── ServicosScreen.js # tela principal: lista + orquestra o CRUD
├── services/
│   └── api.js            # integração HTTP (GET, POST, PUT, DELETE)
├── styles/
│   └── theme.js          # cores e espaçamentos compartilhados
└── App.js                # ponto de entrada
```
