# 🍳 Recetario Inteligente

Plataforma web para gestionar y compartir recetas adaptadas para tus robots de cocina (Moulinex, Philips, etc).

## Características

✨ **Listado de recetas** - Visualiza todas tus recetas en una interfaz hermosa
🔍 **Filtrado por robot** - Filtra recetas según tu máquina de cocina
📋 **Detalles completos** - Ingredientes, pasos, tiempos y recomendaciones
⚡ **En tiempo real** - Actualizaciones automáticas desde la BD Neon
📱 **Responsive** - Funciona perfectamente en mobile, tablet y desktop

## Tech Stack

- **Frontend:** Next.js 14 + React
- **Backend:** API routes de Next.js
- **Base de datos:** PostgreSQL (Neon)
- **Hosting:** Netlify
- **Estilos:** CSS Modules

## Instalación Local

### Requisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
   - Copia `.env.local` y verifica que `DATABASE_URL` sea correcta

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Abrir en navegador:**
```
http://localhost:3000
```

## Estructura del Proyecto

```
recetario-web/
├── pages/
│   ├── api/                    # Rutas API
│   │   ├── recetas.js         # GET todas las recetas
│   │   └── recetas/[id].js    # GET receta por ID
│   ├── index.js               # Página principal
│   ├── receta/[id].js         # Página de detalle
│   └── _document.js           # Documento HTML
├── lib/
│   └── db.js                  # Utilidad de conexión PostgreSQL
├── styles/
│   ├── Home.module.css        # Estilos página principal
│   └── Receta.module.css      # Estilos página de detalle
├── public/                    # Assets estáticos
├── .env.local                 # Variables de entorno
├── .gitignore                 # Git ignore
├── package.json               # Dependencias
├── next.config.js             # Config Next.js
├── netlify.toml               # Config Netlify
└── README.md                  # Este archivo
```

## Rutas API

### GET `/api/recetas`
Obtiene todas las recetas con información básica

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Sopa Crema de Zapallo",
    "descripcion": "...",
    "robot": "Cuisine Companion",
    "categoria": "Cremas",
    "tiempo_total_min": 35,
    "porciones": 4
  }
]
```

### GET `/api/recetas/[id]`
Obtiene una receta específica con todos sus detalles

**Respuesta:**
```json
{
  "id": 1,
  "titulo": "Sopa Crema de Zapallo",
  "ingredientes": [...],
  "pasos": [...]
}
```

## Agregar Nuevas Recetas

### Desde Neon SQL Editor:

```sql
-- 1. Insertar receta
INSERT INTO recetas (titulo, descripcion, robot_id, categoria_id, 
  tiempo_preparacion_min, tiempo_coccion_min, tiempo_total_min, 
  porciones, dificultad, programa_recomendado, fuente)
VALUES (
  'Tu Receta',
  'Descripción',
  1,  -- robot_id (1=Moulinex, 2=Philips)
  1,  -- categoria_id
  10, 20, 30, 4, 'fácil', 'Programa 1', 'Fuente'
);

-- 2. Obtener ID de la receta creada
SELECT id FROM recetas WHERE titulo = 'Tu Receta';

-- 3. Insertar ingredientes (reemplaza 999 por el ID)
INSERT INTO ingredientes (receta_id, nombre, cantidad, unidad, orden)
VALUES (999, 'Ingrediente', 100, 'g', 1);

-- 4. Insertar pasos
INSERT INTO pasos (receta_id, numero, descripcion)
VALUES (999, 1, 'Descripción del paso');
```

## Variables de Entorno

```env
DATABASE_URL=postgresql://usuario:contraseña@host/dbname
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas de cómo desplegar a Netlify.

## Scripts

```bash
npm run dev      # Ejecutar en desarrollo (localhost:3000)
npm run build    # Hacer build para producción
npm start        # Ejecutar build de producción
npm run lint     # Linter de código
```

## Contribuir

Para agregar features o mejorar:

1. Crea una rama: `git checkout -b feature/tu-feature`
2. Haz cambios y commit: `git commit -m "Descripción"`
3. Push: `git push origin feature/tu-feature`
4. Abre Pull Request

## Problemas Comunes

**Q: Las recetas no cargan**
A: Verifica que `DATABASE_URL` sea correcta y que Neon esté accesible

**Q: Error en Netlify: "Cannot find module"**
A: Asegúrate de tener `package.json` en la raíz y todas las dependencias

**Q: ¿Cómo editar una receta?**
A: Por ahora solo desde Neon SQL Editor. Pronto agregaremos UI para editar.

## Roadmap

- [ ] Formulario para agregar recetas desde web
- [ ] Editar/eliminar recetas
- [ ] Buscar por nombre
- [ ] Imprimir recetas
- [ ] Guardar favoritos
- [ ] Sistema de comentarios
- [ ] Compartir recetas en redes

## Licencia

MIT

## Soporte

¿Problemas? Contacta a [tu-email]

---

**Hecho con ❤️ para los amantes de la cocina fácil**
