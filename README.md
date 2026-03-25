# 🧩 Proyecto C - Microservicios (AST)

## 📌 Descripción

Proyecto basado en arquitectura de microservicios utilizando Node.js, Express y MongoDB.

El sistema se divide en tres microservicios independientes:

* **ms-camisetas** → gestión de artículos (CRUD)
* **ms-usuarios** → gestión de usuarios y roles
* **ms-compras** → gestión de compras

---

## 🏗️ Arquitectura

Cada microservicio:

* tiene su propio backend (Node + Express)
* tiene su propia SPA (AngularJS / HTML + JS)
* funciona en un puerto distinto
* se comunica con los demás mediante HTTP

---

## 🔌 Puertos

* `3001` → ms-usuarios
* `3002` → ms-camisetas
* `3003` → ms-compras

---

## 🗄️ Base de datos

MongoDB

Base de datos:

```
tiendaBD
```

Colecciones:

* `usuarios`
* `camisetas`
* `compras`

---

## ⚙️ Instalación

Clonar el repositorio:

```
git clone https://github.com/SandraLopez18/Proyecto-C-AST.git
```

Instalar dependencias en cada microservicio:

```
cd ms-camisetas
npm install

cd ../ms-usuarios
npm install

cd ../ms-compras
npm install
```

---

## ▶️ Ejecución

En cada microservicio:

```
node server.js
```


---

# 🧪 Pruebas realizadas con Postman

## ✅ ms-usuarios

### 🔹 Crear usuario

**POST** `/api/usuarios`

Body:

```json
{
  "nombre": "Sandra",
  "rol": "admin"
}
```

✔ Usuario creado correctamente

---

### 🔹 Obtener usuarios

**GET** `/api/usuarios`

✔ Devuelve listado de usuarios

---

### 🔹 Filtrar usuarios por rol

**GET** `/api/usuarios?rol=admin`

✔ Devuelve solo usuarios admin

---

### 🔹 Obtener rol de un usuario

**GET** `/api/usuarios/:id/rol`

✔ Devuelve correctamente el rol (`admin` o `client`)

---

### 🔹 Eliminar usuario

**DELETE** `/api/usuarios/:id`

✔ Usuario eliminado correctamente


## 🐞 Problema encontrado: error de acceso al consultar rol

Durante la implementación de la comunicación entre microservicios, se detectó el siguiente problema:

Al introducir un `userId` válido en el microservicio de camisetas, el sistema mostraba el mensaje:

```
Usuario no válido o error al consultar el rol.
```

Sin embargo:

* El usuario existía en la base de datos
* El endpoint `/api/usuarios/:id/rol` funcionaba correctamente en Postman

---

## 🔍 Causa del problema

El error estaba relacionado con **CORS (Cross-Origin Resource Sharing)**.

El frontend de `ms-camisetas` (puerto 3002) intentaba acceder a `ms-usuarios` (puerto 3001):

```
http://localhost:3002 → http://localhost:3001
```

El navegador bloqueaba la petición por seguridad al tratarse de distintos orígenes (diferente puerto), aunque funcionaba correctamente en Postman.

---

## 🛠️ Solución aplicada

Se habilitó CORS en el microservicio `ms-usuarios`.

### 1. Instalación de dependencia

```bash
npm install cors
```

### 2. Configuración en `server.js`

```js
const cors = require('cors');

app.use(cors());
```

---

## ✅ Resultado

Tras aplicar la solución:

* El frontend puede comunicarse correctamente con `ms-usuarios`
* Se valida correctamente el rol del usuario
* El acceso al microservicio de camisetas funciona según permisos:

  * `admin` → acceso permitido
  * `client` → acceso denegado (403)

---

## 🧠 Conclusión

Este problema permitió comprobar la importancia de:

* La configuración de CORS en arquitecturas con múltiples microservicios
* La diferencia entre pruebas en Postman y en navegador
* La comunicación real entre servicios en entornos distribuidos

---
