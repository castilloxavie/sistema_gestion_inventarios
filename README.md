# Sistema de Gestión de Inventarios

## Descripción

Este es un sistema completo de gestión de inventarios (full-stack) diseñado para ser utilizado tanto por pequeñas como por grandes empresas. El sistema gestiona usuarios, productos, proveedores, ventas y movimientos de inventario, y cuenta con un sistema de autenticación basado en roles para controlar el acceso a las diferentes funcionalidades. Incluye un backend API RESTful desarrollado con Node.js y Express, y un frontend desarrollado con React y Vite.

## Características Principales

-   **Gestión de Usuarios:** Sistema de registro y autenticación de usuarios con roles definidos.
-   **Roles de Usuario:**
    -   **Administrador:** Acceso total al sistema, puede supervisar y gestionar usuarios, productos y proveedores.
    -   **Vendedor:** Acceso restringido a funciones de venta y gestión de productos y proveedores.
    -   **Auditor:** Acceso de solo lectura para fines de auditoría y revisión (definido en middleware pero no visible en rutas principales).
-   **Gestión de Productos:** CRUD seguro para productos con control de acceso basado en roles.
-   **Gestión de Proveedores:** CRUD seguro para proveedores con control de acceso basado en roles.
-   **Gestión de Inventario:** Modelado de movimientos de inventario (entradas y salidas) para control de stock.
-   **Gestión de Ventas:** Modelado de ventas con campo de total para registrar el monto de las ventas.
-   **API RESTful:** Endpoints seguros para interactuar con la aplicación frontend.
-   **Autenticación y Seguridad:** Autenticación mediante JWT, almacenamiento seguro de contraseñas con bcrypt.
-   **Frontend Interactivo:** Interfaz de usuario desarrollada con React, con navegación protegida por roles, incluyendo páginas para login, dashboard, gestión de productos, proveedores, inventario y ventas.

## Tecnologías Utilizadas

A continuación se listan las principales tecnologías y librerías utilizadas en este proyecto:

| Tecnología | Descripción |
| :--- | :--- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | Entorno de ejecución para JavaScript en el servidor. |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Framework para la construcción de aplicaciones web y APIs. |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | Sistema de gestión de bases de datos relacional. |
| ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white) | ORM de Node.js para bases de datos SQL. |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | Estándar para la creación de tokens de acceso. |
| ![Bcrypt.js](https://img.shields.io/badge/Bcrypt-62438B?style=for-the-badge) | Librería para el hasheo de contraseñas. |
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | Librería para la construcción de interfaces de usuario. |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Herramienta de construcción rápida para desarrollo web. |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | Cliente HTTP para realizar peticiones a la API. |

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/castilloxavie/sistema_gestion_inventarios.git
    ```
2.  Navega al directorio del backend:
    ```bash
    cd backend
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Crea un archivo `.env` en la raíz del directorio `backend` y configura las variables de entorno necesarias (base de datos, secretos JWT, etc.).
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=tu_contraseña
    DB_NAME=nombre_de_tu_bd
    SECURITY_TOKEN_JWT=tu_secreto_jwt
    PORT=3000
    NODE_ENV=development
    ```

## Uso

### Backend

Para iniciar el servidor en modo de desarrollo (con reinicio automático y sincronización de tablas):

```bash
cd backend
npm run dev
```

Para iniciar el servidor en modo de producción:

```bash
cd backend
npm start
```

El servidor se ejecutará en el puerto configurado (por ejemplo, `http://localhost:3000`).

Durante el arranque, si la variable de entorno `NODE_ENV` está en `development`, el servidor sincroniza automáticamente las tablas con la base de datos (alterando la estructura si es necesario). En producción, esta sincronización está desactivada para evitar modificaciones no deseadas.

### Frontend

Para iniciar el servidor de desarrollo del frontend:

```bash
cd frontend
npm run dev
```

El frontend se ejecutará en `http://localhost:5173` (puerto por defecto de Vite).

Para construir el frontend para producción:

```bash
cd frontend
npm run build
```

Para previsualizar la construcción de producción:

```bash
cd frontend
npm run preview
```

## Endpoints Disponibles

A continuación se listan los principales endpoints que ya están funcionando correctamente en la API RESTful:

### Autenticación

- `POST /api/auth/register`: Registro de nuevos usuarios.
- `POST /api/auth/login`: Inicio de sesión y obtención de token JWT.

### Gestión de Usuarios

- `GET /api/users`: Obtiene todos los usuarios (solo rol **admin**).
- `GET /api/users/:id`: Obtiene un usuario por ID (roles **admin** y **vendedor**).
- `POST /api/users`: Crea un nuevo usuario (solo rol **admin**).
- `PUT /api/users/:id`: Actualiza usuario (solo rol **admin**).
- `DELETE /api/users/:id`: Elimina usuario (solo rol **admin**).

### Gestión de Productos

- `GET /api/products`: Obtiene todos los productos (solo rol **admin**).
- `GET /api/products/:id`: Obtiene un producto por ID (roles **admin** y **vendedor**).
- `POST /api/products`: Crea un nuevo producto (solo rol **admin**).
- `PUT /api/products/:id`: Actualiza producto (roles **admin** y **vendedor**).
- `DELETE /api/products/:id`: Elimina producto (solo rol **admin**).

### Gestión de Proveedores

- `GET /api/providers`: Obtiene todos los proveedores (solo rol **admin**).
- `GET /api/providers/:id`: Obtiene un proveedor por ID (roles **admin** y **vendedor**).
- `POST /api/providers`: Crea un nuevo proveedor (solo rol **admin**).
- `PUT /api/providers/:id`: Actualiza proveedor (roles **admin** y **vendedor**).
- `DELETE /api/providers/:id`: Eliminar proveedor (role **admin**).

### Gestión de Inventario

- `GET /api/inventory`: Obtiene todos los movimientos de inventario (roles **admin** y **vendedor**).
- `GET /api/inventory/:id`: Obtiene un movimiento de inventario por ID (roles **admin** y **vendedor**).
- `POST /api/inventory`: Crea un nuevo movimiento de inventario (roles **admin** y **vendedor**).

### Gestión de Ventas

- `POST /api/sales`: Crea una nueva venta (roles **admin** y **vendedor**).
- `GET /api/sales`: Obtiene todas las ventas (roles **admin** y **vendedor**).
- `GET /api/sales/:id`: Obtiene una venta por ID (solo rol **admin**).
