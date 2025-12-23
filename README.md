# Sistema de Gestión de Inventarios

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellowgreen)


Un sistema de gestión de inventarios completo (full-stack) diseñado para administrar usuarios, productos, proveedores, ventas y movimientos de inventario. Incluye una API RESTful con Node.js y un frontend interactivo con React.

## Tabla de Contenidos

- [Sistema de Gestión de Inventarios](#sistema-de-gestión-de-inventarios)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características Principales](#características-principales)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Pre-requisitos](#pre-requisitos)
  - [Instalación](#instalación)
  - [Uso](#uso)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Endpoints de la API](#endpoints-de-la-api)

## Características Principales

-   **Gestión de Usuarios:** Sistema de registro y autenticación con roles (Administrador, Vendedor, Auditor).
-   **Seguridad:** Autenticación basada en JWT y hasheo de contraseñas con `bcrypt.js`.
-   **Módulos de Gestión:**
    -   CRUD de Productos.
    -   CRUD de Proveedores.
    -   Registro de Movimientos de Inventario (entradas/salidas).
    -   Registro de Ventas y sus detalles.
-   **Dashboard Interactivo:** Visualización de datos clave del negocio.
-   **Frontend Moderno:** Interfaz de usuario construida con React, Vite y `lucide-react` para iconos.

## Tecnologías Utilizadas

### Backend

| Tecnología                                                                                                         | Descripción                                         |
| :----------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)             | Entorno de ejecución para JavaScript en el servidor.  |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)         | Framework para la construcción de la API RESTful.     |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)                     | Sistema de gestión de bases de datos relacional.    |
| ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)         | ORM de Node.js para bases de datos SQL.             |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)                 | Estándar para la creación de tokens de acceso (JWT).  |
| ![Bcrypt.js](https://img.shields.io/badge/Bcrypt-62438B?style=for-the-badge)                                        | Librería para el hasheo seguro de contraseñas.        |

### Frontend

| Tecnología                                                                                                             | Descripción                                             |
| :--------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ |
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)                       | Librería para construir interfaces de usuario.          |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                           | Herramienta de desarrollo frontend ultra-rápida.        |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Librería para el enrutamiento en React.                 |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)                       | Cliente HTTP para peticiones a la API.                  |
| ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white) | CSS-in-JS para estilizar componentes. |
| ![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge) | Librería de gráficos para React. |
| ![Lucide React](https://img.shields.io/badge/Lucide-2dd4bf?style=for-the-badge) | Pack de iconos SVG ligero y personalizable. |

## Estructura del Proyecto

```
/
├── backend/          # Contiene el código de la API (Node.js/Express)
│   ├── src/
│   ├── package.json
│   └── .env.example
└── frontend/         # Contiene el código de la aplicación cliente (React)
    ├── src/
    ├── package.json
    └── .env.example
```

## Pre-requisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   [npm](https://www.npmjs.com/)
-   Un servidor de [MySQL](https://www.mysql.com/)

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/castilloxavie/sistema_gestion_inventarios.git
    cd sistema_gestion_inventarios
    ```

2.  **Configura el Backend:**
    ```bash
    cd backend
    npm install
    ```
    -   Renombra `.env.example` a `.env` y configura tus variables de entorno (base de datos, clave secreta JWT, etc.).

3.  **Configura el Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    -   Renombra `.env.example` a `.env` y, si es necesario, ajusta la URL de la API (`VITE_API_URL`).

## Uso

Puedes ejecutar ambos servidores en terminales separadas.

### Backend

Inicia el servidor en modo de desarrollo (con `nodemon`):

```bash
cd backend
npm run dev
```

El servidor se ejecutará en el puerto definido en tu `.env` (por defecto: `http://localhost:3000`).

### Frontend

Inicia la aplicación de React en modo de desarrollo:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Endpoints de la API

La API requiere un token JWT en la cabecera `Authorization` para las rutas protegidas.

| Método | Endpoint                    | Descripción                        | Rol Requerido        |
| :----- | :-------------------------- | :--------------------------------- | :------------------- |
| **Auth** |
| `POST` | `/api/auth/register`        | Registra un nuevo usuario.         | (Público)            |
| `POST` | `/api/auth/login`           | Inicia sesión y obtiene un token.  | (Público)            |
| **Users** |
| `GET`  | `/api/users`                | Obtiene todos los usuarios.        | `admin`              |
| `GET`  | `/api/users/:id`            | Obtiene un usuario por ID.         | `admin`, `vendedor`  |
| `POST` | `/api/users`                | Crea un nuevo usuario.             | `admin`              |
| `PUT`  | `/api/users/:id`            | Actualiza un usuario.              | `admin`              |
| `DELETE` | `/api/users/:id`          | Elimina un usuario.                | `admin`              |
| **Products** |
| `GET`  | `/api/products`             | Obtiene todos los productos.       | `admin`              |
| `GET`  | `/api/products/:id`         | Obtiene un producto por ID.        | `admin`, `vendedor`  |
| `POST` | `/api/products`             | Crea un nuevo producto.            | `admin`              |
| `PUT`  | `/api/products/:id`         | Actualiza un producto.             | `admin`, `vendedor`  |
| `DELETE` | `/api/products/:id`       | Elimina un producto.               | `admin`              |
| **Providers** |
| `GET`  | `/api/providers`            | Obtiene todos los proveedores.     | `admin`              |
| `GET`  | `/api/providers/:id`        | Obtiene un proveedor por ID.       | `admin`, `vendedor`  |
| `POST` | `/api/providers`            | Crea un nuevo proveedor.           | `admin`              |
| `PUT`  | `/api/providers/:id`        | Actualiza un proveedor.            | `admin`, `vendedor`  |
| `DELETE` | `/api/providers/:id`      | Elimina un proveedor.              | `admin`              |
| **Inventory** |
| `GET`  | `/api/inventory`            | Obtiene movimientos de inventario. | `admin`, `vendedor`  |
| `GET`  | `/api/inventory/:id`        | Obtiene un movimiento por ID.      | `admin`, `vendedor`  |
| `POST` | `/api/inventory`            | Crea un movimiento de inventario.  | `admin`, `vendedor`  |
| **Sales** |
| `GET`  | `/api/sales`                | Obtiene todas las ventas.          | `admin`, `vendedor`  |
| `GET`  | `/api/sales/:id`            | Obtiene una venta por ID.          | `admin`              |
| `POST` | `/api/sales`                | Crea una nueva venta.              | `admin`, `vendedor`  |