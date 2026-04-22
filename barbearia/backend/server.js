const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) =>
  res.json({ message: 'API da Barbearia funcionando! 💈', versao: '1.0.0' })
);

// Rotas
app.use('/api/clientes',     require('./routes/clienteRoutes'));
app.use('/api/servicos',     require('./routes/servicoRoutes'));
app.use('/api/barbeiros',    require('./routes/barbeiroRoutes'));
app.use('/api/agendamentos', require('./routes/agendamentoRoutes'));

// Conexão com MongoDB e start do servidor
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/barbearia';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
