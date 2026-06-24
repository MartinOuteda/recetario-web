import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener todas las recetas
    try {
      const result = await query('SELECT * FROM recetas_completas ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Error fetching recipes' });
    }
  } else if (req.method === 'POST') {
    // Crear nueva receta
    try {
      const {
        titulo,
        descripcion,
        robot_id,
        categoria_id,
        tiempo_preparacion_min,
        tiempo_coccion_min,
        tiempo_total_min,
        porciones,
        dificultad,
        programa_recomendado,
        notas,
        fuente,
        ingredientes,
        pasos,
      } = req.body;

      // Validar datos requeridos
      if (!titulo || !descripcion || !robot_id) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      // Insertar receta
      const recetaResult = await query(
        `INSERT INTO recetas 
        (titulo, descripcion, robot_id, categoria_id, tiempo_preparacion_min, 
         tiempo_coccion_min, tiempo_total_min, porciones, dificultad, 
         programa_recomendado, notas, fuente)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
        [
          titulo,
          descripcion,
          robot_id,
          categoria_id,
          tiempo_preparacion_min,
          tiempo_coccion_min,
          tiempo_total_min,
          porciones,
          dificultad,
          programa_recomendado,
          notas,
          fuente,
        ]
      );

      const receta_id = recetaResult.rows[0].id;

      // Insertar ingredientes
      if (ingredientes && ingredientes.length > 0) {
        for (let i = 0; i < ingredientes.length; i++) {
          const ing = ingredientes[i];
          await query(
            `INSERT INTO ingredientes 
            (receta_id, nombre, cantidad, unidad, orden)
            VALUES ($1, $2, $3, $4, $5)`,
            [receta_id, ing.nombre, ing.cantidad || null, ing.unidad, i + 1]
          );
        }
      }

      // Insertar pasos
      if (pasos && pasos.length > 0) {
        for (let i = 0; i < pasos.length; i++) {
          const paso = pasos[i];
          await query(
            `INSERT INTO pasos 
            (receta_id, numero, descripcion)
            VALUES ($1, $2, $3)`,
            [receta_id, paso.numero, paso.descripcion]
          );
        }
      }

      res.status(201).json({
        id: receta_id,
        message: 'Receta creada exitosamente',
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ error: 'Error al crear la receta' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
