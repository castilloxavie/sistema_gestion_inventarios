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
  - [Instalación y Configuración](#instalación-y-configuración)
  - [Uso](#uso)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Guía de Usuarios](#guía-de-usuarios)
    - [Administrador](#administrador)
    - [Vendedor](#vendedor)
    - [Auditor](#auditor)
  - [Endpoints de la API](#endpoints-de-la-api)

## Características Principales

-   **Gestión de Usuarios:** Sistema de registro y autenticación con roles (Administrador, Vendedor, Auditor).
-   **Seguridad:** Autenticación basada en JWT y hasheo de contraseñas con `bcrypt.js`.
-   **Módulos de Gestión:**
    -   CRUD de Productos.
    -   CRUD de Proveedores.
    -   CRUD de Clientes.
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
│   ├── seedInventory.js  # Script para sembrar datos iniciales de inventario
│   └── .env.example      # Archivo de ejemplo para variables de entorno
└── frontend/         # Contiene el código de la aplicación cliente (React)
    ├── src/
    ├── package.json
    ├── README.md          # Documentación específica del frontend
    └── .env.example       # Archivo de ejemplo para variables de entorno
```

## Pre-requisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   [npm](https://www.npmjs.com/)
-   Un servidor de [MySQL](https://www.mysql.com/) activo.

## Instalación y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

**1. Clonar el Repositorio**

```bash
git clone https://github.com/castilloxavie/sistema_gestion_inventarios.git
cd sistema_gestion_inventarios
```

**2. Configuración del Backend**

a. **Navega al directorio del backend e instala las dependencias:**
```bash
cd backend
npm install
```

b. **Configura las variables de entorno:**
   - Renombra el archivo `.env.example` a `.env`.
   - Edita el archivo `.env` con las credenciales de tu base de datos y otras configuraciones.

   ```ini
   # Configuracion de la base de datos
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=inventory_system

   # Configuracion del servidor
   PORT=3000
   NODE_ENV=development

   # Token de seguridad para JWT (cambia 'secret' por una clave segura)
   SECURITY_TOKEN_JWT=tu_clave_secreta_super_segura
   ```

c. **Crea la base de datos:**
   Asegúrate de que tu servidor MySQL esté en ejecución. Conéctate a MySQL y crea la base de datos especificada en tu archivo `.env`.

   ```sql
   CREATE DATABASE IF NOT EXISTS inventory_system;
   ```

d. **(Opcional) Poblar la base de datos con datos de ejemplo:**
   El proyecto incluye un script para añadir datos iniciales al inventario. Para ejecutarlo, usa el siguiente comando desde el directorio `backend`:

   ```bash
   node seedInventory.js
   ```

**3. Configuración del Frontend**

a. **Navega al directorio del frontend e instala las dependencias:**
```bash
# Desde la raíz del proyecto, si estás en la carpeta backend
cd ../frontend 

# O desde la raíz del proyecto
# cd frontend

npm install
```

b. **Configura las variables de entorno:**
   - Renombra el archivo `.env.example` a `.env`.
   - Asegúrate de que la variable `VITE_API_URL` apunte a la URL de tu backend. El valor por defecto suele ser correcto para el desarrollo local.

   ```ini
   # URL de la API del backend
   VITE_API_URL=http://localhost:3000/api
   ```

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

## Guía de Usuarios

Esta sección describe las funcionalidades y pasos iniciales para cada tipo de usuario en el sistema. Cada rol tiene permisos específicos para gestionar diferentes aspectos del inventario.

### Administrador
El administrador tiene acceso completo al sistema y es responsable de la configuración inicial y gestión general.

**Pasos iniciales recomendados:**
1. **Registrar proveedores:** Antes de agregar productos, crea proveedores para asociarlos. Ve a la sección de Proveedores y registra al menos uno con nombre, contacto y detalles.
2. **Agregar productos asociados a proveedores:** Una vez creados los proveedores, agrega productos vinculándolos a un proveedor específico. Esto asegura trazabilidad y facilita la gestión de stock.
3. **Crear usuarios adicionales:** Registra vendedores o auditores según sea necesario, asignando roles apropiados.
4. **Configurar inventario inicial:** Registra movimientos de entrada para productos existentes para establecer stock base.
5. **Revisar dashboard:** Monitorea métricas clave como ventas totales y productos con bajo stock.

**Funcionalidades principales:**
- Gestión completa de usuarios, productos, proveedores y clientes.
- Acceso a todas las ventas y movimientos de inventario.
- Generación de reportes y análisis de datos.

### Vendedor
El vendedor se enfoca en las operaciones diarias de ventas y gestión de inventario básico.

**Pasos iniciales recomendados:**
1. **Revisar productos disponibles:** Verifica el stock actual en la lista de productos.
2. **Registrar ventas:** Crea nuevas ventas asociando productos y clientes.
3. **Actualizar inventario:** Registra movimientos de salida cuando se vendan productos.
4. **Monitorear clientes:** Agrega o actualiza información de clientes para futuras ventas.

**Funcionalidades principales:**
- Registro y gestión de ventas.
- Acceso limitado a productos y proveedores (solo lectura y edición básica).
- Visualización de movimientos de inventario.

### Auditor
El auditor tiene acceso de solo lectura para supervisar y reportar actividades.

**Pasos iniciales recomendados:**
1. **Revisar dashboard:** Examina métricas generales del negocio.
2. **Consultar registros:** Revisa listas de usuarios, productos, proveedores, ventas e inventario sin poder modificar.
3. **Generar reportes:** Utiliza la información para análisis y auditorías.

**Funcionalidades principales:**
- Acceso de solo lectura a todas las secciones.
- No puede crear, editar o eliminar registros.

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
| `PUT` | `/api/users/:id`            | Actualiza un usuario.              | `admin`              |
| `DELETE` | `/api/users/:id`          | Elimina un usuario.                | `admin`              |
| **Products** |
| `GET`  | `/api/products`             | Obtiene todos los productos.       | `admin`              |
| `GET`  | `/api/products/:id`         | Obtiene un producto por ID.        | `admin`, `vendedor`  |
| `POST` | `/api/products`             | Crea un nuevo producto.            | `admin`              |
| `PUT` | `/api/products/:id`         | Actualiza un producto.             | `admin`, `vendedor`  |
| `DELETE` | `/api/products/:id`       | Elimina un producto.               | `admin`              |
| **Providers** |
| `GET`  | `/api/providers`            | Obtiene todos los proveedores.     | `admin`              |
| `GET`  | `/api/providers/:id`        | Obtiene un proveedor por ID.       | `admin`, `vendedor`  |
| `POST` | `/api/providers`            | Crea un nuevo proveedor.           | `admin`              |
| `PUT` | `/api/providers/:id`        | Actualiza un proveedor.            | `admin`, `vendedor`  |
| `DELETE` | `/api/providers/:id`      | Elimina un proveedor.              | `admin`              |
| **Inventory** |
| `GET`  | `/api/inventory`            | Obtiene movimientos de inventario. | `admin`, `vendedor`  |
| `GET`  | `/api/inventory/:id`        | Obtiene un movimiento por ID.      | `admin`, `vendedor`  |
| `POST` | `/api/inventory`            | Crea un movimiento de inventario.  | `admin`, `vendedor`  |
| **Sales** |
| `GET`  | `/api/sales`                | Obtiene todas las ventas.          | `admin`, `vendedor`  |
| `GET`  | `/api/sales/:id`            | Obtiene una venta por ID.          | `admin`              |
| `POST` | `/api/sales`                | Crea una nueva venta.              | `admin`, `vendedor`  |
| **Clients** |
| `GET`  | `/api/clients`              | Obtiene todos los clientes.        | `admin`, `vendedor`  |
| `GET`  | `/api/clients/documento/:documento` | Obtiene un cliente por documento.  | `admin`, `vendedor`  |
| `POST` | `/api/clients`              | Crea un nuevo cliente.             | `admin`, `vendedor`  |
| **Dashboard** |
| `GET`  | `/api/dashboard`            | Obtiene el dashboard del administrador. | `admin`              |
| `GET`  | `/api/dashboard/seller`     | Obtiene el dashboard del vendedor. | `admin`, `vendedor`  |
| `GET`  | `/api/dashboard/export/:period/:format` | Exporta un reporte de ventas.     | `admin`              |
