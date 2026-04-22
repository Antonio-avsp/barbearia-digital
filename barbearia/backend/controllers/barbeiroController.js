const Barbeiro = require('../models/Barbeiro');

exports.listar = async (req, res) => {
  try {
    const filtro = req.query.ativos === 'true' ? { ativo: true } : {};
    const barbeiros = await Barbeiro.find(filtro).sort({ nome: 1 });
    res.json(barbeiros);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar barbeiros.', error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findById(req.params.id);
    if (!barbeiro) return res.status(404).json({ message: 'Barbeiro não encontrado.' });
    res.json(barbeiro);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar barbeiro.', error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const barbeiro = await Barbeiro.create(req.body);
    res.status(201).json(barbeiro);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar barbeiro.', error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!barbeiro) return res.status(404).json({ message: 'Barbeiro não encontrado.' });
    res.json(barbeiro);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar barbeiro.', error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const barbeiro = await Barbeiro.findByIdAndDelete(req.params.id);
    if (!barbeiro) return res.status(404).json({ message: 'Barbeiro não encontrado.' });
    res.json({ message: 'Barbeiro removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar barbeiro.', error: err.message });
  }
};
