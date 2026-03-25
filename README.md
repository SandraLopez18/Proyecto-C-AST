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
