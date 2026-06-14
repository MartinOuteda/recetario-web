import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    // Obtener información de la receta
    const recetaResult = await query(
      'SELECT * FROM recetas_completas WHERE id = $1',
      [id]
    );

    if (recetaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Obtener ingredientes
    const ingredientesResult = await query(
      'SELECT * FROM ingredientes WHERE receta_id = $1 ORDER BY orden',
      [id]
    );

    // Obtener pasos
    const pasosResult = await query(
      'SELECT * FROM pasos WHERE receta_id = $1 ORDER BY numero',
      [id]
    );

    const receta = recetaResult.rows[0];
    receta.ingredientes = ingredientesResult.rows;
    receta.pasos = pasosResult.rows;

    res.status(200).json(receta);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Error fetching recipe' });
  }
}
