# NearbyEatsAPI

API REST desarrollada con **NestJS** y montada con **Docker**, cuyo objetivo principal es gestionar usuarios y permitirles consultar restaurantes cercanos.

## 🚀 Características principales

- Registro de usuarios
- Login con autenticación JWT
- Logout de usuarios
- Consulta de restaurantes cercanos a una ciudad o coordenadas
- Registro histórico de todas las acciones de los usuarios (signUp, login, logout, consulta de restaurantes)
- Endpoint para consultar el historial de acciones de un usuario
- Dockerizado completamente con `docker-compose`

## ⚙️ Configuración del archivo `.env`

Para que el proyecto funcione correctamente, es necesario configurar las siguientes variables de entorno. Puedes guiarte con el archivo `.env.example` incluido en el repositorio:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
BCRYPT_SALT_ROUNDS=
JWT_SECRET=
JWT_EXPIRATION=
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACES_API_URL=
THROTTLE_TTL=
THROTTLE_LIMIT=
```

## 🐳 Instalación con Docker

Asegúrate de tener Docker y Docker Compose instalados. Luego, simplemente ejecuta:

```bash
docker-compose up
````

Esto levantará:

* La API NestJS
* La base de datos (PostgreSQL)

## 📦 Tecnologías utilizadas

* NestJS
* TypeORM
* PostgreSQL
* Docker & Docker Compose
* JWT para autenticación
* Axios / HTTP para consumo externo de restaurantes

## 📁 Rutas disponibles

> ⚠️ Todas las rutas protegidas requieren un token JWT válido en el header:
> `Authorization: Bearer <token>`

### 🔐 Autenticación

| Método | Endpoint       | Descripción         |
| ------ | -------------- | ------------------- |
| POST   | `api/auth/signup` | Registro de usuario |
| POST   | `api/auth/login`  | Inicio de sesión    |
| POST   | `api/auth/logout` | Cierre de sesión    |

#### Ejemplo de body para signup

```json
{
  "firstName": "Nombre",
  "lastName": "Apellido",
  "email": "example@gmail.com",
  "username": "usuario1",
  "password": "123456"
}
```

#### Ejemplo de body para login

```json
{
  "username": "usuario1",
  "password": "123456"
}
```

### 📍 Restaurantes

| Método | Endpoint              | Descripción                                              |
| ------ | --------------------- | -------------------------------------------------------- |
| GET    | `/api/places/nearby-restaurants` | Obtener restaurantes cercanos a coordenadas |

**Ejemplo de query:**
`GET /api/places/nearby-restaurants?latitude=6.2442&longitude=-75.5812`

### 🧾 Historial de acciones

| Método | Endpoint   | Descripción                              |
| ------ | ---------- | ---------------------------------------- |
| GET    | `api/logs/me` | Ver el historial de acciones del usuario |

## 🧪 Pruebas

Las pruebas están implementadas utilizando Jest y se pueden correr con:

```bash
npm run test
```

## 🔐 Seguridad

* Contraseñas encriptadas con bcrypt
* JWT para autenticación segura
* Variables sensibles protegidas en archivos `.env`
* Sin secretos expuestos en el código

## ✍️ Autor

Desarrollado por Edinson Noriega.
