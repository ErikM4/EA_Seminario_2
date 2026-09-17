/**
 * ============================================================
 * EJEMPLO 1 — VERSIÓN SENZILLA (async/await básico)
 * ============================================================
 * Pensado para quien empieza: una única función async, de arriba
 * a abajo, con UN solo try/catch/finally para todo el programa.
 * Sin composición de funciones ni abstracciones extra: el
 * objetivo es ver de un vistazo el ciclo de vida completo
 * (conectar -> preparar datos -> operar -> desconectar).
 *
 * Ejecutar:  npm run example:simple
 * ============================================================
 */
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { deleteAllOrganizations, seedOrganizations } from '../repositories/organization.repository.js';
import {
  aggregateUsersByOrganization,
  deleteAllUsers,
  findUserByName,
  findUserSummaryByName,
  findUserWithOrganization,
  seedUsers
} from '../repositories/user.repository.js';
import { buildUsersSeed, organizationsSeed } from './seed-data.js';

const main = async (): Promise<void> => {
  try {
    // 1. CONEXIÓN
    await connectDatabase();
    console.log('Conectado a MongoDB');

    // 2. LIMPIEZA (idempotencia): el demo se puede volver a
    // ejecutar tantas veces como queramos y siempre parte del
    // mismo estado inicial.
    await deleteAllUsers();
    await deleteAllOrganizations();
    console.log('Base de datos limpiada');

    // 3. SEED: las organizaciones se crean primero porque los
    // usuarios necesitan su _id real para referenciarlas.
    const organizations = await seedOrganizations(organizationsSeed);
    const users = await seedUsers(buildUsersSeed(organizations));
    console.log(`Insertadas ${organizations.length} organizaciones y ${users.length} usuarios`);

    // 4. CRUD: lecturas básicas
    console.log('\n--- CRUD ---');
    const bill = await findUserByName('Bill');
    console.log('Usuario encontrado:', bill?.name, bill?.email);

    // select() + lean(): solo los campos que nos interesan, como
    // objeto plano (más ligero que un Documento de Mongoose).
    const billSummary = await findUserSummaryByName('Bill');
    console.log('Resumen (select + lean):', billSummary);

    // 5. POPULATE: sustituye el id de la organización por sus datos
    console.log('\n--- POPULATE ---');
    const billWithOrg = await findUserWithOrganization('Bill');
    console.log('Usuario con organización:', billWithOrg);

    // 6. AGGREGATION PIPELINE
    console.log('\n--- AGGREGATION PIPELINE ---');
    const stats = await aggregateUsersByOrganization();
    console.table(stats);
  } catch (error) {
    // Cualquier error de cualquiera de los pasos anteriores acaba
    // aquí: una única puerta de salida para los fallos.
    console.error('Error en el ejemplo:', error);
  } finally {
    // finally se ejecuta SIEMPRE, haya habido error o no: es el
    // lugar correcto para liberar recursos como la conexión a BD.
    await disconnectDatabase();
    console.log('Desconectado de MongoDB');
  }
};

main();
