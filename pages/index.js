import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    fetch('/api/recetas')
      .then(res => res.json())
      .then(data => {
        setRecetas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      });
  }, []);

  const filteredRecetas = filter === 'todas' 
    ? recetas 
    : recetas.filter(r => r.robot === filter);

  const robots = [...new Set(recetas.map(r => r.robot))];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1>🍳 Recetario Inteligente</h1>
            <p>Recetas adaptadas para tus robots de cocina</p>
          </div>
          <Link href="/agregar-receta">
            <button className={styles.agregarBtn}>➕ Agregar Receta</button>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {/* Filtros */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'todas' ? styles.active : ''}`}
            onClick={() => setFilter('todas')}
          >
            Todas ({recetas.length})
          </button>
          {robots.map(robot => (
            <button
              key={robot}
              className={`${styles.filterBtn} ${filter === robot ? styles.active : ''}`}
              onClick={() => setFilter(robot)}
            >
              {robot} ({recetas.filter(r => r.robot === robot).length})
            </button>
          ))}
        </div>

        {/* Grid de recetas */}
        {loading ? (
          <p className={styles.loading}>Cargando recetas...</p>
        ) : filteredRecetas.length === 0 ? (
          <p className={styles.empty}>No hay recetas disponibles</p>
        ) : (
          <div className={styles.grid}>
            {filteredRecetas.map(receta => (
              <Link key={receta.id} href={`/receta/${receta.id}`}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{receta.titulo}</h3>
                    <span className={styles.badge}>{receta.categoria}</span>
                  </div>
                  <p className={styles.cardDescription}>{receta.descripcion}</p>
                  <div className={styles.cardMeta}>
                    <span>⏱️ {receta.tiempo_total_min} min</span>
                    <span>👥 {receta.porciones} porciones</span>
                    <span>🤖 {receta.robot}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.dificultad}>{receta.dificultad}</span>
                    <span className={styles.arrow}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
