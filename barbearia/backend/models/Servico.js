const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    preco: { type: Number, required: true, min: 0 },
    duracaoMinutos: { type: Number, required: true, min: 5 },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Servico', servicoSchema);
