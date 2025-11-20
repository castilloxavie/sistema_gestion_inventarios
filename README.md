# Sistema de Gestión de Inventarios

## Descripción

Este es el backend para un sistema de gestión de inventarios diseñado para ser utilizado tanto por pequeñas como por grandes empresas. El sistema gestiona productos, ventas, proveedores y movimientos de inventario, y cuenta con un sistema de autenticación basado en roles para controlar el acceso a las diferentes funcionalidades.

## Características Principales

-   **Gestión de Usuarios:** Sistema de registro y autenticación de usuarios.
-   **Roles de Usuario:**
    -   **Administrador:** Acceso total al sistema, puede supervisar las acciones de otros usuarios.
    -   **Vendedor:** Acceso restringido a funciones de venta y gestión de productos.
    -   **Auditor:** Acceso de solo lectura para fines de auditoría y revisión.
-   **Gestión de Inventario:** Funcionalidades para controlar entradas, salidas y stock de productos.
-   **API RESTful:** Endpoints seguros para interactuar con la aplicación frontend.

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

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://URL_DEL_REPOSITORIO.git
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
    JWT_SECRET=tu_secreto_jwt
    ```

## Uso

Para iniciar el servidor en modo de desarrollo (con reinicio automático):

```bash
npm run dev
```

Para iniciar el servidor en modo de producción:

```bash
npm start
```

El servidor se ejecutará en el puerto configurado (por ejemplo, `http://localhost:3000`).