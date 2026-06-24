/**
 * Script para cargar recetas en masa en Neon PostgreSQL
 * 
 * Uso:
 * 1. Crea un archivo recetas.json con el formato de las recetas
 * 2. Configura DATABASE_URL en .env.local
 * 3. Ejecuta: node scripts/cargarRecetas.js recetas.json
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configurar conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function cargarRecetas(archivoJSON) {
  try {
    // Leer archivo JSON
    const filePath = path.join(process.cwd(), archivoJSON);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Archivo no encontrado: ${filePath}`);
      process.exit(1);
    }

    const datos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const recetas = Array.isArray(datos) ? datos : datos.recetas;

    console.log(`📚 Cargando ${recetas.length} recetas...\n`);

    let exitosas = 0;
    let errores = 0;

    for (const receta of recetas) {
      try {
        // Validar datos requeridos
        if (!receta.titulo || !receta.descripcion || !receta.robot_id) {
          console.warn(`⚠️  Receta incompleta: ${receta.titulo}`);
          errores++;
          continue;
        }

        // Insertar receta
        const resultReceta = await pool.query(
          `INSERT INTO recetas 
          (titulo, descripcion, robot_id, categoria_id, tiempo_preparacion_min,
           tiempo_coccion_min, tiempo_total_min, porciones, dificultad,
           programa_recomendado, notas, fuente)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id`,
          [
            receta.titulo,
            receta.descripcion,
            receta.robot_id,
            receta.categoria_id || 1,
            receta.tiempo_preparacion_min || 0,
            receta.tiempo_coccion_min || 0,
            receta.tiempo_total_min || 0,
            receta.porciones || 4,
            receta.dificultad || 'fácil',
            receta.programa_recomendado || '',
            receta.notas || '',
            receta.fuente || 'Manual',
          ]
        );

        const receta_id = resultReceta.rows[0].id;

        // Insertar ingredientes
        if (receta.ingredientes && receta.ingredientes.length > 0) {
          for (let i = 0; i < receta.ingredientes.length; i++) {
            const ing = receta.ingredientes[i];
            await pool.query(
              `INSERT INTO ingredientes 
              (receta_id, nombre, cantidad, unidad, orden)
              VALUES ($1, $2, $3, $4, $5)`,
              [receta_id, ing.nombre, ing.cantidad || null, ing.unidad || 'g', i + 1]
            );
          }
        }

        // Insertar pasos
        if (receta.pasos && receta.pasos.length > 0) {
          for (let i = 0; i < receta.pasos.length; i++) {
            const paso = receta.pasos[i];
            await pool.query(
              `INSERT INTO pasos 
              (receta_id, numero, descripcion)
              VALUES ($1, $2, $3)`,
              [receta_id, paso.numero || i + 1, paso.descripcion]
            );
          }
        }

        console.log(`✅ ${receta.titulo}`);
        exitosas++;
      } catch (err) {
        console.error(`❌ Error en "${receta.titulo}":`, err.message);
        errores++;
      }
    }

    console.log(`\n📊 Resultado: ${exitosas} exitosas, ${errores} con error`);

    if (exitosas > 0) {
      console.log('✨ ¡Recetas cargadas correctamente!');
    }

    process.exit(errores > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Obtener nombre del archivo como argumento
const archivo = process.argv[2];
if (!archivo) {
  console.error('❌ Uso: node scripts/cargarRecetas.js <archivo.json>');
  process.exit(1);
}

cargarRecetas(archivo);
