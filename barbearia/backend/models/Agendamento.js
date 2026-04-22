const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    barbeiro: { type: mongoose.Schema.Types.ObjectId, ref: 'Barbeiro', required: true },
    servico: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true },
    dataHora: { type: Date, required: true },
    status: {
      type: String,
      enum: ['agendado', 'confirmado', 'concluido', 'cancelado'],
      default: 'agendado'
    },
    observacoes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agendamento', agendamentoSchema);
