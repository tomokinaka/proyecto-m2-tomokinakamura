# MiniBlog API

API REST desarrollada con Node.js, Express y PostgreSQL para gestionar autores y posts de un miniblog.

## Descripción del proyecto
Este proyecto implementa una API REST con operaciones CRUD para autores y publicaciones. Incluye persistencia real en PostgreSQL, documentación OpenAPI con Swagger UI, validaciones, manejo global de errores y pruebas automatizadas.

## Tecnologías usadas
- Node.js
- Express
- PostgreSQL
- pg
- Swagger UI
- Jest
- Supertest

## Estructura del proyecto

```text
api-miniblog/
├── src/
├── sql/
├── tests/
├── openapi.yaml
├── .env.example
├── .gitignore
├── package.json
└── README.md

## Requisitos
	•	Node.js instalado
	•	PostgreSQL instalado
	•	VSCode recomendado

## Pasos para ejecutar local

1. Clonar repositorio
git clone TU_URL_DEL_REPOSITORIO
cd api-miniblog

2. Instalar dependencias
npm install

3. Crear archivo .env
Copia .env.example y crea .env.
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=miniblog_db

4. Crear base de datos
CREATE DATABASE miniblog_db;

5. Ejecutar scripts SQL
psql -U postgres -d miniblog_db -f sql/setup.sql
psql -U postgres -d miniblog_db -f sql/seed.sql

6. Levantar servidor
npm run dev

## URL local
	•	API: http://localhost:3000
	•	Swagger UI: http://localhost:3000/docs

## Cómo ejecutar tests
npm test

## Cómo ejecutar la documentación OpenAPI
La documentación está en openapi.yaml y se visualiza con Swagger UI en:
http://localhost:3000/docs

## Deployment en Railway

Variables de entorno
	•	PORT
	•	DATABASE_URL

Pasos generales
	1.	Subir el proyecto a GitHub
	2.	Crear proyecto en Railway
	3.	Conectar repositorio
	4.	Agregar PostgreSQL en Railway
	5.	Configurar variables de entorno
	6.	Ejecutar scripts SQL en la base de datos
	7.	Probar la URL pública y /docs

URLs
	•	Internal URL: la entrega Railway para conexiones internas entre servicios
	•	Public URL: la entrega Railway para acceder desde navegador

Registro del uso de AI en el proyecto

Se utilizó inteligencia artificial como apoyo para:
	•	organizar la estructura del proyecto
	•	generar una base inicial del código
	•	redactar la documentación
	•	revisar consistencia entre endpoints, validaciones y OpenAPI

Todo el contenido fue revisado, entendido y ajustado manualmente antes de su entrega.