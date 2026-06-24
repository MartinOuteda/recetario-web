import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/AgregarReceta.module.css';

export default function AgregarReceta() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    robot_id: '1',
    categoria_id: '1',
    tiempo_preparacion_min: '',
    tiempo_coccion_min: '',
    porciones: '4',
    dificultad: 'fácil',
    programa_recomendado: '',
    notas: '',
    fuente: 'Manual',
    ingredientes: [{ nombre: '', cantidad: '', unidad: 'g' }],
    pasos: [{ numero: 1, descripcion: '' }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredienteChange = (idx, field, value) => {
    const newIngredientes = [...formData.ingredientes];
    newIngredientes[idx][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredientes: newIngredientes
    }));
  };

  const handlePasoChange = (idx, value) => {
    const newPasos = [...formData.pasos];
    newPasos[idx].descripcion = value;
    setFormData(prev => ({
      ...prev,
      pasos: newPasos
    }));
  };

  const agregarIngrediente = () => {
    setFormData(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, { nombre: '', cantidad: '', unidad: 'g' }]
    }));
  };

  const agregarPaso = () => {
    setFormData(prev => ({
      ...prev,
      pasos: [...prev.pasos, { numero: prev.pasos.length + 1, descripcion: '' }]
    }));
  };

  const eliminarIngrediente = (idx) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== idx)
    }));
  };

  const eliminarPaso = (idx) => {
    const newPasos = formData.pasos
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, numero: i + 1 }));
    setFormData(prev => ({
      ...prev,
      pasos: newPasos
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que no haya campos vacíos críticos
      if (!formData.titulo || !formData.descripcion) {
        setError('Título y descripción son obligatorios');
        setLoading(false);
        return;
      }

      if (formData.ingredientes.some(i => !i.nombre)) {
        setError('Todos los ingredientes deben tener un nombre');
        setLoading(false);
        return;
      }

      if (formData.pasos.some(p => !p.descripcion)) {
        setError('Todos los pasos deben tener descripción');
        setLoading(false);
        return;
      }

      // Calcular tiempo total
      const tiempoTotal = parseInt(formData.tiempo_preparacion_min || 0) + 
                         parseInt(formData.tiempo_coccion_min || 0);

      // Crear la receta
      const response = await fetch('/api/recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          robot_id: parseInt(formData.robot_id),
          categoria_id: parseInt(formData.categoria_id),
          tiempo_preparacion_min: parseInt(formData.tiempo_preparacion_min) || 0,
          tiempo_coccion_min: parseInt(formData.tiempo_coccion_min) || 0,
          tiempo_total_min: tiempoTotal,
          porciones: parseInt(formData.porciones),
          dificultad: formData.dificultad,
          programa_recomendado: formData.programa_recomendado,
          notas: formData.notas,
          fuente: formData.fuente,
          ingredientes: formData.ingredientes,
          pasos: formData.pasos,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la receta');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al guardar la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">← Volver</Link>
        <h1>➕ Agregar Nueva Receta</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>¡Receta guardada! Redirigiendo...</div>}

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Sección: Información básica */}
          <section className={styles.section}>
            <h2>📋 Información Básica</h2>

            <div className={styles.group}>
              <label>Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Nombre de la receta"
                required
              />
            </div>

            <div className={styles.group}>
              <label>Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe la receta brevemente"
                rows="3"
                required
              />
            </div>

            <div className={styles.groupRow}>
              <div className={styles.group}>
                <label>Robot *</label>
                <select
                  name="robot_id"
                  value={formData.robot_id}
                  onChange={handleInputChange}
                >
                  <option value="1">Moulinex Cuisine Companion</option>
                  <option value="2">Philips Soup Maker</option>
                </select>
              </div>

              <div className={styles.group}>
                <label>Categoría *</label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                >
                  <option value="1">Sopas</option>
                  <option value="2">Batidos</option>
                  <option value="3">Compotas</option>
                  <option value="4">Cremas</option>
                </select>
              </div>
            </div>
          </section>

          {/* Sección: Tiempos */}
          <section className={styles.section}>
            <h2>⏱️ Tiempos</h2>

            <div className={styles.groupRow}>
              <div className={styles.group}>
                <label>Tiempo Preparación (min) *</label>
                <input
                  type="number"
                  name="tiempo_preparacion_min"
                  value={formData.tiempo_preparacion_min}
                  onChange={handleInputChange}
                  placeholder="10"
                  required
                />
              </div>

              <div className={styles.group}>
                <label>Tiempo Cocción (min) *</label>
                <input
                  type="number"
                  name="tiempo_coccion_min"
                  value={formData.tiempo_coccion_min}
                  onChange={handleInputChange}
                  placeholder="20"
                  required
                />
              </div>

              <div className={styles.group}>
                <label>Porciones</label>
                <input
                  type="number"
                  name="porciones"
                  value={formData.porciones}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>
          </section>

          {/* Sección: Detalles */}
          <section className={styles.section}>
            <h2>🎯 Detalles</h2>

            <div className={styles.groupRow}>
              <div className={styles.group}>
                <label>Dificultad</label>
                <select
                  name="dificultad"
                  value={formData.dificultad}
                  onChange={handleInputChange}
                >
                  <option value="fácil">Fácil</option>
                  <option value="media">Media</option>
                  <option value="difícil">Difícil</option>
                </select>
              </div>

              <div className={styles.group}>
                <label>Programa Recomendado</label>
                <input
                  type="text"
                  name="programa_recomendado"
                  value={formData.programa_recomendado}
                  onChange={handleInputChange}
                  placeholder="Ej: Programa 1 (Sopa Suave)"
                />
              </div>
            </div>

            <div className={styles.group}>
              <label>Fuente</label>
              <input
                type="text"
                name="fuente"
                value={formData.fuente}
                onChange={handleInputChange}
                placeholder="Moulinex PDF, Philips PDF, Manual, etc"
              />
            </div>

            <div className={styles.group}>
              <label>Notas</label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Consejos, variaciones, etc"
                rows="3"
              />
            </div>
          </section>

          {/* Sección: Ingredientes */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>📦 Ingredientes *</h2>
              <button
                type="button"
                className={styles.addBtn}
                onClick={agregarIngrediente}
              >
                + Agregar Ingrediente
              </button>
            </div>

            {formData.ingredientes.map((ing, idx) => (
              <div key={idx} className={styles.ingredientRow}>
                <input
                  type="text"
                  placeholder="Nombre del ingrediente"
                  value={ing.nombre}
                  onChange={(e) => handleIngredienteChange(idx, 'nombre', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={ing.cantidad}
                  onChange={(e) => handleIngredienteChange(idx, 'cantidad', e.target.value)}
                  step="0.01"
                />
                <select
                  value={ing.unidad}
                  onChange={(e) => handleIngredienteChange(idx, 'unidad', e.target.value)}
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="tsp">tsp</option>
                  <option value="tbsp">tbsp</option>
                  <option value="cup">cup</option>
                  <option value="unidad">unidad</option>
                </select>
                {formData.ingredientes.length > 1 && (
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => eliminarIngrediente(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Sección: Pasos */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>👨‍🍳 Pasos *</h2>
              <button
                type="button"
                className={styles.addBtn}
                onClick={agregarPaso}
              >
                + Agregar Paso
              </button>
            </div>

            {formData.pasos.map((paso, idx) => (
              <div key={idx} className={styles.pasoRow}>
                <span className={styles.pasoNum}>{paso.numero}</span>
                <textarea
                  placeholder="Descripción del paso"
                  value={paso.descripcion}
                  onChange={(e) => handlePasoChange(idx, e.target.value)}
                  rows="2"
                  required
                />
                {formData.pasos.length > 1 && (
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => eliminarPaso(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Botones */}
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Receta'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
