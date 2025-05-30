const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Obtener todos los productos
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Crear producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, imagen_url, usuario_id } = req.body;
  const { data, error } = await supabase.from('products').insert([{ nombre, descripcion, precio, imagen_url, usuario_id }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
