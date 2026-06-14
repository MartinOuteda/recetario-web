import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM recetas_completas ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Error fetching recipes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
