/**
 * ============================================================
 * EJEMPLO 2 — VERSIÓN CON PROMESAS (.then / .catch / .finally)
 * ============================================================
 * Mismo demo que el ejemplo 1, pero encadenando Promesas de forma
 * explícita, SIN usar la palabra clave async/await. Sirve para
 * entender qué esconde realmente el "azúcar sintáctico" de
 * async/await: cada `await` no es más que un `.then()`.
 *
 * Ejecutar:  npm run example:promises
 * ============================================================
 */
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { deleteAllOrganizations, seedOrganizations } from '../services/organization.service.js';
import {
  aggregateUsersByOrganization,
  deleteAllUsers,
  findUserByName,
  findUserSummaryByName,
  findUserWithOrganization,
  seedUsers
} from '../services/user.service.js';
import { buildUsersSeed, organizationsSeed } from './seed-data.js';

connectDatabase()
  .then(() => {
    console.log('Conectado a MongoDB');
    // Promise.all: las dos limpiezas no dependen la una de la
    // otra, así que se lanzan en paralelo en vez de esperarlas
    // una detrás de otra.
    return Promise.all([deleteAllUsers(), deleteAllOrganizations()]);
  })
  .then(() => {
    console.log('Base de datos limpiada');
    return seedOrganizations(organizationsSeed);
  })
  .then((organizations) =>
    // Necesitamos los _id de "organizations" para poder sembrar
    // los usuarios: por eso este paso va anidado dentro del .then
    // anterior, en vez de encadenado a continuación.
    seedUsers(buildUsersSeed(organizations)).then((users) => {
      console.log(`Insertadas ${organizations.length} organizaciones y ${users.length} usuarios`);
    })
  )
  .then(() => {
    console.log('\n--- CRUD ---');
    return findUserByName('Bill');
  })
  .then((bill) => {
    console.log('Usuario encontrado:', bill?.name, bill?.email);
    return findUserSummaryByName('Bill');
  })
  .then((billSummary) => {
    console.log('Resumen (select + lean):', billSummary);
    console.log('\n--- POPULATE ---');
    return findUserWithOrganization('Bill');
  })
  .then((billWithOrg) => {
    console.log('Usuario con organización:', billWithOrg);
    console.log('\n--- AGGREGATION PIPELINE ---');
    return aggregateUsersByOrganization();
  })
  .then((stats) => {
    console.table(stats);
  })
  .catch((error) => {
    // .catch() atrapa cualquier rechazo ocurrido en CUALQUIER
    // eslabón anterior de la cadena: es el equivalente al catch
    // de un try/catch, pero para Promesas encadenadas.
    console.error('Error en el ejemplo:', error);
  })
  .finally(() => {
    // .finally() se ejecuta siempre, tanto si la cadena terminó
    // en .then como en .catch.
    void disconnectDatabase().then(() => console.log('Desconectado de MongoDB'));
  });
