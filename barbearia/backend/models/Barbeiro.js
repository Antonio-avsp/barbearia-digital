const mongoose = require('mongoose');

const barbeiroSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    telefone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    especialidades: [{ type: String, trim: true }],
    horarioInicio: { type: String, default: '08:00' }, // HH:MM
    horarioFim: { type: String, default: '18:00' },    // HH:MM
    diasTrabalho: {
      type: [Number], // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
      default: [1, 2, 3, 4, 5]
    },
    ativo: { type: Boolean, default: true },
    foto: { type: String, trim: true } // URL da foto
  },
  { timestamps: true }
);

module.exports = mongoose.model('Barbeiro', barbeiroSchema);
