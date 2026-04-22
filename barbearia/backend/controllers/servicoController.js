const Servico = require('../models/Servico');

exports.listar = async (req, res) => {
  try {
    const filtro = req.query.ativos === 'true' ? { ativo: true } : {};
    const servicos = await Servico.find(filtro).sort({ nome: 1 });
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar serviços.', error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado.' });
    res.json(servico);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviço.', error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const servico = await Servico.create(req.body);
    res.status(201).json(servico);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar serviço.', error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado.' });
    res.json(servico);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar serviço.', error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const servico = await Servico.findByIdAndDelete(req.params.id);
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado.' });
    res.json({ message: 'Serviço removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar serviço.', error: err.message });
  }
};
