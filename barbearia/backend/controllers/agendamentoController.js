const Agendamento = require('../models/Agendamento');

exports.listar = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.status) filtro.status = req.query.status;
    if (req.query.barbeiro) filtro.barbeiro = req.query.barbeiro;
    if (req.query.cliente) filtro.cliente = req.query.cliente;

    // Filtro por data (dia específico)
    if (req.query.data) {
      const inicio = new Date(req.query.data);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(req.query.data);
      fim.setHours(23, 59, 59, 999);
      filtro.dataHora = { $gte: inicio, $lte: fim };
    }

    const agendamentos = await Agendamento.find(filtro)
      .populate('cliente', 'nome telefone')
      .populate('barbeiro', 'nome')
      .populate('servico', 'nome preco duracaoMinutos')
      .sort({ dataHora: 1 });

    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar agendamentos.', error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id)
      .populate('cliente', 'nome telefone email')
      .populate('barbeiro', 'nome telefone')
      .populate('servico', 'nome preco duracaoMinutos');

    if (!agendamento) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    res.json(agendamento);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamento.', error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const agendamento = await Agendamento.create(req.body);
    const populado = await agendamento.populate([
      { path: 'cliente', select: 'nome telefone' },
      { path: 'barbeiro', select: 'nome' },
      { path: 'servico', select: 'nome preco duracaoMinutos' }
    ]);
    res.status(201).json(populado);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar agendamento.', error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('cliente', 'nome telefone')
      .populate('barbeiro', 'nome')
      .populate('servico', 'nome preco duracaoMinutos');

    if (!agendamento) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    res.json(agendamento);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar agendamento.', error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(req.params.id);
    if (!agendamento) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    res.json({ message: 'Agendamento removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar agendamento.', error: err.message });
  }
};
