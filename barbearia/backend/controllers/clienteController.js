const Cliente = require('../models/Cliente');

exports.listar = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nome: 1 });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar clientes.', error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar cliente.', error: err.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar cliente.', error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar cliente.', error: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.json({ message: 'Cliente removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar cliente.', error: err.message });
  }
};
