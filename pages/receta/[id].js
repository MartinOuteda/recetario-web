import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Receta.module.css';

export default function RecetaDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/recetas/${id}`)
      .then(res => res.json())
      .then(data => {
        setReceta(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Cargando receta...</div>;
  }

  if (!receta) {
    return <div className={styles.error}>Receta no encontrada</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">← Volver</Link>
        <h1>{receta.titulo}</h1>
        <div className={styles.meta}>
          <span className={styles.badge}>{receta.categoria}</span>
          <span className={styles.badge}>{receta.robot}</span>
          <span className={styles.badge}>{receta.dificultad}</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.info}>
          <p className={styles.descripcion}>{receta.descripcion}</p>
          
          <div className={styles.tiempos}>
            <div className={styles.tiempo}>
              <strong>⏱️ Preparación</strong>
              <p>{receta.tiempo_preparacion_min} min</p>
            </div>
            <div className={styles.tiempo}>
              <strong>🔥 Cocción</strong>
              <p>{receta.tiempo_coccion_min} min</p>
            </div>
            <div className={styles.tiempo}>
              <strong>⌛ Total</strong>
              <p>{receta.tiempo_total_min} min</p>
            </div>
            <div className={styles.tiempo}>
              <strong>👥 Porciones</strong>
              <p>{receta.porciones}</p>
            </div>
          </div>

          {receta.programa_recomendado && (
            <div className={styles.programa}>
              <strong>🤖 Programa recomendado:</strong>
              <p>{receta.programa_recomendado}</p>
            </div>
          )}
        </div>

        <div className={styles.content}>
          {/* Ingredientes */}
          <section className={styles.section}>
            <h2>📋 Ingredientes</h2>
            <ul className={styles.ingredientesList}>
              {receta.ingredientes && receta.ingredientes.map((ing, idx) => (
                <li key={idx}>
                  <span className={styles.cantidad}>
                    {ing.cantidad} {ing.unidad}
                  </span>
                  <span className={styles.nombre}>{ing.nombre}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pasos */}
          <section className={styles.section}>
            <h2>👨‍🍳 Pasos</h2>
            <ol className={styles.pasosList}>
              {receta.pasos && receta.pasos.map((paso, idx) => (
                <li key={idx} className={styles.paso}>
                  <div className={styles.pasoHeader}>
                    <span className={styles.pasoNumero}>{paso.numero}</span>
                    <span className={styles.pasoTitulo}>{paso.titulo || `Paso ${paso.numero}`}</span>
                  </div>
                  <p className={styles.pasoDescripcion}>{paso.descripcion}</p>
                  {paso.duracion_segundos && (
                    <span className={styles.duracion}>⏱️ {Math.round(paso.duracion_segundos / 60)} min</span>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Notas */}
          {receta.notas && (
            <section className={styles.section}>
              <h2>💡 Notas</h2>
              <div className={styles.notas}>
                <p>{receta.notas}</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
