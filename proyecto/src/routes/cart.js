const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Agregar al carrito
router.post('/add', async (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;
  const { data, error } = await supabase.from('cart_items').insert([{ usuario_id, producto_id, cantidad }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Ver carrito
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(nombre, precio)')
    .eq('usuario_id', usuario_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
