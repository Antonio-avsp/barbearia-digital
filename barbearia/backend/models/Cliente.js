const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dataNascimento: { type: Date },
    observacoes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cliente', clienteSchema);
