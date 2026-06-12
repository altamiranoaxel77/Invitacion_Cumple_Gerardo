# 🎉 Cumple Gerardo - Invitación Web

## Estructura del proyecto

```
gerardo-cumple/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── public/
    │   ├── index.html
    │   └── gerardo.png
    └── src/
        ├── index.js
        └── App.js
```

---

## ✅ CHECKLIST - Pasos para levantar el proyecto

### PASO 1 - Clonar / crear la carpeta del proyecto
- [ ] Crear carpeta `gerardo-cumple` en tu PC
- [ ] Abrir la carpeta en Visual Studio Code

### PASO 2 - Copiar los archivos del backend
- [ ] Dentro de `gerardo-cumple`, crear carpeta `backend`
- [ ] Copiar `main.py` dentro de `backend/`
- [ ] Copiar `requirements.txt` dentro de `backend/`

### PASO 3 - Instalar Python y dependencias del backend
- [ ] Verificar que tenés Python instalado: abrir terminal y correr `python --version`
- [ ] En la terminal, ir a la carpeta backend: `cd gerardo-cumple/backend`
- [ ] Crear entorno virtual: `python -m venv venv`
- [ ] Activar entorno virtual:
  - Windows: `venv\Scripts\activate`
  - Mac/Linux: `source venv/bin/activate`
- [ ] Instalar dependencias: `pip install -r requirements.txt`

### PASO 4 - Levantar el backend
- [ ] Con el entorno virtual activado, correr: `uvicorn main:app --reload`
- [ ] Verificar que aparece: `Uvicorn running on http://127.0.0.1:8000`
- [ ] Abrir en el navegador: `http://localhost:8000/confirmaciones` (debe mostrar `[]`)

### PASO 5 - Copiar los archivos del frontend
- [ ] Dentro de `gerardo-cumple`, crear carpeta `frontend`
- [ ] Copiar `package.json` dentro de `frontend/`
- [ ] Crear carpeta `frontend/public` y copiar `index.html` y `gerardo.png`
- [ ] Crear carpeta `frontend/src` y copiar `index.js` y `App.js`

### PASO 6 - Instalar Node.js y dependencias del frontend
- [ ] Verificar que tenés Node.js: `node --version` (necesitás v16 o superior)
  - Si no lo tenés, descargar de https://nodejs.org
- [ ] Abrir una NUEVA terminal (mantener el backend corriendo)
- [ ] Ir a la carpeta frontend: `cd gerardo-cumple/frontend`
- [ ] Instalar dependencias: `npm install`
  - (Esto puede tardar 2-3 minutos la primera vez)

### PASO 7 - Levantar el frontend
- [ ] Correr: `npm start`
- [ ] El navegador debería abrir automáticamente en `http://localhost:3000`
- [ ] Deberías ver la página de invitación con el diseño de Argentina

### PASO 8 - Probar el formulario
- [ ] Completar todos los campos del formulario
- [ ] Hacer clic en "¡ME ANOTO!"
- [ ] Verificar que aparece el mensaje de confirmación
- [ ] Verificar que el nombre aparece en la lista de confirmados

### PASO 9 - Preparar para hostear gratis (Render.com)
- [ ] Crear cuenta en https://render.com (gratis)
- [ ] Subir el proyecto a GitHub (también gratis)
- [ ] En Render, crear un "Web Service" para el backend (Python/FastAPI)
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] En Render, crear un "Static Site" para el frontend (React)
  - Build command: `npm install && npm run build`
  - Publish directory: `build`
- [ ] Actualizar la variable `API_URL` en `App.js` con la URL de Render de tu backend

---

## 💡 Alternativas gratuitas para hostear

### Opción 1: Render.com (RECOMENDADO)
- Backend FastAPI: Web Service gratuito
- Frontend React: Static Site gratuito
- Persistencia de datos: funciona mientras el server esté activo
- URL personalizada gratis tipo: `gerardo-cumple.onrender.com`

### Opción 2: Railway.app
- Más fácil de configurar
- Plan gratuito con límites mensuales

### Opción 3: Vercel (solo frontend) + Railway (backend)
- Vercel es excelente para React
- Railway para el backend Python
