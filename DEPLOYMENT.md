# Guía de Deployment a Netlify 🚀

## OPCIÓN 1: Deployment desde GitHub (RECOMENDADO)

### Paso 1: Subir el proyecto a GitHub

1. Crea una cuenta en GitHub si no tienes: https://github.com
2. Crea un repositorio nuevo (llamado `recetario-web`)
3. En tu computadora, abre terminal y ve a la carpeta del proyecto:

```bash
cd recetario-web
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/recetario-web.git
git push -u origin main
```

*(Reemplaza TU_USUARIO con tu usuario de GitHub)*

### Paso 2: Conectar con Netlify

1. Ve a https://netlify.com
2. Haz clic en "Sign up" (arriba a la derecha)
3. Elige "Sign up with GitHub"
4. Autoriza a Netlify a acceder a tu GitHub
5. Haz clic en "Create a new site"
6. Selecciona "Import an existing project"
7. Selecciona "GitHub" como proveedor
8. Busca y selecciona tu repositorio `recetario-web`
9. Haz clic en "Deploy site"

### Paso 3: Configurar Variables de Entorno

1. En tu sitio en Netlify, ve a **Settings** → **Environment**
2. Haz clic en **Add environment variable**
3. Agrega esto:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_DTyHlJ2QO7sG@ep-raspy-water-atkocfbl-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
4. Haz clic en "Save"
5. Netlify automáticamente redeployará con las variables

### Paso 4: Esperar deployment

Netlify debería:
1. Descargar el código de GitHub
2. Instalar dependencias (`npm install`)
3. Hacer build (`npm run build`)
4. Deployar a Netlify
5. Darte una URL pública (algo como `https://recetario-xxxx.netlify.app`)

---

## OPCIÓN 2: Deployment Manual (Si no tienes GitHub)

### Paso 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Paso 2: Hacer build local

```bash
cd recetario-web
npm install
npm run build
```

### Paso 3: Deployar a Netlify

```bash
netlify deploy --prod
```

Se te pedirá:
- Loguear en Netlify (abre el navegador)
- Confirmar el directorio a deployar (usa `.next`)
- Esperar a que suba

---

## Variables de Entorno en Netlify

**IMPORTANTE:** La variable `DATABASE_URL` debe estar configurada en Netlify, no en el archivo `.env.local`.

### Para configurarla:

1. En tu sitio Netlify → **Site Settings** → **Build & Deploy** → **Environment**
2. Haz clic en **Edit variables**
3. Agrega:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_DTyHlJ2QO7sG@ep-raspy-water-atkocfbl-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
4. Guarda y redeploya

---

## Troubleshooting

### Error: "Cannot find module 'pg'"

**Solución:** Las dependencias no se instalaron. En tu repositorio GitHub, verifica que:
- `package.json` esté en la raíz
- Todos los archivos estén subidos

Luego:
```bash
git add .
git commit -m "Fix dependencies"
git push
```

Netlify se re-deployará automáticamente.

### Error: "DATABASE_URL is not defined"

**Solución:** Falta la variable de entorno en Netlify. Ve a:
- Netlify → Site Settings → Environment
- Verifica que `DATABASE_URL` esté configurada
- Si no está, agrégala
- Redeploya

### La página carga pero no muestra recetas

**Solución:** Probablemente la API no puede conectarse a Neon. Verifica:
1. En Netlify → Logs (Function logs) para ver errores
2. La `DATABASE_URL` esté bien copiada (sin espacios extra)
3. Tu BD en Neon tenga datos

---

## Redeploy Automático

Con GitHub integrado, cada vez que hagas un push a tu repositorio:
```bash
git add .
git commit -m "Nueva funcionalidad"
git push
```

Netlify **automáticamente:**
1. Ve el cambio en GitHub
2. Descarga el código
3. Hace build
4. Deploya a tu URL

---

## URL Final

Tu sitio estará disponible en una URL como:
```
https://recetario-web.netlify.app
```

(O la que Netlify te asigne)

---

## Próximos Pasos

Una vez que todo funcione:
1. ✅ Verifica que puedas ver las recetas
2. ✅ Prueba los filtros
3. ✅ Haz clic en una receta para ver detalles
4. ✅ Compartir la URL con amigos

---

## Agregar Más Recetas

Para agregar más recetas a tu BD desde Neon:

```sql
INSERT INTO recetas (titulo, descripcion, robot_id, categoria_id, tiempo_preparacion_min, tiempo_coccion_min, tiempo_total_min, porciones, dificultad, programa_recomendado, fuente)
VALUES (
  'Tu Receta',
  'Descripción aquí',
  1, -- ID del robot (1=Moulinex, 2=Philips)
  1, -- ID de categoría
  10, 20, 30, 4, 'fácil', 'Programa 1', 'Moulinex PDF'
);
```

Luego agrega ingredientes y pasos. El sitio se actualizará automáticamente al refresco.

---

¿Problemas? Avísame y lo solucionamos. 🔧
