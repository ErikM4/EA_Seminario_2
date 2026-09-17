# EA Node.js + TypeScript + Mongoose

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/) (versión 14.x o superior)
- [MongoDB](https://www.mongodb.com/) (puede ser local o en la nube a través de MongoDB Atlas)
- [npm](https://www.npmjs.com/) 
- [TS] TypeScript

Instalar TypeScript
```
npm install -g typescript
```

## Clonar el proyecto

```
git clone https://github.com/rocmeseguer/EA-Mongoose
cd EA-Mongoose
```

## Dependencias del proyecto

Instalar Mongoose y otras dependencias
```
npm install
```

## Estructura del proyecto

```
src/
  config/          Conexión a MongoDB (connectDatabase / disconnectDatabase)
  models/          Definición de Schemas y Models
    organization.model.ts   Forma TRADICIONAL: interface + Schema + Model
    user.model.ts            Forma MODERNA: Schema -> InferSchemaType -> Model
  repositories/    Acceso a datos (CRUD, populate, aggregation), sin lógica de UI
  examples/        3 variantes del mismo demo, un estilo asíncrono distinto cada una
    01-simple.ts        async/await básico, un único try/catch/finally
    02-promises.ts      .then / .catch / .finally encadenados
    03-async-await.ts   async/await + composición de funciones (pipeAsync)
  utils/           Utilidades de programación funcional (pipeAsync)
```

Cada archivo de `examples/` reutiliza los mismos `models/` y `repositories/`:
la única diferencia entre los tres es el **estilo asíncrono** empleado para
encadenar las operaciones y manejar los errores.

## Complilación y ejecución

Transpilar de TS a JS
```
npm run build
```

Ejecutar cada ejemplo (compila y ejecuta):
```
npm run example:simple
npm run example:promises
npm run example:async
```

Requiere una instancia de MongoDB accesible en `mongodb://127.0.0.1:27017` (o edita la URI en `src/config/db.ts`).