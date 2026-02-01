# TaskBoard

Aplicación web para gestionar tareas en equipo con autenticación segura y almacenamiento en tiempo real.

## 📋 Descripción

TaskBoard permite a los usuarios crear, gestionar y rastrear tareas. Incluye autenticación de usuarios, tablero de tareas compartido y almacenamiento en Firebase.

## 🛠️ Tecnologías

- **Vue 3** - Framework de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Vue Router** - Enrutamiento
- **Pinia** - Gestor de estado
- **TailwindCSS** - Estilos
- **Firebase** - Autenticación y base de datos (Firestore)
- **Axios** - Cliente HTTP
- **Font Awesome** - Iconos

## 🚀 Instalación y Ejecución en Local

### Requisitos previos
- Node.js v20.19.0 o superior
- npm o yarn
- Cuenta de Firebase con proyecto configurado

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/creepiman854/TaskBoard.git
   cd TaskBoard
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env` con las claves de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Comandos

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run lint` - Ejecutar linters
- `npm run format` - Formatear código


## 🌐 Enlace de Vercel

[Ver en Vercel](https://task-board-kappa-roan.vercel.app)

## 📦 Estructura de Firebase - Firestore

### Colección de Tareas

La colección principal almacena todas las tareas del sistema. Cada documento representa una tarea individual asignada a un usuario.

### Estructura del Documento

Cada documento contiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | ID único del documento (número convertido a string) |
| `assigned` | Boolean | Indica si la tarea está asignada (siempre `true`) |
| `userId` | String | UID del usuario de Firebase propietario de la tarea |
| `todo` | String | Título o descripción de la tarea |
| `completed` | Boolean | Estado de finalización de la tarea (true/false) |

##### Ejemplo de Documento

```json
{
  "id": "1",
  "assigned": true,
  "userId": "abc123xyz789def",
  "todo": "Implementar sistema de autenticación",
  "completed": false
}
```

##### Diagrama de la Estructura

```
Firestore
└── Colección de Tareas
    ├── Documento 1
    │   ├── assigned: true
    │   ├── userId: "user_uid_123"
    │   ├── todo: "Primera tarea"
    │   └── completed: false
    ├── Documento 2
    │   ├── assigned: true
    │   ├── userId: "user_uid_456"
    │   ├── todo: "Segunda tarea"
    │   └── completed: true
    └── ...
```